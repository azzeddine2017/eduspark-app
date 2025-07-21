import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/openai';
import { buildMarjanPrompt, getRandomResponse } from '@/lib/marjan-prompts';
import { questionAnalyzer } from '@/lib/question-analyzer';
import { getSocraticQuestions, getRandomGuidingQuestion, getAnalogy } from '@/lib/socratic-questions';
import { WHITEBOARD_FUNCTIONS } from '@/lib/whiteboard-functions';
import { methodologySelector, TeachingContext } from '@/lib/teaching-methodologies';
import { EducationalMemoryManager } from '@/lib/memory/educational-memory';
import { LearningStyleAnalyzer } from '@/lib/student/learning-style-analyzer';
import { IntelligentProgressTracker } from '@/lib/progress/progress-tracker';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ChatRequest {
  message: string;
  conversationHistory: Array<{
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
  initialTopic?: string;
  context: {
    sessionId: string;
    timestamp: string;
    whiteboardAvailable?: boolean;
    preferredMethod?: string;
    previousAttempts?: number;
    timeOfDay?: number;
    sessionLength?: number;
    deviceType?: string;
  };
}

interface MarjanResponse {
  response: string;
  type: 'socratic' | 'explanation' | 'encouragement' | 'text';
  teachingMethod?: string;
  methodReasoning?: string;
  metadata: {
    subject?: string;
    concept?: string;
    difficulty?: number;
    requiresVisual?: boolean;
    suggestedQuestions?: string[];
    analogy?: string;
    nextSteps?: string[];
  };
  whiteboardFunctions?: Array<{
    name: string;
    parameters: any;
  }>;
  // Enhanced Context Engine Data
  personalizedInsights?: {
    learningStyle: string;
    preferredMethodology: string;
    currentMastery: number;
    accuracyScore: number;
  };
  progressUpdate?: {
    conceptProgress: number;
    overallProgress: number;
    achievements: string[];
    nextGoals: string[];
  };
  success: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة', success: false },
        { status: 400 }
      );
    }

    // الحصول على معلومات المستخدم
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }

    // إنشاء مديري النظام المحسن
    const memoryManager = new EducationalMemoryManager();
    const styleAnalyzer = new LearningStyleAnalyzer();
    const progressTracker = new IntelligentProgressTracker();

    // جلب أو إنشاء ملف الطالب
    const studentProfile = await memoryManager.getOrCreateStudentProfile(session.user.id);

    // تحليل سؤال الطالب
    const questionAnalysis = questionAnalyzer.analyzeQuestion(body.message);

    // تحليل أسلوب التعلم الحالي
    const learningStyleAnalysis = await styleAnalyzer.analyzeLearningStyle(studentProfile.id);

    // تحديد مستوى الطالب بناءً على الملف الشخصي
    const studentLevel = determineStudentLevel(studentProfile, questionAnalysis.subject);

    // إنشاء سياق التدريس المحسن
    const teachingContext: TeachingContext = {
      studentLevel: studentLevel,
      subject: questionAnalysis.subject,
      questionType: questionAnalysis.type === 'factual' ? 'factual' :
                   questionAnalysis.type === 'conceptual' ? 'conceptual' :
                   questionAnalysis.type === 'procedural' ? 'procedural' : 'analytical',
      studentConfusion: body.conversationHistory.length > 3 ? 'moderate' : 'slight',
      previousAttempts: body.context.previousAttempts || 0,
      preferredStyle: determinePreferredStyle(learningStyleAnalysis)
    };

    // اختيار أفضل منهجية تدريس
    const selectedMethod = methodologySelector.selectBestMethod(teachingContext, body.message);
    const methodologyResponse = methodologySelector.applyMethodology(selectedMethod, body.message, teachingContext);

    // بناء سياق المحادثة
    const conversationContext = buildConversationContext(body.conversationHistory);

    // بناء سياق شخصي محسن
    const personalizedContext = buildPersonalizedContext(
      studentProfile,
      learningStyleAnalysis,
      questionAnalysis
    );

    // بناء Prompt مخصص لمرجان مع السياق الشخصي
    const marjanPrompt = buildEnhancedMarjanPrompt({
      subject: questionAnalysis.subject,
      studentLevel: studentLevel,
      previousConversation: conversationContext,
      currentTopic: body.initialTopic || questionAnalysis.keywords.join(', '),
      personalizedContext: personalizedContext,
      learningStyle: learningStyleAnalysis,
      culturalContext: studentProfile.culturalContext
    });

    // إضافة تحليل السؤال للـ prompt
    const enhancedPrompt = `${marjanPrompt}

تحليل سؤال الطالب:
- نوع السؤال: ${questionAnalysis.type}
- المادة: ${questionAnalysis.subject}
- مستوى التعقيد: ${questionAnalysis.complexity}
- النية: ${questionAnalysis.intent}
- يحتاج توضيح بصري: ${questionAnalysis.requiresVisualAid ? 'نعم' : 'لا'}
- مستوى الصعوبة المقدر: ${questionAnalysis.estimatedDifficulty}/10

النهج المقترح: ${questionAnalysis.suggestedApproach}

سؤال الطالب: "${body.message}"

المنهجية المختارة: ${methodologyResponse.method}
السبب: ${methodologyResponse.reasoning}

${methodologyResponse.response}

تذكر:
1. اتبع المنهجية المختارة: ${methodologyResponse.method}
2. ${methodologyResponse.nextSteps ? 'الخطوات التالية: ' + methodologyResponse.nextSteps.join(', ') : ''}
3. استخدم أمثلة من الحياة اليومية
4. كن مشجعاً وإيجابياً
5. ${body.context.whiteboardAvailable ? 'استخدم السبورة للتوضيح البصري عند الحاجة عبر استدعاء الوظائف المتاحة.' : 'إذا احتاج الأمر رسماً، اذكر أنك ستوضح بصرياً'}

ردك يجب أن يكون:`;

    // استدعاء Gemini مع تفعيل أدوات السبورة
    const tools = body.context.whiteboardAvailable ? WHITEBOARD_FUNCTIONS : [];
    const geminiResponse = await callGemini(enhancedPrompt, tools);

    // استخراج النص واستدعاءات الوظائف من الاستجابة
    const candidate = geminiResponse.candidates?.[0];
    const content = candidate?.content?.parts?.[0];
    let aiResponseText = content?.text || '';
    const toolCalls = content?.functionCall ? [content.functionCall] : (candidate?.content?.parts?.filter((p: any) => p.functionCall) || []).map((p: any) => p.functionCall);

    let whiteboardFunctions: MarjanResponse['whiteboardFunctions'] = [];

    if (toolCalls && toolCalls.length > 0) {
      whiteboardFunctions = toolCalls.map((call: any) => ({
        name: call.name,
        parameters: call.args,
      }));
      // إذا كان هناك استدعاء لوظيفة، قد لا يكون هناك نص مصاحب
      if (!aiResponseText) {
        aiResponseText = `بالتأكيد، سأقوم بالتوضيح على السبورة الآن.`;
      }
    }
    
    // تحليل نوع الاستجابة
    const responseType = determineResponseType(aiResponseText, questionAnalysis);
    
    // إضافة معلومات إضافية
    const metadata = generateResponseMetadata(questionAnalysis, body.message);

    // إضافة تشجيع إذا كان الطالب محبطاً
    const enhancedResponse = enhanceResponseWithEncouragement(
      aiResponseText,
      body.message,
      questionAnalysis
    );

    // حفظ التفاعل في الذاكرة التعليمية
    const startTime = Date.now();
    await memoryManager.updateShortTermMemory(body.context.sessionId, {
      studentId: studentProfile.id,
      sessionId: body.context.sessionId,
      question: body.message,
      response: enhancedResponse,
      methodology: methodologyResponse.method,
      success: calculateInteractionSuccess(questionAnalysis, aiResponseText),
      concept: questionAnalysis.keywords[0] || 'general',
      subject: questionAnalysis.subject,
      difficulty: questionAnalysis.estimatedDifficulty,
      responseTime: Math.round((Date.now() - startTime) / 1000)
    });

    // تحديث الذاكرة متوسطة المدى (غير متزامن)
    memoryManager.updateMediumTermMemory(studentProfile.id).catch(console.error);

    // إنشاء رؤى شخصية
    const personalizedInsights = await generatePersonalizedInsights(
      studentProfile,
      learningStyleAnalysis,
      questionAnalysis
    );

    // إنشاء تحديث التقدم
    const progressUpdate = await generateProgressUpdate(
      progressTracker,
      studentProfile.id,
      questionAnalysis.keywords[0]
    );

    const response: MarjanResponse = {
      response: enhancedResponse,
      type: responseType,
      teachingMethod: methodologyResponse.method,
      methodReasoning: methodologyResponse.reasoning,
      metadata: {
        ...metadata,
        nextSteps: methodologyResponse.nextSteps
      },
      whiteboardFunctions,
      personalizedInsights,
      progressUpdate,
      success: true
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('خطأ في مرجان:', error);
    
    return NextResponse.json(
      { 
        error: 'عذراً، حدث خطأ في معالجة طلبك. دعني أحاول مرة أخرى!',
        success: false 
      },
      { status: 500 }
    );
  }
}

