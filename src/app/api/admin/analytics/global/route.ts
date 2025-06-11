import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';

/**
 * GET /api/admin/analytics/global - جلب الإحصائيات العامة للمنصة الموزعة
 * يقوم بجمع وتحليل البيانات من جميع العقد المحلية
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحيات المستخدم
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    // جمع الإحصائيات العامة من جميع العقد
    const globalStats = await globalPlatformService.collectGlobalStatistics();
    
    // Get additional metrics
    const totalUsers = await globalPlatformService.prisma.user.count();
    const totalCourses = await globalPlatformService.prisma.course.count();
    const totalEnrollments = await globalPlatformService.prisma.enrollment.count();
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await globalPlatformService.prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    const recentEnrollments = await globalPlatformService.prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Get revenue trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const monthlyRevenues = await globalPlatformService.prisma.nodeRevenue.groupBy({
      by: ['transactionDate'],
      where: {
        transactionDate: {
          gte: twelveMonthsAgo
        }
      },
      _sum: {
        amount: true,
        platformFee: true,
        netAmount: true
      },
      orderBy: {
        transactionDate: 'asc'
      }
    });
    
    // Process monthly data
    const monthlyData = monthlyRevenues.reduce((acc, item) => {
      const month = item.transactionDate.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          totalAmount: 0,
          platformFee: 0,
          netAmount: 0,
          transactionCount: 0
        };
      }
      acc[month].totalAmount += Number(item._sum.amount || 0);
      acc[month].platformFee += Number(item._sum.platformFee || 0);
      acc[month].netAmount += Number(item._sum.netAmount || 0);
      acc[month].transactionCount++;
      return acc;
    }, {} as Record<string, any>);
    
    // Get top performing nodes
    const topNodes = await globalPlatformService.prisma.nodeRevenue.groupBy({
      by: ['nodeId'],
      _sum: {
        amount: true,
        netAmount: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      },
      take: 10
    });
    
    // Get node details for top performers
    const topNodesWithDetails = await Promise.all(
      topNodes.map(async (nodeData) => {
        const node = await globalPlatformService.getNode(nodeData.nodeId);
        return {
          node: {
            id: node?.id,
            name: node?.name,
            region: node?.region,
            status: node?.status
          },
          totalRevenue: Number(nodeData._sum.amount || 0),
          netRevenue: Number(nodeData._sum.netAmount || 0),
          transactionCount: nodeData._count.id
        };
      })
    );
    
    // Calculate growth rates
    const currentMonth = new Date().toISOString().substring(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthKey = lastMonth.toISOString().substring(0, 7);
    
    const currentMonthRevenue = monthlyData[currentMonth]?.totalAmount || 0;
    const lastMonthRevenue = monthlyData[lastMonthKey]?.totalAmount || 0;
    const revenueGrowthRate = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    
    const response = {
      globalStatistics: globalStats,
      platformMetrics: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        recentUsers,
        recentEnrollments,
        revenueGrowthRate: Math.round(revenueGrowthRate * 100) / 100
      },
      monthlyTrends: monthlyData,
      topPerformingNodes: topNodesWithDetails,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: response,
      message: 'تم جلب الإحصائيات العامة بنجاح'
    });

  } catch (error: any) {
    console.error('Error fetching global analytics:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الإحصائيات العامة' },
      { status: 500 }
    );
  }
}
