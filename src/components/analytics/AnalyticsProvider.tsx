'use client'

import { useEffect } from 'react'
import { usePageTracking, useAnalytics } from '@/lib/analytics/tracker'

/**
 * مزود التحليلات العام
 * يتم تضمينه في التطبيق لتتبع جميع الأحداث تلقائياً
 */
export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // تفعيل تتبع الصفحات تلقائياً
  usePageTracking()
  
  const { trackError } = useAnalytics()

  // تتبع الأخطاء العامة
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(
        'javascript_error',
        event.message,
        event.error?.stack
      )
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(
        'unhandled_promise_rejection',
        event.reason?.toString() || 'Unknown promise rejection'
      )
    }

    // إضافة مستمعي الأحداث
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // تنظيف المستمعين عند إلغاء التحميل
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [trackError])

  return <>{children}</>
}
