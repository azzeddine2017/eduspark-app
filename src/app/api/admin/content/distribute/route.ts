import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { contentDistributionService } from '@/lib/content-distribution';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// مخطط التحقق من بيانات التوزيع
const distributeContentSchema = z.object({
  globalContentId: z.string().min(1, 'معرف المحتوى العالمي مطلوب'),
  targetNodes: z.array(z.string()).optional(),
  distributionType: z.enum(['push_all', 'selective', 'on_demand']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduledTime: z.string().datetime().optional()
});

/**
 * POST /api/admin/content/distribute - توزيع المحتوى العالمي للعقد المحلية
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
    const validatedData = distributeContentSchema.parse(body);

    // تحضير خيارات التوزيع
    const distributionOptions = {
      targetNodes: validatedData.targetNodes,
      distributionType: validatedData.distributionType,
      priority: validatedData.priority,
      scheduledTime: validatedData.scheduledTime ? new Date(validatedData.scheduledTime) : undefined
    };

    // بدء عملية التوزيع
    const distribution = await contentDistributionService.distributeContent(
      validatedData.globalContentId,
      distributionOptions
    );

    return NextResponse.json({
      success: true,
      data: {
        distributionId: distribution.id,
        status: distribution.status,
        targetNodes: distribution.targetNodes,
        distributionType: distribution.distributionType,
        startedAt: distribution.startedAt,
        metadata: distribution.metadata
      },
      message: 'تم بدء عملية توزيع المحتوى بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('خطأ في توزيع المحتوى:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء توزيع المحتوى' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/content/distribute - جلب حالة عمليات التوزيع
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

    // جلب معاملات الاستعلام
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // بناء شروط الاستعلام
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // جلب عمليات التوزيع
    const distributions = await prisma.contentDistribution.findMany({
      where,
      include: {
        globalContent: {
          select: {
            id: true,
            title: true,
            type: true,
            category: true,
            tier: true
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: limit,
      skip: offset
    });

    // حساب الإحصائيات
    const totalDistributions = await prisma.contentDistribution.count({ where });

    const statusCounts = await prisma.contentDistribution.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const statistics = {
      total: totalDistributions,
      byStatus: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      }, {} as Record<string, number>)
    };

    // حساب معدلات النجاح
    const successRates = distributions.map(dist => {
      const totalNodes = Array.isArray(dist.targetNodes) ? dist.targetNodes.length : 0;
      const successRate = totalNodes > 0 ? (dist.successfulNodes / totalNodes) * 100 : 0;
      
      return {
        ...dist,
        totalTargetNodes: totalNodes,
        successRate: Math.round(successRate * 100) / 100
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        distributions: successRates,
        statistics,
        pagination: {
          limit,
          offset,
          total: totalDistributions,
          hasMore: offset + limit < totalDistributions
        }
      },
      message: 'تم جلب حالة عمليات التوزيع بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في جلب حالة التوزيع:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب حالة عمليات التوزيع' },
      { status: 500 }
    );
  }
}
