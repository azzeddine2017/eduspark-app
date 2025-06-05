import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationManager } from '@/lib/notifications/manager'
import { emailManager } from '@/lib/email/mailer'
import { 
  onCourseEnrollment,
  onLessonCompleted,
  onCourseCompleted,
  onQuizCompleted,
  onUserRegistration,
  onSystemAnnouncement
} from '@/lib/notifications/events'

/**
 * اختبار شامل لنظام الإشعارات
 * POST /api/test/notifications
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
      select: { role: true, name: true, email: true }
    })

    if (!user || !['ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بتشغيل الاختبارات' },
        { status: 403 }
      )
    }

    // استخراج نوع الاختبار
    const body = await request.json()
    const { testType, targetUserId } = body

    const testResults: any[] = []
    const userId = targetUserId || session.user.id

    switch (testType) {
      case 'basic_notification':
        // اختبار إشعار أساسي
        const basicResult = await NotificationManager.send({
          userId,
          type: 'SYSTEM_ANNOUNCEMENT',
          data: {
            announcementMessage: 'هذا اختبار لنظام الإشعارات الأساسي',
            userName: user.name
          },
          priority: 'MEDIUM'
        })
        testResults.push({
          test: 'إشعار أساسي',
          success: basicResult.success,
          error: basicResult.error
        })
        break

      case 'email_notification':
        // اختبار إشعار البريد الإلكتروني
        const emailResult = await NotificationManager.send({
          userId,
          type: 'COURSE_ENROLLMENT',
          data: {
            courseName: 'دورة اختبار النظام',
            courseId: 'test-course-123',
            userName: user.name
          },
          priority: 'HIGH',
          sendEmail: true
        })
        testResults.push({
          test: 'إشعار البريد الإلكتروني',
          success: emailResult.success,
          error: emailResult.error
        })
        break

      case 'course_events':
        // اختبار أحداث الدورات
        try {
          await onCourseEnrollment({
            userId,
            courseId: 'test-course-123',
            courseName: 'دورة اختبار الأحداث',
            userName: user.name
          })

          await onLessonCompleted({
            userId,
            lessonId: 'test-lesson-123',
            lessonName: 'درس اختبار',
            courseId: 'test-course-123',
            courseName: 'دورة اختبار الأحداث',
            userName: user.name,
            progress: 50,
            timeSpent: 1800 // 30 دقيقة
          })

          await onQuizCompleted({
            userId,
            quizId: 'test-quiz-123',
            quizName: 'اختبار تجريبي',
            courseId: 'test-course-123',
            lessonId: 'test-lesson-123',
            score: 85,
            maxScore: 100,
            timeSpent: 600, // 10 دقائق
            userName: user.name
          })

          testResults.push({
            test: 'أحداث الدورات',
            success: true,
            message: 'تم تشغيل جميع أحداث الدورات بنجاح'
          })
        } catch (error) {
          testResults.push({
            test: 'أحداث الدورات',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'bulk_notifications':
        // اختبار الإشعارات المجمعة
        const bulkResult = await NotificationManager.sendToAll(
          'SYSTEM_ANNOUNCEMENT',
          {
            announcementMessage: 'هذا اختبار للإشعارات المجمعة لجميع المستخدمين',
            announcementId: 'test-announcement-123'
          },
          {
            priority: 'MEDIUM',
            excludeUserIds: [] // لا نستثني أحد في الاختبار
          }
        )
        testResults.push({
          test: 'الإشعارات المجمعة',
          success: bulkResult.success,
          count: bulkResult.count,
          error: bulkResult.error
        })
        break

      case 'email_system':
        // اختبار نظام البريد الإلكتروني
        try {
          const welcomeResult = await emailManager.sendWelcomeEmail(
            user.email,
            user.name
          )

          const notificationEmailResult = await emailManager.sendNotificationEmail(
            user.email,
            'COURSE_COMPLETED',
            {
              courseName: 'دورة اختبار البريد الإلكتروني',
              courseId: 'test-email-course',
              userName: user.name
            }
          )

          testResults.push({
            test: 'بريد الترحيب',
            success: welcomeResult.success,
            messageId: welcomeResult.messageId,
            error: welcomeResult.error
          })

          testResults.push({
            test: 'بريد الإشعارات',
            success: notificationEmailResult.success,
            messageId: notificationEmailResult.messageId,
            error: notificationEmailResult.error
          })
        } catch (error) {
          testResults.push({
            test: 'نظام البريد الإلكتروني',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'notification_preferences':
        // اختبار تفضيلات الإشعارات
        try {
          // إنشاء تفضيلات اختبار
          const preferences = await prisma.notificationPreference.upsert({
            where: { userId },
            update: {
              enableInApp: true,
              enableEmail: false, // تعطيل البريد الإلكتروني للاختبار
              courseNotifications: true,
              systemNotifications: true
            },
            create: {
              userId,
              enableInApp: true,
              enableEmail: false,
              courseNotifications: true,
              systemNotifications: true
            }
          })

          // اختبار إرسال إشعار مع التفضيلات
          const prefResult = await NotificationManager.send({
            userId,
            type: 'COURSE_ENROLLMENT',
            data: {
              courseName: 'دورة اختبار التفضيلات',
              courseId: 'test-pref-course',
              userName: user.name
            },
            sendEmail: true // سيتم تجاهله بسبب التفضيلات
          })

          testResults.push({
            test: 'تفضيلات الإشعارات',
            success: true,
            preferences: {
              enableInApp: preferences.enableInApp,
              enableEmail: preferences.enableEmail
            },
            notificationSent: prefResult.success
          })
        } catch (error) {
          testResults.push({
            test: 'تفضيلات الإشعارات',
            success: false,
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          })
        }
        break

      case 'performance_test':
        // اختبار الأداء
        const startTime = Date.now()
        const performanceResults = []

        for (let i = 0; i < 10; i++) {
          const result = await NotificationManager.send({
            userId,
            type: 'SYSTEM_ANNOUNCEMENT',
            data: {
              announcementMessage: `إشعار اختبار الأداء رقم ${i + 1}`,
              userName: user.name
            }
          })
          performanceResults.push(result.success)
        }

        const endTime = Date.now()
        const duration = endTime - startTime
        const successCount = performanceResults.filter(r => r).length

        testResults.push({
          test: 'اختبار الأداء',
          success: successCount === 10,
          duration: `${duration}ms`,
          successRate: `${successCount}/10`,
          averageTime: `${Math.round(duration / 10)}ms per notification`
        })
        break

      case 'all_tests':
        // تشغيل جميع الاختبارات
        const allTests = [
          'basic_notification',
          'email_notification',
          'course_events',
          'email_system',
          'notification_preferences',
          'performance_test'
        ]

        for (const test of allTests) {
          try {
            const response = await fetch(`${request.url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('Cookie') || ''
              },
              body: JSON.stringify({ testType: test, targetUserId })
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
      message: 'تم تشغيل الاختبارات بنجاح',
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
    console.error('خطأ في تشغيل اختبارات الإشعارات:', error)
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
 * جلب تقرير حالة نظام الإشعارات
 * GET /api/test/notifications
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

    if (!user || !['ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض تقرير الحالة' },
        { status: 403 }
      )
    }

    // فحص حالة قاعدة البيانات
    const [
      notificationsCount,
      templatesCount,
      preferencesCount,
      recentNotifications
    ] = await Promise.all([
      prisma.notification.count(),
      prisma.notificationTemplate.count(),
      prisma.notificationPreference.count(),
      prisma.notification.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true
        }
      })
    ])

    // فحص حالة البريد الإلكتروني
    const emailStatus = await emailManager.verifyConnection()

    return NextResponse.json({
      status: 'نظام الإشعارات يعمل بشكل طبيعي',
      database: {
        notifications: notificationsCount,
        templates: templatesCount,
        preferences: preferencesCount,
        recentNotifications
      },
      email: {
        connected: emailStatus,
        status: emailStatus ? 'متصل' : 'غير متصل'
      },
      availableTests: [
        'basic_notification',
        'email_notification',
        'course_events',
        'bulk_notifications',
        'email_system',
        'notification_preferences',
        'performance_test',
        'all_tests'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('خطأ في جلب تقرير حالة الإشعارات:', error)
    return NextResponse.json(
      { 
        error: 'حدث خطأ أثناء فحص حالة النظام',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}
