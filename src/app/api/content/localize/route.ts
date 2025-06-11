import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contentDistributionService } from '@/lib/content-distribution';
import { z } from 'zod';

// مخطط التحقق من بيانات التخصيص المحلي
const localizeContentSchema = z.object({
  globalContentId: z.string().min(1, 'معرف المحتوى العالمي مطلوب'),
  nodeId: z.string().min(1, 'معرف العقدة مطلوب'),
  targetLanguage: z.string().min(2, 'اللغة المستهدفة مطلوبة'),
  localizationType: z.enum(['translation', 'adaptation', 'recreation']),
  culturalAdaptations: z.array(z.object({
    section: z.string(),
    originalContent: z.string(),
    adaptedContent: z.string(),
    reason: z.string(),
    approvedBy: z.string()
  })).optional(),
  localExamples: z.array(z.object({
    context: z.string(),
    originalExample: z.string(),
    localExample: z.string(),
    relevanceScore: z.number().min(1).max(10)
  })).optional(),
  additionalResources: z.array(z.any()).optional()
});

// مخطط التحقق من طلب الترجمة
const translationRequestSchema = z.object({
  localContentId: z.string().min(1, 'معرف المحتوى المحلي مطلوب'),
  sourceLanguage: z.string().min(2, 'اللغة المصدر مطلوبة'),
  targetLanguage: z.string().min(2, 'اللغة المستهدفة مطلوبة'),
  sourceText: z.string().min(1, 'النص المصدر مطلوب'),
  translationType: z.enum(['automatic', 'human', 'hybrid']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
});

/**
 * POST /api/content/localize - تخصيص المحتوى محلياً
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

    // التحقق من الصلاحيات (يجب أن يكون شريك في العقدة أو مدير)
    if (!['ADMIN', 'CONTENT_CREATOR', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتخصيص المحتوى' },
        { status: 403 }
      );
    }

    // التحقق من صحة البيانات
    const body = await request.json();
    const validatedData = localizeContentSchema.parse(body);

    // التحقق من صلاحية المستخدم للعقدة المحددة
    if (session.user.role !== 'ADMIN') {
      const nodePartnership = await contentDistributionService.prisma.nodePartner.findFirst({
        where: {
          nodeId: validatedData.nodeId,
          userId: session.user.id,
          status: 'ACTIVE'
        }
      });

      if (!nodePartnership) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح لك بتخصيص المحتوى في هذه العقدة' },
          { status: 403 }
        );
      }
    }

    // تخصيص المحتوى
    const localizedContent = await contentDistributionService.localizeContent(
      validatedData,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: localizedContent,
      message: 'تم تخصيص المحتوى محلياً بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('خطأ في تخصيص المحتوى:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء تخصيص المحتوى' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/localize - جلب المحتوى المحلي للعقدة
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
    const language = url.searchParams.get('language');
    const status = url.searchParams.get('status');
    const isCustomized = url.searchParams.get('isCustomized');

    if (!nodeId) {
      return NextResponse.json(
        { success: false, error: 'معرف العقدة مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من صلاحية الوصول للعقدة
    if (session.user.role !== 'ADMIN') {
      const nodePartnership = await contentDistributionService.prisma.nodePartner.findFirst({
        where: {
          nodeId,
          userId: session.user.id,
          status: 'ACTIVE'
        }
      });

      if (!nodePartnership) {
        return NextResponse.json(
          { success: false, error: 'غير مصرح لك بالوصول لمحتوى هذه العقدة' },
          { status: 403 }
        );
      }
    }

    // بناء شروط الاستعلام
    const where: any = { nodeId };
    if (language) where.language = language;
    if (status) where.status = status;
    if (isCustomized !== null) where.isCustomized = isCustomized === 'true';

    // جلب المحتوى المحلي
    const localContent = await contentDistributionService.prisma.localContent.findMany({
      where,
      include: {
        globalContent: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
            level: true,
            tier: true
          }
        },
        translations: {
          include: {
            translator: {
              select: { name: true, email: true }
            }
          }
        },
        localReviews: {
          include: {
            reviewer: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // جلب إحصائيات المحتوى المحلي
    const statistics = await contentDistributionService.getContentStatistics(nodeId);

    return NextResponse.json({
      success: true,
      data: {
        content: localContent,
        statistics,
        filters: {
          nodeId,
          language,
          status,
          isCustomized
        }
      },
      message: 'تم جلب المحتوى المحلي بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب المحتوى المحلي:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب المحتوى المحلي' },
      { status: 500 }
    );
  }
}
