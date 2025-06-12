import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import Layout from "@/components/Layout"
import Link from "next/link"

export default async function AIManagementPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  // محاكاة بيانات الذكاء الاصطناعي
  const aiStats = {
    totalQueries: 125430,
    dailyQueries: 3240,
    averageResponseTime: 1.2,
    satisfactionRate: 94,
    activeModels: 3,
    supportedLanguages: 25,
    culturalAdaptations: 15,
    nodesCovered: 12
  }

  const models = [
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      status: 'active',
      usage: 85,
      performance: 92,
      cost: 'متوسط',
      specialization: 'عام'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      status: 'active',
      usage: 65,
      performance: 89,
      cost: 'عالي',
      specialization: 'تحليل النصوص'
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      status: 'standby',
      usage: 0,
      performance: 95,
      cost: 'عالي جداً',
      specialization: 'إبداعي'
    }
  ]

  const culturalAdaptations = [
    { region: 'الخليج العربي', accuracy: 96, queries: 45000 },
    { region: 'بلاد الشام', accuracy: 94, queries: 32000 },
    { region: 'شمال أفريقيا', accuracy: 91, queries: 28000 },
    { region: 'مصر', accuracy: 93, queries: 20000 }
  ]

  return (
    <Layout title="إدارة الذكاء الاصطناعي" showBackButton={true} backUrl="/admin" showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold arabic-text mb-2">
                  🤖 إدارة الذكاء الاصطناعي
                </h1>
                <p className="text-lg opacity-90 arabic-text">
                  مراقبة وتحسين أداء المساعد الذكي المخصص ثقافياً
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🧠</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{aiStats.totalQueries.toLocaleString()}</div>
            <div className="text-sm text-textSecondary arabic-text">إجمالي الاستفسارات</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{aiStats.dailyQueries.toLocaleString()}</div>
            <div className="text-sm text-textSecondary arabic-text">استفسارات يومية</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{aiStats.averageResponseTime}ث</div>
            <div className="text-sm text-textSecondary arabic-text">متوسط وقت الاستجابة</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{aiStats.satisfactionRate}%</div>
            <div className="text-sm text-textSecondary arabic-text">معدل الرضا</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="btn btn-primary">
            🔧 تحسين النماذج
          </button>
          <button className="btn btn-secondary">
            📊 تحليل الأداء
          </button>
          <button className="btn btn-accent">
            🌍 إعدادات ثقافية
          </button>
          <button className="btn btn-info">
            🔄 إعادة تدريب
          </button>
        </div>

        {/* AI Models */}
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-bold text-text arabic-text mb-6 flex items-center">
            <span className="ml-2">🤖</span>
            نماذج الذكاء الاصطناعي
          </h3>
          
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="bg-surface rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-4 h-4 rounded-full ${
                      model.status === 'active' ? 'bg-green-400 animate-pulse' : 
                      model.status === 'standby' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <h4 className="text-lg font-bold text-text">{model.name}</h4>
                      <p className="text-sm text-textSecondary">{model.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      model.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      model.status === 'standby' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {model.status === 'active' ? '🟢 نشط' : 
                       model.status === 'standby' ? '🟡 احتياطي' : '🔴 متوقف'}
                    </span>
                    <button className="btn btn-sm btn-primary">
                      إعدادات
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{model.usage}%</div>
                    <div className="text-xs text-textSecondary">معدل الاستخدام</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{model.performance}%</div>
                    <div className="text-xs text-textSecondary">الأداء</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{model.cost}</div>
                    <div className="text-xs text-textSecondary">التكلفة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{model.specialization}</div>
                    <div className="text-xs text-textSecondary">التخصص</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Adaptations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">🌍</span>
              التكيف الثقافي
            </h3>
            <div className="space-y-4">
              {culturalAdaptations.map((adaptation, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text arabic-text">{adaptation.region}</div>
                    <div className="text-sm text-textSecondary">{adaptation.queries.toLocaleString()} استفسار</div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${adaptation.accuracy}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">{adaptation.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">📈</span>
              مؤشرات الأداء
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">دقة الإجابات</span>
                <span className="text-green-600 font-medium">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">سرعة الاستجابة</span>
                <span className="text-blue-600 font-medium">1.2 ثانية</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">التوفر</span>
                <span className="text-green-600 font-medium">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">معدل الأخطاء</span>
                <span className="text-orange-600 font-medium">0.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">💚</span>
              صحة النظام
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">حالة الخوادم</span>
                <span className="text-green-600 font-medium">🟢 ممتاز</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">استهلاك الذاكرة</span>
                <span className="text-blue-600 font-medium">🟢 طبيعي</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary">معدل المعالجة</span>
                <span className="text-green-600 font-medium">🟢 سريع</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">🔧</span>
              إعدادات متقدمة
            </h3>
            <div className="space-y-2">
              <button className="btn btn-sm btn-primary w-full">⚙️ إعدادات النماذج</button>
              <button className="btn btn-sm btn-secondary w-full">🌍 إعدادات ثقافية</button>
              <button className="btn btn-sm btn-accent w-full">🔄 إعادة تدريب</button>
              <button className="btn btn-sm btn-info w-full">📊 تحليل متقدم</button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-text arabic-text mb-4 flex items-center">
              <span className="ml-2">🚨</span>
              التنبيهات
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-800 dark:text-green-200">
                  ✅ جميع النماذج تعمل بكفاءة عالية
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ تحديث متوفر لنموذج Gemini Pro
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
