"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  Globe,
  Shield,
  Trash2,
  Download,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  MessageCircle,
  BookOpen,
  Trophy,
  Users,
  AlertTriangle
} from "lucide-react"
import Header from "@/components/Header"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [settings, setSettings] = useState({
    // إعدادات الإشعارات
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievementNotifications: true,
    communityNotifications: false,
    weeklyDigest: true,
    
    // إعدادات الخصوصية
    profileVisibility: 'public', // public, friends, private
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    
    // إعدادات التعلم
    autoplay: false,
    subtitles: true,
    playbackSpeed: 1,
    language: 'ar',
    
    // إعدادات المساعد الذكي
    aiAssistant: true,
    aiSuggestions: true,
    aiReminders: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error('فشل في حفظ الإعدادات')
      }

      setSuccess('تم حفظ الإعدادات بنجاح!')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch('/api/user/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `fateh-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess('تم تصدير البيانات بنجاح!')
      }
    } catch (error) {
      setError('فشل في تصدير البيانات')
    }
  }

  const deleteAccount = async () => {
    if (!confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return
    }

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.href = '/auth/signin?message=تم حذف حسابك بنجاح'
      } else {
        throw new Error('فشل في حذف الحساب')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء حذف الحساب')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-medium-contrast">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-high-contrast arabic-text">
                الإعدادات
              </h1>
              <p className="text-medium-contrast arabic-text mt-2">
                قم بتخصيص تجربتك على منصة فتح
              </p>
            </div>
            <Link
              href="/profile"
              className="btn btn-outline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للملف الشخصي
            </Link>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="notification notification-error mb-6">
            <div className="flex items-center">
              <span className="text-red-600 ml-2">❌</span>
              <span className="arabic-text">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="notification notification-success mb-6">
            <div className="flex items-center">
              <span className="text-green-600 ml-2">✅</span>
              <span className="arabic-text">{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Theme Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Monitor className="w-5 h-5 ml-2" />
              المظهر والعرض
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-high-contrast arabic-text mb-3">
                  وضع العرض
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm text-high-contrast arabic-text">فاتح</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm text-high-contrast arabic-text">مظلم</span>
                  </button>
                  
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'system' 
                        ? 'border-primary bg-primary bg-opacity-10' 
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm text-high-contrast arabic-text">تلقائي</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-high-contrast arabic-text mb-3">
                  اللغة
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="form-input w-full max-w-xs"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Bell className="w-5 h-5 ml-2" />
              الإشعارات
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-medium-contrast ml-3" />
                  <div>
                    <p className="text-sm font-medium text-high-contrast arabic-text">إشعارات البريد الإلكتروني</p>
                    <p className="text-xs text-medium-contrast arabic-text">تلقي الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-medium-contrast ml-3" />
                  <div>
                    <p className="text-sm font-medium text-high-contrast arabic-text">الإشعارات الفورية</p>
                    <p className="text-xs text-medium-contrast arabic-text">إشعارات على الجهاز</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-medium-contrast ml-3" />
                  <div>
                    <p className="text-sm font-medium text-high-contrast arabic-text">تحديثات الدورات</p>
                    <p className="text-xs text-medium-contrast arabic-text">إشعارات الدروس الجديدة والتحديثات</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.courseUpdates}
                    onChange={(e) => handleSettingChange('courseUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-medium-contrast ml-3" />
                  <div>
                    <p className="text-sm font-medium text-high-contrast arabic-text">إشعارات الإنجازات</p>
                    <p className="text-xs text-medium-contrast arabic-text">عند كسب إنجازات جديدة</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.achievementNotifications}
                    onChange={(e) => handleSettingChange('achievementNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Shield className="w-5 h-5 ml-2" />
              الخصوصية والأمان
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-high-contrast arabic-text mb-3">
                  مستوى خصوصية الملف الشخصي
                </label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="form-input w-full max-w-xs"
                >
                  <option value="public">عام - يمكن للجميع رؤيته</option>
                  <option value="friends">الأصدقاء فقط</option>
                  <option value="private">خاص - أنا فقط</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-high-contrast arabic-text">إظهار التقدم في التعلم</p>
                  <p className="text-xs text-medium-contrast arabic-text">السماح للآخرين برؤية تقدمك</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showProgress}
                    onChange={(e) => handleSettingChange('showProgress', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-high-contrast arabic-text">إظهار الإنجازات</p>
                  <p className="text-xs text-medium-contrast arabic-text">عرض الشارات والإنجازات للآخرين</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showAchievements}
                    onChange={(e) => handleSettingChange('showAchievements', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* AI Assistant Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <MessageCircle className="w-5 h-5 ml-2" />
              المساعد الذكي
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-high-contrast arabic-text">تفعيل المساعد الذكي</p>
                  <p className="text-xs text-medium-contrast arabic-text">السماح بالتفاعل مع المساعد الذكي</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.aiAssistant}
                    onChange={(e) => handleSettingChange('aiAssistant', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-high-contrast arabic-text">اقتراحات ذكية</p>
                  <p className="text-xs text-medium-contrast arabic-text">تلقي اقتراحات مخصصة للتعلم</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.aiSuggestions}
                    onChange={(e) => handleSettingChange('aiSuggestions', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Download className="w-5 h-5 ml-2" />
              إدارة البيانات
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div>
                  <p className="text-sm font-medium text-high-contrast arabic-text">تصدير البيانات</p>
                  <p className="text-xs text-medium-contrast arabic-text">تحميل نسخة من جميع بياناتك</p>
                </div>
                <button
                  onClick={exportData}
                  className="btn btn-outline flex items-center"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-error arabic-text">حذف الحساب</p>
                  <p className="text-xs text-error arabic-text">حذف حسابك وجميع بياناتك نهائياً</p>
                </div>
                <button
                  onClick={deleteAccount}
                  className="btn bg-error text-white hover:bg-opacity-80 flex items-center"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف الحساب
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
