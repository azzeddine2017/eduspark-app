"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  ArrowLeft,
  Camera,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe
} from "lucide-react"
import Header from "@/components/Header"

export default function EditProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    birthDate: '',
    occupation: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: session.user.phone || '',
        location: session.user.location || '',
        bio: session.user.bio || '',
        website: session.user.website || '',
        birthDate: session.user.birthDate || '',
        occupation: session.user.occupation || ''
      }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // التحقق من كلمة المرور الجديدة
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          website: formData.website,
          birthDate: formData.birthDate,
          occupation: formData.occupation,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء تحديث الملف الشخصي')
      }

      // تحديث الجلسة
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email
        }
      })

      setSuccess('تم تحديث الملف الشخصي بنجاح!')
      
      // مسح كلمات المرور
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

      // إعادة توجيه بعد 2 ثانية
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
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
                تعديل الملف الشخصي
              </h1>
              <p className="text-medium-contrast arabic-text mt-2">
                قم بتحديث معلوماتك الشخصية وإعدادات الحساب
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <User className="w-5 h-5 ml-2" />
              المعلومات الأساسية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <User className="inline w-4 h-4 ml-1" />
                  الاسم الكامل *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input w-full"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <Mail className="inline w-4 h-4 ml-1" />
                  البريد الإلكتروني *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input w-full"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <Phone className="inline w-4 h-4 ml-1" />
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input w-full"
                  placeholder="أدخل رقم هاتفك"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <MapPin className="inline w-4 h-4 ml-1" />
                  الموقع
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input w-full"
                  placeholder="المدينة، البلد"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <Calendar className="inline w-4 h-4 ml-1" />
                  تاريخ الميلاد
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className="form-input w-full"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  <Briefcase className="inline w-4 h-4 ml-1" />
                  المهنة
                </label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  className="form-input w-full"
                  placeholder="مهنتك أو تخصصك"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="website" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                <Globe className="inline w-4 h-4 ml-1" />
                الموقع الإلكتروني
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="form-input w-full"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                نبذة شخصية
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="form-input w-full"
                placeholder="اكتب نبذة مختصرة عن نفسك..."
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Lock className="w-5 h-5 ml-2" />
              تغيير كلمة المرور
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    className="form-input w-full pl-10"
                    placeholder="أدخل كلمة المرور الحالية"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-contrast hover:text-high-contrast"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="form-input w-full pl-10"
                      placeholder="أدخل كلمة المرور الجديدة"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-contrast hover:text-high-contrast"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-input w-full"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="bg-info bg-opacity-10 border border-info border-opacity-20 rounded-lg p-4">
                <p className="text-sm text-info arabic-text">
                  💡 <strong>نصيحة:</strong> اتركي حقول كلمة المرور فارغة إذا كنت لا تريدين تغييرها
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <Link
              href="/profile"
              className="btn btn-outline"
            >
              إلغاء
            </Link>
            <button
              type="submit"
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
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
