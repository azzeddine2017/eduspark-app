import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLocalizedAI } from '@/lib/localized-ai';
import { globalPlatformService } from '@/lib/distributed-platform';
import { z } from 'zod';

// مخطط التحقق من طلب المحادثة المخصصة
const localizedChatSchema = z.object({
  message: z.string().min(1, 'الرسالة مطلوبة'),
  nodeId: z.string().min(1, 'معرف العقدة مطلوب'),
  context: z.object({
    currentLesson: z.string().optional(),
    currentTopic: z.string().optional(),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    conversationHistory: z.array(z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
      timestamp: z.string().datetime()
    })).optional(),
    userGoals: z.array(z.string()).optional()
  }).optional()
});

/**
 * POST /api/ai/localized - محادثة مع المساعد الذكي المخصص محلياً
 */
export async function POST(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // التحقق من صحة البيانات
    const body = await request.json();
    const validatedData = localizedChatSchema.parse(body);

    // التحقق من وجود العقدة
    const node = await globalPlatformService.getNode(validatedData.nodeId);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من صلاحية الوصول للعقدة
    const hasAccess = await checkNodeAccess(session.user.id, validatedData.nodeId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول لهذه العقدة' },
        { status: 403 }
      );
    }

    // إنشاء مثيل الذكاء الاصطناعي المحلي
    const localizedAI = createLocalizedAI(validatedData.nodeId);

    // تحضير السياق
    const aiContext = {
      currentLesson: validatedData.context?.currentLesson,
      currentTopic: validatedData.context?.currentTopic,
      difficulty: validatedData.context?.difficulty as any,
      conversationHistory: validatedData.context?.conversationHistory?.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })),
      userGoals: validatedData.context?.userGoals
    };

    // توليد الاستجابة
    const startTime = Date.now();
    const aiResponse = await localizedAI.generateResponse(
      validatedData.message,
      aiContext,
      session.user.id
    );
    const processingTime = Date.now() - startTime;

    // تسجيل المحادثة
    await logLocalizedConversation(
      session.user.id,
      validatedData.nodeId,
      validatedData.message,
      aiResponse.content,
      aiContext,
      processingTime
    );

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse.content,
        confidence: aiResponse.confidence,
        culturallyAdapted: aiResponse.culturallyAdapted,
        suggestions: aiResponse.suggestions,
        followUpQuestions: aiResponse.followUpQuestions,
        resources: aiResponse.resources,
        metadata: {
          nodeId: validatedData.nodeId,
          nodeName: node.name,
          nodeRegion: node.region,
          nodeLanguage: node.language,
          timestamp: new Date().toISOString(),
          processingTime
        }
      },
      message: 'تم توليد الاستجابة المخصصة بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في المحادثة المخصصة:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة طلبك' },
      { status: 500 }
    );
  }
}

// دوال مساعدة

// التحقق من صلاحية الوصول للعقدة
async function checkNodeAccess(userId: string, nodeId: string): Promise<boolean> {
  try {
    // التحقق من الاشتراك النشط في العقدة
    const subscription = await globalPlatformService.prisma.nodeSubscription.findFirst({
      where: {
        userId,
        nodeId,
        isActive: true,
        endDate: {
          gte: new Date()
        }
      }
    });

    if (subscription) return true;

    // التحقق من الشراكة في العقدة
    const partnership = await globalPlatformService.prisma.nodePartner.findFirst({
      where: {
        userId,
        nodeId,
        status: 'ACTIVE'
      }
    });

    if (partnership) return true;

    // التحقق من كون المستخدم مدير عام
    const user = await globalPlatformService.prisma.user.findUnique({
      where: { id: userId }
    });

    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('خطأ في التحقق من صلاحية الوصول:', error);
    return false;
  }
}

// تسجيل المحادثة المخصصة
async function logLocalizedConversation(
  userId: string,
  nodeId: string,
  userMessage: string,
  aiResponse: string,
  context: any,
  processingTime: number
) {
  try {
    await globalPlatformService.prisma.llmInteractionLog.create({
      data: {
        userId,
        type: 'LOCALIZED_CHAT',
        prompt: userMessage,
        response: aiResponse,
        model: 'localized-ai-v1',
        tokens: userMessage.length + aiResponse.length, // تقدير بسيط
        cost: 0, // مجاني حالياً
        responseTime: processingTime,
        metadata: {
          nodeId,
          context,
          isLocalized: true,
          culturallyAdapted: true
        }
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل المحادثة المخصصة:', error);
  }
}
