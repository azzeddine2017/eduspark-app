import { NotificationType, NotificationPriority } from '@prisma/client'

// واجهة قالب الإشعار
export interface NotificationTemplate {
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  actionUrl?: string
  emailSubject?: string
  emailBody?: string
  variables?: string[]
}

// واجهة بيانات الإشعار
export interface NotificationData {
  [key: string]: string | number | boolean | Date
}

/**
 * قوالب الإشعارات المحددة مسبقاً
 */
export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  // إشعارات الدورات
  COURSE_ENROLLMENT: {
    type: 'COURSE_ENROLLMENT',
    title: 'تم التسجيل في دورة جديدة',
    message: 'تم تسجيلك بنجاح في دورة "{courseName}". يمكنك البدء في التعلم الآن!',
    priority: 'MEDIUM',
    actionUrl: '/courses/{courseId}',
    emailSubject: 'مرحباً بك في دورة {courseName}',
    emailBody: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>مرحباً {userName}!</h2>
        <p>تم تسجيلك بنجاح في دورة <strong>{courseName}</strong>.</p>
        <p>يمكنك البدء في التعلم الآن من خلال النقر على الرابط أدناه:</p>
        <a href="{actionUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          ابدأ التعلم
        </a>
        <p>نتمنى لك تجربة تعليمية ممتعة!</p>
      </div>
    `,
    variables: ['courseName', 'courseId', 'userName']
  },

  LESSON_COMPLETED: {
    type: 'LESSON_COMPLETED',
    title: 'تم إكمال درس جديد',
    message: 'أحسنت! لقد أكملت درس "{lessonName}" في دورة "{courseName}". تقدمك الحالي: {progress}%',
    priority: 'LOW',
    actionUrl: '/courses/{courseId}/lessons/{lessonId}',
    emailSubject: 'تهانينا! تم إكمال درس {lessonName}',
    emailBody: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>أحسنت {userName}!</h2>
        <p>لقد أكملت بنجاح درس <strong>{lessonName}</strong> في دورة <strong>{courseName}</strong>.</p>
        <p>تقدمك الحالي في الدورة: <strong>{progress}%</strong></p>
        <p>استمر في التعلم لتحقيق المزيد من التقدم!</p>
      </div>
    `,
    variables: ['lessonName', 'courseName', 'courseId', 'lessonId', 'progress', 'userName']
  },

  COURSE_COMPLETED: {
    type: 'COURSE_COMPLETED',
    title: 'تهانينا! تم إكمال الدورة',
    message: 'مبروك! لقد أكملت دورة "{courseName}" بنجاح. يمكنك الآن الحصول على شهادة الإكمال.',
    priority: 'HIGH',
    actionUrl: '/courses/{courseId}/certificate',
    emailSubject: 'تهانينا! تم إكمال دورة {courseName}',
    emailBody: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>مبروك {userName}!</h2>
        <p>لقد أكملت بنجاح دورة <strong>{courseName}</strong>!</p>
        <p>هذا إنجاز رائع يستحق التقدير. يمكنك الآن:</p>
        <ul>
          <li>الحصول على شهادة الإكمال</li>
          <li>استكشاف دورات جديدة</li>
          <li>مشاركة إنجازك مع الآخرين</li>
        </ul>
        <a href="{actionUrl}" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          احصل على الشهادة
        </a>
      </div>
    `,
    variables: ['courseName', 'courseId', 'userName']
  },

  NEW_COURSE_AVAILABLE: {
    type: 'NEW_COURSE_AVAILABLE',
    title: 'دورة جديدة متاحة',
    message: 'دورة جديدة "{courseName}" متاحة الآن! اكتشف محتوى تعليمي جديد ومثير.',
    priority: 'MEDIUM',
    actionUrl: '/courses/{courseId}',
    emailSubject: 'دورة جديدة: {courseName}',
    emailBody: `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>دورة جديدة متاحة!</h2>
        <p>يسعدنا أن نعلن عن إطلاق دورة جديدة: <strong>{courseName}</strong></p>
        <p>{courseDescription}</p>
        <a href="{actionUrl}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          استكشف الدورة
        </a>
      </div>
    `,
    variables: ['courseName', 'courseId', 'courseDescription']
  },

  // إشعارات الاختبارات
  QUIZ_AVAILABLE: {
    type: 'QUIZ_AVAILABLE',
    title: 'اختبار جديد متاح',
    message: 'اختبار "{quizName}" متاح الآن في درس "{lessonName}". اختبر معرفتك!',
    priority: 'MEDIUM',
    actionUrl: '/courses/{courseId}/lessons/{lessonId}/quiz/{quizId}',
    variables: ['quizName', 'lessonName', 'courseId', 'lessonId', 'quizId']
  },

  QUIZ_RESULT: {
    type: 'QUIZ_RESULT',
    title: 'نتيجة الاختبار',
    message: 'حصلت على {score} من {maxScore} في اختبار "{quizName}". {resultMessage}',
    priority: 'MEDIUM',
    actionUrl: '/courses/{courseId}/lessons/{lessonId}/quiz/{quizId}/result',
    variables: ['score', 'maxScore', 'quizName', 'resultMessage', 'courseId', 'lessonId', 'quizId']
  },

  ASSIGNMENT_DUE: {
    type: 'ASSIGNMENT_DUE',
    title: 'موعد تسليم مهمة',
    message: 'تذكير: موعد تسليم مهمة "{assignmentName}" هو {dueDate}. لا تنس إكمالها!',
    priority: 'HIGH',
    actionUrl: '/assignments/{assignmentId}',
    variables: ['assignmentName', 'dueDate', 'assignmentId']
  },

  // إشعارات النظام
  SYSTEM_ANNOUNCEMENT: {
    type: 'SYSTEM_ANNOUNCEMENT',
    title: 'إعلان من النظام',
    message: '{announcementMessage}',
    priority: 'HIGH',
    actionUrl: '/announcements/{announcementId}',
    variables: ['announcementMessage', 'announcementId']
  },

  // إشعارات الهولاكراسي
  ROLE_ASSIGNMENT: {
    type: 'ROLE_ASSIGNMENT',
    title: 'تم تعيين دور جديد',
    message: 'تم تعيينك في دور "{roleName}" في دائرة "{circleName}". مرحباً بك في فريقنا!',
    priority: 'HIGH',
    actionUrl: '/admin/holacracy/roles/{roleId}',
    variables: ['roleName', 'circleName', 'roleId']
  },

  DECISION_PROPOSED: {
    type: 'DECISION_PROPOSED',
    title: 'قرار جديد مقترح',
    message: 'تم اقتراح قرار جديد: "{decisionTitle}". يرجى مراجعته وإبداء رأيك.',
    priority: 'HIGH',
    actionUrl: '/admin/holacracy/decisions/{decisionId}',
    variables: ['decisionTitle', 'decisionId']
  },

  // إشعارات أخرى
  MESSAGE_RECEIVED: {
    type: 'MESSAGE_RECEIVED',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من {senderName}: "{messagePreview}"',
    priority: 'MEDIUM',
    actionUrl: '/messages/{messageId}',
    variables: ['senderName', 'messagePreview', 'messageId']
  },

  ACHIEVEMENT_UNLOCKED: {
    type: 'ACHIEVEMENT_UNLOCKED',
    title: 'إنجاز جديد!',
    message: 'مبروك! لقد حققت إنجاز "{achievementName}". {achievementDescription}',
    priority: 'MEDIUM',
    actionUrl: '/profile/achievements',
    variables: ['achievementName', 'achievementDescription']
  }
}

/**
 * استبدال المتغيرات في النص
 */
export function replaceVariables(text: string, data: NotificationData): string {
  let result = text
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    const stringValue = String(value)
    result = result.replace(new RegExp(placeholder, 'g'), stringValue)
  })
  
  return result
}

/**
 * إنشاء إشعار من قالب
 */
export function createNotificationFromTemplate(
  type: NotificationType,
  data: NotificationData
): {
  title: string
  message: string
  priority: NotificationPriority
  actionUrl?: string
  emailSubject?: string
  emailBody?: string
} {
  const template = NOTIFICATION_TEMPLATES[type]
  
  if (!template) {
    throw new Error(`قالب الإشعار غير موجود للنوع: ${type}`)
  }

  return {
    title: replaceVariables(template.title, data),
    message: replaceVariables(template.message, data),
    priority: template.priority,
    actionUrl: template.actionUrl ? replaceVariables(template.actionUrl, data) : undefined,
    emailSubject: template.emailSubject ? replaceVariables(template.emailSubject, data) : undefined,
    emailBody: template.emailBody ? replaceVariables(template.emailBody, data) : undefined
  }
}

/**
 * التحقق من صحة البيانات المطلوبة للقالب
 */
export function validateTemplateData(type: NotificationType, data: NotificationData): boolean {
  const template = NOTIFICATION_TEMPLATES[type]
  
  if (!template || !template.variables) {
    return true
  }

  // التحقق من وجود جميع المتغيرات المطلوبة
  return template.variables.every(variable => 
    data.hasOwnProperty(variable) && data[variable] !== undefined && data[variable] !== null
  )
}

/**
 * الحصول على المتغيرات المطلوبة لقالب معين
 */
export function getTemplateVariables(type: NotificationType): string[] {
  const template = NOTIFICATION_TEMPLATES[type]
  return template?.variables || []
}
