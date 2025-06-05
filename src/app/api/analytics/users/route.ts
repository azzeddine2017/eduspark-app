import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * جلب تحليلات المستخدمين
 * GET /api/analytics/users
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة والصلاحيات
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // التحقق من صلاحيات الإدارة
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض تحليلات المستخدمين' },
        { status: 403 }
      )
    }

    // استخراج معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // آخر 30 يوم افتراضياً
    const userRole = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '50')

    // تحديد نطاق التاريخ
    const days = parseInt(period)
    const dateRange = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }

    // بناء شروط الاستعلام
    const whereClause: any = {}
    if (userRole) {
      whereClause.role = userRole
    }

    // جلب إحصائيات المستخدمين
    const [
      userStats,
      topActiveUsers,
      usersByRole,
      userRegistrations,
      userEngagement,
      inactiveUsers
    ] = await Promise.all([
      // إحصائيات عامة للمستخدمين
      prisma.user.aggregate({
        where: whereClause,
        _count: { id: true },
        _min: { createdAt: true },
        _max: { createdAt: true }
      }),

      // أكثر المستخدمين نشاطاً
      prisma.user.findMany({
        where: {
          ...whereClause,
          dailyActivities: {
            some: {
              date: dateRange
            }
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          dailyActivities: {
            where: {
              date: dateRange
            },
            select: {
              totalTimeSpent: true,
              lessonsViewed: true,
              quizzesTaken: true,
              aiInteractions: true
            }
          }
        },
        take: limit
      }),

      // توزيع المستخدمين حسب الدور
      prisma.user.groupBy({
        by: ['role'],
        where: whereClause,
        _count: { id: true }
      }),

      // تسجيلات المستخدمين الجدد
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          ...whereClause,
          createdAt: dateRange
        },
        _count: { id: true },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // مستوى التفاعل
      prisma.userActivity.aggregate({
        where: {
          date: dateRange,
          user: whereClause
        },
        _avg: {
          totalTimeSpent: true,
          lessonsViewed: true,
          quizzesTaken: true,
          aiInteractions: true
        },
        _sum: {
          totalTimeSpent: true,
          lessonsViewed: true,
          quizzesTaken: true,
          aiInteractions: true
        }
      }),

      // المستخدمين غير النشطين
      prisma.user.count({
        where: {
          ...whereClause,
          dailyActivities: {
            none: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // آخر 30 يوم
              }
            }
          }
        }
      })
    ])

    // معالجة بيانات أكثر المستخدمين نشاطاً
    const processedActiveUsers = topActiveUsers.map(user => {
      const totalActivity = user.dailyActivities.reduce((sum, activity) => ({
        totalTimeSpent: sum.totalTimeSpent + activity.totalTimeSpent,
        lessonsViewed: sum.lessonsViewed + activity.lessonsViewed,
        quizzesTaken: sum.quizzesTaken + activity.quizzesTaken,
        aiInteractions: sum.aiInteractions + activity.aiInteractions
      }), {
        totalTimeSpent: 0,
        lessonsViewed: 0,
        quizzesTaken: 0,
        aiInteractions: 0
      })

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        activity: totalActivity,
        engagementScore: Math.round(
          (totalActivity.totalTimeSpent * 0.3) +
          (totalActivity.lessonsViewed * 10) +
          (totalActivity.quizzesTaken * 15) +
          (totalActivity.aiInteractions * 5)
        )
      }
    }).sort((a, b) => b.engagementScore - a.engagementScore)

    // معالجة تسجيلات المستخدمين الجدد (تجميع يومي)
    const dailyRegistrations = userRegistrations.reduce((acc, reg) => {
      const date = new Date(reg.createdAt).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + reg._count.id
      return acc
    }, {} as Record<string, number>)

    // حساب معدل الاحتفاظ (المستخدمين الذين سجلوا في آخر 30 يوم ولا يزالون نشطين)
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    })

    const activeRecentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        dailyActivities: {
          some: {
            date: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // نشط في آخر أسبوع
            }
          }
        }
      }
    })

    const retentionRate = recentUsers > 0 ? (activeRecentUsers / recentUsers) * 100 : 0

    return NextResponse.json({
      summary: {
        totalUsers: userStats._count.id,
        inactiveUsers,
        retentionRate: Math.round(retentionRate * 100) / 100,
        averageEngagement: {
          timeSpent: Math.round((userEngagement._avg.totalTimeSpent || 0) * 100) / 100,
          lessonsViewed: Math.round((userEngagement._avg.lessonsViewed || 0) * 100) / 100,
          quizzesTaken: Math.round((userEngagement._avg.quizzesTaken || 0) * 100) / 100,
          aiInteractions: Math.round((userEngagement._avg.aiInteractions || 0) * 100) / 100
        },
        totalEngagement: {
          timeSpent: userEngagement._sum.totalTimeSpent || 0,
          lessonsViewed: userEngagement._sum.lessonsViewed || 0,
          quizzesTaken: userEngagement._sum.quizzesTaken || 0,
          aiInteractions: userEngagement._sum.aiInteractions || 0
        }
      },
      demographics: {
        byRole: usersByRole.map(role => ({
          role: role.role,
          count: role._count.id,
          percentage: Math.round((role._count.id / userStats._count.id) * 100)
        }))
      },
      activity: {
        topUsers: processedActiveUsers.slice(0, 20),
        dailyRegistrations: Object.entries(dailyRegistrations).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => a.date.localeCompare(b.date))
      },
      insights: {
        mostActiveRole: usersByRole.reduce((max, role) => 
          role._count.id > max._count.id ? role : max, usersByRole[0]
        )?.role || 'غير محدد',
        averageSessionTime: Math.round((userEngagement._avg.totalTimeSpent || 0)),
        engagementTrend: processedActiveUsers.length > 0 ? 'متزايد' : 'مستقر'
      }
    })

  } catch (error) {
    console.error('خطأ في جلب تحليلات المستخدمين:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تحليلات المستخدمين' },
      { status: 500 }
    )
  }
}
