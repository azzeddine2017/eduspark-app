import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/openai';
import { buildMarjanPrompt, getRandomResponse } from '@/lib/marjan-prompts';
import { questionAnalyzer } from '@/lib/question-analyzer';
import { getSocraticQuestions, getRandomGuidingQuestion, getAnalogy } from '@/lib/socratic-questions';

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
  };
}

interface MarjanResponse {
  response: string;
  type: 'socratic' | 'explanation' | 'encouragement' | 'text';
  metadata: {
    subject?: string;
    concept?: string;
    difficulty?: number;
    requiresVisual?: boolean;
    suggestedQuestions?: string[];
    analogy?: string;
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

    // تحليل سؤال الطالب
    const questionAnalysis = questionAnalyzer.analyzeQuestion(body.message);
    
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

تذكر:
1. استخدم الطريقة السقراطية - لا تعطِ الإجابة مباشرة
2. اطرح سؤالاً توجيهياً واحداً فقط في كل رد
3. استخدم أمثلة من الحياة اليومية
4. كن مشجعاً وإيجابياً
5. إذا احتاج الأمر رسماً، اذكر أنك ستوضح بصرياً

ردك يجب أن يكون:`;

    // استدعاء Gemini
    const aiResponse = await callGemini(enhancedPrompt);
    
    // تحليل نوع الاستجابة
    const responseType = determineResponseType(aiResponse, questionAnalysis);
    
    // إضافة معلومات إضافية
    const metadata = generateResponseMetadata(questionAnalysis, body.message);
    
    // إضافة تشجيع إذا كان الطالب محبطاً
    const enhancedResponse = enhanceResponseWithEncouragement(
      aiResponse, 
      body.message, 
      questionAnalysis
    );

    const response: MarjanResponse = {
      response: enhancedResponse,
      type: responseType,
      metadata,
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
