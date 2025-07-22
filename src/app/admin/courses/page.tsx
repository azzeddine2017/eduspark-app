import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"
import CourseActions from "@/components/admin/CourseActions"
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

export default async function AdminCoursesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get courses with related data
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          lessons: true
        }
      }
    }
  })

  const totalCourses = await prisma.course.count()
  const publishedCourses = await prisma.course.count({ where: { isPublished: true } })
  const draftCourses = await prisma.course.count({ where: { isPublished: false } })
  const totalEnrollments = await prisma.enrollment.count()

  return (
    <Layout title="إدارة الدورات" showBackButton={true} backUrl="/admin" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-high-contrast arabic-text">
                إدارة الدورات
              </h1>
              <p className="text-medium-contrast arabic-text mt-2">
                إدارة المحتوى التعليمي والدورات المتاحة
              </p>
            </div>
            <Link
              href="/admin/courses/new"
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إنشاء دورة جديدة
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">إجمالي الدورات</p>
                <p className="text-3xl font-bold text-high-contrast">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدورات المنشورة</p>
                <p className="text-3xl font-bold text-high-contrast">{publishedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">المسودات</p>
                <p className="text-3xl font-bold text-high-contrast">{draftCourses}</p>
              </div>
              <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">إجمالي التسجيلات</p>
                <p className="text-3xl font-bold text-high-contrast">{totalEnrollments}</p>
              </div>
              <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن دورة..."
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2">
              <select className="input w-auto">
                <option>جميع الحالات</option>
                <option>منشورة</option>
                <option>مسودة</option>
              </select>
              <select className="input w-auto">
                <option>جميع المستويات</option>
                <option>مبتدئ</option>
                <option>متوسط</option>
                <option>متقدم</option>
              </select>
              <button className="btn btn-outline flex items-center">
                <Filter className="w-4 h-4 ml-2" />
                تصفية
              </button>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="arabic-text">الدورة</th>
                  <th className="arabic-text">المؤلف</th>
                  <th className="arabic-text">الدروس</th>
                  <th className="arabic-text">التسجيلات</th>
                  <th className="arabic-text">الحالة</th>
                  <th className="arabic-text">تاريخ الإنشاء</th>
                  <th className="arabic-text">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-text arabic-text">
                            {course.title}
                          </div>
                          <div className="text-sm text-textSecondary arabic-text">
                            {course.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium text-text arabic-text">
                          {course.author.name}
                        </div>
                        <div className="text-textSecondary">
                          {course.author.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-textSecondary ml-1" />
                        <span className="text-sm text-textSecondary">
                          {course._count.lessons} درس
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-textSecondary ml-1" />
                        <span className="text-sm text-textSecondary">
                          {course._count.enrollments} طالب
                        </span>
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
                    <td>
                      <div className="text-sm text-textSecondary">
                        {new Date(course.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <CourseActions
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12 text-textSecondary">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium text-text arabic-text mb-2">
                لا توجد دورات
              </h4>
              <p className="arabic-text">ابدأ بإنشاء أول دورة تعليمية</p>
              <Link href="/admin/courses/new" className="btn btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4 ml-2" />
                إنشاء دورة جديدة
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/courses/new" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center ml-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-high-contrast arabic-text">إنشاء دورة جديدة</h3>
                <p className="text-sm text-medium-contrast arabic-text">ابدأ في إنشاء محتوى تعليمي جديد</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/courses/categories" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center ml-4">
                <Filter className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-high-contrast arabic-text">إدارة التصنيفات</h3>
                <p className="text-sm text-medium-contrast arabic-text">تنظيم الدورات في تصنيفات</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/analytics/courses" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-info bg-opacity-20 rounded-lg flex items-center justify-center ml-4">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
              <div>
                <h3 className="font-bold text-high-contrast arabic-text">تحليلات الدورات</h3>
                <p className="text-sm text-medium-contrast arabic-text">إحصائيات وتقارير مفصلة</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon Notice */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white mt-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">قريباً - أدوات إدارة متقدمة</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            نعمل على تطوير أدوات إدارة متقدمة للدورات مع إمكانيات تحرير شاملة ونظام موافقات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/contact"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
            >
              اقترح ميزة
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
