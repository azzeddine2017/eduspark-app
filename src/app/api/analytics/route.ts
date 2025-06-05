import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AnalyticsCollector } from '@/lib/analytics/collector'

/**
 * تسجيل حدث تحليلي
 * POST /api/analytics
 */
export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // استخراج بيانات الحدث
    const body = await request.json()
    const {
      eventName,
      eventType,
      properties,
      sessionId,
      pageUrl,
      referrer
    } = body

    // التحقق من صحة البيانات
    if (!eventName || !eventType) {
      return NextResponse.json(
        { error: 'اسم الحدث ونوعه مطلوبان' },
        { status: 400 }
      )
    }

    // الحصول على معلومات الطلب
    const userAgent = request.headers.get('user-agent') || undefined
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIp || undefined

    // تسجيل الحدث
    const success = await AnalyticsCollector.trackEvent({
      eventName,
      eventType,
      userId: session.user.id,
      properties,
      sessionId,
      userAgent,
      ipAddress,
      pageUrl,
      referrer
    })

    if (success) {
      return NextResponse.json({ message: 'تم تسجيل الحدث بنجاح' })
    } else {
      return NextResponse.json(
        { error: 'فشل في تسجيل الحدث' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('خطأ في تسجيل الحدث التحليلي:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الحدث' },
      { status: 500 }
    )
  }
}

/**
 * جلب الإحصائيات العامة
 * GET /api/analytics
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
        { error: 'غير مصرح بعرض التحليلات' },
        { status: 403 }
      )
    }

    // استخراج معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7' // آخر 7 أيام افتراضياً
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // تحديد نطاق التاريخ
    let dateRange: { gte: Date; lte?: Date }
    
    if (startDate && endDate) {
      dateRange = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    } else {
      const days = parseInt(period)
      dateRange = {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    }

    // جلب الإحصائيات
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalLessons,
      totalEnrollments,
      recentEvents,
      topPages,
      userGrowth,
      courseStats,
      aiUsage
    ] = await Promise.all([
      // إجمالي المستخدمين
      prisma.user.count(),
      
      // المستخدمين النشطين في الفترة المحددة
      prisma.user.count({
        where: {
          dailyActivities: {
            some: {
              date: dateRange
            }
          }
        }
      }),
      
      // إجمالي الدورات
      prisma.course.count({ where: { isPublished: true } }),
      
      // إجمالي الدروس
      prisma.lesson.count({ where: { isPublished: true } }),
      
      // إجمالي التسجيلات
      prisma.enrollment.count(),
      
      // الأحداث الحديثة
      prisma.analyticsEvent.findMany({
        where: {
          timestamp: dateRange
        },
        select: {
          eventName: true,
          eventType: true,
          timestamp: true,
          properties: true
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 100
      }),
      
      // أكثر الصفحات زيارة
      prisma.analyticsEvent.groupBy({
        by: ['pageUrl'],
        where: {
          eventName: 'page_view',
          timestamp: dateRange,
          pageUrl: { not: null }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      }),
      
      // نمو المستخدمين
      prisma.systemMetrics.findMany({
        where: {
          date: dateRange
        },
        select: {
          date: true,
          totalUsers: true,
          activeUsers: true,
          newUsers: true
        },
        orderBy: {
          date: 'asc'
        }
      }),
      
      // إحصائيات الدورات
      prisma.systemMetrics.findMany({
        where: {
          date: dateRange
        },
        select: {
          date: true,
          newEnrollments: true,
          lessonsCompleted: true,
          quizzesCompleted: true
        },
        orderBy: {
          date: 'asc'
        }
      }),
      
      // استخدام المساعد الذكي
      prisma.systemMetrics.findMany({
        where: {
          date: dateRange
        },
        select: {
          date: true,
          aiInteractions: true,
          aiTokensUsed: true
        },
        orderBy: {
          date: 'asc'
        }
      })
    ])

    // تجميع الأحداث حسب النوع
    const eventsByType = recentEvents.reduce((acc, event) => {
      acc[event.eventName] = (acc[event.eventName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // حساب معدلات النمو
    const growthRate = userGrowth.length > 1 
      ? ((userGrowth[userGrowth.length - 1].totalUsers - userGrowth[0].totalUsers) / userGrowth[0].totalUsers) * 100
      : 0

    return NextResponse.json({
      summary: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalLessons,
        totalEnrollments,
        growthRate: Math.round(growthRate * 100) / 100
      },
      events: {
        total: recentEvents.length,
        byType: eventsByType,
        recent: recentEvents.slice(0, 20)
      },
      pages: {
        topPages: topPages.map(page => ({
          url: page.pageUrl,
          views: page._count.id
        }))
      },
      trends: {
        userGrowth: userGrowth.map(day => ({
          date: day.date,
          total: day.totalUsers,
          active: day.activeUsers,
          new: day.newUsers
        })),
        courseActivity: courseStats.map(day => ({
          date: day.date,
          enrollments: day.newEnrollments,
          lessonsCompleted: day.lessonsCompleted,
          quizzesCompleted: day.quizzesCompleted
        })),
        aiUsage: aiUsage.map(day => ({
          date: day.date,
          interactions: day.aiInteractions,
          tokens: day.aiTokensUsed
        }))
      }
    })

  } catch (error) {
    console.error('خطأ في جلب التحليلات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التحليلات' },
      { status: 500 }
    )
  }
}
