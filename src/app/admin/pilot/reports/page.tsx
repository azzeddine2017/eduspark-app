'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function PilotReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'overview', name: 'تقرير شامل', icon: BarChart3 },
    { id: 'users', name: 'تقرير المستخدمين', icon: Users },
    { id: 'financial', name: 'التقرير المالي', icon: DollarSign },
    { id: 'performance', name: 'تقرير الأداء', icon: TrendingUp },
    { id: 'challenges', name: 'تقرير التحديات', icon: AlertTriangle }
  ];

  const timePeriods = [
    { id: 'week', name: 'أسبوعي' },
    { id: 'month', name: 'شهري' },
    { id: 'quarter', name: 'ربع سنوي' },
    { id: 'custom', name: 'فترة مخصصة' }
  ];

  // بيانات تجريبية للتقارير
  const overviewData = {
    summary: {
      totalUsers: 42,
      activeUsers: 38,
      newUsers: 8,
      revenue: 1250,
      conversionRate: 16.5,
      satisfaction: 87
    },
    weeklyTrend: [
      { week: 'الأسبوع 1', users: 8, revenue: 0, satisfaction: 0 },
      { week: 'الأسبوع 2', users: 15, revenue: 0, satisfaction: 0 },
      { week: 'الأسبوع 3', users: 22, revenue: 180, satisfaction: 78 },
      { week: 'الأسبوع 4', users: 28, revenue: 420, satisfaction: 82 },
      { week: 'الأسبوع 5', users: 35, revenue: 680, satisfaction: 85 },
      { week: 'الأسبوع 6', users: 42, revenue: 1250, satisfaction: 87 }
    ],
    goals: [
      { metric: 'المستخدمون النشطون', target: 50, current: 42, percentage: 84 },
      { metric: 'معدل الرضا', target: 85, current: 87, percentage: 102 },
      { metric: 'الإيرادات الشهرية', target: 1500, current: 1250, percentage: 83 },
      { metric: 'معدل التحويل', target: 15, current: 16.5, percentage: 110 }
    ]
  };

  const userAnalytics = {
    demographics: {
      ageGroups: [
        { range: '18-25', count: 12, percentage: 28.6 },
        { range: '26-35', count: 18, percentage: 42.9 },
        { range: '36-45', count: 8, percentage: 19.0 },
        { range: '46+', count: 4, percentage: 9.5 }
      ],
      education: [
        { level: 'ثانوي', count: 8, percentage: 19.0 },
        { level: 'جامعي', count: 24, percentage: 57.1 },
        { level: 'دراسات عليا', count: 10, percentage: 23.9 }
      ]
    },
    engagement: {
      dailyActive: 32,
      weeklyActive: 38,
      monthlyActive: 42,
      averageSessionTime: 45, // minutes
      coursesCompleted: 28,
      averageProgress: 73
    }
  };

  const financialData = {
    revenue: {
      total: 1250,
      subscriptions: 980,
      courses: 270,
      growth: 12.5
    },
    subscriptions: [
      { plan: 'البرمجة للمبتدئين', subscribers: 12, revenue: 348, price: 29 },
      { plan: 'التصميم الجرافيكي', subscribers: 8, revenue: 312, price: 39 },
      { plan: 'إدارة الأعمال', subscribers: 6, revenue: 294, price: 49 },
      { plan: 'التسويق الرقمي', subscribers: 2, revenue: 70, price: 35 }
    ],
    expenses: {
      infrastructure: 200,
      team: 800,
      marketing: 150,
      other: 100
    }
  };

  const generateReport = async () => {
    setLoading(true);
    // محاكاة تحميل التقرير
    setTimeout(() => {
      setLoading(false);
      // هنا يمكن إضافة منطق تحميل التقرير الفعلي
    }, 2000);
  };

  const downloadReport = (format: string) => {
    // منطق تحميل التقرير
    console.log(`تحميل التقرير بصيغة ${format}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="mr-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    تقارير العقدة التجريبية
                  </h1>
                  <p className="text-gray-600">
                    تحليلات شاملة وتقارير مفصلة للأداء
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateReport}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  تحديث البيانات
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => downloadReport('pdf')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تحميل PDF
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Report Type */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع التقرير
              </label>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedReport(type.id)}
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedReport === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    <span>{type.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفترة الزمنية
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timePeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Report */}
        {selectedReport === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-3xl font-bold text-gray-900">{overviewData.summary.totalUsers}</p>
                    <p className="text-sm text-green-600">+{overviewData.summary.newUsers} جديد</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الإيرادات</p>
                    <p className="text-3xl font-bold text-gray-900">${overviewData.summary.revenue}</p>
                    <p className="text-sm text-green-600">+12% نمو</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
                    <p className="text-3xl font-bold text-gray-900">{overviewData.summary.satisfaction}%</p>
                    <p className="text-sm text-green-600">أعلى من المستهدف</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">تقدم الأهداف</h3>
              <div className="space-y-4">
                {overviewData.goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{goal.metric}</span>
                        <span className="text-sm text-gray-500">
                          {goal.current} / {goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            goal.percentage >= 100 ? 'bg-green-500' : 
                            goal.percentage >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mr-4">
                      <span className={`text-sm font-semibold ${
                        goal.percentage >= 100 ? 'text-green-600' : 
                        goal.percentage >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {goal.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Trend Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">الاتجاه الأسبوعي</h3>
              <div className="space-y-4">
                {overviewData.weeklyTrend.map((week, index) => (
                  <div key={index} className="border-r-4 border-blue-500 pr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{week.week}</h4>
                      <span className="text-sm text-gray-500">
                        {index < overviewData.weeklyTrend.length - 1 ? 'مكتمل' : 'جاري'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">المستخدمون: </span>
                        <span className="font-semibold">{week.users}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الإيرادات: </span>
                        <span className="font-semibold">${week.revenue}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الرضا: </span>
                        <span className="font-semibold">{week.satisfaction || 'N/A'}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* User Analytics Report */}
        {selectedReport === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userAnalytics.engagement.dailyActive}</p>
                <p className="text-sm text-gray-600">نشط يومياً</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userAnalytics.engagement.coursesCompleted}</p>
                <p className="text-sm text-gray-600">دورة مكتملة</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userAnalytics.engagement.averageProgress}%</p>
                <p className="text-sm text-gray-600">متوسط التقدم</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userAnalytics.engagement.averageSessionTime}</p>
                <p className="text-sm text-gray-600">دقيقة/جلسة</p>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">التوزيع العمري</h3>
                <div className="space-y-3">
                  {userAnalytics.demographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{group.range}</span>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-left">
                          {group.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المستوى التعليمي</h3>
                <div className="space-y-3">
                  {userAnalytics.demographics.education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{edu.level}</span>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${edu.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-left">
                          {edu.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Report */}
        {selectedReport === 'financial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-3xl font-bold text-gray-900">${financialData.revenue.total}</p>
                    <p className="text-sm text-green-600">+{financialData.revenue.growth}%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الاشتراكات</p>
                    <p className="text-3xl font-bold text-gray-900">${financialData.revenue.subscriptions}</p>
                    <p className="text-sm text-gray-500">78% من الإيرادات</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الدورات المفردة</p>
                    <p className="text-3xl font-bold text-gray-900">${financialData.revenue.courses}</p>
                    <p className="text-sm text-gray-500">22% من الإيرادات</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                    <p className="text-3xl font-bold text-gray-900">${financialData.revenue.total - Object.values(financialData.expenses).reduce((a, b) => a + b, 0)}</p>
                    <p className="text-sm text-gray-500">هامش 20%</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">تفصيل الاشتراكات</h3>
              <div className="space-y-4">
                {financialData.subscriptions.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{sub.plan}</h4>
                      <p className="text-sm text-gray-600">{sub.subscribers} مشترك</p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">${sub.revenue}</p>
                      <p className="text-sm text-gray-600">${sub.price}/شهر</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
