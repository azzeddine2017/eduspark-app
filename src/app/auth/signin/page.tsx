"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import SimpleThemeToggle from "@/components/SimpleThemeToggle"
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react"

function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
    } else {
      // إعادة تحميل الصفحة للتأكد من تحديث الجلسة
      window.location.href = "/dashboard"
    }
    setLoading(false)
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/courses" })
  }

  return (
    <>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">ف</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text arabic-text">
            مرحباً بعودتك! 👋
          </h2>
          <p className="mt-2 text-textSecondary arabic-text">
            سجل دخولك لمتابعة رحلة التعلم
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="notification notification-success">
            <div className="flex items-center">
              <span className="text-green-600 ml-2">✅</span>
              <span className="arabic-text">{message}</span>
            </div>
          </div>
        )}

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
              <label htmlFor="email" className="block text-sm font-medium text-text arabic-text mb-2">
                <Mail className="inline w-4 h-4 ml-1" />
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input w-full"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text arabic-text mb-2">
                <Lock className="inline w-4 h-4 ml-1" />
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="form-input w-full pl-10"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-textSecondary arabic-text">
                  تذكرني
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-primary hover:text-secondary arabic-text">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg py-3 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner ml-2"></div>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 ml-2" />
                    تسجيل الدخول
                  </>
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

            {/* Google Sign In */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn btn-secondary w-full text-lg py-3 flex items-center justify-center"
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                تسجيل الدخول بـ Google
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-textSecondary arabic-text">
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="text-primary hover:text-secondary font-medium inline-flex items-center">
                <UserPlus className="w-4 h-4 ml-1" />
                إنشاء حساب جديد
              </Link>
            </span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-textSecondary hover:text-primary transition-colors arabic-text inline-flex items-center">
            <ArrowLeft className="w-4 h-4 ml-1" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="absolute top-4 left-4">
        <SimpleThemeToggle />
      </div>

      <Suspense fallback={
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-4 text-textSecondary">جاري التحميل...</p>
          </div>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  )
}