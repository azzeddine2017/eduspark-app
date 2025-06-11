import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';
import { ContentTier, SubscriptionType } from '@prisma/client';
import { z } from 'zod';

// مخطط التحقق من بيانات الاشتراك الجديد
const createSubscriptionSchema = z.object({
  nodeId: z.string().min(1, 'معرف العقدة مطلوب'),
  subscriptionType: z.nativeEnum(SubscriptionType),
  tier: z.nativeEnum(ContentTier),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().optional(),
  durationMonths: z.number().min(1, 'مدة الاشتراك يجب أن تكون شهر واحد على الأقل').max(24, 'مدة الاشتراك لا يمكن أن تزيد عن 24 شهر')
});

/**
 * GET /api/subscriptions - جلب اشتراكات المستخدم الحالي
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // جلب معاملات الاستعلام
    const url = new URL(request.url);
    const nodeId = url.searchParams.get('nodeId');

    // جلب اشتراكات المستخدم
    const subscriptions = await globalPlatformService.getUserSubscriptions(
      session.user.id, 
      nodeId || undefined
    );

    // تجميع إحصائيات سريعة
    const activeSubscriptions = subscriptions.filter(sub => 
      sub.isActive && new Date(sub.endDate) > new Date()
    );

    const totalSpent = subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        summary: {
          totalSubscriptions: subscriptions.length,
          activeSubscriptions: activeSubscriptions.length,
          totalSpent,
          hasActiveSubscription: activeSubscriptions.length > 0
        }
      },
      message: 'تم جلب الاشتراكات بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب الاشتراكات:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الاشتراكات' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions - إنشاء اشتراك جديد
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
    const validatedData = createSubscriptionSchema.parse(body);

    // التحقق من وجود العقدة
    const node = await globalPlatformService.getNode(validatedData.nodeId);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من عدم وجود اشتراك نشط مسبقاً
    const existingSubscriptions = await globalPlatformService.getUserSubscriptions(
      session.user.id, 
      validatedData.nodeId
    );

    const hasActiveSubscription = existingSubscriptions.some(sub => 
      sub.isActive && new Date(sub.endDate) > new Date()
    );

    if (hasActiveSubscription) {
      return NextResponse.json(
        { success: false, error: 'لديك اشتراك نشط بالفعل في هذه العقدة' },
        { status: 400 }
      );
    }

    // إنشاء الاشتراك الجديد
    const subscription = await globalPlatformService.createSubscription(
      validatedData.nodeId,
      {
        userId: session.user.id,
        subscriptionType: validatedData.subscriptionType,
        tier: validatedData.tier,
        amount: validatedData.amount,
        currency: validatedData.currency || 'USD',
        durationMonths: validatedData.durationMonths
      }
    );

    // تسجيل الإيراد
    await globalPlatformService.recordNodeRevenue(validatedData.nodeId, {
      type: 'SUBSCRIPTION',
      amount: validatedData.amount,
      currency: validatedData.currency || 'USD',
      date: new Date(),
      description: `اشتراك ${validatedData.subscriptionType} - ${validatedData.tier}`,
      metadata: {
        subscriptionId: subscription.id,
        userId: session.user.id,
        tier: validatedData.tier,
        durationMonths: validatedData.durationMonths
      }
    });

    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'تم إنشاء الاشتراك بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('خطأ في إنشاء الاشتراك:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إنشاء الاشتراك' },
      { status: 500 }
    );
  }
}
