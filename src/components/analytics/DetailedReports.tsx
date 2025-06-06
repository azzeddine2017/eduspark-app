'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  FileText, 
  Users, 
  BookOpen, 
  Brain,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  TrendingUp
} from 'lucide-react'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import PieChart from './charts/PieChart'

// واجهة بيانات التقرير
interface ReportData {
  users?: any
  courses?: any
  ai?: any
}

// أنواع التقارير المتاحة
const REPORT_TYPES = [
  {
    id: 'users',
    name: 'تقرير المستخدمين',
    description: 'تحليل شامل لنشاط وسلوك المستخدمين',
    icon: Users,
    color: 'blue'
  },
  {
    id: 'courses',
    name: 'تقرير الدورات',
    description: 'أداء الدورات ومعدلات الإكمال',
    icon: BookOpen,
    color: 'green'
  },
  {
    id: 'ai',
    name: 'تقرير المساعد الذكي',
    description: 'استخدام وأداء المساعد الذكي',
    icon: Brain,
    color: 'purple'
  }
]

/**
 * مكون التقارير المفصلة
 */
export default function DetailedReports() {
  const [selectedReport, setSelectedReport] = useState('users')
  const [reportData, setReportData] = useState<ReportData>({})
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('30')
  const [filters, setFilters] = useState({
    role: '',
    category: '',
    instructor: ''
  })

  // جلب بيانات التقرير
  const fetchReportData = async (reportType: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        period,
        ...filters
      })

      const response = await fetch(`/api/analytics/${reportType}?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(prev => ({
          ...prev,
          [reportType]: data
        }))
      }
    } catch (error) {
      console.error(`خطأ في جلب تقرير ${reportType}:`, error)
    } finally {
      setLoading(false)
    }
  }

  // تصدير التقرير
  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`/api/analytics/${selectedReport}/export?format=${format}&period=${period}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('خطأ في تصدير التقرير:', error)
    }
  }

  // تحديث البيانات عند تغيير التقرير أو الفترة
  useEffect(() => {
    fetchReportData(selectedReport)
  }, [selectedReport, period])

  // تطبيق الفلاتر
  const applyFilters = () => {
    fetchReportData(selectedReport)
  }

  // رسم تقرير المستخدمين
  const renderUsersReport = () => {
    const data = reportData.users
    if (!data) return null

    return (
      <div className="space-y-8">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalUsers?.toLocaleString('ar-SA') || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">معدل الاحتفاظ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.retentionRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">متوسط وقت الجلسة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.averageEngagement?.timeSpent?.toFixed(0) || 0} دقيقة
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">مستخدمين غير نشطين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.inactiveUsers?.toLocaleString('ar-SA') || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* توزيع المستخدمين حسب الدور */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">توزيع المستخدمين حسب الدور</h3>
            <PieChart
              data={data.demographics?.byRole?.map((role: any) => ({
                name: role.role,
                value: role.count
              })) || []}
              height={300}
            />
          </div>

          {/* التسجيلات اليومية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">التسجيلات اليومية</h3>
            <LineChart
              data={data.activity?.dailyRegistrations?.map((reg: any) => ({
                name: reg.date,
                value: reg.count
              })) || []}
              lines={[
                { dataKey: 'value', stroke: '#3b82f6', name: 'تسجيلات جديدة' }
              ]}
              height={300}
            />
          </div>
        </div>

        {/* أكثر المستخدمين نشاطاً */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">أكثر المستخدمين نشاطاً</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدور</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">وقت النشاط</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدروس المشاهدة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">نقاط التفاعل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.activity?.topUsers?.slice(0, 10).map((user: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.activity.totalTimeSpent} دقيقة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.activity.lessonsViewed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.engagementScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // رسم تقرير الدورات
  const renderCoursesReport = () => {
    const data = reportData.courses
    if (!data) return null

    return (
      <div className="space-y-8">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الدورات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalCourses?.toLocaleString('ar-SA') || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.averageRating?.toFixed(1) || 0} ⭐
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي التسجيلات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalEnrollments?.toLocaleString('ar-SA') || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">متوسط المدة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.averageDuration?.toFixed(0) || 0} ساعة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* توزيع الدورات حسب الفئة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">توزيع الدورات حسب الفئة</h3>
            <BarChart
              data={data.categories?.map((cat: any) => ({
                name: cat.category,
                value: cat.count
              })) || []}
              bars={[
                { dataKey: 'value', fill: '#10b981', name: 'عدد الدورات' }
              ]}
              height={300}
            />
          </div>

          {/* التسجيلات اليومية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">التسجيلات اليومية</h3>
            <LineChart
              data={data.trends?.dailyEnrollments?.map((enrollment: any) => ({
                name: enrollment.date,
                value: enrollment.count
              })) || []}
              lines={[
                { dataKey: 'value', stroke: '#8b5cf6', name: 'تسجيلات جديدة' }
              ]}
              height={300}
            />
          </div>
        </div>

        {/* أفضل الدورات */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">أفضل الدورات أداءً</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدورة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدرب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التسجيلات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">معدل الإكمال</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topCourses?.slice(0, 10).map((course: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.instructor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.totalEnrollments.toLocaleString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.completionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.rating?.toFixed(1) || 'غير مقيم'} ⭐
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // رسم تقرير المساعد الذكي
  const renderAIReport = () => {
    const data = reportData.ai
    if (!data) return null

    return (
      <div className="space-y-8">
        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي التفاعلات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.totalInteractions?.toLocaleString('ar-SA') || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">معدل النجاح</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.successRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">الرموز المستخدمة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(data.summary?.totalTokensUsed / 1000)?.toFixed(0) || 0}K
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="mr-4">
                <p className="text-sm text-gray-600">متوسط وقت الاستجابة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.summary?.averageResponseTime?.toFixed(1) || 0}ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* الاستخدام حسب النوع */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">الاستخدام حسب نوع التفاعل</h3>
            <PieChart
              data={data.usage?.byType?.map((type: any) => ({
                name: type.type,
                value: type.count
              })) || []}
              height={300}
            />
          </div>

          {/* الاستخدام اليومي */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">الاستخدام اليومي</h3>
            <LineChart
              data={data.usage?.dailyStats?.map((stat: any) => ({
                name: stat.date,
                تفاعلات: stat.interactions,
                رموز: Math.round(stat.tokens / 1000)
              })) || []}
              lines={[
                { dataKey: 'تفاعلات', stroke: '#ef4444', name: 'عدد التفاعلات' },
                { dataKey: 'رموز', stroke: '#f97316', name: 'الرموز (بالآلاف)' }
              ]}
              height={300}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* شريط التحكم */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          {/* اختيار نوع التقرير */}
          <div className="flex flex-wrap gap-4 mb-4 lg:mb-0">
            {REPORT_TYPES.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  selectedReport === report.id
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <report.icon className="h-5 w-5 ml-2" />
                {report.name}
              </button>
            ))}
          </div>

          {/* أزرار التصدير */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
            </select>

            <button
              onClick={() => exportReport('csv')}
              className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 ml-2" />
              CSV
            </button>

            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Download className="h-4 w-4 ml-2" />
              PDF
            </button>

            <button
              onClick={() => fetchReportData(selectedReport)}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>

        {/* وصف التقرير المحدد */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            {REPORT_TYPES.find(r => r.id === selectedReport)?.icon && (
              <div className="flex-shrink-0 ml-3">
                {React.createElement(REPORT_TYPES.find(r => r.id === selectedReport)!.icon, {
                  className: "h-6 w-6 text-blue-600"
                })}
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                {REPORT_TYPES.find(r => r.id === selectedReport)?.name}
              </h3>
              <p className="text-blue-700">
                {REPORT_TYPES.find(r => r.id === selectedReport)?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى التقرير */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري تحميل التقرير...</p>
        </div>
      ) : (
        <div>
          {selectedReport === 'users' && renderUsersReport()}
          {selectedReport === 'courses' && renderCoursesReport()}
          {selectedReport === 'ai' && renderAIReport()}
        </div>
      )}
    </div>
  )
}
