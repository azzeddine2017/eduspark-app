import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/openai';
import { buildMarjanPrompt, getRandomResponse } from '@/lib/marjan-prompts';
import { questionAnalyzer } from '@/lib/question-analyzer';
import { getSocraticQuestions, getRandomGuidingQuestion, getAnalogy } from '@/lib/socratic-questions';
import { WHITEBOARD_FUNCTIONS } from '@/lib/whiteboard-functions';
import { methodologySelector, TeachingContext } from '@/lib/teaching-methodologies';

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

    // تحليل سؤال الطالب
    const questionAnalysis = questionAnalyzer.analyzeQuestion(body.message);

    // إنشاء سياق التدريس
    const teachingContext: TeachingContext = {
      studentLevel: body.studentLevel === 'مبتدئ' ? 'beginner' :
                   body.studentLevel === 'متقدم' ? 'advanced' : 'intermediate',
      subject: questionAnalysis.subject,
      questionType: questionAnalysis.type === 'factual' ? 'factual' :
                   questionAnalysis.type === 'conceptual' ? 'conceptual' :
                   questionAnalysis.type === 'procedural' ? 'procedural' : 'analytical',
      studentConfusion: body.conversationHistory.length > 3 ? 'moderate' : 'slight',
      previousAttempts: body.context.previousAttempts || 0,
      preferredStyle: body.context.preferredMethod as any
    };

    // اختيار أفضل منهجية تدريس
    const selectedMethod = methodologySelector.selectBestMethod(teachingContext, body.message);
    const methodologyResponse = methodologySelector.applyMethodology(selectedMethod, body.message, teachingContext);

    // بناء سياق المحادثة
    const conversationContext = buildConversationContext(body.conversationHistory);
    
    // بناء Prompt مخصص لمرجان
    const marjanPrompt = buildMarjanPrompt({
      subject: questionAnalysis.subject,
      studentLevel: body.studentLevel,
      previousConversation: conversationContext,
      currentTopic: body.initialTopic || questionAnalysis.keywords.join(', ')
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

${body.context.whiteboardAvailable ? `
السبورة الافتراضية متاحة! يمكنك استخدام الوظائف التالية للرسم والتوضيح:
${WHITEBOARD_FUNCTIONS.map(f => `- ${f.name}: ${f.description}`).join('\n')}

عندما تحتاج للرسم أو التوضيح، استخدم هذه الوظائف في ردك.
` : ''}

المنهجية المختارة: ${methodologyResponse.method}
السبب: ${methodologyResponse.reasoning}

${methodologyResponse.response}

تذكر:
1. اتبع المنهجية المختارة: ${methodologyResponse.method}
2. ${methodologyResponse.nextSteps ? 'الخطوات التالية: ' + methodologyResponse.nextSteps.join(', ') : ''}
3. استخدم أمثلة من الحياة اليومية
4. كن مشجعاً وإيجابياً
5. ${body.context.whiteboardAvailable ? 'استخدم السبورة للتوضيح البصري عند الحاجة' : 'إذا احتاج الأمر رسماً، اذكر أنك ستوضح بصرياً'}

ردك يجب أن يكون:`;

    // استدعاء Gemini
    const aiResponse = await callGemini(enhancedPrompt);
    
    // تحليل نوع الاستجابة
    const responseType = determineResponseType(aiResponse, questionAnalysis);
    
    // إضافة معلومات إضافية
    const metadata = generateResponseMetadata(questionAnalysis, body.message);

    // استخراج وظائف السبورة من الاستجابة
    const whiteboardFunctions = body.context.whiteboardAvailable
      ? extractWhiteboardFunctions(aiResponse, questionAnalysis)
      : undefined;

    // إضافة تشجيع إذا كان الطالب محبطاً
    const enhancedResponse = enhanceResponseWithEncouragement(
      aiResponse,
      body.message,
      questionAnalysis
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

/**
 * استخراج وظائف السبورة من استجابة مرجان
 */
function extractWhiteboardFunctions(
  response: string,
  analysis: ReturnType<typeof questionAnalyzer.analyzeQuestion>
): Array<{ name: string; parameters: any }> {
  const functions: Array<{ name: string; parameters: any }> = [];

  // إذا كان السؤال يحتاج توضيح بصري، أضف وظائف مناسبة
  if (analysis.requiresVisualAid || analysis.subject === 'mathematics' || analysis.subject === 'physics') {

    // للرياضيات - رسم أشكال هندسية
    if (analysis.subject === 'mathematics') {
      if (analysis.keywords.some(k => k.includes('مثلث') || k.includes('triangle'))) {
        functions.push({
          name: 'draw_triangle',
          parameters: {
            x1: 200, y1: 300,
            x2: 400, y2: 300,
            x3: 200, y3: 150,
            color: '#0066cc',
            label: 'مثلث'
          }
        });
      }

      if (analysis.keywords.some(k => k.includes('دائرة') || k.includes('circle'))) {
        functions.push({
          name: 'draw_circle',
          parameters: {
            center_x: 300,
            center_y: 200,
            radius: 80,
            color: '#0066cc',
            label: 'دائرة'
          }
        });
      }

      if (analysis.keywords.some(k => k.includes('معادلة') || k.includes('equation'))) {
        functions.push({
          name: 'draw_equation',
          parameters: {
            x: 400,
            y: 150,
            equation: 'أ² + ب² = ج²',
            size: 20,
            color: '#cc0066'
          }
        });
      }
    }

    // للفيزياء - رسم دوائر كهربائية ومخططات
    if (analysis.subject === 'physics') {
      if (analysis.keywords.some(k => k.includes('دائرة') || k.includes('كهرباء'))) {
        // رسم دائرة كهربائية بسيطة
        functions.push({
          name: 'draw_rectangle',
          parameters: {
            x: 200, y: 200,
            width: 60, height: 30,
            color: '#009900',
            label: 'بطارية'
          }
        });

        functions.push({
          name: 'draw_circle',
          parameters: {
            center_x: 400,
            center_y: 215,
            radius: 20,
            color: '#ff6600',
            label: 'مصباح'
          }
        });

        // خطوط التوصيل
        functions.push({
          name: 'draw_line',
          parameters: {
            from_x: 260, from_y: 215,
            to_x: 380, to_y: 215,
            color: '#000000',
            thickness: 2
          }
        });
      }
    }
  }

  return functions;
}
