import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      lessonId, 
      courseId, 
      context, 
      nodeId, 
      culturalContext, 
      history 
    } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      );
    }

    // بناء السياق المتقدم للذكاء الاصطناعي
    const advancedPrompt = buildAdvancedPrompt({
      message,
      lessonId,
      courseId,
      context,
      nodeId,
      culturalContext,
      history
    });

    // استدعاء الذكاء الاصطناعي
    const aiResponse = await callGemini(advancedPrompt);

    // تحليل نوع الاستجابة
    const responseType = analyzeResponseType(message);
    
    // إضافة معلومات إضافية للاستجابة
    const metadata = generateResponseMetadata(message, aiResponse, culturalContext);

    return NextResponse.json({
      response: aiResponse,
      type: responseType,
      metadata,
      success: true
    });

  } catch (error) {
    console.error('خطأ في المساعد الذكي المتقدم:', error);
    
    return NextResponse.json(
      { 
        error: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        success: false 
      },
      { status: 500 }
    );
  }
}

function buildAdvancedPrompt({
  message,
  lessonId,
  courseId,
  context,
  nodeId,
  culturalContext,
  history
}: any) {
  let prompt = `أنت مساعد ذكي متطور في منصة فتح التعليمية. لديك قدرات متقدمة في:

🧠 **قدراتك الأساسية:**
- تحليل المحتوى التعليمي بعمق
- تقديم توصيات مخصصة ذكياً
- شرح المفاهيم بطرق متنوعة
- تتبع تقدم المتعلم وتحليل الأداء
- التكيف مع السياق الثقافي والمحلي
- تقديم أمثلة عملية من البيئة المحلية

📍 **السياق الحالي:**`;

  if (culturalContext) {
    prompt += `\n- المنطقة: ${culturalContext.region || 'غير محدد'}`;
    prompt += `\n- اللغة: ${culturalContext.language || 'العربية'}`;
    prompt += `\n- المستوى التعليمي: ${culturalContext.level || 'متوسط'}`;
  }

  if (nodeId) {
    prompt += `\n- العقدة المحلية: ${nodeId}`;
  }

  if (lessonId) {
    prompt += `\n- الدرس الحالي: ${lessonId}`;
  }

  if (courseId) {
    prompt += `\n- الدورة الحالية: ${courseId}`;
  }

  if (context) {
    prompt += `\n- السياق الإضافي: ${context}`;
  }

  if (history && history.length > 0) {
    prompt += `\n\n📜 **تاريخ المحادثة الأخير:**`;
    history.slice(-3).forEach((msg: any, index: number) => {
      const role = msg.isUser ? 'المتعلم' : 'المساعد';
      prompt += `\n${role}: ${msg.content}`;
    });
  }

  prompt += `\n\n❓ **السؤال الحالي:** ${message}

🎯 **تعليمات الاستجابة:**
1. قدم إجابة شاملة ومفيدة
2. استخدم أمثلة من السياق المحلي عند الإمكان
3. اجعل الشرح مناسباً للمستوى التعليمي
4. أضف نصائح عملية قابلة للتطبيق
5. استخدم الرموز التعبيرية لجعل الإجابة أكثر تفاعلاً
6. إذا كان السؤال غير واضح، اطلب توضيحاً
7. قدم مصادر إضافية أو مواضيع ذات صلة عند الحاجة

الرجاء الإجابة باللغة العربية بأسلوب ودود ومهني:`;

  return prompt;
}

function analyzeResponseType(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('اشرح') || lowerMessage.includes('وضح') || lowerMessage.includes('ما هو')) {
    return 'explanation';
  }
  
  if (lowerMessage.includes('اقترح') || lowerMessage.includes('أوصي') || lowerMessage.includes('توصية')) {
    return 'recommendation';
  }
  
  if (lowerMessage.includes('حلل') || lowerMessage.includes('تحليل') || lowerMessage.includes('أداء')) {
    return 'analysis';
  }
  
  if (lowerMessage.includes('مثال') || lowerMessage.includes('تطبيق') || lowerMessage.includes('كيف')) {
    return 'example';
  }
  
  return 'text';
}

function generateResponseMetadata(message: string, response: string, culturalContext: any) {
  // حساب مستوى الثقة بناءً على طول الاستجابة وجودتها
  const confidence = Math.min(0.95, Math.max(0.6, response.length / 500));
  
  // استخراج المواضيع ذات الصلة
  const relatedTopics = extractRelatedTopics(message, response);
  
  // تحديد مستوى الصعوبة
  const difficulty = determineDifficulty(message, culturalContext);
  
  return {
    confidence,
    relatedTopics,
    difficulty,
    culturallyAdapted: !!culturalContext,
    responseLength: response.length,
    estimatedReadTime: Math.ceil(response.length / 200) // تقدير وقت القراءة بالدقائق
  };
}

function extractRelatedTopics(message: string, response: string): string[] {
  const topics: string[] = [];
  const keywords = [
    'برمجة', 'تصميم', 'رياضيات', 'علوم', 'تاريخ', 'جغرافيا',
    'فيزياء', 'كيمياء', 'أحياء', 'لغة', 'أدب', 'فلسفة',
    'اقتصاد', 'إدارة', 'تسويق', 'محاسبة', 'قانون', 'طب'
  ];
  
  const text = (message + ' ' + response).toLowerCase();
  
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      topics.push(keyword);
    }
  });
  
  return topics.slice(0, 5); // أقصى 5 مواضيع
}

function determineDifficulty(message: string, culturalContext: any): 'easy' | 'medium' | 'hard' {
  const complexWords = ['تحليل', 'نظرية', 'معادلة', 'خوارزمية', 'استراتيجية'];
  const simpleWords = ['ما هو', 'اشرح', 'بسيط', 'مثال', 'كيف'];
  
  const lowerMessage = message.toLowerCase();
  
  const complexCount = complexWords.filter(word => lowerMessage.includes(word)).length;
  const simpleCount = simpleWords.filter(word => lowerMessage.includes(word)).length;
  
  if (complexCount > simpleCount) {
    return 'hard';
  } else if (simpleCount > complexCount) {
    return 'easy';
  }
  
  return 'medium';
}
