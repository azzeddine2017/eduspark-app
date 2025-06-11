'use client';

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import StatCard from '@/components/ui/StatCard';
import ActivityFeed from '@/components/admin/ActivityFeed';
import LocalContentManager from '@/components/partner/LocalContentManager';
import LocalUserManager from '@/components/partner/LocalUserManager';

interface LocalDashboardContentProps {
  node: any;
  partnership: any;
  localStats: {
    totalUsers: number;
    monthlyRevenue: number;
    totalContent: number;
    activeSubscriptions: number;
  };
  activeSubscriptions: any[];
  localContent: any[];
  recentActivity: any[];
  charts: {
    revenue: any[];
    userGrowth: any[];
    contentPerformance: any[];
  };
}

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

export default function LocalDashboardContent({
  node,
  partnership,
  localStats,
  activeSubscriptions,
  localContent,
  recentActivity,
  charts
}: LocalDashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'content', name: 'إدارة المحتوى', icon: '📚' },
    { id: 'users', name: 'إدارة المستخدمين', icon: '👥' },
    { id: 'analytics', name: 'التحليلات', icon: '📈' }
  ];

  return (
    <div className="space-y-8">
      {/* معلومات العقدة */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{node.name}</h2>
            <p className="text-purple-100 mb-4">{node.description}</p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{node.region}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{node.language}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                node.status === 'ACTIVE' 
                  ? 'bg-green-500 bg-opacity-20 text-green-100'
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-100'
              }`}>
                {node.status === 'ACTIVE' ? 'نشطة' : 'قيد المراجعة'}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">${localStats.monthlyRevenue.toLocaleString()}</div>
            <div className="text-purple-100">الإيرادات الشهرية</div>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="ml-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* مؤشرات الأداء الرئيسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="إجمالي المستخدمين"
              value={localStats.totalUsers}
              change={12}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="primary"
            />
            
            <StatCard
              title="الإيرادات الشهرية"
              value={`$${localStats.monthlyRevenue.toLocaleString()}`}
              change={8.5}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              color="success"
            />
            
            <StatCard
              title="المحتوى المحلي"
              value={localStats.totalContent}
              change={15.3}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              color="warning"
            />
            
            <StatCard
              title="الاشتراكات النشطة"
              value={localStats.activeSubscriptions}
              change={-2.1}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              color="info"
            />
          </div>

          {/* المخططات */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مخطط الإيرادات */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                نمو الإيرادات والاشتراكات
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={charts.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="subscriptions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* مخطط نمو المستخدمين */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                نمو المستخدمين
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line type="monotone" dataKey="totalUsers" stroke="#3B82F6" strokeWidth={3} name="إجمالي المستخدمين" />
                  <Line type="monotone" dataKey="activeUsers" stroke="#10B981" strokeWidth={3} name="المستخدمين النشطين" />
                  <Line type="monotone" dataKey="newUsers" stroke="#F59E0B" strokeWidth={3} name="مستخدمين جدد" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* آخر الأنشطة وأفضل المحتوى أداءً */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* آخر الأنشطة */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                آخر الأنشطة المحلية
              </h3>
              <ActivityFeed activities={recentActivity} />
            </div>

            {/* أفضل المحتوى أداءً */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                أفضل المحتوى أداءً
              </h3>
              
              <div className="space-y-4">
                {charts.contentPerformance.slice(0, 5).map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {content.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {content.views} مشاهدة • {content.completions} إكمال
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${content.revenue}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⭐ {content.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <LocalContentManager 
          localContent={localContent}
          nodeId={node.id}
        />
      )}

      {activeTab === 'users' && (
        <LocalUserManager 
          activeSubscriptions={activeSubscriptions}
          nodeId={node.id}
        />
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            تحليلات مفصلة
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            ستتوفر التحليلات المفصلة قريباً...
          </p>
        </div>
      )}
    </div>
  );
}
