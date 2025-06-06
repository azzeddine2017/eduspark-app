import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationPriority, User } from '@prisma/client'
import {
  createNotificationFromTemplate,
  validateTemplateData,
  NotificationData
} from './templates'

// واجهة خيارات الإشعار
export interface NotificationOptions {
  userId?: string
  userIds?: string[]
  senderId?: string
  type: NotificationType
  data: NotificationData
  priority?: NotificationPriority
  expiresAt?: Date
  sendEmail?: boolean
  customTitle?: string
  customMessage?: string
  customActionUrl?: string
}

// واجهة نتيجة الإرسال
export interface SendResult {
  success: boolean
  notificationIds?: string[]
  error?: string
  count?: number
}

/**
 * مدير الإشعارات الرئيسي
 */
export class NotificationManager {

  /**
   * إرسال إشعار واحد أو متعدد
   */
  static async send(options: NotificationOptions): Promise<SendResult> {
    try {
      // التحقق من صحة البيانات
      if (!validateTemplateData(options.type, options.data)) {
        return {
          success: false,
          error: 'بيانات القالب غير مكتملة أو غير صحيحة'
        }
      }

      // تحديد المستلمين
      let recipientIds: string[] = []

      if (options.userId) {
        recipientIds = [options.userId]
      } else if (options.userIds && options.userIds.length > 0) {
        recipientIds = options.userIds
      } else {
        return {
          success: false,
          error: 'يجب تحديد مستلم واحد على الأقل'
        }
      }

      // التحقق من وجود المستلمين
      const existingUsers = await prisma.user.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true, email: true, name: true }
      })

      if (existingUsers.length !== recipientIds.length) {
        return {
          success: false,
          error: 'بعض المستخدمين المحددين غير موجودين'
        }
      }

      // إنشاء محتوى الإشعار من القالب أو استخدام المحتوى المخصص
      let title: string
      let message: string
      let actionUrl: string | undefined

      if (options.customTitle && options.customMessage) {
        title = options.customTitle
        message = options.customMessage
        actionUrl = options.customActionUrl
      } else {
        const templateContent = createNotificationFromTemplate(options.type, options.data)
        title = templateContent.title
        message = templateContent.message
        actionUrl = templateContent.actionUrl
      }

      // إنشاء الإشعارات
      const notifications = await prisma.notification.createMany({
        data: recipientIds.map(recipientId => ({
          title,
          message,
          type: options.type,
          priority: options.priority || 'MEDIUM',
          userId: recipientId,
          senderId: options.senderId || null,
          actionUrl: actionUrl || null,
          expiresAt: options.expiresAt || null,
          metadata: options.data as any
        }))
      })

      // إرسال البريد الإلكتروني إذا كان مطلوباً
      if (options.sendEmail) {
        await this.sendEmailNotifications(existingUsers, options)
      }

      return {
        success: true,
        count: notifications.count,
        notificationIds: [] // سيتم تحديثها لاحقاً إذا لزم الأمر
      }

    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error)
      return {
        success: false,
        error: 'حدث خطأ أثناء إرسال الإشعار'
      }
    }
  }

  /**
   * إرسال إشعار لجميع المستخدمين
   */
  static async sendToAll(
    type: NotificationType,
    data: NotificationData,
    options?: {
      priority?: NotificationPriority
      senderId?: string
      expiresAt?: Date
      sendEmail?: boolean
      excludeUserIds?: string[]
    }
  ): Promise<SendResult> {
    try {
      // جلب جميع المستخدمين النشطين
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          id: options?.excludeUserIds ? {
            notIn: options.excludeUserIds
          } : undefined
        },
        select: { id: true }
      })

      if (users.length === 0) {
        return {
          success: false,
          error: 'لا يوجد مستخدمين نشطين'
        }
      }

      return await this.send({
        userIds: users.map(user => user.id),
        type,
        data,
        priority: options?.priority,
        senderId: options?.senderId,
        expiresAt: options?.expiresAt,
        sendEmail: options?.sendEmail
      })

    } catch (error) {
      console.error('خطأ في إرسال الإشعار لجميع المستخدمين:', error)
      return {
        success: false,
        error: 'حدث خطأ أثناء إرسال الإشعار'
      }
    }
  }

  /**
   * إرسال إشعار لمستخدمين بدور معين
   */
  static async sendToRole(
    role: string,
    type: NotificationType,
    data: NotificationData,
    options?: {
      priority?: NotificationPriority
      senderId?: string
      expiresAt?: Date
      sendEmail?: boolean
    }
  ): Promise<SendResult> {
    try {
      // جلب المستخدمين بالدور المحدد
      const users = await prisma.user.findMany({
        where: {
          role: role as any,
          isActive: true
        },
        select: { id: true }
      })

      if (users.length === 0) {
        return {
          success: false,
          error: `لا يوجد مستخدمين نشطين بدور ${role}`
        }
      }

      return await this.send({
        userIds: users.map(user => user.id),
        type,
        data,
        priority: options?.priority,
        senderId: options?.senderId,
        expiresAt: options?.expiresAt,
        sendEmail: options?.sendEmail
      })

    } catch (error) {
      console.error('خطأ في إرسال الإشعار للدور:', error)
      return {
        success: false,
        error: 'حدث خطأ أثناء إرسال الإشعار'
      }
    }
  }

  /**
   * إرسال إشعارات البريد الإلكتروني
   */
  private static async sendEmailNotifications(
    users: Array<{ id: string; email: string; name: string }>,
    options: NotificationOptions
  ): Promise<void> {
    try {
      // استيراد مدير البريد الإلكتروني
      const { emailManager } = await import('../email/mailer')

      // إرسال البريد الإلكتروني لكل مستخدم
      for (const user of users) {
        try {
          await emailManager.sendNotificationEmail(
            user.email,
            options.type,
            { ...options.data, userName: user.name }
          )
        } catch (error) {
          console.error(`خطأ في إرسال البريد الإلكتروني للمستخدم ${user.email}:`, error)
        }
      }
    } catch (error) {
      console.error('خطأ في إرسال إشعارات البريد الإلكتروني:', error)
    }
  }

  /**
   * تنظيف الإشعارات المنتهية الصلاحية
   */
  static async cleanupExpiredNotifications(): Promise<number> {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      return result.count
    } catch (error) {
      console.error('خطأ في تنظيف الإشعارات المنتهية الصلاحية:', error)
      return 0
    }
  }

  /**
   * تنظيف الإشعارات القديمة (أكثر من شهر)
   */
  static async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          status: {
            in: ['READ', 'ARCHIVED']
          }
        }
      })

      return result.count
    } catch (error) {
      console.error('خطأ في تنظيف الإشعارات القديمة:', error)
      return 0
    }
  }

  /**
   * الحصول على عدد الإشعارات غير المقروءة لمستخدم
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          status: 'UNREAD'
        }
      })
    } catch (error) {
      console.error('خطأ في جلب عدد الإشعارات غير المقروءة:', error)
      return 0
    }
  }

  /**
   * تحديد جميع إشعارات المستخدم كمقروءة
   */
  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          status: 'UNREAD'
        },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      })

      return result.count
    } catch (error) {
      console.error('خطأ في تحديد الإشعارات كمقروءة:', error)
      return 0
    }
  }
}

