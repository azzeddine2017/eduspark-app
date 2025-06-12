import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createLocalizedAI } from '@/lib/localized-ai';
import LearnerDashboardContent from '@/components/learn/LearnerDashboardContent';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'منصة التعلم - فتح الموزعة',
  description: 'تجربة تعلم مخصصة مع مساعد ذكي وتوصيات شخصية',
};

// جلب بيانات المتعلم
async function getLearnerData(userId: string) {
  try {
    // جلب معلومات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: { userId }
                    }
                  }
                }
              }
            }
          }
        },
        lessonProgress: {
          include: {
            lesson: {
              include: {
                course: true
              }
            }
          }
        },
        quizAttempts: {
          include: {
            quiz: {
              include: {
                lesson: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // تحديد العقدة المحلية للمستخدم (افتراضياً أول عقدة نشطة)
    const userNode = await prisma.localNode.findFirst({
      where: {
        status: 'ACTIVE'
      }
    });

    // إنشاء مثيل الذكاء الاصطناعي المحلي
    const localizedAI = userNode ? createLocalizedAI(userNode.id) : null;

    // حساب إحصائيات التقدم
    const totalLessons = user.enrollments.reduce((sum, enrollment) => 
      sum + enrollment.course.lessons.length, 0
    );
    
    const completedLessons = user.lessonProgress.filter(progress => 
      progress.completed
    ).length;

    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // حساب متوسط الدرجات
    const averageScore = user.quizAttempts.length > 0
      ? user.quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / user.quizAttempts.length
      : 0;

    // جلب التوصيات المخصصة
    const recommendations = localizedAI 
      ? await localizedAI.generateContentRecommendations(userId, 5)
      : generateFallbackRecommendations();

    // جلب الدورات الحالية
    const currentCourses = user.enrollments.map(enrollment => {
      const course = enrollment.course;
      const completedLessonsInCourse = course.lessons.filter(lesson =>
        lesson.progress.some(progress => progress.completed)
      ).length;
      
      const courseProgress = course.lessons.length > 0 
        ? (completedLessonsInCourse / course.lessons.length) * 100 
        : 0;

      return {
        ...course,
        progress: courseProgress,
        completedLessons: completedLessonsInCourse,
        totalLessons: course.lessons.length,
        lastAccessed: enrollment.enrolledAt
      };
    });

    // جلب الإنجازات (مؤقت)
    const achievements = generateUserAchievements(user, completedLessons, averageScore);

    // جلب آخر الأنشطة
    const recentActivity = [
      ...user.lessonProgress.slice(-5).map(progress => ({
        id: `lesson_${progress.id}`,
        type: 'lesson_completed',
        title: `أكمل درس: ${progress.lesson.title}`,
        course: progress.lesson.course.title,
        timestamp: progress.updatedAt,
        points: 10
      })),
      ...user.quizAttempts.slice(-3).map(attempt => ({
        id: `quiz_${attempt.id}`,
        type: 'quiz_completed',
        title: `أكمل اختبار: ${attempt.quiz.lesson.title}`,
        course: attempt.quiz.lesson.course.title,
        timestamp: attempt.startedAt,
        score: attempt.score || 0,
        points: Math.round((attempt.score || 0) / 10)
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

    return {
      user,
      userNode,
      learningStats: {
        totalLessons,
        completedLessons,
        progressPercentage: Math.round(progressPercentage),
        averageScore: Math.round(averageScore),
        totalCourses: user.enrollments.length,
        studyStreak: 7, // يمكن حسابها من النشاط الفعلي
        totalPoints: completedLessons * 10 + user.quizAttempts.reduce((sum, attempt) => sum + Math.round((attempt.score || 0) / 10), 0)
      },
      currentCourses,
      recommendations,
      achievements,
      recentActivity,
      aiAssistant: {
        isAvailable: !!localizedAI,
        nodeId: userNode?.id,
        culturalContext: userNode ? {
          region: userNode.region,
          language: userNode.language
        } : null
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات المتعلم:', error);
    throw error;
  }
}

// توليد توصيات احتياطية
function generateFallbackRecommendations() {
  return [
    {
      id: 'rec_1',
      title: 'أساسيات البرمجة',
      description: 'تعلم أساسيات البرمجة من الصفر',
      type: 'course',
      difficulty: 'BEGINNER',
      estimatedTime: 120,
      rating: 4.8,
      thumbnail: '/images/programming-basics.jpg',
      reason: 'مناسب لمستواك الحالي'
    },
    {
      id: 'rec_2',
      title: 'الرياضيات التطبيقية',
      description: 'تطبيقات عملية للرياضيات',
      type: 'course',
      difficulty: 'INTERMEDIATE',
      estimatedTime: 90,
      rating: 4.6,
      thumbnail: '/images/applied-math.jpg',
      reason: 'يكمل دراستك السابقة'
    }
  ];
}

// توليد إنجازات المستخدم
function generateUserAchievements(user: any, completedLessons: number, averageScore: number) {
  const achievements = [];

  if (completedLessons >= 1) {
    achievements.push({
      id: 'first_lesson',
      title: 'الخطوة الأولى',
      description: 'أكمل أول درس',
      icon: '🎯',
      unlockedAt: new Date(),
      points: 10
    });
  }

  if (completedLessons >= 10) {
    achievements.push({
      id: 'ten_lessons',
      title: 'المتعلم النشط',
      description: 'أكمل 10 دروس',
      icon: '📚',
      unlockedAt: new Date(),
      points: 50
    });
  }

  if (averageScore >= 80) {
    achievements.push({
      id: 'high_scorer',
      title: 'المتفوق',
      description: 'حقق متوسط درجات 80% أو أكثر',
      icon: '⭐',
      unlockedAt: new Date(),
      points: 100
    });
  }

  return achievements;
}

export default async function LearnerDashboardPage() {
  // التحقق من المصادقة
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  مرحباً، {session.user.name}! 👋
                </h1>
                <p className="text-purple-100">
                  استمر في رحلة التعلم واكتشف محتوى جديد مخصص لك
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  البحث في المحتوى
                </button>
                
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  المساعد الذكي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى لوحة التحكم */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <LearnerDataWrapper userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

// مكون لتحميل البيانات وعرضها
async function LearnerDataWrapper({ userId }: { userId: string }) {
  try {
    const learnerData = await getLearnerData(userId);
    return <LearnerDashboardContent {...learnerData} />;
  } catch (error: any) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          خطأ في تحميل بيانات التعلم
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error.message || 'حدث خطأ أثناء جلب بيانات التعلم. يرجى المحاولة مرة أخرى.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }
}
