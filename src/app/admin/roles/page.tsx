import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { HOLACRACY_ROLES, getRoleDescription } from "@/lib/permissions"
import RoleAssignmentForm from "@/components/admin/RoleAssignmentForm"
import { UserRole } from "@prisma/client"

export default async function RolesManagementPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // جلب جميع المستخدمين مع أدوارهم
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // إحصائيات الأدوار
  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/admin" className="text-2xl font-bold text-gray-900 dark:text-white">
                منصة فتح
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-xl font-medium text-indigo-600">
                إدارة الأدوار والصلاحيات
              </span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-700 dark:text-gray-300">
                مرحباً، {user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة الأدوار والصلاحيات
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            تعيين الأدوار للمستخدمين وإدارة الصلاحيات حسب نظام الهولاكراسي
          </p>
        </div>

        {/* Role Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {Object.entries(roleStats).map(([role, count]) => {
            const roleInfo = getRoleDescription(role as UserRole)
            return (
              <div key={role} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {count}
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {roleInfo?.name || role}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Role Descriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              أوصاف الأدوار في النظام
            </h3>
            <div className="space-y-4">
              {Object.entries(HOLACRACY_ROLES).map(([roleKey, roleInfo]) => (
                <div key={roleKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {roleInfo.name}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {roleInfo.circle}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {roleInfo.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>المسؤوليات:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {roleInfo.responsibilities.slice(0, 2).map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                      {roleInfo.responsibilities.length > 2 && (
                        <li>و {roleInfo.responsibilities.length - 2} مسؤوليات أخرى...</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              المستخدمون وأدوارهم
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => {
                const roleInfo = getRoleDescription(user.role)
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <div className="mr-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-red-100 text-red-800'
                              : user.role === 'STUDENT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {roleInfo?.name || user.role}
                          </span>
                        </div>
                        <div>
                          <span className={`w-2 h-2 rounded-full ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Role Assignment Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            تعيين دور جديد للمستخدم
          </h3>
          <RoleAssignmentForm users={users} />
        </div>

        {/* Admin Note */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ملاحظة مهمة للمدير
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <ul className="list-disc list-inside space-y-1">
                  <li>أنت كمدير عام لك صلاحية كاملة على جميع أجزاء النظام</li>
                  <li>نظام الهولاكراسي يساعد في تنظيم المهام وتوزيع المسؤوليات</li>
                  <li>يمكنك تغيير أدوار المستخدمين في أي وقت</li>
                  <li>جميع القرارات النهائية تحتاج موافقتك</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
