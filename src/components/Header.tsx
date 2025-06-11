"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import SimpleThemeToggle from "./SimpleThemeToggle"
import { Settings, BookOpen, LogIn, UserPlus, LogOut, User, Menu, X, ChevronDown, Info, Users, Heart, Shield, FileText, Handshake, Vote, Crown, MessageCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"

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
  const { data: session, status } = useSession()
  const user = session?.user
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pagesMenuRef = useRef<HTMLDivElement>(null)

  // تشخيص المشكلة - فقط في development
  if (process.env.NODE_ENV === 'development') {
    console.log('Header Debug:', {
      status,
      session,
      user,
      userRole: user?.role
    })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (pagesMenuRef.current && !pagesMenuRef.current.contains(event.target as Node)) {
        setIsPagesMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
            {/* Public Pages Menu */}
            <div className="relative hidden md:block" ref={pagesMenuRef}>
              <button
                onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
                className="flex items-center space-x-1 space-x-reverse text-sm text-text hover:text-primary transition-colors arabic-text px-3 py-2 rounded-lg hover:bg-background"
              >
                <span>الصفحات</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isPagesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Pages Dropdown Menu */}
              {isPagesMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                  <Link
                    href="/about"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Info className="w-4 h-4 ml-2" />
                    عن المنصة
                  </Link>

                  <Link
                    href="/community"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Users className="w-4 h-4 ml-2" />
                    المجتمع
                  </Link>

                  <Link
                    href="/partnerships"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Handshake className="w-4 h-4 ml-2" />
                    الشراكات
                  </Link>

                  <Link
                    href="/governance"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Vote className="w-4 h-4 ml-2" />
                    الحوكمة
                  </Link>

                  <Link
                    href="/roles"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Crown className="w-4 h-4 ml-2" />
                    الأدوار
                  </Link>

                  <Link
                    href="/communication"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    التواصل
                  </Link>

                  <Link
                    href="/volunteer"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 ml-2" />
                    التطوع
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                    onClick={() => setIsPagesMenuOpen(false)}
                  >
                    <Users className="w-4 h-4 ml-2" />
                    اتصل بنا
                  </Link>

                  <div className="border-t border-border mt-2 pt-2">
                    <Link
                      href="/privacy"
                      className="flex items-center px-4 py-2 text-sm text-textSecondary hover:bg-background transition-colors arabic-text"
                      onClick={() => setIsPagesMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4 ml-2" />
                      سياسة الخصوصية
                    </Link>

                    <Link
                      href="/terms"
                      className="flex items-center px-4 py-2 text-sm text-textSecondary hover:bg-background transition-colors arabic-text"
                      onClick={() => setIsPagesMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4 ml-2" />
                      شروط الاستخدام
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <SimpleThemeToggle />

            {status === 'loading' ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : session ? (
              <>
                <div className="hidden sm:flex items-center space-x-4 space-x-reverse">
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="btn btn-primary text-sm flex items-center"
                    >
                      <Settings className="w-4 h-4 ml-1" />
                      لوحة التحكم
                    </Link>
                  )}

                  <Link
                    href="/courses"
                    className="btn btn-outline text-sm flex items-center"
                  >
                    <BookOpen className="w-4 h-4 ml-1" />
                    الدورات
                  </Link>

                  {/* User Dropdown Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 space-x-reverse bg-surface hover:bg-background rounded-lg px-3 py-2 transition-colors border border-border"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-text arabic-text">{user?.name || session.user?.name || 'مستخدم'}</p>
                        <p className="text-xs text-textSecondary arabic-text">{user?.role === 'ADMIN' ? 'مدير' : user?.role === 'INSTRUCTOR' ? 'مدرس' : 'طالب'}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border py-2 z-50">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-sm font-medium text-text arabic-text">{user?.name || session.user?.name || 'مستخدم'}</p>
                          <p className="text-xs text-textSecondary arabic-text">{user?.email || session.user?.email}</p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 ml-2" />
                          الملف الشخصي
                        </Link>

                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="w-4 h-4 ml-2" />
                          لوحة التحكم
                        </Link>

                        <Link
                          href="/profile/settings"
                          className="flex items-center px-4 py-2 text-sm text-text hover:bg-background transition-colors arabic-text"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 ml-2" />
                          الإعدادات
                        </Link>

                        <div className="border-t border-border mt-2 pt-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false)
                              handleSignOut()
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error hover:text-white transition-colors arabic-text"
                          >
                            <LogOut className="w-4 h-4 ml-2" />
                            تسجيل الخروج
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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
                {/* Mobile Menu Button for non-logged users */}
                <div className="md:hidden">
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

      {/* Mobile Menu for Logged Users */}
      {session && isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            <div className="text-textSecondary arabic-text text-sm mb-3 font-medium">
              مرحباً، {user?.name || session.user?.name || 'مستخدم'}
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

            {user?.role === 'ADMIN' && (
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

            {/* Public Pages in Mobile */}
            <div className="border-t border-border pt-2 mt-2">
              <div className="text-textSecondary arabic-text text-xs mb-2 font-medium px-3">
                الصفحات العامة
              </div>

              <Link
                href="/about"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="w-4 h-4 ml-2" />
                عن المنصة
              </Link>

              <Link
                href="/community"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4 ml-2" />
                المجتمع
              </Link>

              <Link
                href="/partnerships"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Handshake className="w-4 h-4 ml-2" />
                الشراكات
              </Link>

              <Link
                href="/governance"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Vote className="w-4 h-4 ml-2" />
                الحوكمة
              </Link>

              <Link
                href="/roles"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Crown className="w-4 h-4 ml-2" />
                الأدوار
              </Link>

              <Link
                href="/communication"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                التواصل
              </Link>

              <Link
                href="/volunteer"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4 ml-2" />
                التطوع
              </Link>

              <Link
                href="/contact"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4 ml-2" />
                اتصل بنا
              </Link>
            </div>

            <div className="border-t border-border pt-2 mt-2">
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
        </div>
      )}

      {/* Mobile Menu for Non-Logged Users */}
      {!session && isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            <div className="text-textSecondary arabic-text text-sm mb-3 font-medium">
              الصفحات العامة
            </div>

            <Link
              href="/about"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="w-4 h-4 ml-2" />
              عن المنصة
            </Link>

            <Link
              href="/community"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-4 h-4 ml-2" />
              المجتمع
            </Link>

            <Link
              href="/partnerships"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Handshake className="w-4 h-4 ml-2" />
              الشراكات
            </Link>

            <Link
              href="/governance"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Vote className="w-4 h-4 ml-2" />
              الحوكمة
            </Link>

            <Link
              href="/roles"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Crown className="w-4 h-4 ml-2" />
              الأدوار
            </Link>

            <Link
              href="/communication"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageCircle className="w-4 h-4 ml-2" />
              التواصل
            </Link>

            <Link
              href="/volunteer"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Heart className="w-4 h-4 ml-2" />
              التطوع
            </Link>

            <Link
              href="/contact"
              className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-text arabic-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="w-4 h-4 ml-2" />
              اتصل بنا
            </Link>

            <div className="border-t border-border pt-2 mt-2">
              <Link
                href="/privacy"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-textSecondary arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4 ml-2" />
                سياسة الخصوصية
              </Link>

              <Link
                href="/terms"
                className="flex items-center w-full text-right py-2 px-3 rounded-lg hover:bg-background transition-colors text-textSecondary arabic-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4 ml-2" />
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
