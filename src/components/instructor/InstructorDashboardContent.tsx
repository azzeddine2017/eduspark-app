'use client';

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import StatCard from '@/components/ui/StatCard';
import CourseManager from '@/components/instructor/CourseManager';
import ContentStudio from '@/components/instructor/ContentStudio';
import StudentAnalytics from '@/components/instructor/StudentAnalytics';
import ActivityFeed from '@/components/admin/ActivityFeed';

interface InstructorDashboardContentProps {
  instructor: any;
  instructorStats: {
    totalCourses: number;
    totalLessons: number;
    totalStudents: number;
    totalViews: number;
    averageScore: number;
    totalRevenue: number;
    activeStudents: number;
  };
  recentCourses: any[];
  topStudents: any[];
  recentActivity: any[];
  charts: {
    performance: any[];
    studentsGrowth: any[];
  };
}

export default function InstructorDashboardContent({
  instructor,
  instructorStats,
  recentCourses,
  topStudents,
  recentActivity,
  charts
}: InstructorDashboardContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'courses', name: 'إدارة الدورات', icon: '📚' },
    { id: 'studio', name: 'استوديو المحتوى', icon: '🎬' },
    { id: 'analytics', name: 'تحليلات الطلاب', icon: '📈' }
  ];

  return (
    <div className="space-y-8">
      {/* معلومات المدرس */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{instructor.name}</h2>
            <p className="text-indigo-100 mb-4">{instructor.email}</p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{instructorStats.totalCourses} دورة</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>{instructorStats.totalStudents} طالب</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>{instructorStats.averageScore}% متوسط الدرجات</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold">${instructorStats.totalRevenue.toLocaleString()}</div>
            <div className="text-indigo-100">إجمالي الإيرادات</div>
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
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
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
              title="إجمالي الدورات"
              value={instructorStats.totalCourses}
              change={12}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              color="primary"
            />
            
            <StatCard
              title="إجمالي الطلاب"
              value={instructorStats.totalStudents}
              change={8.5}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
              color="success"
            />
            
            <StatCard
              title="إجمالي المشاهدات"
              value={instructorStats.totalViews.toLocaleString()}
              change={15.3}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              color="warning"
            />
            
            <StatCard
              title="متوسط الدرجات"
              value={`${instructorStats.averageScore}%`}
              change={-2.1}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              color="info"
            />
          </div>

          {/* المخططات */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* مخطط أداء الدورات */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                أداء الدورات الشهري
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={charts.performance}>
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
                  <Area type="monotone" dataKey="views" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} name="المشاهدات" />
                  <Area type="monotone" dataKey="completions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="الإكمالات" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* مخطط نمو الطلاب */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                نمو الطلاب
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.studentsGrowth}>
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
                  <Line type="monotone" dataKey="newStudents" stroke="#F59E0B" strokeWidth={3} name="طلاب جدد" />
                  <Line type="monotone" dataKey="activeStudents" stroke="#3B82F6" strokeWidth={3} name="طلاب نشطين" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* الدورات الحديثة وأفضل الطلاب */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الدورات الحديثة */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                دوراتك الحديثة
              </h3>
              
              <div className="space-y-4">
                {recentCourses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.studentsCount} طالب • {course.lessonsCount} درس
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round(course.completionRate)}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        معدل الإكمال
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* أفضل الطلاب */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                أفضل الطلاب نشاطاً
              </h3>
              
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={student.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                            {student.user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.coursesCount} دورة
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        #{index + 1} الأكثر نشاطاً
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* آخر الأنشطة */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              آخر الأنشطة
            </h3>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <CourseManager 
          courses={recentCourses}
          instructorId={instructor.id}
        />
      )}

      {activeTab === 'studio' && (
        <ContentStudio 
          instructorId={instructor.id}
        />
      )}

      {activeTab === 'analytics' && (
        <StudentAnalytics 
          courses={recentCourses}
          topStudents={topStudents}
          charts={charts}
        />
      )}
    </div>
  );
}
