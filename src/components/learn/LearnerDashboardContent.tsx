'use client';

import { useState } from 'react';
import { 
  CircularProgressbar, 
  buildStyles 
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import StatCard from '@/components/ui/StatCard';
import ContentRecommendations from '@/components/learn/ContentRecommendations';
import CurrentCourses from '@/components/learn/CurrentCourses';
import AchievementsBadges from '@/components/learn/AchievementsBadges';
import ActivityFeed from '@/components/learn/ActivityFeed';
import AIAssistantWidget from '@/components/learn/AIAssistantWidget';

interface LearnerDashboardContentProps {
  user: any;
  userNode: any;
  learningStats: {
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
    averageScore: number;
    totalCourses: number;
    studyStreak: number;
    totalPoints: number;
  };
  currentCourses: any[];
  recommendations: any[];
  achievements: any[];
  recentActivity: any[];
  aiAssistant: {
    isAvailable: boolean;
    nodeId?: string;
    culturalContext?: any;
  };
}

export default function LearnerDashboardContent({
  user,
  userNode,
  learningStats,
  currentCourses,
  recommendations,
  achievements,
  recentActivity,
  aiAssistant
}: LearnerDashboardContentProps) {
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  return (
    <div className="space-y-8">
      {/* إحصائيات التقدم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="الدروس المكتملة"
          value={`${learningStats.completedLessons}/${learningStats.totalLessons}`}
          change={12}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="success"
        />
        
        <StatCard
          title="متوسط الدرجات"
          value={`${learningStats.averageScore}%`}
          change={8.5}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          color="warning"
        />
        
        <StatCard
          title="سلسلة الدراسة"
          value={`${learningStats.studyStreak} أيام`}
          change={15.3}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          }
          color="error"
        />
        
        <StatCard
          title="إجمالي النقاط"
          value={learningStats.totalPoints.toLocaleString()}
          change={-2.1}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
          color="primary"
        />
      </div>

      {/* التقدم العام والإنجازات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* التقدم العام */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            التقدم العام
          </h3>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={learningStats.progressPercentage}
                text={`${learningStats.progressPercentage}%`}
                styles={buildStyles({
                  textColor: '#7C3AED',
                  pathColor: '#7C3AED',
                  trailColor: '#E5E7EB'
                })}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">الدروس المكتملة</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {learningStats.completedLessons}/{learningStats.totalLessons}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">الدورات النشطة</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {learningStats.totalCourses}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">متوسط الدرجات</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {learningStats.averageScore}%
              </span>
            </div>
          </div>
        </div>

        {/* الإنجازات */}
        <div className="lg:col-span-2">
          <AchievementsBadges achievements={achievements} />
        </div>
      </div>

      {/* التوصيات والدورات الحالية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* التوصيات المخصصة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              توصيات مخصصة لك
            </h3>
            {aiAssistant.isAvailable && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                مدعوم بالذكاء الاصطناعي
              </span>
            )}
          </div>
          <ContentRecommendations recommendations={recommendations} />
        </div>

        {/* الدورات الحالية */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            دوراتك الحالية
          </h3>
          <CurrentCourses courses={currentCourses} />
        </div>
      </div>

      {/* آخر الأنشطة */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          آخر أنشطتك التعليمية
        </h3>
        <ActivityFeed activities={recentActivity} />
      </div>

      {/* المساعد الذكي */}
      {aiAssistant.isAvailable && (
        <AIAssistantWidget
          isVisible={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
          nodeId={aiAssistant.nodeId!}
          culturalContext={aiAssistant.culturalContext}
          user={user}
        />
      )}

      {/* زر المساعد الذكي العائم */}
      {aiAssistant.isAvailable && (
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className="fixed bottom-6 left-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      {/* معلومات العقدة المحلية */}
      {userNode && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="mr-3">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                تتعلم من خلال عقدة {userNode.name}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                محتوى مخصص لمنطقة {userNode.region} باللغة {userNode.language}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
