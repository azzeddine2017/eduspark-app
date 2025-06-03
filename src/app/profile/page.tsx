import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { 
  User, 
  BookOpen, 
  Trophy, 
  Clock, 
  Settings, 
  Edit3, 
  Mail, 
  Calendar,
  Target,
  Heart,
  Award,
  TrendingUp,
  Activity,
  Users,
  MessageCircle
} from "lucide-react"
import Header from "@/components/Header"
import ProfileEditForm from "@/components/ProfileEditForm"
import ProgressChart from "@/components/ProgressChart"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // جلب إحصائيات المستخدم
  const [enrollments, completedLessons, totalInteractions] = await Promise.all([
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
      }
    }),
    prisma.lessonProgress.count({
      where: { 
        userId: user.id,
        completed: true 
      }
    }),
    prisma.llmInteractionLog.count({
      where: { userId: user.id }
    })
  ])

  // حساب التقدم الإجمالي
  const totalLessons = enrollments.reduce((sum, enrollment) => 
    sum + enrollment.course._count.lessons, 0
  )
  const progressPercentage = totalLessons > 0 ? 
    Math.round((completedLessons / totalLessons) * 100) : 0

  // حساب الدورات المكتملة
  const completedCourses = enrollments.filter(enrollment => 
    enrollment.progress === 100
  ).length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center ml-6">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold arabic-text mb-2">
                    {user.name}
                  </h1>
                  <p className="text-lg opacity-90 arabic-text">
                    {user.email}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                      <Calendar className="w-4 h-4 ml-1" />
                      انضم في {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {user.role === 'ADMIN' ? 'مسؤول' : 'طالب'}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href="/profile/edit"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center"
              >
                <Edit3 className="w-4 h-4 ml-2" />
                تعديل الملف الشخصي
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدورات المسجلة</p>
                <p className="text-3xl font-bold text-high-contrast">{enrollments.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدورات المكتملة</p>
                <p className="text-3xl font-bold text-high-contrast">{completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">الدروس المكتملة</p>
                <p className="text-3xl font-bold text-high-contrast">{completedLessons}</p>
              </div>
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-medium-contrast arabic-text">التقدم الإجمالي</p>
                <p className="text-3xl font-bold text-high-contrast">{progressPercentage}%</p>
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
            {/* Progress Overview */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
                <Activity className="w-5 h-5 ml-2" />
                نظرة عامة على التقدم
              </h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-medium-contrast arabic-text">التقدم الإجمالي</span>
                  <span className="text-sm font-medium text-high-contrast">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-2xl font-bold text-success">{completedLessons}</p>
                  <p className="text-sm text-medium-contrast arabic-text">دروس مكتملة</p>
                </div>
                <div className="text-center p-4 bg-surface rounded-lg">
                  <p className="text-2xl font-bold text-primary">{totalLessons - completedLessons}</p>
                  <p className="text-sm text-medium-contrast arabic-text">دروس متبقية</p>
                </div>
              </div>
            </div>

            {/* Recent Courses */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
                <BookOpen className="w-5 h-5 ml-2" />
                الدورات الحالية
              </h3>
              
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-high-contrast arabic-text">
                        {enrollment.course.title}
                      </h4>
                      <p className="text-sm text-medium-contrast arabic-text mt-1">
                        {enrollment.course.description?.substring(0, 100)}...
                      </p>
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
                
                {enrollments.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-medium-contrast mx-auto mb-4" />
                    <p className="text-medium-contrast arabic-text">لم تسجل في أي دورة بعد</p>
                    <Link href="/courses" className="btn btn-primary mt-4">
                      تصفح الدورات
                    </Link>
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
                <Settings className="w-5 h-5 ml-2" />
                إجراءات سريعة
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/profile/edit"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <Edit3 className="w-4 h-4 ml-2" />
                  تعديل الملف الشخصي
                </Link>
                
                <Link
                  href="/courses"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 ml-2" />
                  تصفح الدورات
                </Link>
                
                <Link
                  href="/profile/settings"
                  className="w-full btn btn-outline flex items-center justify-center"
                >
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </Link>
              </div>
            </div>

            {/* AI Usage Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 ml-2" />
                استخدام المساعد الذكي
              </h3>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalInteractions}</p>
                <p className="text-sm text-medium-contrast arabic-text">إجمالي التفاعلات</p>
                
                <div className="mt-4 p-3 bg-surface rounded-lg">
                  <p className="text-sm text-medium-contrast arabic-text">
                    الحد اليومي: {user.role === 'ADMIN' ? '50' : '10'} استفسار
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4 flex items-center">
                <Trophy className="w-5 h-5 ml-2" />
                الإنجازات
              </h3>
              
              <div className="space-y-3">
                {completedCourses > 0 && (
                  <div className="flex items-center p-3 bg-success bg-opacity-10 rounded-lg">
                    <Award className="w-6 h-6 text-success ml-3" />
                    <div>
                      <p className="text-sm font-medium text-high-contrast arabic-text">أول دورة مكتملة</p>
                      <p className="text-xs text-medium-contrast arabic-text">أكملت دورتك الأولى!</p>
                    </div>
                  </div>
                )}
                
                {enrollments.length >= 5 && (
                  <div className="flex items-center p-3 bg-primary bg-opacity-10 rounded-lg">
                    <Heart className="w-6 h-6 text-primary ml-3" />
                    <div>
                      <p className="text-sm font-medium text-high-contrast arabic-text">متعلم نشط</p>
                      <p className="text-xs text-medium-contrast arabic-text">سجلت في 5 دورات أو أكثر</p>
                    </div>
                  </div>
                )}
                
                {totalInteractions >= 50 && (
                  <div className="flex items-center p-3 bg-accent bg-opacity-10 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-accent ml-3" />
                    <div>
                      <p className="text-sm font-medium text-high-contrast arabic-text">مستخدم المساعد الذكي</p>
                      <p className="text-xs text-medium-contrast arabic-text">استخدمت المساعد 50 مرة</p>
                    </div>
                  </div>
                )}
                
                {completedCourses === 0 && enrollments.length === 0 && totalInteractions < 10 && (
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
    </div>
  )
}
