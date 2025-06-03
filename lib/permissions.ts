import { UserRole } from '@prisma/client'

// صلاحيات النظام
export const PERMISSIONS = {
  // صلاحيات الأدمن - كل شيء
  ADMIN: {
    canManageUsers: true,
    canManageCourses: true,
    canManageLessons: true,
    canManageHolacracy: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canDeleteAnything: true,
    canAssignRoles: true,
    canMakeDecisions: true,
  },

  // منشئ المحتوى
  CONTENT_CREATOR: {
    canCreateCourses: true,
    canEditOwnCourses: true,
    canCreateLessons: true,
    canEditOwnLessons: true,
    canViewBasicAnalytics: true,
    canSuggestDecisions: true,
  },

  // المدرس
  INSTRUCTOR: {
    canCreateCourses: true,
    canEditOwnCourses: true,
    canCreateLessons: true,
    canEditOwnLessons: true,
    canViewStudentProgress: true,
    canGradeAssignments: true,
    canSuggestDecisions: true,
  },

  // الموجه
  MENTOR: {
    canViewStudentProgress: true,
    canMessageStudents: true,
    canCreateGuidance: true,
    canSuggestDecisions: true,
  },

  // مدير المجتمع
  COMMUNITY_MANAGER: {
    canModerateComments: true,
    canManageForums: true,
    canSendAnnouncements: true,
    canViewCommunityAnalytics: true,
    canSuggestDecisions: true,
  },

  // مراجع الجودة
  QUALITY_ASSURANCE: {
    canReviewContent: true,
    canApproveContent: true,
    canRejectContent: true,
    canViewQualityReports: true,
    canSuggestDecisions: true,
  },

  // أخصائي التحليلات
  ANALYTICS_SPECIALIST: {
    canViewAllAnalytics: true,
    canCreateReports: true,
    canExportData: true,
    canSuggestDecisions: true,
  },

  // أخصائي الدعم
  SUPPORT_SPECIALIST: {
    canViewUserIssues: true,
    canRespondToTickets: true,
    canAccessUserAccounts: true,
    canViewSupportAnalytics: true,
    canSuggestDecisions: true,
  },

  // الطالب - صلاحيات أساسية
  STUDENT: {
    canEnrollInCourses: true,
    canViewOwnProgress: true,
    canSubmitAssignments: true,
    canParticipateInForums: true,
    canRateCourses: true,
  },
} as const

// دالة للتحقق من الصلاحيات
export function hasPermission(userRole: UserRole, permission: string): boolean {
  // الأدمن له كل الصلاحيات
  if (userRole === 'ADMIN') {
    return true
  }

  const rolePermissions = PERMISSIONS[userRole]
  if (!rolePermissions) {
    return false
  }

  return (rolePermissions as any)[permission] === true
}

// دالة للحصول على جميع صلاحيات المستخدم
export function getUserPermissions(userRole: UserRole) {
  if (userRole === 'ADMIN') {
    return PERMISSIONS.ADMIN
  }
  
  return PERMISSIONS[userRole] || {}
}

// أدوار الهولاكراسي مع أوصافها
export const HOLACRACY_ROLES = {
  CONTENT_CREATOR: {
    name: 'منشئ المحتوى',
    description: 'مسؤول عن إنتاج المحتوى التعليمي عالي الجودة',
    circle: 'دائرة المحتوى',
    responsibilities: [
      'إنشاء دورات تعليمية جديدة',
      'كتابة وتطوير محتوى الدروس',
      'مراجعة وتحديث المحتوى الموجود',
      'التعاون مع فريق التصميم التعليمي'
    ]
  },

  INSTRUCTOR: {
    name: 'المدرس',
    description: 'مسؤول عن تدريس الدورات وتوجيه الطلاب',
    circle: 'دائرة التعليم',
    responsibilities: [
      'تدريس الدورات المخصصة',
      'تقييم أداء الطلاب',
      'تقديم التغذية الراجعة',
      'الإجابة على استفسارات الطلاب'
    ]
  },

  MENTOR: {
    name: 'الموجه التعليمي',
    description: 'مسؤول عن توجيه ومساعدة الطلاب في رحلتهم التعليمية',
    circle: 'دائرة الدعم التعليمي',
    responsibilities: [
      'توجيه الطلاب في اختيار المسارات',
      'تقديم الدعم النفسي والتحفيزي',
      'مساعدة الطلاب في حل المشاكل',
      'متابعة تقدم الطلاب'
    ]
  },

  COMMUNITY_MANAGER: {
    name: 'مدير المجتمع',
    description: 'مسؤول عن بناء وإدارة مجتمع المتعلمين',
    circle: 'دائرة المجتمع',
    responsibilities: [
      'إدارة المنتديات والمناقشات',
      'تنظيم الفعاليات التعليمية',
      'تشجيع التفاعل بين المتعلمين',
      'إدارة وسائل التواصل الاجتماعي'
    ]
  },

  QUALITY_ASSURANCE: {
    name: 'مراجع الجودة',
    description: 'مسؤول عن ضمان جودة المحتوى والخدمات',
    circle: 'دائرة الجودة',
    responsibilities: [
      'مراجعة جودة المحتوى التعليمي',
      'اختبار الميزات الجديدة',
      'وضع معايير الجودة',
      'تقييم رضا المستخدمين'
    ]
  },

  ANALYTICS_SPECIALIST: {
    name: 'أخصائي التحليلات',
    description: 'مسؤول عن تحليل البيانات وتقديم الرؤى',
    circle: 'دائرة التحليلات',
    responsibilities: [
      'تحليل سلوك المستخدمين',
      'إنتاج التقارير الدورية',
      'تقديم توصيات للتحسين',
      'مراقبة مؤشرات الأداء'
    ]
  },

  SUPPORT_SPECIALIST: {
    name: 'أخصائي الدعم',
    description: 'مسؤول عن تقديم الدعم الفني والتعليمي',
    circle: 'دائرة الدعم',
    responsibilities: [
      'الرد على استفسارات المستخدمين',
      'حل المشاكل التقنية',
      'إنشاء دليل المساعدة',
      'تدريب المستخدمين الجدد'
    ]
  }
} as const

// دالة للحصول على وصف الدور
export function getRoleDescription(role: UserRole) {
  if (role === 'ADMIN') {
    return {
      name: 'المدير العام',
      description: 'له صلاحية كاملة على جميع أجزاء النظام',
      circle: 'الدائرة العامة',
      responsibilities: ['إدارة النظام بالكامل', 'اتخاذ القرارات الاستراتيجية', 'تعيين الأدوار', 'الإشراف العام']
    }
  }

  if (role === 'STUDENT') {
    return {
      name: 'الطالب',
      description: 'مستخدم يتعلم من خلال المنصة',
      circle: 'دائرة المتعلمين',
      responsibilities: ['التعلم والمشاركة', 'إكمال الدورات', 'تقييم المحتوى', 'المشاركة في المجتمع']
    }
  }

  return HOLACRACY_ROLES[role] || null
}
