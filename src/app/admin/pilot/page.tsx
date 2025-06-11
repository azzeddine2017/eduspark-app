'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Activity,
  MapPin,
  Settings,
  BarChart3,
  Calendar,
  FileText,
  Zap,
  Globe
} from 'lucide-react';

export default function PilotManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [pilotData, setPilotData] = useState(null);
  const [loading, setLoading] = useState(true);

  // بيانات تجريبية للعقدة التجريبية
  const pilotStats = {
    currentUsers: 42,
    targetUsers: 50,
    completionRate: 73,
    satisfaction: 87,
    revenue: 1250,
    uptime: 99.2,
    conversionRate: 16.5,
    weeklyGrowth: 12
  };

  const teamMembers = [
    {
      name: 'أحمد محمد السعيد',
      role: 'مدير العقدة المحلية',
      status: 'نشط',
      performance: 92,
      avatar: '👨‍💼'
    },
    {
      name: 'فاطمة علي الزهراني',
      role: 'منسقة المحتوى',
      status: 'نشط',
      performance: 88,
      avatar: '👩‍🏫'
    },
    {
      name: 'محمد عبدالله القحطاني',
      role: 'مطور تقني محلي',
      status: 'نشط',
      performance: 95,
      avatar: '👨‍💻'
    },
    {
      name: 'نورا سعد العتيبي',
      role: 'منسقة المجتمع',
      status: 'نشط',
      performance: 90,
      avatar: '👩‍💼'
    },
    {
      name: 'خالد يوسف الدوسري',
      role: 'مساعد إداري',
      status: 'نشط',
      performance: 85,
      avatar: '👨‍💼'
    }
  ];

  const weeklyProgress = [
    { week: 'الأسبوع 1', users: 8, revenue: 0, satisfaction: 0 },
    { week: 'الأسبوع 2', users: 15, revenue: 0, satisfaction: 0 },
    { week: 'الأسبوع 3', users: 22, revenue: 180, satisfaction: 78 },
    { week: 'الأسبوع 4', users: 28, revenue: 420, satisfaction: 82 },
    { week: 'الأسبوع 5', users: 35, revenue: 680, satisfaction: 85 },
    { week: 'الأسبوع 6', users: 42, revenue: 1250, satisfaction: 87 }
  ];

  const challenges = [
    {
      id: 1,
      title: 'بطء في التسجيل خلال ساعات الذروة',
      severity: 'متوسط',
      status: 'قيد الحل',
      assignee: 'محمد القحطاني',
      dueDate: '2025-01-15'
    },
    {
      id: 2,
      title: 'طلبات تخصيص إضافي للمحتوى المحلي',
      severity: 'منخفض',
      status: 'مفتوح',
      assignee: 'فاطمة الزهراني',
      dueDate: '2025-01-20'
    },
    {
      id: 3,
      title: 'تحسين واجهة الدفع للمستخدمين المحليين',
      severity: 'عالي',
      status: 'مكتمل',
      assignee: 'محمد القحطاني',
      dueDate: '2025-01-12'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'منخفض': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'قيد الحل': return 'bg-blue-100 text-blue-800';
      case 'مفتوح': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العقدة التجريبية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div className="mr-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    إدارة العقدة التجريبية
                  </h1>
                  <p className="text-gray-600">
                    الرياض، المملكة العربية السعودية
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  الأسبوع 6 من 8
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  نشط
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'team', label: 'الفريق', icon: Users },
              { id: 'progress', label: 'التقدم', icon: TrendingUp },
              { id: 'challenges', label: 'التحديات', icon: AlertCircle },
              { id: 'reports', label: 'التقارير', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المستخدمون النشطون</p>
                    <p className="text-3xl font-bold text-gray-900">{pilotStats.currentUsers}</p>
                    <p className="text-sm text-gray-500">من أصل {pilotStats.targetUsers}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(pilotStats.currentUsers / pilotStats.targetUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معدل الرضا</p>
                    <p className="text-3xl font-bold text-gray-900">{pilotStats.satisfaction}%</p>
                    <p className="text-sm text-green-600">+5% من الأسبوع الماضي</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                    <p className="text-3xl font-bold text-gray-900">${pilotStats.revenue}</p>
                    <p className="text-sm text-green-600">+{pilotStats.weeklyGrowth}% نمو أسبوعي</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
                    <p className="text-3xl font-bold text-gray-900">{pilotStats.conversionRate}%</p>
                    <p className="text-sm text-green-600">أعلى من المستهدف</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة النظام</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">وقت التشغيل</span>
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold">{pilotStats.uptime}%</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">سرعة الاستجابة</span>
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold">1.2s</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">استخدام الخادم</span>
                    <div className="flex items-center">
                      <span className="text-yellow-600 font-semibold">68%</span>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">التزامن مع الشبكة</span>
                    <div className="flex items-center">
                      <span className="text-green-600 font-semibold">متصل</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">انضمام 3 متعلمين جدد</p>
                      <p className="text-xs text-gray-500">منذ ساعتين</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">إكمال دورة البرمجة للمبتدئين</p>
                      <p className="text-xs text-gray-500">منذ 4 ساعات</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">اشتراك جديد في دورة التصميم</p>
                      <p className="text-xs text-gray-500">منذ 6 ساعات</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">فريق العقدة المحلية</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 space-x-reverse mb-3">
                        <div className="text-3xl">{member.avatar}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'نشط' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">الأداء</p>
                          <p className="font-semibold text-gray-900">{member.performance}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">تقدم العقدة التجريبية</h3>
              <div className="space-y-6">
                {weeklyProgress.map((week, index) => (
                  <div key={index} className="border-r-4 border-blue-500 pr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{week.week}</h4>
                      <span className="text-sm text-gray-500">
                        {index < weeklyProgress.length - 1 ? 'مكتمل' : 'جاري'}
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

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">التحديات والمشاكل</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{challenge.title}</h4>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                            <span>المسؤول: {challenge.assignee}</span>
                            <span>الموعد النهائي: {challenge.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(challenge.severity)}`}>
                            {challenge.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(challenge.status)}`}>
                            {challenge.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
