import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  Mail,
  Calendar,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  XCircle
} from "lucide-react"

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get users with pagination
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          enrollments: true,
          authoredCourses: true
        }
      }
    }
  })

  const totalUsers = await prisma.user.count()
  const activeUsers = await prisma.user.count({ where: { isActive: true } })
  const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } })
  const studentUsers = await prisma.user.count({ where: { role: 'STUDENT' } })

  return (
    <Layout title="إدارة المستخدمين" showBackButton={true} backUrl="/admin" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-high-contrast arabic-text">
                إدارة المستخدمين
              </h1>
              <p className="text-medium-contrast arabic-text mt-2">
                إدارة حسابات المستخدمين وصلاحياتهم
              </p>
            </div>
            <Link
              href="/admin/users/new"
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة مستخدم
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">إجمالي المستخدمين</p>
                <p className="text-3xl font-bold text-high-contrast">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">المستخدمون النشطون</p>
                <p className="text-3xl font-bold text-high-contrast">{activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">المديرون</p>
                <p className="text-3xl font-bold text-high-contrast">{adminUsers}</p>
              </div>
              <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الطلاب</p>
                <p className="text-3xl font-bold text-high-contrast">{studentUsers}</p>
              </div>
              <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-info" />
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
                placeholder="البحث عن مستخدم..."
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2">
              <select className="input w-auto">
                <option>جميع الأدوار</option>
                <option>مدير</option>
                <option>طالب</option>
                <option>مدرس</option>
              </select>
              <select className="input w-auto">
                <option>جميع الحالات</option>
                <option>نشط</option>
                <option>غير نشط</option>
              </select>
              <button className="btn btn-outline flex items-center">
                <Filter className="w-4 h-4 ml-2" />
                تصفية
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="arabic-text">المستخدم</th>
                  <th className="arabic-text">الدور</th>
                  <th className="arabic-text">الحالة</th>
                  <th className="arabic-text">الدورات</th>
                  <th className="arabic-text">تاريخ التسجيل</th>
                  <th className="arabic-text">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold ml-3">
                          {userData.name?.charAt(0) || 'م'}
                        </div>
                        <div>
                          <div className="font-medium text-text arabic-text">
                            {userData.name}
                          </div>
                          <div className="text-sm text-textSecondary">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        userData.role === 'ADMIN'
                          ? 'bg-error bg-opacity-20 text-error'
                          : userData.role === 'INSTRUCTOR'
                          ? 'bg-warning bg-opacity-20 text-warning'
                          : 'bg-primary bg-opacity-20 text-primary'
                      }`}>
                        {userData.role === 'ADMIN' ? '🔑 مدير' : 
                         userData.role === 'INSTRUCTOR' ? '👨‍🏫 مدرس' : '👨‍🎓 طالب'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        userData.isActive
                          ? 'bg-success bg-opacity-20 text-success'
                          : 'bg-error bg-opacity-20 text-error'
                      }`}>
                        {userData.isActive ? '✅ نشط' : '❌ غير نشط'}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm text-textSecondary">
                        {userData.role === 'STUDENT' 
                          ? `${userData._count.enrollments} مسجل`
                          : `${userData._count.authoredCourses} منشئ`
                        }
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-textSecondary">
                        {new Date(userData.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Link
                          href={`/admin/users/${userData.id}`}
                          className="p-2 text-textSecondary hover:text-primary transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/users/${userData.id}/edit`}
                          className="p-2 text-textSecondary hover:text-warning transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-textSecondary hover:text-error transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 text-textSecondary">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium text-text arabic-text mb-2">
                لا يوجد مستخدمون
              </h4>
              <p className="arabic-text">ابدأ بإضافة أول مستخدم</p>
              <Link href="/admin/users/new" className="btn btn-primary mt-4 inline-flex">
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستخدم
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="btn btn-outline">السابق</button>
              <span className="px-4 py-2 text-sm text-textSecondary arabic-text">
                صفحة 1 من 1
              </span>
              <button className="btn btn-outline">التالي</button>
            </div>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white mt-8">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">قريباً - إدارة متقدمة للمستخدمين</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            نعمل على تطوير أدوات إدارة متقدمة للمستخدمين مع إمكانيات تحرير وإدارة شاملة
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
