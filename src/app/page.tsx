import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import ThemeToggle from "@/components/ThemeToggle"
import AIAssistant from "@/components/AIAssistant"

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
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-textSecondary arabic-text">
                    مرحباً، {user.name}
                  </span>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="btn btn-primary"
                    >
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    href="/courses"
                    className="btn btn-secondary"
                  >
                    الدورات
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="nav-link arabic-text"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary"
                  >
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
          <h2 className="text-4xl font-bold text-text sm:text-5xl md:text-6xl arabic-text">
            افتح آفاق التعلّم مع
            <span className="text-primary block mt-2"> منصة فتح</span>
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-textSecondary arabic-text leading-relaxed">
            منصة تعليمية ذكية مجانية تفتح لك أبواب المعرفة بتقنيات الذكاء الاصطناعي المتطورة
            <br />
            <span className="text-primary font-semibold">تعليم للجميع - لا أحد يُترك خلف الركب</span>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/courses" : "/auth/register"}
              className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {user ? "🎓 تصفح الدورات" : "🚀 ابدأ التعلم الآن"}
            </Link>
            <Link
              href="/about"
              className="btn btn-secondary text-lg px-8 py-4"
            >
              📖 تعرف على المنصة
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-text arabic-text mb-4">
              ميزات منصة فتح المجتمعية
            </h3>
            <p className="text-textSecondary arabic-text max-w-2xl mx-auto">
              تعلم مجاني عالي الجودة مع تقنيات الذكاء الاصطناعي المتطورة
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🤖</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    مساعد ذكي متطور
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    احصل على إجابات فورية لأسئلتك من مساعد ذكي يدعم اللغة العربية بتقنية Gemini
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">📚</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    تعليم مجتمعي شامل
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    برامج تعليمية للجميع: الأطفال، الشباب، الأسر، وكبار السن
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🏛️</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    إدارة مفتوحة (هولاكراسي)
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    نظام إداري شفاف يشرك المجتمع في اتخاذ القرارات
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🛠️</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    مهارات حياتية عملية
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    تعلم الطبخ، الحرف، الإدارة المالية، والمهارات التقنية
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-info rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">👥</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    مجتمع متطوعين
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    انضم كمتطوع أو استفد من خبرات المتطوعين في مجتمعك
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-error rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                </div>
                <div className="mr-4">
                  <h3 className="text-xl font-semibold text-text arabic-text mb-2">
                    تعلم مخصص
                  </h3>
                  <p className="text-textSecondary arabic-text leading-relaxed">
                    مسارات تعليمية مخصصة حسب احتياجاتك ومستواك
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact Section */}
        <div className="mt-20 bg-surface rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-text arabic-text mb-6">
              أثر مجتمعي حقيقي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-textSecondary arabic-text">مجاني للجميع</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-success mb-2">24/7</div>
                <div className="text-textSecondary arabic-text">متاح دائماً</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">∞</div>
                <div className="text-textSecondary arabic-text">إمكانيات لا محدودة</div>
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
