import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * جلب تحليلات الدورات
 * GET /api/analytics/courses
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
    const period = searchParams.get('period') || '30' // آخر 30 يوم افتراضياً
    const courseId = searchParams.get('courseId')
    const instructorId = searchParams.get('instructorId')

    // تحديد نطاق التاريخ
    const days = parseInt(period)
    const dateRange = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }

    // بناء شروط الاستعلام
    const whereClause: any = { isPublished: true }
    if (courseId) {
      whereClause.id = courseId
    }
    if (instructorId) {
      whereClause.authorId = instructorId
    }

    // جلب البيانات بشكل متوازي
    const [
      courseStats,
      topCourses,
      coursesByCategory,
      enrollmentTrends,
      completionRates
    ] = await Promise.all([
      // إحصائيات عامة للدورات
      prisma.course.aggregate({
        where: whereClause,
        _count: { id: true },
        _avg: {
          duration: true
        }
      }),

      // أكثر الدورات شعبية
      prisma.course.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          duration: true,
          createdAt: true,
          author: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              lessons: true
            }
          },
          enrollments: {
            where: {
              enrolledAt: dateRange
            },
            select: {
              enrolledAt: true,
              progress: true,
              completedAt: true
            }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        },
        take: 20
      }),

      // توزيع الدورات حسب المستوى
      prisma.course.groupBy({
        by: ['level'],
        where: whereClause,
        _count: { id: true },
        _avg: { duration: true }
      }),

      // اتجاهات التسجيل
      prisma.enrollment.groupBy({
        by: ['enrolledAt'],
        where: {
          enrolledAt: dateRange,
          course: whereClause
        },
        _count: { id: true },
        orderBy: {
          enrolledAt: 'asc'
        }
      }),

      // معدلات الإكمال
      prisma.enrollment.findMany({
        where: {
          course: whereClause
        },
        select: {
          courseId: true,
          progress: true,
          completedAt: true,
          course: {
            select: {
              title: true
            }
          }
        }
      })
    ])

    // معالجة بيانات أكثر الدورات شعبية
    const processedTopCourses = topCourses.map(course => {
      const recentEnrollments = course.enrollments.length
      const completedEnrollments = course.enrollments.filter(e => e.completedAt).length
      const completionRate = recentEnrollments > 0 ? (completedEnrollments / recentEnrollments) * 100 : 0
      const averageProgress = recentEnrollments > 0
        ? course.enrollments.reduce((sum, e) => sum + e.progress, 0) / recentEnrollments
        : 0

      return {
        id: course.id,
        title: course.title,
        level: course.level,
        instructor: course.author.name,
        duration: course.duration,
        totalEnrollments: course._count.enrollments,
        recentEnrollments,
        lessonsCount: course._count.lessons,
        completionRate: Math.round(completionRate * 100) / 100,
        averageProgress: Math.round(averageProgress * 100) / 100,
        createdAt: course.createdAt
      }
    })

    // معالجة معدلات الإكمال حسب الدورة
    const courseCompletionRates = completionRates.reduce((acc, enrollment) => {
      const courseId = enrollment.courseId
      if (!acc[courseId]) {
        acc[courseId] = {
          courseTitle: enrollment.course.title,
          total: 0,
          completed: 0,
          averageProgress: 0
        }
      }
      acc[courseId].total++
      if (enrollment.completedAt) {
        acc[courseId].completed++
      }
      acc[courseId].averageProgress += enrollment.progress
      return acc
    }, {} as Record<string, any>)

    // حساب المعدلات النهائية
    Object.keys(courseCompletionRates).forEach(courseId => {
      const data = courseCompletionRates[courseId]
      data.completionRate = data.total > 0 ? (data.completed / data.total) * 100 : 0
      data.averageProgress = data.total > 0 ? data.averageProgress / data.total : 0
    })

    return NextResponse.json({
      summary: {
        totalCourses: courseStats._count.id,
        averageDuration: Math.round((courseStats._avg.duration || 0) * 100) / 100,
        totalEnrollments: enrollmentTrends.reduce((sum, e) => sum + e._count.id, 0)
      },
      topCourses: processedTopCourses,
      levels: coursesByCategory.map(cat => ({
        level: cat.level,
        count: cat._count.id,
        averageDuration: Math.round((cat._avg.duration || 0) * 100) / 100
      })),
      performance: {
        completionRates: Object.entries(courseCompletionRates).map(([courseId, data]: [string, any]) => ({
          courseId,
          courseTitle: data.courseTitle,
          totalEnrollments: data.total,
          completedEnrollments: data.completed,
          completionRate: Math.round(data.completionRate * 100) / 100,
          averageProgress: Math.round(data.averageProgress * 100) / 100
        }))
      }
    })

  } catch (error) {
    console.error('خطأ في جلب تحليلات الدورات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تحليلات الدورات' },
      { status: 500 }
    )
  }
}
