import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contentDistributionService } from '@/lib/content-distribution';
import { GlobalContentType, ContentCategory, ContentLevel, AgeGroup, ContentTier } from '@prisma/client';
import { z } from 'zod';

// مخطط التحقق من بيانات المحتوى العالمي
const createGlobalContentSchema = z.object({
  title: z.string().min(1, 'عنوان المحتوى مطلوب'),
  description: z.string().optional(),
  type: z.nativeEnum(GlobalContentType),
  category: z.nativeEnum(ContentCategory),
  level: z.nativeEnum(ContentLevel),
  ageGroup: z.nativeEnum(AgeGroup),
  tier: z.nativeEnum(ContentTier),
  estimatedDuration: z.number().positive().optional(),
  prerequisites: z.array(z.string()).optional(),
  learningObjectives: z.array(z.string()).optional(),
  contentData: z.any(), // البيانات الأساسية للمحتوى
  metadata: z.any().optional()
});

/**
 * GET /api/admin/content/global - جلب المحتوى العالمي مع الفلترة
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحيات المستخدم
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'CONTENT_CREATOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    // جلب معاملات الفلترة من URL
    const url = new URL(request.url);
    const filters: any = {};

    const type = url.searchParams.get('type');
    const category = url.searchParams.get('category');
    const level = url.searchParams.get('level');
    const tier = url.searchParams.get('tier');
    const isPublished = url.searchParams.get('isPublished');
    const searchTerm = url.searchParams.get('search');

    if (type) filters.type = type as GlobalContentType;
    if (category) filters.category = category as ContentCategory;
    if (level) filters.level = level as ContentLevel;
    if (tier) filters.tier = tier as ContentTier;
    if (isPublished !== null) filters.isPublished = isPublished === 'true';
    if (searchTerm) filters.searchTerm = searchTerm;

    // جلب المحتوى العالمي
    const globalContent = await contentDistributionService.getGlobalContent(filters);

    // جلب إحصائيات سريعة
    const statistics = await contentDistributionService.getContentStatistics();

    return NextResponse.json({
      success: true,
      data: {
        content: globalContent,
        statistics,
        filters: {
          applied: filters,
          available: {
            types: Object.values(GlobalContentType),
            categories: Object.values(ContentCategory),
            levels: Object.values(ContentLevel),
            tiers: Object.values(ContentTier)
          }
        }
      },
      message: 'تم جلب المحتوى العالمي بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب المحتوى العالمي:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب المحتوى العالمي' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content/global - إنشاء محتوى عالمي جديد
 */
export async function POST(request: NextRequest) {
  try {
    // التحقق من صلاحيات المستخدم
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'CONTENT_CREATOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    // التحقق من صحة البيانات
    const body = await request.json();
    const validatedData = createGlobalContentSchema.parse(body);

    // إنشاء المحتوى العالمي
    const globalContent = await contentDistributionService.createGlobalContent(
      validatedData,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: globalContent,
      message: 'تم إنشاء المحتوى العالمي بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('خطأ في إنشاء المحتوى العالمي:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إنشاء المحتوى العالمي' },
      { status: 500 }
    );
  }
}