/**
 * بناء سياق المحادثة من التاريخ السابق
 */
function buildConversationContext(history: ChatRequest['conversationHistory']): string {
  if (!history || history.length === 0) {
    return 'هذه أول محادثة مع الطالب.';
  }

  const contextLines = history.slice(-4).map(msg => {
    const role = msg.isUser ? 'الطالب' : 'مرجان';
    return `${role}: ${msg.content}`;
  });

  return contextLines.join('\n');
}

/**
 * تحديد نوع الاستجابة بناءً على المحتوى والتحليل
 */
function determineResponseType(
  response: string, 
  analysis: ReturnType<typeof questionAnalyzer.analyzeQuestion>
): MarjanResponse['type'] {
  
  // فحص وجود أسئلة في الاستجابة
  if (response.includes('؟') || response.includes('?')) {
    return 'socratic';
  }
  
  // فحص وجود كلمات تشجيعية
  const encouragementWords = ['ممتاز', 'رائع', 'أحسنت', 'بارك الله', 'عظيم'];
  if (encouragementWords.some(word => response.includes(word))) {
    return 'encouragement';
  }
  
  // فحص إذا كان شرحاً مفصلاً
  if (response.length > 200 && analysis.suggestedApproach === 'direct_explanation') {
    return 'explanation';
  }
  
  return 'text';
}

