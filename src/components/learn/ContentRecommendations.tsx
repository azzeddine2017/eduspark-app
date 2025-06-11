'use client';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedTime: number;
  rating: number;
  thumbnail?: string;
  reason: string;
}

interface ContentRecommendationsProps {
  recommendations: Recommendation[];
}

export default function ContentRecommendations({ recommendations }: ContentRecommendationsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'EXPERT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'مبتدئ';
      case 'INTERMEDIATE':
        return 'متوسط';
      case 'ADVANCED':
        return 'متقدم';
      case 'EXPERT':
        return 'خبير';
      default:
        return difficulty;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}س ${remainingMinutes}د` : `${hours} ساعة`;
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">
          لا توجد توصيات متاحة حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4 space-x-reverse">
            {/* صورة مصغرة */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                {recommendation.type === 'course' ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
            </div>

            {/* محتوى التوصية */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {recommendation.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {recommendation.description}
                  </p>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* مستوى الصعوبة */}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recommendation.difficulty)}`}>
                    {getDifficultyText(recommendation.difficulty)}
                  </span>

                  {/* الوقت المقدر */}
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(recommendation.estimatedTime)}
                  </span>

                  {/* التقييم */}
                  <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-3 h-3 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {recommendation.rating}
                  </span>
                </div>

                {/* زر البدء */}
                <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors">
                  ابدأ الآن
                </button>
              </div>

              {/* سبب التوصية */}
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* زر عرض المزيد */}
      <div className="text-center pt-4">
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
          عرض المزيد من التوصيات
        </button>
      </div>
    </div>
  );
}
