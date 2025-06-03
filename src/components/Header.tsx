"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import ThemeToggle from "./ThemeToggle"
import { Settings, BookOpen, LogIn, UserPlus, LogOut, User, Menu, X } from "lucide-react"
import { useState } from "react"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

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
                  <span className="text-textSecondary arabic-text text-sm font-medium">
                    مرحباً، {user.name}
                  </span>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="btn btn-primary text-sm flex items-center"
                    >
                      <Settings className="w-4 h-4 ml-1" />
                      لوحة التحكم
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    className="btn btn-secondary text-sm flex items-center"
                  >
                    <BookOpen className="w-4 h-4 ml-1" />
                    لوحة التحكم
                  </Link>

                  <Link
                    href="/courses"
                    className="btn btn-outline text-sm flex items-center"
                  >
                    <BookOpen className="w-4 h-4 ml-1" />
                    الدورات
                  </Link>

                  <Link
                    href="/profile"
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-opacity-80 transition-colors"
                    title="الملف الشخصي"
                  >
                    <User className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="btn btn-outline text-sm flex items-center text-error hover:bg-error hover:text-white"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4 ml-1" />
                    خروج
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-background transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6 text-textSecondary" />
                    ) : (
                      <Menu className="w-6 h-6 text-textSecondary" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  href="/auth/signin"
                  className="nav-link arabic-text text-sm hover:text-primary transition-colors flex items-center"
                >
                  <LogIn className="w-4 h-4 ml-1" />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="btn btn-primary text-sm flex items-center"
                >
                  <UserPlus className="w-4 h-4 ml-1" />
                  إنشاء حساب
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {user && isMobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            <div className="text-textSecondary arabic-text text-sm mb-3 font-medium">
              مرحباً، {user.name}
            </div>

            <Link
              href="/dashboard"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4 ml-2" />
              لوحة التحكم
            </Link>

            <Link
              href="/courses"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-4 h-4 ml-2" />
              الدورات
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4 ml-2" />
                لوحة التحكم
              </Link>
            )}

            <Link
              href="/profile"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-4 h-4 ml-2" />
              الملف الشخصي
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleSignOut()
              }}
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-error arabic-text"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
