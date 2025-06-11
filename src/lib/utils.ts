import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * دالة مساعدة لدمج أسماء الفئات (CSS classes) بطريقة ذكية
 * تستخدم clsx لتجميع الفئات و tailwind-merge لحل التعارضات
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق الأرقام بالفواصل المناسبة
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num);
}

/**
 * تنسيق العملة
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * تحويل التاريخ إلى نص نسبي (منذ كم من الوقت)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'منذ لحظات';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `منذ ${diffInDays} يوم`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `منذ ${diffInMonths} شهر`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `منذ ${diffInYears} سنة`;
}

/**
 * تحويل حجم الملف إلى نص قابل للقراءة
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 بايت';

  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * إنشاء معرف فريد قصير
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * تحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * تحقق من قوة كلمة المرور
 */
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  return { score, feedback };
}

/**
 * تحويل النص إلى slug مناسب للروابط
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * تحديد لون بناءً على النسبة المئوية
 */
export function getColorByPercentage(percentage: number): string {
  if (percentage >= 80) return 'text-green-600 dark:text-green-400';
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * تحديد لون الخلفية بناءً على الحالة
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'نشط':
    case 'مكتمل':
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'pending':
    case 'قيد المراجعة':
    case 'في الانتظار':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'suspended':
    case 'معلق':
    case 'محظور':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'draft':
    case 'مسودة':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  }
}

/**
 * تحويل الكائن إلى معاملات URL
 */
export function objectToQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  
  return params.toString();
}

/**
 * تأخير التنفيذ (للاختبار أو التحكم في التوقيت)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * نسخ النص إلى الحافظة
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('فشل في نسخ النص:', err);
    return false;
  }
}

/**
 * تحديد ما إذا كان المستخدم على جهاز محمول
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * تحديد ما إذا كان المتصفح يدعم ميزة معينة
 */
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case 'webp':
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    case 'localStorage':
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    case 'serviceWorker':
      return 'serviceWorker' in navigator;
    default:
      return false;
  }
}
