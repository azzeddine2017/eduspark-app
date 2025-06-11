import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { paymentService, PaymentProvider } from '@/lib/payment/payment-service';
import { globalPlatformService } from '@/lib/distributed-platform';
import { z } from 'zod';

// مخطط التحقق من البيانات
const createSubscriptionSchema = z.object({
  planId: z.string().min(1, 'معرف الخطة مطلوب'),
  provider: z.enum(['stripe', 'paypal'], {
    errorMap: () => ({ message: 'بوابة دفع غير صحيحة للاشتراكات' })
  }),
  metadata: z.record(z.any()).optional(),
});

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, 'معرف الاشتراك مطلوب'),
  reason: z.string().optional(),
});

// إنشاء اشتراك جديد
export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // قراءة وتحليل البيانات
    const body = await request.json();
    const validationResult = createSubscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { planId, provider, metadata } = validationResult.data;

    // التحقق من وجود اشتراك نشط
    const existingSubscription = await globalPlatformService.prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active'
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'لديك اشتراك نشط بالفعل. يرجى إلغاؤه أولاً قبل إنشاء اشتراك جديد.' 
        },
        { status: 400 }
      );
    }

    // إنشاء الاشتراك
    const result = await paymentService.createSubscription({
      planId,
      userId: session.user.id,
      provider: provider as PaymentProvider,
      metadata
    });

    return NextResponse.json({
      success: result.success,
      data: result.success ? {
        subscriptionId: result.subscriptionId,
        redirectUrl: result.redirectUrl
      } : null,
      error: result.error
    });

  } catch (error) {
    console.error('خطأ في إنشاء الاشتراك:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}

// جلب اشتراكات المستخدم
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // جلب اشتراكات المستخدم
    const subscriptions = await globalPlatformService.prisma.subscription.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // جلب خطط الاشتراك للمرجع
    const plans = await paymentService.getSubscriptionPlans();
    const plansMap = new Map(plans.map(plan => [plan.id, plan]));

    // إثراء البيانات بمعلومات الخطط
    const enrichedSubscriptions = subscriptions.map(subscription => ({
      ...subscription,
      plan: plansMap.get(subscription.planId) || null
    }));

    return NextResponse.json({
      success: true,
      data: {
        subscriptions: enrichedSubscriptions,
        availablePlans: plans
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الاشتراكات:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}

// إلغاء اشتراك
export async function DELETE(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // قراءة وتحليل البيانات
    const body = await request.json();
    const validationResult = cancelSubscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { subscriptionId, reason } = validationResult.data;

    // التحقق من ملكية الاشتراك
    const subscription = await globalPlatformService.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: session.user.id
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'الاشتراك غير موجود أو غير مملوك لك' },
        { status: 404 }
      );
    }

    if (subscription.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'الاشتراك ملغى بالفعل' },
        { status: 400 }
      );
    }

    // إلغاء الاشتراك حسب البوابة
    try {
      switch (subscription.provider) {
        case 'stripe':
          const { stripeService } = await import('@/lib/payment/stripe');
          await stripeService.cancelSubscription(subscriptionId);
          break;
        case 'paypal':
          const { paypalService } = await import('@/lib/payment/paypal');
          await paypalService.cancelSubscription(subscriptionId, reason);
          break;
        default:
          throw new Error('بوابة دفع غير مدعومة');
      }

      // تحديث حالة الاشتراك في قاعدة البيانات
      await globalPlatformService.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason
        }
      });

      return NextResponse.json({
        success: true,
        message: 'تم إلغاء الاشتراك بنجاح'
      });

    } catch (providerError) {
      console.error('خطأ في إلغاء الاشتراك من البوابة:', providerError);
      
      // حتى لو فشل الإلغاء من البوابة، نحدث حالة الاشتراك محلياً
      await globalPlatformService.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason || 'إلغاء محلي بسبب خطأ في البوابة'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'تم إلغاء الاشتراك محلياً. قد تحتاج لمتابعة الإلغاء مع بوابة الدفع.',
        warning: 'تم الإلغاء محلياً فقط'
      });
    }

  } catch (error) {
    console.error('خطأ في إلغاء الاشتراك:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}
