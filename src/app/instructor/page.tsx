import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { globalPlatformService } from '@/lib/distributed-platform';
import InstructorDashboardContent from '@/components/instructor/InstructorDashboardContent';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'استوديو المدرس - منصة فتح الموزعة',
  description: 'إنشاء وإدارة المحتوى التعليمي مع أدوات متقدمة',
};

// جلب بيانات المدرس
async function getInstructorData(userId: string) {
  try {
    // جلب معلومات المدرس
    const instructor = await globalPlatformService.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          include: {
            lessons: {
              include: {
                lessonProgress: true,
                quizzes: {
                  include: {
                    quizAttempts: true
                  }
                }
              }
            },
            enrollments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!instructor) {
      throw new Error('المدرس غير موجود');
    }

    // حساب إحصائيات المدرس
    const totalCourses = instructor.courses.length;
    const totalLessons = instructor.courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const totalStudents = instructor.courses.reduce((sum, course) => sum + course.enrollments.length, 0);
    
    // حساب إجمالي المشاهدات
    const totalViews = instructor.courses.reduce((sum, course) => 
      sum + course.lessons.reduce((lessonSum, lesson) => 
        lessonSum + lesson.lessonProgress.length, 0
      ), 0
    );

    // حساب متوسط الدرجات
    const allQuizAttempts = instructor.courses.flatMap(course =>
      course.lessons.flatMap(lesson =>
        lesson.quizzes.flatMap(quiz => quiz.quizAttempts)
      )
    );
    
    const averageScore = allQuizAttempts.length > 0
      ? allQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / allQuizAttempts.length
      : 0;

    // جلب الدورات الحديثة
    const recentCourses = instructor.courses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(course => ({
        ...course,
        studentsCount: course.enrollments.length,
        lessonsCount: course.lessons.length,
        completionRate: course.lessons.length > 0 
          ? (course.lessons.reduce((sum, lesson) => 
              sum + lesson.lessonProgress.filter(p => p.completed).length, 0
            ) / (course.lessons.length * course.enrollments.length)) * 100
          : 0
      }));

    // جلب أفضل الطلاب أداءً
    const topStudents = instructor.courses
      .flatMap(course => course.enrollments)
      .reduce((acc: any[], enrollment) => {
        const existingStudent = acc.find(s => s.userId === enrollment.userId);
        if (existingStudent) {
          existingStudent.coursesCount++;
        } else {
          acc.push({
            userId: enrollment.userId,
            user: enrollment.user,
            coursesCount: 1,
            enrolledAt: enrollment.createdAt
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.coursesCount - a.coursesCount)
      .slice(0, 5);

    // جلب آخر الأنشطة
    const recentActivity = [
      ...instructor.courses.flatMap(course =>
        course.enrollments.slice(-3).map(enrollment => ({
          id: `enrollment_${enrollment.id}`,
          type: 'student_enrolled',
          message: `انضم ${enrollment.user.name} لدورة ${course.title}`,
          timestamp: enrollment.createdAt,
          courseId: course.id
        }))
      ),
      ...allQuizAttempts.slice(-3).map(attempt => ({
        id: `quiz_${attempt.id}`,
        type: 'quiz_completed',
        message: `طالب أكمل اختبار بدرجة ${attempt.score}%`,
        timestamp: attempt.createdAt,
        score: attempt.score
      }))
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8);

    // تحضير بيانات المخططات
    const performanceData = generatePerformanceData();
    const studentsGrowthData = generateStudentsGrowthData();

    return {
      instructor,
      instructorStats: {
        totalCourses,
        totalLessons,
        totalStudents,
        totalViews,
        averageScore: Math.round(averageScore),
        totalRevenue: totalStudents * 50, // تقدير بسيط
        activeStudents: Math.round(totalStudents * 0.7) // تقدير الطلاب النشطين
      },
      recentCourses,
      topStudents,
      recentActivity,
      charts: {
        performance: performanceData,
        studentsGrowth: studentsGrowthData
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات المدرس:', error);
    throw error;
  }
}

// توليد بيانات أداء الدورات (مؤقت)
function generatePerformanceData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    views: Math.floor(Math.random() * 500) + 200 + index * 50,
    completions: Math.floor(Math.random() * 100) + 50 + index * 10,
    ratings: (Math.random() * 1 + 4).toFixed(1) // 4.0 - 5.0
  }));
}

// توليد بيانات نمو الطلاب (مؤقت)
function generateStudentsGrowthData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    newStudents: Math.floor(Math.random() * 30) + 10 + index * 5,
    activeStudents: Math.floor(Math.random() * 80) + 40 + index * 10,
    retentionRate: Math.floor(Math.random() * 20) + 70 + index * 2
  }));
}

export default async function InstructorDashboardPage() {
  // التحقق من المصادقة والصلاحيات
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // التحقق من أن المستخدم مدرس أو مدير
  if (!['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  استوديو المدرس 👨‍🏫
                </h1>
                <p className="text-indigo-100">
                  إنشاء وإدارة المحتوى التعليمي مع أدوات متقدمة
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إنشاء دورة جديدة
                </button>
                
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  إنشاء درس
                </button>
                
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  التحليلات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى لوحة التحكم */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <InstructorDataWrapper userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

// مكون لتحميل البيانات وعرضها
async function InstructorDataWrapper({ userId }: { userId: string }) {
  try {
    const instructorData = await getInstructorData(userId);
    return <InstructorDashboardContent {...instructorData} />;
  } catch (error: any) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          خطأ في تحميل بيانات المدرس
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {error.message || 'حدث خطأ أثناء جلب بيانات المدرس. يرجى المحاولة مرة أخرى.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }
}
