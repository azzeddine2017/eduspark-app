'use client';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* مؤشرات الأداء الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* مؤشر صحة النظام */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* المخططات الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* مخطط الإيرادات */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
          <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* مخطط نمو العقد */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6" />
          <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* خريطة العالم وتوزيع المحتوى */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* خريطة العقد العالمية */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6" />
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* توزيع المحتوى */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full ml-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* آخر الأنشطة وأفضل العقد أداءً */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* آخر الأنشطة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 space-x-reverse p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أفضل العقد أداءً */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex-shrink-0" />
                  <div className="mr-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-1" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
