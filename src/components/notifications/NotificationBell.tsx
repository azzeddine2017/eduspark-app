'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

// واجهة بيانات الإشعار
interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: 'UNREAD' | 'read' | 'ARCHIVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  actionUrl?: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

// واجهة إحصائيات الإشعارات
interface NotificationStats {
  unreadCount: number
}

/**
 * مكون جرس الإشعارات في شريط التنقل
 */
export default function NotificationBell() {
  const { data: session } = useSession()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  // جلب عدد الإشعارات غير المقروءة
  const fetchUnreadCount = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/notifications/stats')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.summary.unread || 0)
      }
    } catch (error) {
      console.error('خطأ في جلب عدد الإشعارات:', error)
    }
  }

  // جلب الإشعارات الحديثة
  const fetchRecentNotifications = async () => {
    if (!session?.user?.id) return

    setLoading(true)
    try {
      const response = await fetch('/api/notifications?limit=5&unreadOnly=true')
      if (response.ok) {
        const data = await response.json()
        setRecentNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('خطأ في جلب الإشعارات الحديثة:', error)
    } finally {
      setLoading(false)
    }
  }

  // تحديد جميع الإشعارات كمقروءة
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markAllAsRead: true })
      })

      if (response.ok) {
        setUnreadCount(0)
        setRecentNotifications([])
        setIsOpen(false)
      }
    } catch (error) {
      console.error('خطأ في تحديد الإشعارات كمقروءة:', error)
    }
  }

  // تحديث البيانات عند تسجيل الدخول
  useEffect(() => {
    if (session?.user?.id) {
      fetchUnreadCount()
    }
  }, [session])

  // جلب الإشعارات عند فتح القائمة
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchRecentNotifications()
    }
  }, [isOpen, session])

  // إخفاء المكون إذا لم يكن المستخدم مسجل الدخول
  if (!session?.user?.id) {
    return null
  }

  // تنسيق الوقت النسبي
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'الآن'
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`
    
    return date.toLocaleDateString('ar-SA')
  }

  // تحديد لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-blue-600'
      case 'LOW': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="relative">
      {/* زر الجرس */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
        aria-label="الإشعارات"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-6 w-6" />
        ) : (
          <Bell className="h-6 w-6" />
        )}
        
        {/* عداد الإشعارات غير المقروءة */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* قائمة الإشعارات المنسدلة */}
      {isOpen && (
        <>
          {/* خلفية شفافة لإغلاق القائمة */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* القائمة */}
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden">
            {/* رأس القائمة */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* محتوى القائمة */}
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                // حالة التحميل
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : recentNotifications.length > 0 ? (
                // قائمة الإشعارات
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        notification.status === 'UNREAD' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        {/* أيقونة الأولوية */}
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.priority === 'URGENT' ? 'bg-red-500' :
                          notification.priority === 'HIGH' ? 'bg-orange-500' :
                          notification.priority === 'MEDIUM' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        
                        {/* محتوى الإشعار */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            {notification.sender && (
                              <span className="text-xs text-gray-500">
                                من: {notification.sender.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // لا توجد إشعارات
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">لا توجد إشعارات جديدة</p>
                </div>
              )}
            </div>

            {/* تذييل القائمة */}
            <div className="px-4 py-3 border-t border-gray-200">
              <Link
                href="/notifications"
                className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                عرض جميع الإشعارات
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
