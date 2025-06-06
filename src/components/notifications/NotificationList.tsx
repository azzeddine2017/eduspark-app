'use client'

import { useState, useEffect } from 'react'
import {
  Bell,
  Check,
  Archive,
  Trash2,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

// واجهة بيانات الإشعار
interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  readAt?: string
  actionUrl?: string
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

// واجهة بيانات الصفحات
interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// واجهة استجابة API
interface NotificationsResponse {
  notifications: Notification[]
  pagination: Pagination
  unreadCount: number
}

/**
 * مكون قائمة الإشعارات الكاملة
 */
export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // فلاتر البحث
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    page: 1
  })

  // جلب الإشعارات
  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10'
      })

      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/notifications?${params}`)
      if (response.ok) {
        const data: NotificationsResponse = await response.json()
        setNotifications(data.notifications)
        setPagination(data.pagination)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error)
    } finally {
      setLoading(false)
    }
  }

  // تحديث حالة إشعار واحد
  const updateNotificationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id
              ? { ...notif, status: status as any, readAt: status === 'READ' ? new Date().toISOString() : notif.readAt }
              : notif
          )
        )

        // تحديث العداد
        if (status === 'READ') {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('خطأ في تحديث الإشعار:', error)
    }
  }

  // تحديث حالة إشعارات متعددة
  const updateMultipleNotifications = async (status: string) => {
    if (selectedIds.length === 0) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: selectedIds, status })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            selectedIds.includes(notif.id)
              ? { ...notif, status: status as any, readAt: status === 'READ' ? new Date().toISOString() : notif.readAt }
              : notif
          )
        )

        setSelectedIds([])

        // تحديث العداد للإشعارات المقروءة
        if (status === 'READ') {
          const unreadSelected = notifications.filter(n =>
            selectedIds.includes(n.id) && n.status === 'UNREAD'
          ).length
          setUnreadCount(prev => Math.max(0, prev - unreadSelected))
        }
      }
    } catch (error) {
      console.error('خطأ في تحديث الإشعارات:', error)
    }
  }

  // حذف إشعارات متعددة
  const deleteMultipleNotifications = async () => {
    if (selectedIds.length === 0) return

    try {
      const response = await fetch(`/api/notifications?ids=${selectedIds.join(',')}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => !selectedIds.includes(notif.id)))
        setSelectedIds([])

        // تحديث العداد
        const unreadSelected = notifications.filter(n =>
          selectedIds.includes(n.id) && n.status === 'UNREAD'
        ).length
        setUnreadCount(prev => Math.max(0, prev - unreadSelected))
      }
    } catch (error) {
      console.error('خطأ في حذف الإشعارات:', error)
    }
  }

  // تحديد/إلغاء تحديد جميع الإشعارات
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notifications.map(n => n.id))
    }
  }

  // تحديد/إلغاء تحديد إشعار واحد
  const toggleSelectNotification = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  // تحديث الصفحة
  const changePage = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  // تطبيق الفلاتر
  const applyFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  // تحديث البيانات عند تغيير الفلاتر
  useEffect(() => {
    fetchNotifications()
  }, [filters])

  // تنسيق الوقت
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA') + ' ' + date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // أيقونة نوع الإشعار
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'COURSE_ENROLLMENT':
      case 'COURSE_COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'QUIZ_AVAILABLE':
      case 'QUIZ_RESULT':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'SYSTEM_ANNOUNCEMENT':
        return <Info className="h-5 w-5 text-purple-500" />
      case 'ASSIGNMENT_DUE':
        return <Clock className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'border-r-red-500 bg-red-50'
      case 'HIGH': return 'border-r-orange-500 bg-orange-50'
      case 'MEDIUM': return 'border-r-blue-500 bg-blue-50'
      case 'LOW': return 'border-r-gray-500 bg-gray-50'
      default: return 'border-r-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* رأس الصفحة */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
            <p className="text-gray-600 mt-1">
              لديك {unreadCount} إشعار غير مقروء
            </p>
          </div>

          {/* أزرار الإجراءات السريعة */}
          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => updateMultipleNotifications('read')}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Check className="h-4 w-4 ml-1" />
                تحديد كمقروء
              </button>
              <button
                onClick={() => updateMultipleNotifications('ARCHIVED')}
                className="flex items-center px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Archive className="h-4 w-4 ml-1" />
                أرشفة
              </button>
              <button
                onClick={deleteMultipleNotifications}
                className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 ml-1" />
                حذف
              </button>
            </div>
          )}
        </div>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في الإشعارات..."
              value={filters.search}
              onChange={(e) => applyFilters({ search: e.target.value })}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* فلتر الحالة */}
          <select
            value={filters.status}
            onChange={(e) => applyFilters({ status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="UNREAD">غير مقروء</option>
            <option value="READ">مقروء</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>

          {/* فلتر النوع */}
          <select
            value={filters.type}
            onChange={(e) => applyFilters({ type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الأنواع</option>
            <option value="COURSE_ENROLLMENT">تسجيل في دورة</option>
            <option value="LESSON_COMPLETED">إكمال درس</option>
            <option value="COURSE_COMPLETED">إكمال دورة</option>
            <option value="QUIZ_AVAILABLE">اختبار متاح</option>
            <option value="QUIZ_RESULT">نتيجة اختبار</option>
            <option value="SYSTEM_ANNOUNCEMENT">إعلان النظام</option>
          </select>

          {/* تحديد الكل */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedIds.length === notifications.length && notifications.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="selectAll" className="mr-2 text-sm text-gray-700">
              تحديد الكل ({notifications.length})
            </label>
          </div>
        </div>
      </div>

      {/* قائمة الإشعارات */}
      <div className="space-y-3">
        {loading ? (
          // حالة التحميل
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري تحميل الإشعارات...</p>
          </div>
        ) : notifications.length > 0 ? (
          // قائمة الإشعارات
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border-r-4 shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md ${
                getPriorityColor(notification.priority)
              } ${
                notification.status === 'UNREAD' ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                {/* تحديد الإشعار */}
                <input
                  type="checkbox"
                  checked={selectedIds.includes(notification.id)}
                  onChange={() => toggleSelectNotification(notification.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                {/* أيقونة النوع */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* محتوى الإشعار */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-sm font-medium ${
                        notification.status === 'UNREAD' ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      {/* معلومات إضافية */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                          <span>{formatDateTime(notification.createdAt)}</span>
                          {notification.sender && (
                            <span>من: {notification.sender.name}</span>
                          )}
                          {notification.readAt && (
                            <span>قُرئ: {formatDateTime(notification.readAt)}</span>
                          )}
                        </div>

                        {/* حالة الإشعار */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {notification.status === 'UNREAD' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              جديد
                            </span>
                          )}
                          {notification.status === 'ARCHIVED' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              مؤرشف
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex items-center space-x-1 space-x-reverse mr-4">
                      {notification.status === 'UNREAD' && (
                        <button
                          onClick={() => updateNotificationStatus(notification.id, 'READ')}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="تحديد كمقروء"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}

                      {notification.status !== 'ARCHIVED' && (
                        <button
                          onClick={() => updateNotificationStatus(notification.id, 'ARCHIVED')}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          title="أرشفة"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}

                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          title="عرض التفاصيل"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // لا توجد إشعارات
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
            <p className="text-gray-500">لم يتم العثور على إشعارات تطابق المعايير المحددة.</p>
          </div>
        )}
      </div>

      {/* شريط الصفحات */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-700">
            عرض {((pagination.page - 1) * pagination.limit) + 1} إلى {Math.min(pagination.page * pagination.limit, pagination.totalCount)} من {pagination.totalCount} إشعار
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              السابق
            </button>

            <span className="px-3 py-2 text-sm">
              صفحة {pagination.page} من {pagination.totalPages}
            </span>

            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
              <ChevronLeft className="h-4 w-4 mr-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
