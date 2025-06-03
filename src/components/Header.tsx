"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import ThemeToggle from "./ThemeToggle"

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  backUrl?: string
}

export default function Header({ 
  title = "منصة فتح للتعلّم الذكي", 
  showBackButton = false, 
  backUrl = "/" 
}: HeaderProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {showBackButton && (
              <Link 
                href={backUrl}
                className="ml-4 p-2 rounded-lg hover:bg-background transition-colors"
                title="العودة"
              >
                <svg className="w-6 h-6 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center ml-3">
                <span className="text-white font-bold text-xl">ف</span>
              </div>
              <Link href="/" className="text-xl font-bold text-text arabic-text hover:text-primary transition-colors">
                {title}
              </Link>
            </div>
          </div>

          <nav className="flex items-center space-x-4 space-x-reverse">
            <ThemeToggle />
            
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-4 space-x-reverse">
                  <span className="text-textSecondary arabic-text text-sm">
                    مرحباً، {user.name}
                  </span>
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="btn btn-primary text-sm"
                    >
                      🏛️ لوحة التحكم
                    </Link>
                  )}
                  
                  <Link
                    href="/courses"
                    className="btn btn-secondary text-sm"
                  >
                    📚 الدورات
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-opacity-80 transition-colors"
                    title="الملف الشخصي"
                  >
                    {user.name?.charAt(0) || 'م'}
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden">
                  <button className="p-2 rounded-lg hover:bg-background transition-colors">
                    <svg className="w-6 h-6 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  href="/auth/signin"
                  className="nav-link arabic-text text-sm hover:text-primary transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-primary text-sm"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu (Hidden by default) */}
      {user && (
        <div className="sm:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            <div className="text-textSecondary arabic-text text-sm mb-3">
              مرحباً، {user.name}
            </div>
            
            <Link
              href="/courses"
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
            >
              📚 الدورات
            </Link>
            
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              >
                🏛️ لوحة التحكم
              </Link>
            )}
            
            <Link
              href="/profile"
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
            >
              👤 الملف الشخصي
            </Link>
            
            <Link
              href="/api/auth/signout"
              className="block w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-error arabic-text"
            >
              🚪 تسجيل الخروج
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
