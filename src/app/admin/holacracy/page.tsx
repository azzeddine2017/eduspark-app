import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Layout from "@/components/Layout"
import {
  Users,
  Circle as CircleIcon,
  Crown,
  Shield,
  Target,
  Plus,
  Edit,
  Eye,
  ArrowRight,
  Building,
  UserCheck,
  Award,
  TrendingUp,
  Globe
} from "lucide-react"

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

  const totalCircles = circles.length
  const totalRoles = roles.length
  const activeAssignments = roles.reduce((total, role) => total + role.assignments.filter(a => a.isActive).length, 0)
  const pendingDecisions = decisions.filter(d => d.status === 'PROPOSED').length

  return (
    <Layout title="نظام الهولاكراسي" showBackButton={true} backUrl="/admin" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold arabic-text mb-2">
                  🏛️ نظام الهولاكراسي
                </h1>
                <p className="text-lg opacity-90 arabic-text">
                  الإدارة المفتوحة والشفافة - توزيع المسؤوليات والسلطات بعدالة
                </p>
                <div className="mt-4 flex items-center space-x-4 space-x-reverse">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    🌍 نظام عالمي
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    🔄 تطوير مستمر
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{totalCircles}</div>
                <div className="text-sm opacity-90">دائرة نشطة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدوائر</p>
                <p className="text-3xl font-bold text-high-contrast">{totalCircles}</p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <CircleIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الأدوار</p>
                <p className="text-3xl font-bold text-high-contrast">{totalRoles}</p>
              </div>
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">التعيينات النشطة</p>
                <p className="text-3xl font-bold text-high-contrast">{activeAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">القرارات المعلقة</p>
                <p className="text-3xl font-bold text-high-contrast">{pendingDecisions}</p>
              </div>
              <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/holacracy/circles" className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                <CircleIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-high-contrast arabic-text text-sm">إدارة الدوائر</h3>
                <p className="text-xs text-medium-contrast arabic-text">تنظيم الهيكل التنظيمي</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/holacracy/roles" className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                <Crown className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-high-contrast arabic-text text-sm">إدارة الأدوار</h3>
                <p className="text-xs text-medium-contrast arabic-text">تحديد المسؤوليات</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/holacracy/assignments" className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                <UserCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-high-contrast arabic-text text-sm">تعيين الأدوار</h3>
                <p className="text-xs text-medium-contrast arabic-text">ربط الأشخاص بالأدوار</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/holacracy/decisions" className="card p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-warning bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                <Target className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-high-contrast arabic-text text-sm">اتخاذ القرارات</h3>
                <p className="text-xs text-medium-contrast arabic-text">عملية صنع القرار</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Circles */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-high-contrast arabic-text flex items-center">
                <CircleIcon className="w-5 h-5 ml-2" />
                الدوائر التنظيمية
              </h2>
              <Link href="/admin/holacracy/circles" className="text-primary hover:text-primary-dark transition-colors text-sm arabic-text">
                عرض الكل
              </Link>
            </div>

            <div className="space-y-4">
              {circles.slice(0, 5).map((circle) => (
                <div key={circle.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                      <CircleIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-high-contrast arabic-text">{circle.name}</h3>
                      <p className="text-xs text-medium-contrast arabic-text">
                        {circle.roles.length} دور • {circle.members.length} عضو
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-textSecondary" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Decisions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-high-contrast arabic-text flex items-center">
                <Target className="w-5 h-5 ml-2" />
                القرارات الأخيرة
              </h2>
              <Link href="/admin/holacracy/decisions" className="text-primary hover:text-primary-dark transition-colors text-sm arabic-text">
                عرض الكل
              </Link>
            </div>

            <div className="space-y-4">
              {decisions.slice(0, 5).map((decision) => (
                <div key={decision.id} className="p-3 bg-surface rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-high-contrast arabic-text text-sm">
                      {decision.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      decision.status === 'APPROVED' ? 'bg-success bg-opacity-20 text-success' :
                      decision.status === 'REJECTED' ? 'bg-error bg-opacity-20 text-error' :
                      'bg-warning bg-opacity-20 text-warning'
                    }`}>
                      {decision.status === 'APPROVED' ? 'موافق عليه' :
                       decision.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </div>
                  <p className="text-xs text-medium-contrast arabic-text">
                    بواسطة {decision.proposer.name} • {decision.circle?.name || 'عام'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Holacracy */}
        <div className="card p-8 bg-gradient-to-r from-info to-primary text-white">
          <div className="flex items-start">
            <Globe className="w-8 h-8 ml-4 mt-1 opacity-90" />
            <div>
              <h3 className="text-2xl font-bold arabic-text mb-4">ما هو نظام الهولاكراسي؟</h3>
              <p className="text-lg opacity-90 arabic-text mb-4">
                نظام إداري مبتكر يوزع السلطة والمسؤوليات بشكل عادل وشفاف، مما يضمن مشاركة جميع أعضاء المنظمة في اتخاذ القرارات.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm opacity-90 arabic-text">
                <div>• توزيع عادل للمسؤوليات</div>
                <div>• شفافية كاملة في اتخاذ القرارات</div>
                <div>• مشاركة جميع الأعضاء</div>
                <div>• تطوير مستمر للهيكل التنظيمي</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
