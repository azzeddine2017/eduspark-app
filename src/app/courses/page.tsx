import Link from "next/link"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ThemeToggle from "@/components/ThemeToggle"

export default async function CoursesPage() {
  const user = await getCurrentUser()

  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

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
              <Link href="/" className="text-2xl font-bold text-text arabic-text">
                منصة فتح للتعلّم الذكي
              </Link>
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
                    href="/"
                    className="btn btn-secondary"
                  >
                    الرئيسية
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-text arabic-text mb-4">
            🎓 الدورات التعليمية المجتمعية
          </h1>
          <p className="text-lg text-textSecondary arabic-text max-w-3xl mx-auto">
            اكتشف مجموعة واسعة من الدورات التعليمية المجانية المدعومة بالذكاء الاصطناعي
            <br />
            <span className="text-primary font-semibold">تعلم مهارات جديدة وطور نفسك مع مجتمعك</span>
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 bg-surface rounded-lg p-6 border border-border">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary">
              📚 جميع الدورات
            </button>
            <button className="btn btn-secondary">
              🔤 محو الأمية
            </button>
            <button className="btn btn-secondary">
              🛠️ مهارات حياتية
            </button>
            <button className="btn btn-secondary">
              💻 تقنية
            </button>
            <button className="btn btn-secondary">
              🎨 فنون وحرف
            </button>
            <button className="btn btn-secondary">
              💼 ريادة أعمال
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white text-6xl">📚</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      course.level === 'BEGINNER'
                        ? 'bg-success bg-opacity-20 text-success'
                        : course.level === 'INTERMEDIATE'
                        ? 'bg-warning bg-opacity-20 text-warning'
                        : 'bg-error bg-opacity-20 text-error'
                    }`}>
                      {course.level === 'BEGINNER' ? '🌱 مبتدئ' :
                       course.level === 'INTERMEDIATE' ? '🌿 متوسط' : '🌳 متقدم'}
                    </span>
                    <span className="text-sm text-textSecondary bg-surface px-2 py-1 rounded-full">
                      📖 {course._count.lessons} درس
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text arabic-text mb-3 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-textSecondary arabic-text mb-4 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center text-textSecondary">
                      <span className="ml-1">👨‍🏫</span>
                      <span className="arabic-text">{course.author.name}</span>
                    </div>
                    <div className="flex items-center text-textSecondary">
                      <span className="ml-1">👥</span>
                      <span>{course._count.enrollments} طالب</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="btn btn-primary w-full text-center"
                    >
                      🚀 ابدأ التعلم
                    </Link>
                    <div className="flex justify-between text-xs text-textSecondary">
                      <span>🆓 مجاني</span>
                      <span>🤖 مع مساعد ذكي</span>
                      <span>📱 متاح دائماً</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-surface rounded-2xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-text arabic-text mb-4">
                لا توجد دورات متاحة حالياً
              </h3>
              <p className="text-textSecondary arabic-text mb-6">
                نحن نعمل على إضافة دورات تعليمية مجانية عالية الجودة
              </p>
              <div className="space-y-2">
                <p className="text-sm text-primary">🔄 سيتم إضافة دورات جديدة قريباً</p>
                <p className="text-sm text-success">🤝 يمكنك التطوع لإنشاء محتوى</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold arabic-text mb-4">
            🌟 انضم لمجتمع التعلم
          </h3>
          <p className="text-lg mb-6 arabic-text opacity-90">
            كن جزءاً من مجتمع تعليمي يهدف لتطوير المهارات وبناء المستقبل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-primary hover:bg-gray-100">
              🚀 انضم كطالب
            </Link>
            <Link href="/volunteer" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
              🤝 تطوع كمعلم
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
