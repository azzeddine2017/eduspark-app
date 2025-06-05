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

    if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST', 'INSTRUCTOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض تحليلات الدورات' },
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
      whereClause.instructorId = instructorId
    }

    // جلب إحصائيات الدورات
    const [
      courseStats,
      topCourses,
      coursesByCategory,
      enrollmentTrends,
      completionRates,
      lessonProgress,
      quizPerformance,
      courseRatings
    ] = await Promise.all([
      // إحصائيات عامة للدورات
      prisma.course.aggregate({
        where: whereClause,
        _count: { id: true },
        _avg: { 
          rating: true,
          estimatedDuration: true
        }
      }),

      // أكثر الدورات شعبية
      prisma.course.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          rating: true,
          estimatedDuration: true,
          createdAt: true,
          instructor: {
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

      // توزيع الدورات حسب الفئة
      prisma.course.groupBy({
        by: ['category'],
        where: whereClause,
        _count: { id: true },
        _avg: { rating: true }
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
      }),

      // تقدم الدروس
      prisma.lessonProgress.groupBy({
        by: ['lessonId'],
        where: {
          lesson: {
            course: whereClause
          },
          updatedAt: dateRange
        },
        _count: {
          id: true
        },
        _sum: {
          timeSpent: true
        }
      }),

      // أداء الاختبارات
      prisma.quizAttempt.findMany({
        where: {
          quiz: {
            lesson: {
              course: whereClause
            }
          },
          createdAt: dateRange
        },
        select: {
          score: true,
          maxScore: true,
          isCompleted: true,
          quiz: {
            select: {
              lesson: {
                select: {
                  courseId: true,
                  course: {
                    select: {
                      title: true
                    }
                  }
                }
              }
            }
          }
        }
      }),

      // تقييمات الدورات
      prisma.courseRating.findMany({
        where: {
          course: whereClause,
          createdAt: dateRange
        },
        select: {
          rating: true,
          courseId: true,
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
        category: course.category,
        instructor: course.instructor.name,
        rating: course.rating,
        duration: course.estimatedDuration,
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

    // معالجة أداء الاختبارات
    const quizStats = quizPerformance.reduce((acc, attempt) => {
      const courseId = attempt.quiz.lesson.courseId
      if (!acc[courseId]) {
        acc[courseId] = {
          courseTitle: attempt.quiz.lesson.course.title,
          totalAttempts: 0,
          completedAttempts: 0,
          totalScore: 0,
          totalMaxScore: 0
        }
      }
      acc[courseId].totalAttempts++
      if (attempt.isCompleted) {
        acc[courseId].completedAttempts++
        acc[courseId].totalScore += attempt.score
        acc[courseId].totalMaxScore += attempt.maxScore
      }
      return acc
    }, {} as Record<string, any>)

    // حساب متوسط النتائج
    Object.keys(quizStats).forEach(courseId => {
      const data = quizStats[courseId]
      data.averageScore = data.totalMaxScore > 0 ? (data.totalScore / data.totalMaxScore) * 100 : 0
      data.completionRate = data.totalAttempts > 0 ? (data.completedAttempts / data.totalAttempts) * 100 : 0
    })

    // معالجة اتجاهات التسجيل (تجميع يومي)
    const dailyEnrollments = enrollmentTrends.reduce((acc, enrollment) => {
      const date = new Date(enrollment.enrolledAt).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + enrollment._count.id
      return acc
    }, {} as Record<string, number>)

    // معالجة تقييمات الدورات
    const ratingStats = courseRatings.reduce((acc, rating) => {
      const courseId = rating.courseId
      if (!acc[courseId]) {
        acc[courseId] = {
          courseTitle: rating.course.title,
          ratings: [],
          average: 0,
          count: 0
        }
      }
      acc[courseId].ratings.push(rating.rating)
      acc[courseId].count++
      return acc
    }, {} as Record<string, any>)

    // حساب متوسط التقييمات
    Object.keys(ratingStats).forEach(courseId => {
      const data = ratingStats[courseId]
      data.average = data.ratings.length > 0 
        ? data.ratings.reduce((sum: number, r: number) => sum + r, 0) / data.ratings.length 
        : 0
    })

    return NextResponse.json({
      summary: {
        totalCourses: courseStats._count.id,
        averageRating: Math.round((courseStats._avg.rating || 0) * 100) / 100,
        averageDuration: Math.round((courseStats._avg.estimatedDuration || 0) * 100) / 100,
        totalEnrollments: enrollmentTrends.reduce((sum, e) => sum + e._count.id, 0)
      },
      topCourses: processedTopCourses,
      categories: coursesByCategory.map(cat => ({
        category: cat.category,
        count: cat._count.id,
        averageRating: Math.round((cat._avg.rating || 0) * 100) / 100
      })),
      performance: {
        completionRates: Object.entries(courseCompletionRates).map(([courseId, data]: [string, any]) => ({
          courseId,
          courseTitle: data.courseTitle,
          totalEnrollments: data.total,
          completedEnrollments: data.completed,
          completionRate: Math.round(data.completionRate * 100) / 100,
          averageProgress: Math.round(data.averageProgress * 100) / 100
        })),
        quizPerformance: Object.entries(quizStats).map(([courseId, data]: [string, any]) => ({
          courseId,
          courseTitle: data.courseTitle,
          totalAttempts: data.totalAttempts,
          completedAttempts: data.completedAttempts,
          averageScore: Math.round(data.averageScore * 100) / 100,
          completionRate: Math.round(data.completionRate * 100) / 100
        }))
      },
      trends: {
        dailyEnrollments: Object.entries(dailyEnrollments).map(([date, count]) => ({
          date,
          count
        })).sort((a, b) => a.date.localeCompare(b.date))
      },
      ratings: Object.entries(ratingStats).map(([courseId, data]: [string, any]) => ({
        courseId,
        courseTitle: data.courseTitle,
        averageRating: Math.round(data.average * 100) / 100,
        ratingsCount: data.count
      }))
    })

  } catch (error) {
    console.error('خطأ في جلب تحليلات الدورات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تحليلات الدورات' },
      { status: 500 }
    )
  }
}
