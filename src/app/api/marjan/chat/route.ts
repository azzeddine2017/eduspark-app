import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/openai';
import { buildMarjanPrompt, getRandomResponse } from '@/lib/marjan-prompts';
import { questionAnalyzer } from '@/lib/question-analyzer';
import { getSocraticQuestions, getRandomGuidingQuestion, getAnalogy } from '@/lib/socratic-questions';
import { WHITEBOARD_FUNCTIONS } from '@/lib/whiteboard-functions';
import { methodologySelector, TeachingContext, TeachingMethod } from '@/lib/teaching-methodologies';
import { EducationalMemoryManager } from '@/lib/memory/educational-memory';
import { LearningStyleAnalyzer } from '@/lib/student/learning-style-analyzer';
import { IntelligentProgressTracker } from '@/lib/progress/progress-tracker';
import { SmartExampleGenerator } from '@/lib/content/smart-example-generator';
import { EducationalStoryGenerator } from '@/lib/content/educational-story-generator';
import { SmartRecommendationEngine } from '@/lib/recommendations/smart-recommendation-engine';
import { EnhancedMethodologySelector } from '@/lib/methodology/enhanced-methodology-selector';
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
  // Phase 2: Adaptive Content
  adaptiveContent?: {
    customExample?: any;
    educationalStory?: any;
    smartRecommendations?: any[];
  };
  roleSpecificContent?: {
    userRole: string;
    adaptedInstructions: string[];
    roleSpecificTips: string[];
    relevantResources: string[];
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

    // إنشاء مديري النظام المحسن - المرحلة الأولى والثانية
    const memoryManager = new EducationalMemoryManager();
    const styleAnalyzer = new LearningStyleAnalyzer();
    const progressTracker = new IntelligentProgressTracker();

    // المرحلة الثانية: المحتوى التكيفي
    const exampleGenerator = new SmartExampleGenerator();
    const storyGenerator = new EducationalStoryGenerator();
    const recommendationEngine = new SmartRecommendationEngine();
    const enhancedMethodologySelector = new EnhancedMethodologySelector();

    // جلب أو إنشاء ملف الطالب
    const studentProfile = await memoryManager.getOrCreateStudentProfile(session.user.id);

    // جلب معلومات المستخدم مع الدور
    const user = await getUserWithRole(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'لم يتم العثور على بيانات المستخدم', success: false },
        { status: 404 }
      );
    }

    // تحليل سؤال الطالب
    const questionAnalysis = questionAnalyzer.analyzeQuestion(body.message);

    // تحليل أسلوب التعلم الحالي
    const learningStyleAnalysis = await styleAnalyzer.analyzeLearningStyle(studentProfile.id);

    // تحديد مستوى الطالب بناءً على الملف الشخصي
    const studentLevel = determineStudentLevel(studentProfile, questionAnalysis.subject);

    // إنشاء سياق التدريس المحسن مع معلومات الدور
    const enhancedTeachingContext = {
      studentLevel: studentLevel,
      subject: questionAnalysis.subject,
      questionType: questionAnalysis.type === 'factual' ? 'factual' :
                   questionAnalysis.type === 'conceptual' ? 'conceptual' :
                   questionAnalysis.type === 'procedural' ? 'procedural' : 'analytical',
      studentConfusion: body.conversationHistory.length > 3 ? 'moderate' : 'slight',
      previousAttempts: body.context.previousAttempts || 0,
      preferredStyle: determinePreferredStyle(learningStyleAnalysis),
      // المرحلة الثانية: معلومات إضافية
      userRole: user.role,
      culturalContext: studentProfile.culturalContext,
      timeConstraints: {
        availableTime: body.context.sessionLength || 30,
        timeOfDay: body.context.timeOfDay || new Date().getHours(),
        sessionType: body.context.sessionLength && body.context.sessionLength < 15 ? 'quick' : 'standard'
      },
      deviceCapabilities: {
        hasWhiteboard: body.context.whiteboardAvailable || false,
        hasAudio: true,
        hasVideo: true,
        screenSize: body.context.deviceType === 'mobile' ? 'small' : 'large',
        internetSpeed: 'fast'
      }
    };

    // اختيار أفضل منهجية تدريس محسنة
    const methodologyResponse = await enhancedMethodologySelector.selectBestMethod(
      enhancedTeachingContext,
      questionAnalysis.intent,
      studentProfile,
      [] // سيتم تطوير تاريخ الأداء لاحقاً
    );

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

    // المرحلة الثانية: توليد المحتوى التكيفي
    const adaptiveContent = await generateAdaptiveContent(
      exampleGenerator,
      storyGenerator,
      recommendationEngine,
      questionAnalysis,
      studentProfile,
      user.role,
      enhancedTeachingContext
    );

    // إنشاء المحتوى الخاص بالدور
    const roleSpecificContent = generateRoleSpecificContent(
      user.role,
      questionAnalysis,
      methodologyResponse,
      studentProfile
    );

    const response: MarjanResponse = {
      response: enhancedResponse,
      type: responseType,
      teachingMethod: methodologyResponse.methodology,
      methodReasoning: methodologyResponse.reasoning,
      metadata: {
        ...metadata,
        nextSteps: methodologyResponse.implementationSteps.map(step => step.description)
      },
      whiteboardFunctions,
      personalizedInsights,
      progressUpdate,
      // المرحلة الثانية: المحتوى التكيفي
      adaptiveContent,
      roleSpecificContent,
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
function determinePreferredStyle(learningStyleAnalysis: any): TeachingMethod {
  const styles = [
    { name: 'visual_demo', value: learningStyleAnalysis.visualPreference },
    { name: 'narrative', value: learningStyleAnalysis.auditoryPreference },
    { name: 'problem_based', value: learningStyleAnalysis.kinestheticPreference },
    { name: 'direct_instruction', value: learningStyleAnalysis.readingPreference }
  ];

  const preferredStyle = styles.reduce((max, style) =>
    style.value > max.value ? style : max
  );

  return preferredStyle.name as TeachingMethod;
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

// ===== PHASE 2: ADAPTIVE CONTENT FUNCTIONS =====

/**
 * جلب معلومات المستخدم مع الدور
 */
async function getUserWithRole(userId: string): Promise<any> {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    await prisma.$disconnect();
    return user;
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    await prisma.$disconnect();
    return null;
  }
}

/**
 * توليد المحتوى التكيفي
 */
async function generateAdaptiveContent(
  exampleGenerator: any,
  storyGenerator: any,
  recommendationEngine: any,
  questionAnalysis: any,
  studentProfile: any,
  userRole: string,
  context: any
): Promise<any> {
  try {
    const adaptiveContent: any = {};

    // توليد مثال مخصص إذا كان مناسباً
    if (shouldGenerateExample(questionAnalysis, userRole)) {
      const exampleRequest = {
        concept: questionAnalysis.keywords[0] || 'general',
        subject: questionAnalysis.subject,
        difficulty: questionAnalysis.estimatedDifficulty || 5,
        culturalContext: studentProfile.culturalContext,
        learningStyle: getDominantLearningStyle(studentProfile.learningStyle),
        userRole: userRole,
        interests: studentProfile.interests,
        realLifeContext: true
      };

      adaptiveContent.customExample = await exampleGenerator.generateCustomExample(exampleRequest);
    }

    // توليد قصة تعليمية للطلاب الصغار
    if (shouldGenerateStory(questionAnalysis, userRole, studentProfile)) {
      const storyRequest = {
        concept: questionAnalysis.keywords[0] || 'general',
        subject: questionAnalysis.subject,
        targetAge: studentProfile.age || 15,
        culturalContext: studentProfile.culturalContext,
        userRole: userRole,
        learningObjective: `فهم مفهوم ${questionAnalysis.keywords[0]}`,
        storyLength: 'medium'
      };

      adaptiveContent.educationalStory = await storyGenerator.generateEducationalStory(storyRequest);
    }

    // توليد توصيات ذكية
    if (shouldGenerateRecommendations(userRole)) {
      const recommendationRequest = {
        studentId: studentProfile.id,
        userRole: userRole,
        context: {
          currentSession: {
            sessionId: context.sessionId || 'current',
            duration: context.timeConstraints?.availableTime || 30,
            conceptsCovered: [questionAnalysis.keywords[0]],
            currentMood: 'neutral',
            engagementLevel: 7
          },
          recentPerformance: [],
          learningGoals: [],
          timeConstraints: context.timeConstraints
        }
      };

      adaptiveContent.smartRecommendations = await recommendationEngine.generateSmartRecommendations(recommendationRequest);
    }

    return adaptiveContent;
  } catch (error) {
    console.error('خطأ في توليد المحتوى التكيفي:', error);
    return {};
  }
}

/**
 * توليد المحتوى الخاص بالدور
 */
function generateRoleSpecificContent(
  userRole: string,
  questionAnalysis: any,
  methodologyResponse: any,
  studentProfile: any
): any {
  const roleContent = {
    userRole: userRole,
    adaptedInstructions: [],
    roleSpecificTips: [],
    relevantResources: []
  };

  switch (userRole) {
    case 'STUDENT':
      roleContent.adaptedInstructions = [
        'اقرأ الشرح بعناية',
        'جرب الأمثلة بنفسك',
        'اطرح أسئلة إذا لم تفهم شيئاً'
      ];
      roleContent.roleSpecificTips = [
        'خذ وقتك في الفهم',
        'لا تتردد في طلب المساعدة',
        'مارس ما تعلمته'
      ];
      roleContent.relevantResources = [
        'تمارين إضافية',
        'فيديوهات تعليمية',
        'ألعاب تعليمية'
      ];
      break;

    case 'INSTRUCTOR':
      roleContent.adaptedInstructions = [
        'استخدم هذا المحتوى كدليل تدريس',
        'اضبط الصعوبة حسب مستوى الطلاب',
        'استخدم الأمثلة المقترحة'
      ];
      roleContent.roleSpecificTips = [
        'راقب فهم الطلاب',
        'استخدم أساليب تقييم متنوعة',
        'شجع المشاركة الفعالة'
      ];
      roleContent.relevantResources = [
        'خطط دروس جاهزة',
        'أدوات تقييم',
        'أنشطة صفية'
      ];
      break;

    case 'ADMIN':
      roleContent.adaptedInstructions = [
        'راجع فعالية المحتوى',
        'تأكد من توافق المعايير',
        'راقب مؤشرات الأداء'
      ];
      roleContent.roleSpecificTips = [
        'ركز على النتائج القابلة للقياس',
        'راجع التكاليف والفوائد',
        'خطط للتوسع'
      ];
      roleContent.relevantResources = [
        'تقارير الأداء',
        'مؤشرات الجودة',
        'خطط التطوير'
      ];
      break;

    case 'CONTENT_CREATOR':
      roleContent.adaptedInstructions = [
        'استخدم هذا كمرجع للتصميم',
        'اضبط المحتوى للجمهور المستهدف',
        'اختبر الفعالية'
      ];
      roleContent.roleSpecificTips = [
        'ركز على تجربة المستخدم',
        'استخدم مبادئ التصميم التعليمي',
        'اجعل المحتوى تفاعلياً'
      ];
      roleContent.relevantResources = [
        'أدوات التصميم',
        'مكتبات المحتوى',
        'معايير الجودة'
      ];
      break;

    case 'MENTOR':
      roleContent.adaptedInstructions = [
        'استخدم هذا لتوجيه الطلاب',
        'ركز على التحفيز والدعم',
        'راقب التقدم الشخصي'
      ];
      roleContent.roleSpecificTips = [
        'كن صبوراً ومشجعاً',
        'اربط التعلم بالأهداف الشخصية',
        'قدم الدعم العاطفي'
      ];
      roleContent.relevantResources = [
        'استراتيجيات التحفيز',
        'أدوات متابعة التقدم',
        'مصادر الدعم'
      ];
      break;

    default:
      // محتوى افتراضي للطالب
      roleContent.adaptedInstructions = ['اتبع التعليمات المقدمة'];
      roleContent.roleSpecificTips = ['تعلم بالسرعة التي تناسبك'];
      roleContent.relevantResources = ['مصادر تعليمية عامة'];
  }

  return roleContent;
}

// وظائف مساعدة للمحتوى التكيفي
function shouldGenerateExample(questionAnalysis: any, userRole: string): boolean {
  // توليد أمثلة للمفاهيم المعقدة أو للمدرسين
  return questionAnalysis.estimatedDifficulty > 5 ||
         userRole === 'INSTRUCTOR' ||
         userRole === 'CONTENT_CREATOR';
}

function shouldGenerateStory(questionAnalysis: any, userRole: string, studentProfile: any): boolean {
  // توليد قصص للطلاب الصغار أو للمفاهيم المجردة
  return (studentProfile.age && studentProfile.age < 16) ||
         questionAnalysis.type === 'conceptual' ||
         userRole === 'CONTENT_CREATOR';
}

function shouldGenerateRecommendations(userRole: string): boolean {
  // توليد توصيات لجميع الأدوار
  return true;
}

function getDominantLearningStyle(learningStyle: any): string {
  if (!learningStyle) return 'visual';

  const styles = [
    { name: 'visual', value: learningStyle.visual || 0 },
    { name: 'auditory', value: learningStyle.auditory || 0 },
    { name: 'kinesthetic', value: learningStyle.kinesthetic || 0 },
    { name: 'reading', value: learningStyle.reading || 0 }
  ];

  return styles.reduce((max, style) => style.value > max.value ? style : max).name;
}


