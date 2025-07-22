'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Bot, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import WorldMap from '@/components/admin/WorldMap';
import ActivityFeed from '@/components/admin/ActivityFeed';
import SystemHealthIndicator from '@/components/admin/SystemHealthIndicator';

interface GlobalDashboardContentProps {
  globalStats: {
    totalNodes: number;
    totalUsers: number;
    totalRevenue: number;
    averageRevenuePerNode: number;
    nodeStatistics: any[];
  };
  activeNodes: any[];
  recentActivity: any[];
  charts: {
    revenue: any[];
    nodesGrowth: any[];
    contentDistribution: any[];
  };
  systemHealth: {
    status: string;
    uptime: number;
    responseTime: number;
    activeConnections: number;
  };
}

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function GlobalDashboardContent({
  globalStats,
  activeNodes,
  recentActivity,
  charts,
  systemHealth
}: GlobalDashboardContentProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');

  return (
    <div className="space-y-8">
      {/* مولد الدورات الذكي - مرجان */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8" />
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">مولد الدورات الذكي - مرجان</h3>
              <p className="text-blue-100 mt-1">دع مرجان ينشئ دورات تعليمية شاملة ومتنوعة تلقائياً</p>
            </div>
          </div>
          <Link
            href="/admin/course-generator"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            إنشاء دورة جديدة
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-blue-100">دورة مولدة</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">10</div>
            <div className="text-blue-100">مواد مختلفة</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold">95%</div>
            <div className="text-blue-100">معدل الرضا</div>
          </div>
        </div>
      </div>

      {/* مؤشرات الأداء الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي العقد"
          value={globalStats.totalNodes}
          change={12}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="primary"
        />
        
        <StatCard
          title="إجمالي المستخدمين"
          value={globalStats.totalUsers.toLocaleString()}
          change={8.5}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
          color="success"
        />
        
        <StatCard
          title="إجمالي الإيرادات"
          value={`$${globalStats.totalRevenue.toLocaleString()}`}
          change={15.3}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="warning"
        />
        
        <StatCard
          title="متوسط الإيراد لكل عقدة"
          value={`$${Math.round(globalStats.averageRevenuePerNode).toLocaleString()}`}
          change={-2.1}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="error"
        />
      </div>

      {/* مؤشر صحة النظام */}
      <SystemHealthIndicator health={systemHealth} />

      {/* الصف الثاني: المخططات الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* مخطط الإيرادات */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              نمو الإيرادات الشهرية
            </h3>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="3months">آخر 3 أشهر</option>
              <option value="6months">آخر 6 أشهر</option>
              <option value="12months">آخر 12 شهر</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'الإيرادات']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#7C3AED" 
                fill="#7C3AED"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* مخطط نمو العقد */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            نمو العقد والمستخدمين
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.nodesGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="nodes" 
                stroke="#10B981" 
                strokeWidth={3}
                name="العقد"
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="المستخدمين النشطين"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* الصف الثالث: خريطة العالم وتوزيع المحتوى */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* خريطة العقد العالمية */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            خريطة العقد العالمية
          </h3>
          <WorldMap nodes={activeNodes} />
        </div>

        {/* توزيع المحتوى */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            توزيع المحتوى حسب الفئة
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={charts.contentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="count"
              >
                {charts.contentDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* مفتاح الألوان */}
          <div className="mt-4 space-y-2">
            {charts.contentDistribution.map((item: any, index: number) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full ml-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الصف الرابع: آخر الأنشطة وأفضل العقد أداءً */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخر الأنشطة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            آخر الأنشطة
          </h3>
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* أفضل العقد أداءً */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            أفضل العقد أداءً
          </h3>
          
          <div className="space-y-4">
            {globalStats.nodeStatistics
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((node, index) => (
                <div key={node.nodeId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
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
                        عقدة {node.nodeId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {node.contentCount} محتوى
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${node.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      +12% هذا الشهر
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
