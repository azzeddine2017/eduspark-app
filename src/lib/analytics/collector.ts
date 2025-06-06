import { prisma } from '@/lib/prisma'

// واجهة بيانات الحدث
export interface AnalyticsEventData {
  eventName: string
  eventType: 'user_action' | 'system_event' | 'page_view' | 'interaction'
  userId?: string
  properties?: Record<string, any>
  sessionId?: string
  userAgent?: string
  ipAddress?: string
  pageUrl?: string
  referrer?: string
}

// واجهة نشاط المستخدم اليومي
export interface UserActivityData {
  userId: string
  date: Date
  sessionsCount?: number
  totalTimeSpent?: number // بالدقائق
  pagesVisited?: number
  lessonsViewed?: number
  quizzesTaken?: number
  aiInteractions?: number
}

/**
 * مجمع البيانات التحليلية
 */
export class AnalyticsCollector {
  
  /**
   * تسجيل حدث تحليلي
   */
  static async trackEvent(data: AnalyticsEventData): Promise<boolean> {
    try {
      // تشفير عنوان IP للخصوصية (اختياري)
      const hashedIp = data.ipAddress ? this.hashIP(data.ipAddress) : null

      await prisma.analyticsEvent.create({
        data: {
          eventName: data.eventName,
          eventType: data.eventType,
          userId: data.userId || null,
          properties: data.properties === undefined ? undefined : data.properties,
          sessionId: data.sessionId || null,
          userAgent: data.userAgent || null,
          ipAddress: hashedIp,
          pageUrl: data.pageUrl || null,
          referrer: data.referrer || null,
          timestamp: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('خطأ في تسجيل الحدث التحليلي:', error)
      return false
    }
  }

  /**
   * تحديث نشاط المستخدم اليومي
   */
  static async updateUserActivity(data: UserActivityData): Promise<boolean> {
    try {
      const today = new Date(data.date)
      today.setHours(0, 0, 0, 0) // بداية اليوم

      await prisma.userActivity.upsert({
        where: {
          userId_date: {
            userId: data.userId,
            date: today
          }
        },
        update: {
          sessionsCount: data.sessionsCount ? { increment: data.sessionsCount } : undefined,
          totalTimeSpent: data.totalTimeSpent ? { increment: data.totalTimeSpent } : undefined,
          pagesVisited: data.pagesVisited ? { increment: data.pagesVisited } : undefined,
          lessonsViewed: data.lessonsViewed ? { increment: data.lessonsViewed } : undefined,
          quizzesTaken: data.quizzesTaken ? { increment: data.quizzesTaken } : undefined,
          aiInteractions: data.aiInteractions ? { increment: data.aiInteractions } : undefined,
          lastActiveAt: new Date(),
          updatedAt: new Date()
        },
        create: {
          userId: data.userId,
          date: today,
          sessionsCount: data.sessionsCount || 0,
          totalTimeSpent: data.totalTimeSpent || 0,
          pagesVisited: data.pagesVisited || 0,
          lessonsViewed: data.lessonsViewed || 0,
          quizzesTaken: data.quizzesTaken || 0,
          aiInteractions: data.aiInteractions || 0,
          lastActiveAt: new Date()
        }
      })

      return true
    } catch (error) {
      console.error('خطأ في تحديث نشاط المستخدم:', error)
      return false
    }
  }

  /**
   * تحديث مقاييس النظام اليومية
   */
  static async updateSystemMetrics(date: Date = new Date()): Promise<boolean> {
    try {
      const today = new Date(date)
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      // حساب الإحصائيات
      const [
        totalUsers,
        activeUsers,
        newUsers,
        totalCourses,
        activeCourses,
        newEnrollments,
        totalLessons,
        lessonsCompleted,
        quizzesCompleted,
        aiInteractions,
        aiTokensUsed
      ] = await Promise.all([
        // إجمالي المستخدمين
        prisma.user.count(),
        
        // المستخدمين النشطين (نشطوا خلال آخر 7 أيام)
        prisma.user.count({
          where: {
            dailyActivities: {
              some: {
                date: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
              }
            }
          }
        }),
        
        // مستخدمين جدد (اليوم)
        prisma.user.count({
          where: {
            createdAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // إجمالي الدورات
        prisma.course.count(),
        
        // الدورات النشطة (منشورة)
        prisma.course.count({
          where: { isPublished: true }
        }),
        
        // تسجيلات جديدة (اليوم)
        prisma.enrollment.count({
          where: {
            enrolledAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // إجمالي الدروس
        prisma.lesson.count(),
        
        // الدروس المكتملة (اليوم)
        prisma.lessonProgress.count({
          where: {
            completed: true,
            completedAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // الاختبارات المكتملة (اليوم)
        prisma.quizAttempt.count({
          where: {
            isCompleted: true,
            completedAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // تفاعلات AI (اليوم)
        prisma.lLMInteractionLog.count({
          where: {
            createdAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // الرموز المستخدمة في AI (اليوم)
        prisma.lLMInteractionLog.aggregate({
          where: {
            createdAt: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
          },
          _sum: {
            tokens: true
          }
        })
      ])

      // حفظ المقاييس
      await prisma.systemMetrics.upsert({
        where: { date: today },
        update: {
          totalUsers,
          activeUsers,
          newUsers,
          totalCourses,
          activeCourses,
          newEnrollments,
          totalLessons,
          lessonsCompleted,
          quizzesCompleted,
          aiInteractions,
          aiTokensUsed: aiTokensUsed._sum.tokens || 0,
          updatedAt: new Date()
        },
        create: {
          date: today,
          totalUsers,
          activeUsers,
          newUsers,
          totalCourses,
          activeCourses,
          newEnrollments,
          totalLessons,
          lessonsCompleted,
          quizzesCompleted,
          aiInteractions,
          aiTokensUsed: aiTokensUsed._sum.tokens || 0
        }
      })

      return true
    } catch (error) {
      console.error('خطأ في تحديث مقاييس النظام:', error)
      return false
    }
  }

  /**
   * تشفير عنوان IP للخصوصية
   */
  private static hashIP(ip: string): string {
    // تشفير بسيط لعنوان IP للخصوصية
    const crypto = require('crypto')
    return crypto.createHash('sha256').update(ip + process.env.NEXTAUTH_SECRET).digest('hex').substring(0, 16)
  }

  /**
   * تنظيف البيانات القديمة
   */
  static async cleanupOldData(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const result = await prisma.analyticsEvent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      })

      return result.count
    } catch (error) {
      console.error('خطأ في تنظيف البيانات القديمة:', error)
      return 0
    }
  }
}

// دوال مساعدة سريعة للاستخدام المباشر

/**
 * تسجيل زيارة صفحة
 */
export async function trackPageView(
  pageUrl: string,
  userId?: string,
  sessionId?: string,
  userAgent?: string,
  referrer?: string
): Promise<boolean> {
  return AnalyticsCollector.trackEvent({
    eventName: 'page_view',
    eventType: 'page_view',
    userId,
    sessionId,
    userAgent,
    pageUrl,
    referrer,
    properties: {
      page: pageUrl
    }
  })
}

/**
 * تسجيل بداية دورة
 */
export async function trackCourseStart(
  userId: string,
  courseId: string,
  courseName: string,
  sessionId?: string
): Promise<boolean> {
  return AnalyticsCollector.trackEvent({
    eventName: 'course_start',
    eventType: 'user_action',
    userId,
    sessionId,
    properties: {
      courseId,
      courseName,
      action: 'start_course'
    }
  })
}

/**
 * تسجيل إكمال درس
 */
export async function trackLessonComplete(
  userId: string,
  lessonId: string,
  courseId: string,
  timeSpent: number, // بالثواني
  sessionId?: string
): Promise<boolean> {
  // تسجيل الحدث
  const eventTracked = await AnalyticsCollector.trackEvent({
    eventName: 'lesson_complete',
    eventType: 'user_action',
    userId,
    sessionId,
    properties: {
      lessonId,
      courseId,
      timeSpent,
      action: 'complete_lesson'
    }
  })

  // تحديث نشاط المستخدم
  const activityUpdated = await AnalyticsCollector.updateUserActivity({
    userId,
    date: new Date(),
    lessonsViewed: 1,
    totalTimeSpent: Math.round(timeSpent / 60) // تحويل إلى دقائق
  })

  return eventTracked && activityUpdated
}

/**
 * تسجيل تفاعل مع المساعد الذكي
 */
export async function trackAIInteraction(
  userId: string,
  interactionType: string,
  tokens?: number,
  sessionId?: string
): Promise<boolean> {
  // تسجيل الحدث
  const eventTracked = await AnalyticsCollector.trackEvent({
    eventName: 'ai_interaction',
    eventType: 'interaction',
    userId,
    sessionId,
    properties: {
      interactionType,
      tokens,
      action: 'ai_chat'
    }
  })

  // تحديث نشاط المستخدم
  const activityUpdated = await AnalyticsCollector.updateUserActivity({
    userId,
    date: new Date(),
    aiInteractions: 1
  })

  return eventTracked && activityUpdated
}

/**
 * تسجيل إكمال اختبار
 */
export async function trackQuizComplete(
  userId: string,
  quizId: string,
  score: number,
  maxScore: number,
  timeSpent: number, // بالثواني
  sessionId?: string
): Promise<boolean> {
  // تسجيل الحدث
  const eventTracked = await AnalyticsCollector.trackEvent({
    eventName: 'quiz_complete',
    eventType: 'user_action',
    userId,
    sessionId,
    properties: {
      quizId,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      timeSpent,
      action: 'complete_quiz'
    }
  })

  // تحديث نشاط المستخدم
  const activityUpdated = await AnalyticsCollector.updateUserActivity({
    userId,
    date: new Date(),
    quizzesTaken: 1,
    totalTimeSpent: Math.round(timeSpent / 60) // تحويل إلى دقائق
  })

  return eventTracked && activityUpdated
}

/**
 * تسجيل جلسة مستخدم
 */
export async function trackUserSession(
  userId: string,
  sessionId: string,
  duration: number, // بالدقائق
  pagesVisited: number
): Promise<boolean> {
  // تسجيل الحدث
  const eventTracked = await AnalyticsCollector.trackEvent({
    eventName: 'session_end',
    eventType: 'system_event',
    userId,
    sessionId,
    properties: {
      duration,
      pagesVisited,
      action: 'end_session'
    }
  })

  // تحديث نشاط المستخدم
  const activityUpdated = await AnalyticsCollector.updateUserActivity({
    userId,
    date: new Date(),
    sessionsCount: 1,
    totalTimeSpent: duration,
    pagesVisited
  })

  return eventTracked && activityUpdated
}
