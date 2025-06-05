'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

// واجهة بيانات التتبع
interface TrackingData {
  eventName: string
  eventType: 'page_view' | 'user_action' | 'interaction' | 'system_event'
  properties?: Record<string, any>
  sessionId?: string
}

/**
 * مدير التتبع من جانب العميل
 */
class ClientAnalyticsTracker {
  private sessionId: string
  private startTime: number
  private pageViews: number = 0

  constructor() {
    // إنشاء معرف جلسة فريد
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    
    // تتبع إغلاق الصفحة
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handlePageUnload.bind(this))
      window.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    }
  }

  /**
   * إنشاء معرف جلسة فريد
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * إرسال حدث تحليلي
   */
  async trackEvent(data: TrackingData): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          sessionId: this.sessionId,
          pageUrl: window.location.pathname,
          referrer: document.referrer || undefined
        })
      })
    } catch (error) {
      console.error('خطأ في تتبع الحدث:', error)
    }
  }

  /**
   * تتبع زيارة صفحة
   */
  async trackPageView(pathname: string): Promise<void> {
    this.pageViews++
    
    await this.trackEvent({
      eventName: 'page_view',
      eventType: 'page_view',
      properties: {
        page: pathname,
        pageNumber: this.pageViews,
        timestamp: new Date().toISOString()
      }
    })
  }

  /**
   * تتبع نقرة على زر أو رابط
   */
  async trackClick(element: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventName: 'click',
      eventType: 'user_action',
      properties: {
        element,
        ...properties
      }
    })
  }

  /**
   * تتبع تفاعل مع نموذج
   */
  async trackFormInteraction(formName: string, action: 'start' | 'submit' | 'error', properties?: Record<string, any>): Promise<void> {
    await this.trackEvent({
      eventName: 'form_interaction',
      eventType: 'user_action',
      properties: {
        formName,
        action,
        ...properties
      }
    })
  }

  /**
   * تتبع بحث
   */
  async trackSearch(query: string, results?: number): Promise<void> {
    await this.trackEvent({
      eventName: 'search',
      eventType: 'user_action',
      properties: {
        query,
        results,
        queryLength: query.length
      }
    })
  }

  /**
   * تتبع تشغيل فيديو
   */
  async trackVideoPlay(videoId: string, videoTitle: string, duration?: number): Promise<void> {
    await this.trackEvent({
      eventName: 'video_play',
      eventType: 'interaction',
      properties: {
        videoId,
        videoTitle,
        duration
      }
    })
  }

  /**
   * تتبع تحميل ملف
   */
  async trackDownload(fileName: string, fileType: string, fileSize?: number): Promise<void> {
    await this.trackEvent({
      eventName: 'file_download',
      eventType: 'user_action',
      properties: {
        fileName,
        fileType,
        fileSize
      }
    })
  }

  /**
   * تتبع خطأ
   */
  async trackError(errorType: string, errorMessage: string, errorStack?: string): Promise<void> {
    await this.trackEvent({
      eventName: 'error',
      eventType: 'system_event',
      properties: {
        errorType,
        errorMessage,
        errorStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    })
  }

  /**
   * معالجة إغلاق الصفحة
   */
  private handlePageUnload(): void {
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000) // بالثواني
    
    // إرسال بيانات الجلسة (استخدام sendBeacon للموثوقية)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify({
        eventName: 'session_end',
        eventType: 'system_event',
        sessionId: this.sessionId,
        properties: {
          duration: timeSpent,
          pagesVisited: this.pageViews
        }
      }))
    }
  }

  /**
   * معالجة تغيير رؤية الصفحة
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // الصفحة أصبحت مخفية
      this.trackEvent({
        eventName: 'page_hidden',
        eventType: 'system_event',
        properties: {
          timeSpent: Math.round((Date.now() - this.startTime) / 1000)
        }
      })
    } else {
      // الصفحة أصبحت مرئية مرة أخرى
      this.startTime = Date.now() // إعادة تعيين وقت البداية
      this.trackEvent({
        eventName: 'page_visible',
        eventType: 'system_event',
        properties: {
          timestamp: new Date().toISOString()
        }
      })
    }
  }
}

// إنشاء مثيل واحد من المتتبع
const tracker = typeof window !== 'undefined' ? new ClientAnalyticsTracker() : null

/**
 * Hook لتتبع زيارات الصفحات تلقائياً
 */
export function usePageTracking() {
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    if (tracker && session?.user) {
      tracker.trackPageView(pathname)
    }
  }, [pathname, session])

  return tracker
}

/**
 * Hook لتتبع الأحداث المخصصة
 */
export function useAnalytics() {
  const { data: session } = useSession()

  const trackEvent = async (data: Omit<TrackingData, 'sessionId'>) => {
    if (tracker && session?.user) {
      await tracker.trackEvent(data)
    }
  }

  const trackClick = async (element: string, properties?: Record<string, any>) => {
    if (tracker && session?.user) {
      await tracker.trackClick(element, properties)
    }
  }

  const trackFormInteraction = async (formName: string, action: 'start' | 'submit' | 'error', properties?: Record<string, any>) => {
    if (tracker && session?.user) {
      await tracker.trackFormInteraction(formName, action, properties)
    }
  }

  const trackSearch = async (query: string, results?: number) => {
    if (tracker && session?.user) {
      await tracker.trackSearch(query, results)
    }
  }

  const trackVideoPlay = async (videoId: string, videoTitle: string, duration?: number) => {
    if (tracker && session?.user) {
      await tracker.trackVideoPlay(videoId, videoTitle, duration)
    }
  }

  const trackDownload = async (fileName: string, fileType: string, fileSize?: number) => {
    if (tracker && session?.user) {
      await tracker.trackDownload(fileName, fileType, fileSize)
    }
  }

  const trackError = async (errorType: string, errorMessage: string, errorStack?: string) => {
    if (tracker && session?.user) {
      await tracker.trackError(errorType, errorMessage, errorStack)
    }
  }

  return {
    trackEvent,
    trackClick,
    trackFormInteraction,
    trackSearch,
    trackVideoPlay,
    trackDownload,
    trackError,
    isEnabled: !!(tracker && session?.user)
  }
}

export default tracker