/**
 * توليد معلومات إضافية للاستجابة
 */
function generateResponseMetadata(
  analysis: ReturnType<typeof questionAnalyzer.analyzeQuestion>,
  originalQuestion: string
): MarjanResponse['metadata'] {
  
  // الحصول على أسئلة سقراطية مقترحة
  const socraticQuestions = getSocraticQuestions(
    analysis.keywords[0] || 'general',
    analysis.subject
  );
  
  // الحصول على تشبيه مناسب
  const analogy = getAnalogy(
    analysis.keywords[0] || 'general',
    analysis.subject
  );

  return {
    subject: analysis.subject,
    concept: analysis.keywords[0],
    difficulty: analysis.estimatedDifficulty,
    requiresVisual: analysis.requiresVisualAid,
    suggestedQuestions: socraticQuestions?.guidingQuestions.slice(0, 3),
    analogy: analogy || undefined
  };
}

/**
 * تحسين الاستجابة بإضافة التشجيع المناسب
 */
function enhanceResponseWithEncouragement(
  response: string,
  originalQuestion: string,
  analysis: ReturnType<typeof questionAnalyzer.analyzeQuestion>
): string {
  
  // فحص إذا كان الطالب محبطاً أو مرتبكاً
  const confusionIndicators = [
    'لا أفهم', 'صعب', 'معقد', 'مش فاهم', 'confused', 'difficult'
  ];
  
  const isConfused = confusionIndicators.some(indicator => 
    originalQuestion.toLowerCase().includes(indicator)
  );
  
  if (isConfused) {
    const encouragement = getRandomResponse('confused_student');
    return `${encouragement}\n\n${response}`;
  }
  
  // إضافة تشجيع عام للأسئلة الجيدة
  if (analysis.type === 'conceptual' || analysis.type === 'analytical') {
    const encouragement = "سؤال ممتاز! أحب أن أرى طلاباً يفكرون بعمق. 🌟\n\n";
    return `${encouragement}${response}`;
  }
  
  return response;
}

