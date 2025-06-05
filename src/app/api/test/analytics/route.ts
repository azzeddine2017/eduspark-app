import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AnalyticsCollector } from '@/lib/analytics/collector'
import { 
  trackPageView,
  trackCourseStart,
  trackLessonComplete,
  trackQuizComplete,
  trackAIInteraction,
  trackUserSession
} from '@/lib/analytics/collector'

/**
 * اختبار شامل لنظام التحليلات
 * POST /api/test/analytics
 */
export async function POST(request: NextRequest) {
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
      select: { role: true, name: true }
    })

    if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بتشغيل اختبارات التحليلات' },
        { status: 403 }
      )
    }

    // استخراج نوع الاختبار
    const body = await request.json()
    const { testType, targetUserId, sampleSize = 10 } = body

    const testResults: any[] = []
    const userId = targetUserId || session.user.id

    switch (testType) {
      case 'basic_tracking':
        // اختبار التتبع الأساسي
        try {
          const trackingResult = await AnalyticsCollector.trackEvent({
            eventName: 'test_event',
            eventType: 'user_action',
            userId,
            properties: {
              testType: 'basic_tracking',
              timestamp: new Date().toISOString()
            }
          })

          testResults.push({
            test: 'التتبع الأساسي',
            success: trackingResult,
            message: trackingResult ? 'تم تسجيل الحدث بنجاح' : 'فشل في تسجيل الحدث'
          })
        } catch (error) {
          testResults.push({
            test: 'التتبع الأساسي',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'page_tracking':
        // اختبار تتبع الصفحات
        try {
          const pages = ['/dashboard', '/courses', '/profile', '/settings', '/analytics']
          const results = []

          for (const page of pages) {
            const result = await trackPageView(page, userId, 'test-session-123')
            results.push(result)
          }

          const successCount = results.filter(r => r).length
          testResults.push({
            test: 'تتبع الصفحات',
            success: successCount === pages.length,
            pagesTracked: successCount,
            totalPages: pages.length
          })
        } catch (error) {
          testResults.push({
            test: 'تتبع الصفحات',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'learning_analytics':
        // اختبار تحليلات التعلم
        try {
          // تتبع بداية دورة
          const courseStartResult = await trackCourseStart(
            userId,
            'test-course-analytics',
            'دورة اختبار التحليلات',
            'test-session-123'
          )

          // تتبع إكمال درس
          const lessonCompleteResult = await trackLessonComplete(
            userId,
            'test-lesson-analytics',
            'test-course-analytics',
            1800, // 30 دقيقة
            'test-session-123'
          )

          // تتبع إكمال اختبار
          const quizCompleteResult = await trackQuizComplete(
            userId,
            'test-quiz-analytics',
            85,
            100,
            600, // 10 دقائق
            'test-session-123'
          )

          const results = [courseStartResult, lessonCompleteResult, quizCompleteResult]
          const successCount = results.filter(r => r).length

          testResults.push({
            test: 'تحليلات التعلم',
            success: successCount === 3,
            courseStart: courseStartResult,
            lessonComplete: lessonCompleteResult,
            quizComplete: quizCompleteResult
          })
        } catch (error) {
          testResults.push({
            test: 'تحليلات التعلم',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'ai_analytics':
        // اختبار تحليلات المساعد الذكي
        try {
          const aiInteractionTypes = ['chat', 'question', 'explanation', 'summary']
          const results = []

          for (const type of aiInteractionTypes) {
            const result = await trackAIInteraction(
              userId,
              type,
              Math.floor(Math.random() * 1000) + 100, // رموز عشوائية
              'test-session-123'
            )
            results.push(result)
          }

          const successCount = results.filter(r => r).length
          testResults.push({
            test: 'تحليلات المساعد الذكي',
            success: successCount === aiInteractionTypes.length,
            interactionsTracked: successCount,
            totalInteractions: aiInteractionTypes.length
          })
        } catch (error) {
          testResults.push({
            test: 'تحليلات المساعد الذكي',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'user_activity':
        // اختبار نشاط المستخدم
        try {
          const activityResult = await AnalyticsCollector.updateUserActivity({
            userId,
            date: new Date(),
            sessionsCount: 1,
            totalTimeSpent: 45, // 45 دقيقة
            pagesVisited: 8,
            lessonsViewed: 3,
            quizzesTaken: 1,
            aiInteractions: 5
          })

          testResults.push({
            test: 'نشاط المستخدم',
            success: activityResult,
            message: activityResult ? 'تم تحديث نشاط المستخدم بنجاح' : 'فشل في تحديث النشاط'
          })
        } catch (error) {
          testResults.push({
            test: 'نشاط المستخدم',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'system_metrics':
        // اختبار مقاييس النظام
        try {
          const metricsResult = await AnalyticsCollector.updateSystemMetrics()

          testResults.push({
            test: 'مقاييس النظام',
            success: metricsResult,
            message: metricsResult ? 'تم تحديث مقاييس النظام بنجاح' : 'فشل في تحديث المقاييس'
          })
        } catch (error) {
          testResults.push({
            test: 'مقاييس النظام',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'performance_test':
        // اختبار الأداء
        const startTime = Date.now()
        const performanceResults = []

        try {
          for (let i = 0; i < sampleSize; i++) {
            const eventStartTime = Date.now()
            
            const result = await AnalyticsCollector.trackEvent({
              eventName: `performance_test_${i}`,
              eventType: 'user_action',
              userId,
              properties: {
                testIndex: i,
                timestamp: new Date().toISOString()
              }
            })
            
            const eventEndTime = Date.now()
            performanceResults.push({
              success: result,
              duration: eventEndTime - eventStartTime
            })
          }

          const endTime = Date.now()
          const totalDuration = endTime - startTime
          const successCount = performanceResults.filter(r => r.success).length
          const averageDuration = performanceResults.reduce((sum, r) => sum + r.duration, 0) / performanceResults.length

          testResults.push({
            test: 'اختبار الأداء',
            success: successCount === sampleSize,
            totalDuration: `${totalDuration}ms`,
            averageDuration: `${Math.round(averageDuration)}ms`,
            successRate: `${successCount}/${sampleSize}`,
            eventsPerSecond: Math.round((sampleSize / totalDuration) * 1000)
          })
        } catch (error) {
          testResults.push({
            test: 'اختبار الأداء',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'data_cleanup':
        // اختبار تنظيف البيانات
        try {
          const cleanupResult = await AnalyticsCollector.cleanupOldData(1) // حذف البيانات الأقدم من يوم واحد
          
          testResults.push({
            test: 'تنظيف البيانات',
            success: true,
            deletedRecords: cleanupResult,
            message: `تم حذف ${cleanupResult} سجل قديم`
          })
        } catch (error) {
          testResults.push({
            test: 'تنظيف البيانات',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'api_endpoints':
        // اختبار API endpoints
        try {
          const endpoints = [
            '/api/analytics',
            '/api/analytics/users',
            '/api/analytics/courses',
            '/api/analytics/ai'
          ]

          const endpointResults = []

          for (const endpoint of endpoints) {
            try {
              const response = await fetch(`${request.url.replace('/test/analytics', endpoint.replace('/api', ''))}?period=7`, {
                headers: {
                  'Cookie': request.headers.get('Cookie') || ''
                }
              })

              endpointResults.push({
                endpoint,
                success: response.ok,
                status: response.status,
                responseTime: 'N/A' // يمكن قياسه إذا لزم الأمر
              })
            } catch (error) {
              endpointResults.push({
                endpoint,
                success: false,
                error: error instanceof Error ? error.message : 'خطأ في الاتصال'
              })
            }
          }

          const successfulEndpoints = endpointResults.filter(r => r.success).length

          testResults.push({
            test: 'API endpoints',
            success: successfulEndpoints === endpoints.length,
            endpoints: endpointResults,
            successRate: `${successfulEndpoints}/${endpoints.length}`
          })
        } catch (error) {
          testResults.push({
            test: 'API endpoints',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'all_tests':
        // تشغيل جميع الاختبارات
        const allTests = [
          'basic_tracking',
          'page_tracking',
          'learning_analytics',
          'ai_analytics',
          'user_activity',
          'system_metrics',
          'performance_test',
          'api_endpoints'
        ]

        for (const test of allTests) {
          try {
            const response = await fetch(`${request.url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('Cookie') || ''
              },
              body: JSON.stringify({ testType: test, targetUserId, sampleSize: 5 })
            })

            if (response.ok) {
              const result = await response.json()
              testResults.push(...result.results)
            }
          } catch (error) {
            testResults.push({
              test: `مجموعة اختبارات ${test}`,
              success: false,
              error: error instanceof Error ? error.message : 'خطأ في التشغيل'
            })
          }
        }
        break

      default:
        return NextResponse.json(
          { error: 'نوع اختبار غير صحيح' },
          { status: 400 }
        )
    }

    // حساب الإحصائيات
    const totalTests = testResults.length
    const successfulTests = testResults.filter(r => r.success).length
    const failedTests = totalTests - successfulTests
    const successRate = totalTests > 0 ? Math.round((successfulTests / totalTests) * 100) : 0

    return NextResponse.json({
      message: 'تم تشغيل اختبارات التحليلات بنجاح',
      testType,
      summary: {
        total: totalTests,
        successful: successfulTests,
        failed: failedTests,
        successRate: `${successRate}%`
      },
      results: testResults,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('خطأ في تشغيل اختبارات التحليلات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء تشغيل الاختبارات',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}

/**
 * جلب تقرير حالة نظام التحليلات
 * GET /api/test/analytics
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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض تقرير حالة التحليلات' },
        { status: 403 }
      )
    }

    // فحص حالة قاعدة البيانات
    const [
      eventsCount,
      userActivitiesCount,
      systemMetricsCount,
      recentEvents
    ] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.userActivity.count(),
      prisma.systemMetrics.count(),
      prisma.analyticsEvent.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        select: {
          id: true,
          eventName: true,
          eventType: true,
          timestamp: true,
          userId: true
        }
      })
    ])

    // فحص أداء قاعدة البيانات
    const performanceStart = Date.now()
    await prisma.analyticsEvent.findFirst()
    const performanceEnd = Date.now()
    const dbResponseTime = performanceEnd - performanceStart

    return NextResponse.json({
      status: 'نظام التحليلات يعمل بشكل طبيعي',
      database: {
        events: eventsCount,
        userActivities: userActivitiesCount,
        systemMetrics: systemMetricsCount,
        responseTime: `${dbResponseTime}ms`,
        recentEvents
      },
      performance: {
        dbResponseTime: `${dbResponseTime}ms`,
        status: dbResponseTime < 100 ? 'ممتاز' : dbResponseTime < 500 ? 'جيد' : 'بطيء'
      },
      availableTests: [
        'basic_tracking',
        'page_tracking',
        'learning_analytics',
        'ai_analytics',
        'user_activity',
        'system_metrics',
        'performance_test',
        'data_cleanup',
        'api_endpoints',
        'all_tests'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('خطأ في جلب تقرير حالة التحليلات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء فحص حالة النظام',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
