import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function HolacracyPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // Get holacracy data
  const [circles, roles, decisions] = await Promise.all([
    prisma.circle.findMany({
      include: {
        parent: true,
        children: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        roles: {
          include: {
            assignments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.role.findMany({
      include: {
        circle: true,
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        accountabilities: true,
      }
    }),
    prisma.decision.findMany({
      include: {
        proposer: {
          select: {
            id: true,
            name: true,
          }
        },
        circle: true,
        objections: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
  ])

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
                نظام الهولاكراسي
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
            نظام الهولاكراسي - الإدارة المفتوحة
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            نظام إداري مبتكر يعتمد على الأدوار والدوائر المستقلة والقرارات الشفافة
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">⭕</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      الدوائر النشطة
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {circles.filter(c => c.isActive).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">👤</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      الأدوار النشطة
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {roles.filter(r => r.isActive).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">🤝</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      التعيينات النشطة
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {roles.reduce((total, role) => total + role.assignments.filter(a => a.isActive).length, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">📋</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      القرارات المقترحة
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {decisions.filter(d => d.status === 'PROPOSED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circles Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              الدوائر التنظيمية
            </h3>
            <div className="space-y-4">
              {circles.map((circle) => (
                <div key={circle.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {circle.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      circle.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {circle.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {circle.purpose}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{circle.roles.length} أدوار</span>
                    <span className="mx-2">•</span>
                    <span>{circle.members.length} أعضاء</span>
                    {circle.children.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{circle.children.length} دوائر فرعية</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              القرارات الأخيرة
            </h3>
            <div className="space-y-4">
              {decisions.slice(0, 5).map((decision) => (
                <div key={decision.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {decision.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      decision.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800'
                        : decision.status === 'PROPOSED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : decision.status === 'OBJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {decision.status === 'PROPOSED' ? 'مقترح' :
                       decision.status === 'APPROVED' ? 'موافق عليه' :
                       decision.status === 'OBJECTED' ? 'معترض عليه' :
                       decision.status === 'IMPLEMENTED' ? 'منفذ' : 'مرفوض'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    بواسطة {decision.proposer.name} • {decision.circle?.name || 'عام'}
                  </p>
                  {decision.objections.length > 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      {decision.objections.length} اعتراض
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            إجراءات الهولاكراسي
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/holacracy/circles"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              إدارة الدوائر
            </Link>
            <Link
              href="/admin/holacracy/roles"
              className="bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors text-center"
            >
              إدارة الأدوار
            </Link>
            <Link
              href="/admin/holacracy/decisions"
              className="bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors text-center"
            >
              إدارة القرارات
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
