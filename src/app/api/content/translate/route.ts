import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contentDistributionService } from '@/lib/content-distribution';
import { prisma } from '@/lib/prisma';
import { TranslationStatus } from '@prisma/client';
import { z } from 'zod';

// مخطط التحقق من طلب الترجمة
const createTranslationSchema = z.object({
  localContentId: z.string().min(1, 'معرف المحتوى المحلي مطلوب'),
  sourceLanguage: z.string().min(2, 'اللغة المصدر مطلوبة'),
  targetLanguage: z.string().min(2, 'اللغة المستهدفة مطلوبة'),
  sourceText: z.string().min(1, 'النص المصدر مطلوب'),
  translationType: z.enum(['automatic', 'human', 'hybrid']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
});

// مخطط تحديث الترجمة
const updateTranslationSchema = z.object({
  translatedText: z.string().min(1, 'النص المترجم مطلوب'),
  quality: z.object({
    accuracy: z.number().min(1).max(10).optional(),
    fluency: z.number().min(1).max(10).optional(),
    culturalFit: z.number().min(1).max(10).optional(),
    needsReview: z.boolean().optional()
  }).optional(),
  feedback: z.string().optional(),
  status: z.nativeEnum(TranslationStatus).optional()
});

/**
 * POST /api/content/translate - إنشاء طلب ترجمة جديد
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

    // التحقق من الصلاحيات
    if (!['ADMIN', 'CONTENT_CREATOR', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بطلب الترجمة' },
        { status: 403 }
      );
    }

    // التحقق من صحة البيانات
    const body = await request.json();
    const validatedData = createTranslationSchema.parse(body);

    // التحقق من وجود المحتوى المحلي
    const localContent = await prisma.localContent.findUnique({
      where: { id: validatedData.localContentId },
      include: { node: true }
    });

    if (!localContent) {
      return NextResponse.json(
        { success: false, error: 'المحتوى المحلي غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من صلاحية المستخدم للعقدة
    if (session.user.role !== 'ADMIN') {
      const nodePartnership = await prisma.nodePartner.findFirst({
        where: {
          nodeId: localContent.nodeId,
          userId: session.user.id,
          status: 'ACTIVE'
        }
      });

      if (!nodePartnership) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح لك بطلب ترجمة محتوى هذه العقدة' },
          { status: 403 }
        );
      }
    }

    // إنشاء طلب الترجمة
    const translation = await contentDistributionService.createTranslationRequest({
      localContentId: validatedData.localContentId,
      translatorId: session.user.id, // المستخدم الحالي كمترجم مؤقت
      sourceLanguage: validatedData.sourceLanguage,
      targetLanguage: validatedData.targetLanguage,
      sourceText: validatedData.sourceText,
      translationType: validatedData.translationType,
      priority: validatedData.priority
    });

    // إذا كانت الترجمة تلقائية، قم بمحاولة الترجمة فوراً
    if (validatedData.translationType === 'automatic') {
      try {
        // هنا يمكن إضافة خدمة الترجمة التلقائية (Google Translate, DeepL, إلخ)
        const automaticTranslation = await performAutomaticTranslation(
          validatedData.sourceText,
          validatedData.sourceLanguage,
          validatedData.targetLanguage
        );

        // تحديث الترجمة بالنتيجة التلقائية
        await contentDistributionService.updateTranslation(
          translation.id,
          automaticTranslation,
          {
            accuracy: 7, // تقدير أولي للترجمة التلقائية
            fluency: 6,
            culturalFit: 5,
            needsReview: true
          }
        );
      } catch (autoTranslateError) {
        console.error('خطأ في الترجمة التلقائية:', autoTranslateError);
        // الاستمرار بدون الترجمة التلقائية
      }
    }

    return NextResponse.json({
      success: true,
      data: translation,
      message: 'تم إنشاء طلب الترجمة بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('خطأ في إنشاء طلب الترجمة:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إنشاء طلب الترجمة' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/translate - جلب طلبات الترجمة
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
    const status = url.searchParams.get('status');
    const translationType = url.searchParams.get('type');
    const language = url.searchParams.get('language');
    const nodeId = url.searchParams.get('nodeId');

    // بناء شروط الاستعلام
    const where: any = {};
    
    if (status) where.status = status as TranslationStatus;
    if (translationType) where.translationType = translationType;
    if (language) {
      where.OR = [
        { sourceLanguage: language },
        { targetLanguage: language }
      ];
    }

    // إضافة فلتر العقدة إذا تم تحديدها
    if (nodeId) {
      where.localContent = { nodeId };
    }

    // للمستخدمين غير المديرين، عرض الترجمات الخاصة بهم فقط
    if (session.user.role !== 'ADMIN') {
      where.translatorId = session.user.id;
    }

    // جلب طلبات الترجمة
    const translations = await prisma.translation.findMany({
      where,
      include: {
        localContent: {
          include: {
            node: { select: { name: true, language: true } },
            globalContent: { select: { title: true, type: true } }
          }
        },
        translator: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // جلب إحصائيات الترجمة
    const statistics = await prisma.translation.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const statusCounts = statistics.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        translations,
        statistics: {
          total: translations.length,
          byStatus: statusCounts
        }
      },
      message: 'تم جلب طلبات الترجمة بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب طلبات الترجمة:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب طلبات الترجمة' },
      { status: 500 }
    );
  }
}

// دالة مساعدة للترجمة التلقائية (يمكن تطويرها لاحقاً)
async function performAutomaticTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  // هنا يمكن إضافة تكامل مع خدمات الترجمة التلقائية
  // مثل Google Translate API أو DeepL API
  
  // مثال بسيط للترجمة من العربية للإنجليزية
  if (sourceLanguage === 'ar' && targetLanguage === 'en') {
    // ترجمة تجريبية بسيطة
    return `[AUTO-TRANSLATED] ${text}`;
  }
  
  // إرجاع النص الأصلي مع تنبيه للترجمة اليدوية
  return `[NEEDS MANUAL TRANSLATION] ${text}`;
}
