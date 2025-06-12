import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Layout from "@/components/Layout"
import Link from "next/link"

export default async function NodesManagementPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // محاكاة بيانات العقد الموزعة
  const nodes = [
    {
      id: 'pilot-riyadh-001',
      name: 'عقدة الرياض التجريبية',
      region: 'الرياض، السعودية',
      status: 'active',
      users: 1250,
      courses: 45,
      revenue: 0, // مجاني
      culturalAdaptation: 95,
      aiPerformance: 88,
      lastSync: '2025-01-15T10:30:00Z'
    },
    {
      id: 'cairo-edu-hub',
      name: 'مركز القاهرة التعليمي',
      region: 'القاهرة، مصر',
      status: 'active',
      users: 2100,
      courses: 67,
      revenue: 0,
      culturalAdaptation: 92,
      aiPerformance: 85,
      lastSync: '2025-01-15T09:45:00Z'
    },
    {
      id: 'dubai-innovation',
      name: 'عقدة دبي للابتكار',
      region: 'دبي، الإمارات',
      status: 'pending',
      users: 0,
      courses: 0,
      revenue: 0,
      culturalAdaptation: 0,
      aiPerformance: 0,
      lastSync: null
    }
  ]

  const globalStats = {
    totalNodes: nodes.length,
    activeNodes: nodes.filter(n => n.status === 'active').length,
    totalUsers: nodes.reduce((sum, n) => sum + n.users, 0),
    totalCourses: nodes.reduce((sum, n) => sum + n.courses, 0),
    avgCulturalAdaptation: Math.round(
      nodes.filter(n => n.status === 'active')
           .reduce((sum, n) => sum + n.culturalAdaptation, 0) / 
      nodes.filter(n => n.status === 'active').length
    ),
    avgAIPerformance: Math.round(
      nodes.filter(n => n.status === 'active')
           .reduce((sum, n) => sum + n.aiPerformance, 0) / 
      nodes.filter(n => n.status === 'active').length
    )
  }

  return (
    <Layout title="إدارة العقد الموزعة" showBackButton={true} backUrl="/admin" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold arabic-text mb-2">
                  🌐 إدارة العقد الموزعة
                </h1>
                <p className="text-lg opacity-90 arabic-text">
                  مراقبة وإدارة شبكة فتح التعليمية العالمية
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🌍</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{globalStats.totalNodes}</div>
            <div className="text-sm text-textSecondary arabic-text">إجمالي العقد</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{globalStats.activeNodes}</div>
            <div className="text-sm text-textSecondary arabic-text">عقد نشطة</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{globalStats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-textSecondary arabic-text">إجمالي المستخدمين</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{globalStats.totalCourses}</div>
            <div className="text-sm text-textSecondary arabic-text">إجمالي الدورات</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600">{globalStats.avgCulturalAdaptation}%</div>
            <div className="text-sm text-textSecondary arabic-text">التكيف الثقافي</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{globalStats.avgAIPerformance}%</div>
            <div className="text-sm text-textSecondary arabic-text">أداء الذكاء الاصطناعي</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link href="/admin/nodes/new" className="btn btn-primary">
            ➕ إضافة عقدة جديدة
          </Link>
          <button className="btn btn-secondary">
            🔄 مزامنة جميع العقد
          </button>
          <button className="btn btn-accent">
            📊 تقرير شامل
          </button>
          <button className="btn btn-info">
            🌍 خريطة العقد العالمية
          </button>
        </div>

        {/* Nodes List */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-text arabic-text mb-6 flex items-center">
            <span className="ml-2">🌐</span>
            العقد المحلية
          </h3>
          
          <div className="space-y-4">
            {nodes.map((node) => (
              <div key={node.id} className="bg-surface rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-4 h-4 rounded-full ${
                      node.status === 'active' ? 'bg-green-400 animate-pulse' : 
                      node.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <h4 className="text-lg font-bold text-text arabic-text">{node.name}</h4>
                      <p className="text-sm text-textSecondary">{node.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      node.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      node.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {node.status === 'active' ? '🟢 نشطة' : 
                       node.status === 'pending' ? '🟡 قيد الانتظار' : '🔴 غير نشطة'}
                    </span>
                    <Link href={`/admin/nodes/${node.id}`} className="btn btn-sm btn-primary">
                      إدارة
                    </Link>
                  </div>
                </div>

                {node.status === 'active' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{node.users.toLocaleString()}</div>
                      <div className="text-xs text-textSecondary">مستخدم</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{node.courses}</div>
                      <div className="text-xs text-textSecondary">دورة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">مجاني</div>
                      <div className="text-xs text-textSecondary">النموذج</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-600">{node.culturalAdaptation}%</div>
                      <div className="text-xs text-textSecondary">تكيف ثقافي</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{node.aiPerformance}%</div>
                      <div className="text-xs text-textSecondary">أداء الذكاء الاصطناعي</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {node.lastSync ? new Date(node.lastSync).toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 'لم يتم'}
                      </div>
                      <div className="text-xs text-textSecondary">آخر مزامنة</div>
                    </div>
                  </div>
                )}

                {node.status === 'pending' && (
                  <div className="text-center py-4">
                    <p className="text-textSecondary arabic-text mb-4">
                      هذه العقدة في انتظار الموافقة والتفعيل
                    </p>
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <button className="btn btn-sm btn-success">✅ موافقة</button>
                      <button className="btn btn-sm btn-error">❌ رفض</button>
                      <button className="btn btn-sm btn-secondary">📋 مراجعة</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Network Health */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">💚</span>
              صحة الشبكة
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">اتصال الشبكة</span>
                <span className="text-green-600 font-medium">🟢 ممتاز</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">أداء المزامنة</span>
                <span className="text-green-600 font-medium">🟢 سريع</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">استقرار النظام</span>
                <span className="text-green-600 font-medium">🟢 مستقر</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">🚀</span>
              إجراءات سريعة
            </h3>
            <div className="space-y-2">
              <button className="btn btn-sm btn-primary w-full">🔄 مزامنة فورية</button>
              <button className="btn btn-sm btn-secondary w-full">📊 تحليل الأداء</button>
              <button className="btn btn-sm btn-accent w-full">🌍 عرض الخريطة</button>
              <button className="btn btn-sm btn-info w-full">📈 تقارير مفصلة</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
