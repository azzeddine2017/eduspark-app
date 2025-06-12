import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
  Star,
  Calendar,
  MessageCircle,
  Target,
  Award,
  Users,
  Zap
} from "lucide-react"
import Header from "@/components/Header"
import AdvancedAIAssistant from "@/components/ai/AdvancedAIAssistant"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // جلب البيانات المطلوبة
  const [
    enrollments,
    recentProgress,
    totalLessonsCompleted,
    totalTimeSpent,
    recentInteractions,
    upcomingDeadlines
  ] = await Promise.all([
    // الدورات المسجل فيها
    prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            _count: {
              select: { lessons: true }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 6
    }),

    // آخر التقدم
    prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        completed: true
      },
      include: {
        lesson: {
          include: {
            course: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 5
    }),

    // إجمالي الدروس المكتملة
    prisma.lessonProgress.count({
      where: {
        userId: user.id,
        completed: true
      }
    }),

    // إجمالي الوقت المقضي
    prisma.lessonProgress.aggregate({
      where: { userId: user.id },
      _sum: { timeSpent: true }
    }),

    // آخر التفاعلات مع المساعد الذكي
    prisma.lLMInteractionLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        prompt: true,
        response: true,
        createdAt: true,
        lesson: {
          select: {
            title: true,
            course: {
              select: { title: true }
            }
          }
        }
      }
    }),

    // مواعيد نهائية قادمة (محاكاة)
    []
  ])

  // حساب الإحصائيات
  const totalCourses = enrollments.length
  const completedCourses = enrollments.filter(e => e.progress === 100).length
  const totalTimeInHours = Math.round((totalTimeSpent._sum.timeSpent || 0) / 3600)
  const averageProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0

  // الدورات الحالية (قيد التقدم)
  const currentCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold arabic-text mb-2">
                  مرحباً، {user.name}! 👋
                </h1>
                <p className="text-lg opacity-90 arabic-text">
                  استمر في رحلة التعلم مع منصة فتح الموزعة العالمية 🌐
                </p>
                <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm">
                  <span className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    🤖 مساعد ذكي مخصص
                  </span>
                  <span className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    🌍 محتوى عالمي محلي
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-6 space-x-reverse">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 ml-2" />
                    <span>{completedCourses} دورة مكتملة</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 ml-2" />
                    <span>{totalTimeInHours} ساعة تعلم</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageProgress}%</div>
                <div className="text-sm opacity-90">متوسط التقدم</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدورات المسجلة</p>
                <p className="text-3xl font-bold text-high-contrast">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدروس المكتملة</p>
                <p className="text-3xl font-bold text-high-contrast">{totalLessonsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">ساعات التعلم</p>
                <p className="text-3xl font-bold text-high-contrast">{totalTimeInHours}</p>
              </div>
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">متوسط التقدم</p>
                <p className="text-3xl font-bold text-high-contrast">{averageProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-info bg-opacity-10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-high-contrast arabic-text flex items-center">
                  <Play className="w-5 h-5 ml-2" />
                  متابعة التعلم
                </h3>
                <Link href="/courses" className="text-primary hover:text-secondary text-sm">
                  عرض الكل
                </Link>
              </div>

              <div className="space-y-4">
                {currentCourses.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-border transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-high-contrast arabic-text">
                        {enrollment.course.title}
                      </h4>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-medium-contrast">التقدم</span>
                          <span className="text-xs font-medium text-high-contrast">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/courses/${enrollment.course.id}`}
                      className="btn btn-primary text-sm mr-4"
                    >
                      متابعة
                    </Link>
                  </div>
                ))}

                {currentCourses.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-medium-contrast mx-auto mb-4" />
                    <p className="text-medium-contrast arabic-text mb-4">لا توجد دورات قيد التقدم</p>
                    <Link href="/courses" className="btn btn-primary">
                      تصفح الدورات
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 ml-2" />
                النشاط الأخير
              </h3>

              <div className="space-y-4">
                {recentProgress.map((progress) => (
                  <div key={progress.id} className="flex items-center p-3 bg-surface rounded-lg">
                    <div className="w-10 h-10 bg-success bg-opacity-10 rounded-full flex items-center justify-center ml-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-high-contrast arabic-text">
                        أكملت درس "{progress.lesson.title}"
                      </p>
                      <p className="text-xs text-medium-contrast arabic-text">
                        في دورة {progress.lesson.course.title}
                      </p>
                      <p className="text-xs text-medium-contrast">
                        {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString('ar-SA') : ''}
                      </p>
                    </div>
                  </div>
                ))}

                {recentProgress.length === 0 && (
                  <div className="text-center py-4">
                    <Target className="w-8 h-8 text-medium-contrast mx-auto mb-2" />
                    <p className="text-sm text-medium-contrast arabic-text">لا يوجد نشاط حديث</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4 flex items-center">
                <Zap className="w-5 h-5 ml-2" />
                إجراءات سريعة
              </h3>

              <div className="space-y-3">
                <Link
                  href="/courses"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 ml-2" />
                  تصفح الدورات
                </Link>

                <Link
                  href="/profile"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <Users className="w-4 h-4 ml-2" />
                  الملف الشخصي
                </Link>

                <Link
                  href="/profile/settings"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <Target className="w-4 h-4 ml-2" />
                  الإعدادات
                </Link>
              </div>
            </div>

            {/* AI Assistant Recent */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 ml-2" />
                المساعد الذكي المتطور
              </h3>

              <div className="space-y-3">
                {recentInteractions.map((interaction) => (
                  <div key={interaction.id} className="p-3 bg-surface rounded-lg">
                    <p className="text-sm text-high-contrast arabic-text mb-1">
                      {interaction.prompt.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-medium-contrast">
                      {new Date(interaction.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                ))}

                {recentInteractions.length === 0 && (
                  <div className="text-center py-4">
                    <MessageCircle className="w-8 h-8 text-medium-contrast mx-auto mb-2" />
                    <p className="text-sm text-medium-contrast arabic-text">لم تستخدم المساعد بعد</p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4 flex items-center">
                <Award className="w-5 h-5 ml-2" />
                الإنجازات الأخيرة
              </h3>

              <div className="space-y-3">
                {completedCourses > 0 && (
                  <div className="flex items-center p-3 bg-success bg-opacity-10 rounded-lg">
                    <Trophy className="w-6 h-6 text-success ml-3" />
                    <div>
                      <p className="text-sm font-medium text-high-contrast arabic-text">أول دورة مكتملة</p>
                      <p className="text-xs text-medium-contrast arabic-text">أكملت دورتك الأولى!</p>
                    </div>
                  </div>
                )}

                {totalLessonsCompleted >= 10 && (
                  <div className="flex items-center p-3 bg-primary bg-opacity-10 rounded-lg">
                    <Star className="w-6 h-6 text-primary ml-3" />
                    <div>
                      <p className="text-sm font-medium text-high-contrast arabic-text">متعلم نشط</p>
                      <p className="text-xs text-medium-contrast arabic-text">أكملت 10 دروس أو أكثر</p>
                    </div>
                  </div>
                )}

                {totalCourses === 0 && totalLessonsCompleted === 0 && (
                  <div className="text-center py-4">
                    <Target className="w-8 h-8 text-medium-contrast mx-auto mb-2" />
                    <p className="text-sm text-medium-contrast arabic-text">ابدأ رحلة التعلم لكسب الإنجازات!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced AI Assistant */}
      <AdvancedAIAssistant
        context={`لوحة تحكم المستخدم - ${user.name}`}
        nodeId="pilot-riyadh-001"
        culturalContext={{
          region: 'الرياض',
          language: 'العربية',
          level: 'متوسط'
        }}
      />
    </div>
  )
}
