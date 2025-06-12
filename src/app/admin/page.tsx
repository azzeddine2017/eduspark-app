import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get dashboard statistics
  const [
    totalUsers,
    totalCourses,
    totalLessons,
    totalEnrollments,
    recentUsers,
    recentCourses
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.enrollment.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    })
  ])

  return (
    <Layout title="لوحة التحكم الإدارية" showBackButton={true} backUrl="/" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold arabic-text mb-2">
                  🌐 مرحباً بك في لوحة التحكم الموزعة
                </h1>
                <p className="text-lg opacity-90 arabic-text">
                  إدارة منصة فتح الموزعة العالمية - شبكة التعليم الذكي
                </p>
                <div className="mt-4 flex items-center space-x-4 space-x-reverse">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    👤 {user.name}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    🌐 مدير العقدة المحلية
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">👥</span>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-text">
                  {totalUsers}
                </div>
                <div className="text-sm text-textSecondary arabic-text">
                  إجمالي المستخدمين
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📚</span>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-text">
                  {totalCourses}
                </div>
                <div className="text-sm text-textSecondary arabic-text">
                  إجمالي الدورات
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📖</span>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-text">
                  {totalLessons}
                </div>
                <div className="text-sm text-textSecondary arabic-text">
                  إجمالي الدروس
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🎓</span>
                </div>
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-text">
                  {totalEnrollments}
                </div>
                <div className="text-sm text-textSecondary arabic-text">
                  إجمالي التسجيلات
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-text arabic-text mb-6 flex items-center">
              <span className="ml-2">⚡</span>
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/admin/courses/new"
                className="btn btn-primary text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">➕</span>
                إنشاء دورة جديدة
              </Link>
              <Link
                href="/admin/users"
                className="btn btn-secondary text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">👥</span>
                إدارة المستخدمين
              </Link>
              <Link
                href="/admin/courses"
                className="btn btn-secondary text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">📚</span>
                إدارة الدورات
              </Link>
              <Link
                href="/admin/roles"
                className="btn btn-secondary text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">🎭</span>
                إدارة الأدوار
              </Link>
              <Link
                href="/admin/holacracy"
                className="btn btn-secondary text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">🏛️</span>
                نظام الهولاكراسي
              </Link>
              <Link
                href="/admin/nodes"
                className="btn btn-accent text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">🌐</span>
                إدارة العقد الموزعة
              </Link>
              <Link
                href="/admin/ai"
                className="btn btn-info text-center py-3 flex items-center justify-center"
              >
                <span className="ml-2">🤖</span>
                إدارة الذكاء الاصطناعي
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-text arabic-text mb-6 flex items-center">
              <span className="ml-2">👋</span>
              المستخدمون الجدد
            </h3>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold ml-3">
                      {user.name?.charAt(0) || 'م'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text arabic-text">
                        {user.name}
                      </p>
                      <p className="text-xs text-textSecondary">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    user.role === 'ADMIN'
                      ? 'bg-error bg-opacity-20 text-error'
                      : 'bg-primary bg-opacity-20 text-primary'
                  }`}>
                    {user.role === 'ADMIN' ? '🔑 مسؤول' : '👨‍🎓 طالب'}
                  </span>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <div className="text-center py-8 text-textSecondary">
                  <span className="text-4xl block mb-2">👥</span>
                  لا يوجد مستخدمون جدد
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-text arabic-text mb-6 flex items-center">
            <span className="ml-2">📚</span>
            الدورات الحديثة
          </h3>
          {recentCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="arabic-text">الدورة</th>
                    <th className="arabic-text">المؤلف</th>
                    <th className="arabic-text">التسجيلات</th>
                    <th className="arabic-text">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="font-medium text-text arabic-text">
                          {course.title}
                        </div>
                      </td>
                      <td>
                        <div className="text-textSecondary arabic-text">
                          {course.author.name}
                        </div>
                      </td>
                      <td>
                        <div className="text-textSecondary">
                          {course._count.enrollments} طالب
                        </div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          course.isPublished
                            ? 'bg-success bg-opacity-20 text-success'
                            : 'bg-warning bg-opacity-20 text-warning'
                        }`}>
                          {course.isPublished ? '✅ منشورة' : '⏳ مسودة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-textSecondary">
              <span className="text-6xl block mb-4">📚</span>
              <h4 className="text-lg font-medium text-text arabic-text mb-2">
                لا توجد دورات حديثة
              </h4>
              <p className="arabic-text">ابدأ بإنشاء أول دورة تعليمية</p>
              <Link href="/admin/courses/new" className="btn btn-primary mt-4 inline-flex">
                ➕ إنشاء دورة جديدة
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
