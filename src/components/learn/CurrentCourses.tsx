'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: Date;
  thumbnail?: string;
}

interface CurrentCoursesProps {
  courses: Course[];
}

export default function CurrentCourses({ courses }: CurrentCoursesProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          لا توجد دورات مسجلة
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          ابدأ رحلة التعلم بالتسجيل في دورة جديدة
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          استكشف الدورات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4 space-x-reverse">
            {/* صورة الدورة */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* محتوى الدورة */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* شريط التقدم */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">التقدم</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(course.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.completedLessons}/{course.totalLessons} دروس
                  </span>
                  
                  <span className="flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    آخر وصول {formatDistanceToNow(new Date(course.lastAccessed), { addSuffix: true, locale: ar })}
                  </span>
                </div>

                {/* زر المتابعة */}
                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                  متابعة التعلم
                </button>
              </div>

              {/* حالة التقدم */}
              {course.progress === 100 ? (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    تم إكمال الدورة! 🎉
                  </p>
                </div>
              ) : course.progress > 75 ? (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                    أوشكت على الانتهاء!
                  </p>
                </div>
              ) : course.progress > 0 ? (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    استمر في التقدم الرائع!
                  </p>
                </div>
              ) : (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    ابدأ رحلة التعلم
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* زر عرض جميع الدورات */}
      <div className="text-center pt-4">
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
          عرض جميع دوراتي
        </button>
      </div>
    </div>
  );
}
