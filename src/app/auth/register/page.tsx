"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف")
      setLoading(false)
      return
    }

    if (formData.name.length < 2) {
      setError("الاسم يجب أن يكون على الأقل حرفين")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/auth/signin?message=تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن")
      } else {
        setError(data.error || "حدث خطأ في إنشاء الحساب")
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/courses" })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">ف</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text arabic-text">
            انضم لمجتمع التعلم! 🌟
          </h2>
          <p className="mt-2 text-textSecondary arabic-text">
            ابدأ رحلتك التعليمية المجانية اليوم
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="notification notification-error">
                <div className="flex items-center">
                  <span className="text-red-600 ml-2">❌</span>
                  <span className="arabic-text">{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text arabic-text mb-2">
                👤 الاسم الكامل
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="form-input w-full"
                placeholder="أدخل اسمك الكامل"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text arabic-text mb-2">
                📧 البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input w-full"
                placeholder="أدخل بريدك الإلكتروني"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text arabic-text mb-2">
                🔒 كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="form-input w-full"
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text arabic-text mb-2">
                🔐 تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="form-input w-full"
                placeholder="أعد إدخال كلمة المرور"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="terms" className="mr-2 block text-sm text-textSecondary arabic-text">
                أوافق على{" "}
                <Link href="/terms" className="text-primary hover:text-secondary">
                  شروط الاستخدام
                </Link>
                {" "}و{" "}
                <Link href="/privacy" className="text-primary hover:text-secondary">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg py-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner ml-2"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  "🚀 إنشاء الحساب"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-textSecondary">أو</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="btn btn-secondary w-full text-lg py-3 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                التسجيل بـ Google
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-textSecondary arabic-text">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/signin" className="text-primary hover:text-secondary font-medium">
                سجل الدخول
              </Link>
            </span>
          </div>

          {/* Community Benefits */}
          <div className="mt-6 p-4 bg-primary bg-opacity-10 rounded-lg">
            <h3 className="text-sm font-semibold text-primary arabic-text mb-2">
              🌟 مزايا الانضمام لمجتمع فتح:
            </h3>
            <ul className="text-xs text-textSecondary arabic-text space-y-1">
              <li>✅ تعلم مجاني 100% مدى الحياة</li>
              <li>🤖 مساعد ذكي شخصي بتقنية Gemini</li>
              <li>👥 مجتمع داعم من المتعلمين والمعلمين</li>
              <li>📜 شهادات إتمام معتمدة</li>
              <li>🎯 مسارات تعليمية مخصصة</li>
            </ul>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-textSecondary hover:text-primary transition-colors arabic-text">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