/**
 * معالجة الأخطاء مع رسائل ودودة من مرجان
 */
function handleMarjanError(error: any): string {
  const friendlyErrors = [
    "عذراً، يبدو أنني أحتاج لحظة للتفكير. هل يمكنك إعادة صياغة سؤالك؟ 🤔",
    "أعتذر، حدث خطأ تقني صغير. دعنا نحاول مرة أخرى! 💪",
    "يبدو أن هناك مشكلة في الاتصال. لا تقلق، سنحل هذا معاً! 🔧",
    "آسف للانقطاع! أنا هنا ومستعد لمساعدتك. ما سؤالك؟ 😊"
  ];

  return friendlyErrors[Math.floor(Math.random() * friendlyErrors.length)];
}

// ===== ENHANCED CONTEXT ENGINE FUNCTIONS =====

/**
 * تحديد مستوى الطالب بناءً على الملف الشخصي
 */
function determineStudentLevel(
  studentProfile: any,
  subject: string
): 'beginner' | 'intermediate' | 'advanced' {
  // البحث عن إتقان المفاهيم في هذه المادة
  const subjectMastery = studentProfile.conceptMastery?.filter(
    (concept: any) => concept.subject === subject
  ) || [];

  if (subjectMastery.length === 0) return 'beginner';

  const avgMastery = subjectMastery.reduce(
    (sum: number, concept: any) => sum + concept.masteryLevel, 0
  ) / subjectMastery.length;

  if (avgMastery >= 70) return 'advanced';
  if (avgMastery >= 40) return 'intermediate';
  return 'beginner';
}

/**
 * تحديد الأسلوب المفضل بناءً على تحليل أسلوب التعلم
 */
function determinePreferredStyle(learningStyleAnalysis: any): string {
  const styles = [
    { name: 'visual', value: learningStyleAnalysis.visualPreference },
    { name: 'auditory', value: learningStyleAnalysis.auditoryPreference },
    { name: 'kinesthetic', value: learningStyleAnalysis.kinestheticPreference },
    { name: 'reading', value: learningStyleAnalysis.readingPreference }
  ];

  const preferredStyle = styles.reduce((max, style) =>
    style.value > max.value ? style : max
  );

  return preferredStyle.name;
}

/**
 * بناء السياق الشخصي المحسن
 */
function buildPersonalizedContext(
  studentProfile: any,
  learningStyleAnalysis: any,
  questionAnalysis: any
): string {
  const context = [];

  // معلومات أسلوب التعلم
  const dominantStyle = determinePreferredStyle(learningStyleAnalysis);
  context.push(`أسلوب التعلم المفضل: ${dominantStyle}`);

  // معلومات الاهتمامات
  if (studentProfile.interests && studentProfile.interests.length > 0) {
    context.push(`الاهتمامات: ${studentProfile.interests.slice(0, 3).join(', ')}`);
  }

  // معلومات نقاط القوة والضعف
  if (studentProfile.strengths && studentProfile.strengths.length > 0) {
    context.push(`نقاط القوة: ${studentProfile.strengths.slice(0, 2).join(', ')}`);
  }

  if (studentProfile.weaknesses && studentProfile.weaknesses.length > 0) {
    context.push(`نقاط تحتاج تحسين: ${studentProfile.weaknesses.slice(0, 2).join(', ')}`);
  }

  // السياق الثقافي
  context.push(`السياق الثقافي: ${studentProfile.culturalContext}`);

  return context.join('\n');
}