// دوال مساعدة سريعة للاستخدام المباشر

/**
 * إرسال إشعار تسجيل في دورة
 */
export async function sendCourseEnrollmentNotification(
  userId: string,
  courseData: { courseId: string; courseName: string; userName: string }
): Promise<SendResult> {
  return NotificationManager.send({
    userId,
    type: 'COURSE_ENROLLMENT',
    data: courseData,
    priority: 'MEDIUM',
    sendEmail: true
  })
}

/**
 * إرسال إشعار إكمال درس
 */
export async function sendLessonCompletedNotification(
  userId: string,
  lessonData: {
    lessonId: string
    lessonName: string
    courseId: string
    courseName: string
    progress: number
    userName: string
  }
): Promise<SendResult> {
  return NotificationManager.send({
    userId,
    type: 'LESSON_COMPLETED',
    data: lessonData,
    priority: 'LOW'
  })
}

/**
 * إرسال إشعار إكمال دورة
 */
export async function sendCourseCompletedNotification(
  userId: string,
  courseData: { courseId: string; courseName: string; userName: string }
): Promise<SendResult> {
  return NotificationManager.send({
    userId,
    type: 'COURSE_COMPLETED',
    data: courseData,
    priority: 'HIGH',
    sendEmail: true
  })
}

/**
 * إرسال إعلان للجميع
 */
export async function sendSystemAnnouncement(
  announcementData: { announcementMessage: string; announcementId?: string },
  senderId?: string
): Promise<SendResult> {
  return NotificationManager.sendToAll(
    'SYSTEM_ANNOUNCEMENT',
    announcementData,
    {
      priority: 'HIGH',
      senderId,
      sendEmail: true
    }
  )
}
