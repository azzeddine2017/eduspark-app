'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Brain,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import StatCard from './StatCard'
import LineChart from './charts/LineChart'
import BarChart from './charts/BarChart'
import PieChart from './charts/PieChart'
import AreaChart from './charts/AreaChart'

// واجهة بيانات التحليلات
interface AnalyticsData {
  summary: {
    totalUsers: number
    activeUsers: number
    totalCourses: number
    totalLessons: number
    totalEnrollments: number
    growthRate: number
  }
  trends: {
    userGrowth: Array<{
      date: string
      total: number
      active: number
      new: number
    }>
    courseActivity: Array<{
      date: string
      enrollments: number
      lessonsCompleted: number
      quizzesCompleted: number
    }>
    aiUsage: Array<{
      date: string
      interactions: number
      tokens: number
    }>
  }
  events: {
    total: number
    byType: Record<string, number>
  }
  pages: {
    topPages: Array<{
      url: string
      views: number
    }>
  }
}

/**
 * مكون لوحة التحليلات الرئيسية
 */
export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7') // آخر 7 أيام افتراضياً
  const [refreshing, setRefreshing] = useState(false)

  // جلب بيانات التحليلات
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${period}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('خطأ في جلب التحليلات:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // تحديث البيانات
  const refreshData = async () => {
    setRefreshing(true)
    await fetchAnalytics()
  }

  // تحديث البيانات عند تغيير الفترة
  useEffect(() => {
    setLoading(true)
    fetchAnalytics()
  }, [period])

  // تحديث البيانات عند تحميل المكون
  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري تحميل التحليلات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* شريط التحكم */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4 space-x-reverse mb-4 sm:mb-0">
          {/* فلتر الفترة الزمنية */}
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 ml-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          {/* زر التحديث */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
            تحديث
          </button>

          {/* زر التصدير */}
          <button className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* بطاقات الإحصائيات الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="إجمالي المستخدمين"
              value={data.summary.totalUsers}
              icon={<Users className="h-8 w-8" />}
              trend={{
                value: data.summary.growthRate,
                isPositive: true,
                label: 'نمو'
              }}
              color="blue"
            />
            
            <StatCard
              title="المستخدمين النشطين"
              value={data.summary.activeUsers}
              icon={<TrendingUp className="h-8 w-8" />}
              description={`من أصل ${data.summary.totalUsers} مستخدم`}
              color="green"
            />
            
            <StatCard
              title="إجمالي الدورات"
              value={data.summary.totalCourses}
              icon={<BookOpen className="h-8 w-8" />}
              description="دورة منشورة"
              color="purple"
            />
            
            <StatCard
              title="إجمالي التسجيلات"
              value={data.summary.totalEnrollments}
              icon={<GraduationCap className="h-8 w-8" />}
              description="تسجيل في الدورات"
              color="yellow"
            />
          </div>

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* نمو المستخدمين */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نمو المستخدمين</h3>
              <LineChart
                data={data.trends.userGrowth.map(item => ({
                  name: item.date,
                  إجمالي: item.total,
                  نشط: item.active,
                  جديد: item.new
                }))}
                lines={[
                  { dataKey: 'إجمالي', stroke: '#3b82f6', name: 'إجمالي المستخدمين' },
                  { dataKey: 'نشط', stroke: '#10b981', name: 'المستخدمين النشطين' },
                  { dataKey: 'جديد', stroke: '#f59e0b', name: 'مستخدمين جدد' }
                ]}
                height={300}
              />
            </div>

            {/* نشاط الدورات */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نشاط الدورات</h3>
              <AreaChart
                data={data.trends.courseActivity.map(item => ({
                  name: item.date,
                  تسجيلات: item.enrollments,
                  دروس: item.lessonsCompleted,
                  اختبارات: item.quizzesCompleted
                }))}
                areas={[
                  { dataKey: 'تسجيلات', stroke: '#8b5cf6', fill: '#8b5cf6', name: 'تسجيلات جديدة' },
                  { dataKey: 'دروس', stroke: '#06b6d4', fill: '#06b6d4', name: 'دروس مكتملة' },
                  { dataKey: 'اختبارات', stroke: '#84cc16', fill: '#84cc16', name: 'اختبارات مكتملة' }
                ]}
                height={300}
                stacked={true}
              />
            </div>
          </div>

          {/* صف ثاني من الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* استخدام المساعد الذكي */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">استخدام المساعد الذكي</h3>
              <BarChart
                data={data.trends.aiUsage.map(item => ({
                  name: item.date,
                  تفاعلات: item.interactions,
                  رموز: Math.round(item.tokens / 1000) // تحويل إلى آلاف
                }))}
                bars={[
                  { dataKey: 'تفاعلات', fill: '#ef4444', name: 'عدد التفاعلات' },
                  { dataKey: 'رموز', fill: '#f97316', name: 'الرموز المستخدمة (بالآلاف)' }
                ]}
                height={300}
              />
            </div>

            {/* توزيع الأحداث */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الأحداث</h3>
              <PieChart
                data={Object.entries(data.events.byType).map(([name, value]) => ({
                  name: name.replace('_', ' '),
                  value
                }))}
                height={300}
              />
            </div>
          </div>

          {/* أكثر الصفحات زيارة */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">أكثر الصفحات زيارة</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصفحة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الزيارات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النسبة
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.pages.topPages.slice(0, 10).map((page, index) => {
                    const totalViews = data.pages.topPages.reduce((sum, p) => sum + p.views, 0)
                    const percentage = totalViews > 0 ? ((page.views / totalViews) * 100).toFixed(1) : '0'
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {page.url || 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {page.views.toLocaleString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {percentage}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