/**
 * بناء برومبت مرجان المحسن
 */
function buildEnhancedMarjanPrompt(params: {
  subject: string;
  studentLevel: string;
  previousConversation: string;
  currentTopic: string;
  personalizedContext: string;
  learningStyle: any;
  culturalContext: string;
}): string {
  return `${buildMarjanPrompt({
    subject: params.subject,
    studentLevel: params.studentLevel as any,
    previousConversation: params.previousConversation,
    currentTopic: params.currentTopic
  })}

معلومات شخصية عن الطالب:
${params.personalizedContext}

توجيهات التخصيص:
- استخدم أمثلة من ${params.culturalContext === 'arabic' ? 'البيئة العربية والإسلامية' : params.culturalContext}
- اربط المفاهيم بالحياة اليومية في المنطقة العربية
- استخدم أسلوب التعلم المفضل للطالب
- كن مراعياً للخلفية الثقافية والدينية

تذكر: أنت مرجان، المعلم الافتراضي الذكي الذي يفهم كل طالب بشكل فردي.`;
}

/**
 * حساب نجاح التفاعل
 */
function calculateInteractionSuccess(questionAnalysis: any, response: string): number {
  let success = 0.5; // قيمة أساسية

  // زيادة النجاح بناءً على طول الاستجابة ومحتواها
  if (response.length > 100) success += 0.1;
  if (response.length > 300) success += 0.1;

  // زيادة النجاح إذا كانت الاستجابة تحتوي على أمثلة
  if (response.includes('مثال') || response.includes('مثل')) success += 0.1;

  // زيادة النجاح إذا كانت الاستجابة تحتوي على أسئلة توجيهية
  if (response.includes('؟')) success += 0.1;

  // تقليل النجاح للأسئلة المعقدة
  if (questionAnalysis.estimatedDifficulty > 7) success -= 0.1;

  return Math.max(0, Math.min(1, success));
}

/**
 * إنشاء الرؤى الشخصية
 */
async function generatePersonalizedInsights(
  studentProfile: any,
  learningStyleAnalysis: any,
  questionAnalysis: any
): Promise<MarjanResponse['personalizedInsights']> {
  const dominantStyle = determinePreferredStyle(learningStyleAnalysis);
  const preferredMethodology = learningStyleAnalysis.preferredMethodologies[0]?.methodology || 'direct_instruction';

  // حساب الإتقان الحالي للمفهوم
  const conceptMastery = studentProfile.conceptMastery?.find(
    (c: any) => c.conceptName === questionAnalysis.keywords[0]
  );
  const currentMastery = conceptMastery?.masteryLevel || 0;

  return {
    learningStyle: dominantStyle,
    preferredMethodology: preferredMethodology,
    currentMastery: currentMastery,
    accuracyScore: learningStyleAnalysis.confidence
  };
}

/**
 * إنشاء تحديث التقدم
 */
async function generateProgressUpdate(
  progressTracker: IntelligentProgressTracker,
  studentId: string,
  concept?: string
): Promise<MarjanResponse['progressUpdate']> {
  try {
    if (concept) {
      const conceptProgress = await progressTracker.trackConceptProgress(studentId, concept);
      const progressReport = await progressTracker.generateProgressReport(studentId);

      return {
        conceptProgress: conceptProgress.currentMastery,
        overallProgress: progressReport.overallProgress,
        achievements: progressReport.achievements.map(a => a.title),
        nextGoals: conceptProgress.nextSteps.slice(0, 3)
      };
    }

    const progressReport = await progressTracker.generateProgressReport(studentId);
    return {
      conceptProgress: 0,
      overallProgress: progressReport.overallProgress,
      achievements: progressReport.achievements.map(a => a.title),
      nextGoals: progressReport.recommendations.slice(0, 3).map(r => r.title)
    };
  } catch (error) {
    console.error('خطأ في إنشاء تحديث التقدم:', error);
    return {
      conceptProgress: 0,
      overallProgress: 0,
      achievements: [],
      nextGoals: []
    };
  }
}


