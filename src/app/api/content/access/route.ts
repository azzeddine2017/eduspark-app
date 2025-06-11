import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';
import { ContentTier } from '@prisma/client';
import { z } from 'zod';

// مخطط التحقق من طلب الوصول للمحتوى
const checkAccessSchema = z.object({
  nodeId: z.string().min(1, 'معرف العقدة مطلوب'),
  contentTier: z.nativeEnum(ContentTier),
  contentId: z.string().optional() // معرف المحتوى المحدد (اختياري)
});

/**
 * POST /api/content/access - التحقق من صلاحية الوصول للمحتوى
 * يتحقق من إمكانية وصول المستخدم لمحتوى معين بناءً على اشتراكه
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
    const validatedData = checkAccessSchema.parse(body);

    // التحقق من وجود العقدة
    const node = await globalPlatformService.getNode(validatedData.nodeId);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من صلاحية الوصول
    const accessInfo = await globalPlatformService.checkContentAccess(
      session.user.id,
      validatedData.nodeId,
      validatedData.contentTier
    );

    // تحديد حالة الوصول
    let accessStatus: 'granted' | 'denied' | 'upgrade_required' = 'denied';
    let message = '';

    if (validatedData.contentTier === ContentTier.FREE) {
      accessStatus = 'granted';
      message = 'يمكنك الوصول للمحتوى المجاني';
    } else if (accessInfo.hasPremiumAccess) {
      accessStatus = 'granted';
      message = 'يمكنك الوصول للمحتوى المدفوع';
    } else {
      accessStatus = 'upgrade_required';
      message = 'تحتاج لترقية اشتراكك للوصول لهذا المحتوى';
    }

    // جلب معلومات إضافية عن الاشتراك إذا كان موجود
    let subscriptionInfo = null;
    if (accessInfo.expiryDate) {
      const userSubscriptions = await globalPlatformService.getUserSubscriptions(
        session.user.id,
        validatedData.nodeId
      );
      
      const activeSubscription = userSubscriptions.find(sub => 
        sub.isActive && new Date(sub.endDate) > new Date()
      );

      if (activeSubscription) {
        subscriptionInfo = {
          type: activeSubscription.subscriptionType,
          tier: activeSubscription.tier,
          expiryDate: activeSubscription.endDate,
          autoRenew: activeSubscription.autoRenew,
          daysRemaining: Math.ceil(
            (new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
        };
      }
    }

    // اقتراحات الترقية إذا كان الوصول مرفوض
    let upgradeOptions = null;
    if (accessStatus === 'upgrade_required') {
      upgradeOptions = [
        {
          type: 'BASIC',
          tier: 'PREMIUM',
          price: 29,
          currency: 'USD',
          description: 'وصول للمحتوى المتخصص الأساسي'
        },
        {
          type: 'ADVANCED',
          tier: 'PREMIUM',
          price: 49,
          currency: 'USD',
          description: 'وصول للمحتوى المتقدم والاستشارات'
        },
        {
          type: 'PREMIUM',
          tier: 'ENTERPRISE',
          price: 99,
          currency: 'USD',
          description: 'وصول كامل لجميع المحتويات والخدمات'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        accessStatus,
        message,
        accessInfo,
        subscriptionInfo,
        upgradeOptions,
        requestedContent: {
          nodeId: validatedData.nodeId,
          tier: validatedData.contentTier,
          contentId: validatedData.contentId
        }
      }
    });

  } catch (error: any) {
    console.error('خطأ في التحقق من صلاحية الوصول:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التحقق من صلاحية الوصول' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/access - جلب معلومات الوصول العامة للمستخدم
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

    // جلب جميع اشتراكات المستخدم النشطة
    const allSubscriptions = await globalPlatformService.getUserSubscriptions(session.user.id);
    
    const activeSubscriptions = allSubscriptions.filter(sub => 
      sub.isActive && new Date(sub.endDate) > new Date()
    );

    // تجميع معلومات الوصول لكل عقدة
    const accessByNode = await Promise.all(
      activeSubscriptions.map(async (subscription) => {
        const nodeAccess = await globalPlatformService.checkContentAccess(
          session.user.id,
          subscription.nodeId,
          subscription.tier
        );

        return {
          nodeId: subscription.nodeId,
          nodeName: subscription.node.name,
          subscriptionType: subscription.subscriptionType,
          tier: subscription.tier,
          expiryDate: subscription.endDate,
          accessLevel: nodeAccess.subscriptionLevel,
          daysRemaining: Math.ceil(
            (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
        };
      })
    );

    // إحصائيات عامة
    const totalSpent = allSubscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);
    const expiringSubscriptions = activeSubscriptions.filter(sub => {
      const daysRemaining = Math.ceil(
        (new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysRemaining <= 7; // تنتهي خلال أسبوع
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: session.user.id,
        totalActiveSubscriptions: activeSubscriptions.length,
        totalSpent,
        accessByNode,
        expiringSubscriptions: expiringSubscriptions.map(sub => ({
          nodeId: sub.nodeId,
          nodeName: sub.node.name,
          expiryDate: sub.endDate,
          daysRemaining: Math.ceil(
            (new Date(sub.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
        })),
        hasAnyPremiumAccess: activeSubscriptions.length > 0
      },
      message: 'تم جلب معلومات الوصول بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب معلومات الوصول:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب معلومات الوصول' },
      { status: 500 }
    );
  }
}
