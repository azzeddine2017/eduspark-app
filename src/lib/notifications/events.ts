import { NotificationManager } from './manager'
import { 
  sendCourseEnrollmentNotification,
  sendLessonCompletedNotification,
  sendCourseCompletedNotification,
  sendSystemAnnouncement
} from './manager'
import { trackCourseStart, trackLessonComplete, trackQuizComplete, trackAIInteraction } from '../analytics/collector'

/**
 * نظام ربط الإشعارات بالأحداث
 * يتم استدعاء هذه الدوال عند حدوث أحداث معينة في المنصة
 */

/**
 * حدث تسجيل مستخدم جديد في دورة
 */
export async function onCourseEnrollment(data: {
  userId: string
  courseId: string
  courseName: string
  userName: string
  instructorId?: string
}) {
  try {
    // إرسال إشعار للطالب
    await sendCourseEnrollmentNotification(data.userId, {
      courseId: data.courseId,
      courseName: data.courseName,
      userName: data.userName
    })

    // إرسال إشعار للمدرب (إذا وُجد)
    if (data.instructorId) {
      await NotificationManager.send({
        userId: data.instructorId,
        type: 'COURSE_ENROLLMENT',
        data: {
          courseName: data.courseName,
          userName: data.userName,
          courseId: data.courseId,
          message: `تم تسجيل ${data.userName} في دورة ${data.courseName}`
        },
        priority: 'MEDIUM',
        sendEmail: true
      })
    }

    // تسجيل الحدث في التحليلات
    await trackCourseStart(data.userId, data.courseId, data.courseName)

    console.log(`تم إرسال إشعارات التسجيل في الدورة: ${data.courseName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث التسجيل في الدورة:', error)
  }
}

/**
 * حدث إكمال درس
 */
export async function onLessonCompleted(data: {
  userId: string
  lessonId: string
  lessonName: string
  courseId: string
  courseName: string
  userName: string
  progress: number
  timeSpent: number // بالثواني
}) {
  try {
    // إرسال إشعار للطالب
    await sendLessonCompletedNotification(data.userId, {
      lessonId: data.lessonId,
      lessonName: data.lessonName,
      courseId: data.courseId,
      courseName: data.courseName,
      progress: data.progress,
      userName: data.userName
    })

    // تسجيل الحدث في التحليلات
    await trackLessonComplete(
      data.userId,
      data.lessonId,
      data.courseId,
      data.timeSpent
    )

    console.log(`تم إرسال إشعار إكمال الدرس: ${data.lessonName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث إكمال الدرس:', error)
  }
}

/**
 * حدث إكمال دورة كاملة
 */
export async function onCourseCompleted(data: {
  userId: string
  courseId: string
  courseName: string
  userName: string
  instructorId?: string
  finalScore?: number
}) {
  try {
    // إرسال إشعار للطالب
    await sendCourseCompletedNotification(data.userId, {
      courseId: data.courseId,
      courseName: data.courseName,
      userName: data.userName
    })

    // إرسال إشعار للمدرب
    if (data.instructorId) {
      await NotificationManager.send({
        userId: data.instructorId,
        type: 'COURSE_COMPLETED',
        data: {
          courseName: data.courseName,
          userName: data.userName,
          courseId: data.courseId,
          finalScore: data.finalScore || 0
        },
        priority: 'HIGH',
        sendEmail: true
      })
    }

    // إرسال إشعار إنجاز للطالب
    await NotificationManager.send({
      userId: data.userId,
      type: 'ACHIEVEMENT_UNLOCKED',
      data: {
        achievementName: `إكمال دورة ${data.courseName}`,
        achievementDescription: 'تهانينا! لقد أكملت الدورة بنجاح وحصلت على شهادة الإكمال.',
        userName: data.userName
      },
      priority: 'HIGH'
    })

    console.log(`تم إرسال إشعارات إكمال الدورة: ${data.courseName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث إكمال الدورة:', error)
  }
}

/**
 * حدث إكمال اختبار
 */
export async function onQuizCompleted(data: {
  userId: string
  quizId: string
  quizName: string
  courseId: string
  lessonId: string
  score: number
  maxScore: number
  timeSpent: number // بالثواني
  userName: string
}) {
  try {
    const percentage = Math.round((data.score / data.maxScore) * 100)
    let resultMessage = ''
    
    if (percentage >= 90) {
      resultMessage = 'ممتاز! أداء رائع'
    } else if (percentage >= 80) {
      resultMessage = 'جيد جداً! استمر في التقدم'
    } else if (percentage >= 70) {
      resultMessage = 'جيد! يمكنك تحسين أدائك'
    } else if (percentage >= 60) {
      resultMessage = 'مقبول، حاول مراجعة المادة'
    } else {
      resultMessage = 'يحتاج إلى تحسين، راجع الدرس مرة أخرى'
    }

    // إرسال إشعار نتيجة الاختبار
    await NotificationManager.send({
      userId: data.userId,
      type: 'QUIZ_RESULT',
      data: {
        quizName: data.quizName,
        score: data.score,
        maxScore: data.maxScore,
        resultMessage,
        courseId: data.courseId,
        lessonId: data.lessonId,
        quizId: data.quizId,
        userName: data.userName
      },
      priority: 'MEDIUM'
    })

    // تسجيل الحدث في التحليلات
    await trackQuizComplete(
      data.userId,
      data.quizId,
      data.score,
      data.maxScore,
      data.timeSpent
    )

    console.log(`تم إرسال إشعار نتيجة الاختبار: ${data.quizName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث إكمال الاختبار:', error)
  }
}

/**
 * حدث تفاعل مع المساعد الذكي
 */
export async function onAIInteraction(data: {
  userId: string
  interactionType: string
  tokens?: number
  sessionId?: string
}) {
  try {
    // تسجيل الحدث في التحليلات
    await trackAIInteraction(
      data.userId,
      data.interactionType,
      data.tokens,
      data.sessionId
    )

    // إرسال إشعار للمستخدمين الجدد (أول 3 تفاعلات)
    // يمكن إضافة منطق للتحقق من عدد التفاعلات السابقة
    
    console.log(`تم تسجيل تفاعل AI: ${data.interactionType}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث تفاعل AI:', error)
  }
}

/**
 * حدث تعيين دور جديد للمستخدم
 */
export async function onRoleAssignment(data: {
  userId: string
  roleName: string
  circleName: string
  roleId: string
  assignedBy: string
}) {
  try {
    // إرسال إشعار للمستخدم المعين
    await NotificationManager.send({
      userId: data.userId,
      type: 'ROLE_ASSIGNMENT',
      data: {
        roleName: data.roleName,
        circleName: data.circleName,
        roleId: data.roleId
      },
      priority: 'HIGH',
      sendEmail: true,
      senderId: data.assignedBy
    })

    console.log(`تم إرسال إشعار تعيين الدور: ${data.roleName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث تعيين الدور:', error)
  }
}

/**
 * حدث اقتراح قرار جديد في الهولاكراسي
 */
export async function onDecisionProposed(data: {
  decisionId: string
  decisionTitle: string
  proposedBy: string
  affectedUsers: string[]
}) {
  try {
    // إرسال إشعار للمستخدمين المتأثرين
    await NotificationManager.send({
      userIds: data.affectedUsers,
      type: 'DECISION_PROPOSED',
      data: {
        decisionTitle: data.decisionTitle,
        decisionId: data.decisionId
      },
      priority: 'HIGH',
      sendEmail: true,
      senderId: data.proposedBy
    })

    console.log(`تم إرسال إشعارات القرار المقترح: ${data.decisionTitle}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث اقتراح القرار:', error)
  }
}

/**
 * حدث إضافة دورة جديدة
 */
export async function onNewCourseAdded(data: {
  courseId: string
  courseName: string
  category: string
  instructorName: string
  description?: string
}) {
  try {
    // إرسال إشعار لجميع المستخدمين المهتمين بهذه الفئة
    await NotificationManager.sendToAll(
      'NEW_COURSE_AVAILABLE',
      {
        courseName: data.courseName,
        courseId: data.courseId,
        courseDescription: data.description || `دورة جديدة في ${data.category}`
      },
      {
        priority: 'MEDIUM',
        sendEmail: true
      }
    )

    console.log(`تم إرسال إشعارات الدورة الجديدة: ${data.courseName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث إضافة دورة جديدة:', error)
  }
}

/**
 * حدث إعلان من النظام
 */
export async function onSystemAnnouncement(data: {
  message: string
  announcementId?: string
  senderId?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}) {
  try {
    await sendSystemAnnouncement(
      {
        announcementMessage: data.message,
        announcementId: data.announcementId
      },
      data.senderId
    )

    console.log('تم إرسال الإعلان العام للجميع')
  } catch (error) {
    console.error('خطأ في معالجة حدث الإعلان العام:', error)
  }
}

/**
 * حدث تسجيل مستخدم جديد
 */
export async function onUserRegistration(data: {
  userId: string
  userName: string
  userEmail: string
}) {
  try {
    // إرسال بريد ترحيب
    const { sendWelcomeEmail } = await import('../email/mailer')
    await sendWelcomeEmail(data.userEmail, data.userName)

    // إرسال إشعار ترحيب داخل التطبيق
    await NotificationManager.send({
      userId: data.userId,
      type: 'SYSTEM_ANNOUNCEMENT',
      data: {
        announcementMessage: `مرحباً بك ${data.userName} في منصة فتح! نحن سعداء لانضمامك إلينا. ابدأ رحلتك التعليمية الآن واستكشف الدورات المتاحة.`,
        userName: data.userName
      },
      priority: 'HIGH'
    })

    console.log(`تم إرسال رسائل الترحيب للمستخدم الجديد: ${data.userName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث تسجيل المستخدم الجديد:', error)
  }
}

/**
 * حدث موعد تسليم مهمة قريب
 */
export async function onAssignmentDueSoon(data: {
  userId: string
  assignmentName: string
  assignmentId: string
  dueDate: string
}) {
  try {
    await NotificationManager.send({
      userId: data.userId,
      type: 'ASSIGNMENT_DUE',
      data: {
        assignmentName: data.assignmentName,
        assignmentId: data.assignmentId,
        dueDate: data.dueDate
      },
      priority: 'HIGH',
      sendEmail: true
    })

    console.log(`تم إرسال تذكير موعد التسليم: ${data.assignmentName}`)
  } catch (error) {
    console.error('خطأ في معالجة حدث موعد التسليم:', error)
  }
}
