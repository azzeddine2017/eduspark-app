'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  points: number;
}

interface AchievementsBadgesProps {
  achievements: Achievement[];
}

export default function AchievementsBadges({ achievements }: AchievementsBadgesProps) {
  // إنجازات مقترحة للحصول عليها
  const upcomingAchievements = [
    {
      id: 'week_streak',
      title: 'أسبوع متواصل',
      description: 'ادرس لمدة 7 أيام متتالية',
      icon: '🔥',
      progress: 5,
      target: 7,
      points: 50
    },
    {
      id: 'quiz_master',
      title: 'خبير الاختبارات',
      description: 'احصل على 90% أو أكثر في 5 اختبارات',
      icon: '🎯',
      progress: 2,
      target: 5,
      points: 75
    },
    {
      id: 'course_complete',
      title: 'منهي الدورات',
      description: 'أكمل دورة كاملة',
      icon: '🏆',
      progress: 0,
      target: 1,
      points: 100
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        الإنجازات والشارات
      </h3>

      {/* الإنجازات المحققة */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            الإنجازات المحققة ({achievements.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* أيقونة الإنجاز */}
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3 mx-auto">
                  <span className="text-2xl">{achievement.icon}</span>
                </div>

                {/* تفاصيل الإنجاز */}
                <div className="text-center">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                    {achievement.title}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </p>
                  
                  {/* النقاط والتاريخ */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      +{achievement.points} نقطة
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(achievement.unlockedAt), { addSuffix: true, locale: ar })}
                    </span>
                  </div>
                </div>

                {/* شارة "جديد" للإنجازات الحديثة */}
                {new Date().getTime() - new Date(achievement.unlockedAt).getTime() < 24 * 60 * 60 * 1000 && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      جديد!
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الإنجازات القادمة */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          إنجازات قريبة المنال
        </h4>
        <div className="space-y-4">
          {upcomingAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* أيقونة الإنجاز */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <span className="text-lg opacity-50">{achievement.icon}</span>
                  </div>
                </div>

                {/* تفاصيل الإنجاز */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </h5>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{achievement.points} نقطة
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {achievement.description}
                  </p>

                  {/* شريط التقدم */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {achievement.progress}/{achievement.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      {Math.round((achievement.progress / achievement.target) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات الإنجازات */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {achievements.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              إنجازات محققة
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {achievements.reduce((sum, achievement) => sum + achievement.points, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              نقاط الإنجازات
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {upcomingAchievements.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              إنجازات قادمة
            </div>
          </div>
        </div>
      </div>

      {/* رسالة تحفيزية */}
      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            ابدأ رحلة الإنجازات!
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            أكمل أول درس لتحصل على إنجازك الأول
          </p>
        </div>
      ) : (
        <div className="text-center mt-6">
          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
            عرض جميع الإنجازات
          </button>
        </div>
      )}
    </div>
  );
}
