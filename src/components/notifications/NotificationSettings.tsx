'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// واجهة تفضيلات الإشعارات
interface NotificationPreferences {
  // إعدادات عامة
  enableInApp: boolean
  enableEmail: boolean
  enablePush: boolean
  
  // إعدادات حسب النوع
  courseNotifications: boolean
  quizNotifications: boolean
  systemNotifications: boolean
  roleNotifications: boolean
  achievementNotifications: boolean
  
  // إعدادات التوقيت
  quietHoursStart: string
  quietHoursEnd: string
  weeklyDigest: boolean
}

/**
 * مكون إعدادات الإشعارات
 */
export default function NotificationSettings() {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableInApp: true,
    enableEmail: true,
    enablePush: false,
    courseNotifications: true,
    quizNotifications: true,
    systemNotifications: true,
    roleNotifications: true,
    achievementNotifications: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    weeklyDigest: false
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // جلب التفضيلات الحالية
  const fetchPreferences = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/notifications/preferences')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences || preferences)
      }
    } catch (error) {
      console.error('خطأ في جلب التفضيلات:', error)
    } finally {
      setLoading(false)
    }
  }

  // حفظ التفضيلات
  const savePreferences = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' })
      } else {
        setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' })
      }
    } catch (error) {
      console.error('خطأ في حفظ التفضيلات:', error)
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ الإعدادات' })
    } finally {
      setSaving(false)
    }
  }

  // تحديث تفضيل واحد
  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // تحديث البيانات عند تسجيل الدخول
  useEffect(() => {
    if (session?.user?.id) {
      fetchPreferences()
    }
  }, [session])

  // إخفاء الرسالة بعد 5 ثوان
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* رسالة النجاح/الخطأ */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 ml-2" />
          ) : (
            <AlertCircle className="h-5 w-5 ml-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* الإعدادات العامة */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 ml-2" />
            الإعدادات العامة
          </h2>
          
          <div className="space-y-4">
            {/* إشعارات داخل التطبيق */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">إشعارات داخل التطبيق</h3>
                  <p className="text-sm text-gray-500">عرض الإشعارات داخل المنصة</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableInApp}
                  onChange={(e) => updatePreference('enableInApp', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات البريد الإلكتروني */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">إشعارات البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-500">تلقي الإشعارات عبر البريد الإلكتروني</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableEmail}
                  onChange={(e) => updatePreference('enableEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات الدفع (للمستقبل) */}
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-gray-400 ml-3" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">إشعارات الدفع</h3>
                  <p className="text-sm text-gray-500">إشعارات فورية على الهاتف (قريباً)</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {/* إعدادات أنواع الإشعارات */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">أنواع الإشعارات</h2>
          
          <div className="space-y-4">
            {/* إشعارات الدورات */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">إشعارات الدورات</h3>
                <p className="text-sm text-gray-500">التسجيل، الإكمال، والدورات الجديدة</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.courseNotifications}
                  onChange={(e) => updatePreference('courseNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات الاختبارات */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">إشعارات الاختبارات</h3>
                <p className="text-sm text-gray-500">الاختبارات المتاحة والنتائج</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.quizNotifications}
                  onChange={(e) => updatePreference('quizNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات النظام */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">إشعارات النظام</h3>
                <p className="text-sm text-gray-500">الإعلانات والتحديثات المهمة</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.systemNotifications}
                  onChange={(e) => updatePreference('systemNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات الأدوار */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">إشعارات الأدوار</h3>
                <p className="text-sm text-gray-500">تعيين الأدوار والقرارات</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.roleNotifications}
                  onChange={(e) => updatePreference('roleNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* إشعارات الإنجازات */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">إشعارات الإنجازات</h3>
                <p className="text-sm text-gray-500">الإنجازات والشهادات الجديدة</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.achievementNotifications}
                  onChange={(e) => updatePreference('achievementNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex justify-end">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  )
}
