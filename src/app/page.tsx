import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import SimpleThemeToggle from "@/components/SimpleThemeToggle"
import AIAssistant from "@/components/AIAssistant"
import {
  Bot,
  BookOpen,
  Users,
  Wrench,
  Heart,
  Target,
  GraduationCap,
  BookMarked,
  LogIn,
  UserPlus,
  Settings,
  Rocket,
  Infinity,
  Clock,
  CheckCircle,
  Handshake,
  Vote,
  Crown,
  MessageCircle,
  Globe,
  ArrowRight
} from "lucide-react"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center ml-3">
                <span className="text-white font-bold text-xl">ف</span>
              </div>
              <h1 className="text-2xl font-bold text-text arabic-text">
                منصة فتح للتعلّم الذكي
              </h1>
            </div>
            <nav className="flex items-center space-x-4 space-x-reverse">
              <SimpleThemeToggle />
              {user ? (
                <>
                  <span className="text-textSecondary arabic-text">
                    مرحباً، {user.name}
                  </span>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="btn btn-primary flex items-center"
                    >
                      <Settings className="w-4 h-4 ml-2" />
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    href="/courses"
                    className="btn btn-secondary flex items-center"
                  >
                    <BookOpen className="w-4 h-4 ml-2" />
                    الدورات
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="nav-link arabic-text flex items-center"
                  >
                    <LogIn className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary flex items-center"
                  >
                    <UserPlus className="w-4 h-4 ml-2" />
                    إنشاء حساب
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-fadeIn">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              🌟 مدرسة المجتمع الذكية
            </span>
          </div>
          <h2 className="text-4xl font-bold text-high-contrast sm:text-5xl md:text-6xl arabic-text">
            افتح آفاق التعلّم مع
            <span className="text-primary block mt-2"> منصة فتح</span>
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-medium-contrast arabic-text leading-relaxed">
            منصة تعليمية ذكية مجانية تفتح لك أبواب المعرفة بتقنيات الذكاء الاصطناعي المتطورة
            <br />
            <span className="text-primary font-semibold">تعليم للجميع - لا أحد يُترك خلف الركب</span>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/courses" : "/auth/register"}
              className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              {user ? (
                <>
                  <GraduationCap className="w-5 h-5 ml-2" />
                  تصفح الدورات
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 ml-2" />
                  ابدأ التعلم الآن
                </>
              )}
            </Link>
            <Link
              href="/about"
              className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center"
            >
              <BookMarked className="w-5 h-5 ml-2" />
              تعرف على المنصة
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-high-contrast arabic-text mb-4">
              ميزات منصة فتح المجتمعية
            </h3>
            <p className="text-medium-contrast arabic-text max-w-2xl mx-auto">
              تعلم مجاني عالي الجودة مع تقنيات الذكاء الاصطناعي المتطورة
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    مساعد ذكي متطور
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    احصل على إجابات فورية لأسئلتك من مساعد ذكي يدعم اللغة العربية بتقنية Gemini
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    تعليم مجتمعي شامل
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    برامج تعليمية للجميع: الأطفال، الشباب، الأسر، وكبار السن
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    إدارة مفتوحة (هولاكراسي)
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    نظام إداري شفاف يشرك المجتمع في اتخاذ القرارات
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    مهارات حياتية عملية
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    تعلم الطبخ، الحرف، الإدارة المالية، والمهارات التقنية
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    مجتمع متطوعين
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    انضم كمتطوع أو استفد من خبرات المتطوعين في مجتمعك
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-high-contrast arabic-text mb-2">
                    تعلم مخصص
                  </h3>
                  <p className="text-medium-contrast arabic-text leading-relaxed">
                    مسارات تعليمية مخصصة حسب احتياجاتك ومستواك
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Distributed Platform Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              🌐 جديد: منصة فتح الموزعة
            </span>
            <h3 className="text-3xl font-bold text-high-contrast arabic-text mb-4">
              شبكة عالمية موزعة للتعليم
            </h3>
            <p className="text-medium-contrast arabic-text max-w-3xl mx-auto">
              انضم لثورة التعليم العالمية مع نظام الحوكمة الموزعة والشراكات المحلية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/partnerships" className="card p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-2 group-hover:text-primary transition-colors">
                    الشراكات العالمية
                  </h3>
                  <p className="text-medium-contrast arabic-text text-sm leading-relaxed">
                    كن شريكاً محلياً وأطلق عقدتك التعليمية
                  </p>
                  <div className="mt-3 flex items-center text-primary text-sm font-medium">
                    اكتشف الفرص
                    <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/governance" className="card p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Vote className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-2 group-hover:text-primary transition-colors">
                    الحوكمة الديمقراطية
                  </h3>
                  <p className="text-medium-contrast arabic-text text-sm leading-relaxed">
                    شارك في صنع القرارات المهمة للمنصة
                  </p>
                  <div className="mt-3 flex items-center text-primary text-sm font-medium">
                    شارك في التصويت
                    <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/roles" className="card p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-2 group-hover:text-primary transition-colors">
                    الأدوار الموزعة
                  </h3>
                  <p className="text-medium-contrast arabic-text text-sm leading-relaxed">
                    اكتشف الفرص المهنية في الشبكة العالمية
                  </p>
                  <div className="mt-3 flex items-center text-primary text-sm font-medium">
                    استكشف الأدوار
                    <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/communication" className="card p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-2 group-hover:text-primary transition-colors">
                    منصة التواصل
                  </h3>
                  <p className="text-medium-contrast arabic-text text-sm leading-relaxed">
                    تواصل مع الشبكة العالمية بـ 20+ لغة
                  </p>
                  <div className="mt-3 flex items-center text-primary text-sm font-medium">
                    ابدأ التواصل
                    <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Community Impact Section */}
        <div className="mt-20 bg-surface rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-high-contrast arabic-text mb-6">
              أثر مجتمعي حقيقي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-medium-contrast arabic-text font-medium">مجاني للجميع</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-12 h-12 text-success" />
                </div>
                <div className="text-4xl font-bold text-success mb-2">24/7</div>
                <div className="text-medium-contrast arabic-text font-medium">متاح دائماً</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Infinity className="w-12 h-12 text-accent" />
                </div>
                <div className="text-4xl font-bold text-accent mb-2">∞</div>
                <div className="text-medium-contrast arabic-text font-medium">إمكانيات لا محدودة</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant context="الصفحة الرئيسية لمنصة فتح للتعلّم الذكي" />
    </div>
  )
}
