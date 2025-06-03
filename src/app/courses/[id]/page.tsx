import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EnrollButton from "@/components/EnrollButton"

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      },
      lessons: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          order: true,
          duration: true,
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          enrollments: true,
        }
      }
    }
  })

  if (!course) {
    notFound()
  }

  // Check if course is published or user has access
  if (!course.isPublished) {
    if (!user || (user.role !== 'ADMIN' && user.id !== course.authorId)) {
      notFound()
    }
  }

  // Check if user is enrolled
  let enrollment = null
  if (user) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id
        }
      }
    })
  }

  // Removed unused handleEnrollment function

  const totalDuration = course.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                منصة فتح للتعلّم الذكي
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/courses" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                الدورات
              </Link>
            </div>
            {user && (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-gray-700 dark:text-gray-300">
                  مرحباً، {user.name}
                </span>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    لوحة التحكم
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {/* Course Header */}
              {course.thumbnail && (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={800}
                  height={256}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    course.level === 'BEGINNER'
                      ? 'bg-green-100 text-green-800'
                      : course.level === 'INTERMEDIATE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {course.level === 'BEGINNER' ? 'مبتدئ' :
                     course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
                  </span>
                  {!course.isPublished && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                      مسودة
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.title}
                </h1>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span>بواسطة {course.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>{course._count.enrollments} طالب</span>
                  <span className="mx-2">•</span>
                  <span>{course.lessons.length} درس</span>
                  {totalDuration > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{Math.floor(totalDuration / 60)} ساعة {totalDuration % 60} دقيقة</span>
                    </>
                  )}
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                  <p className="text-gray-700 dark:text-gray-300">
                    {course.description}
                  </p>
                </div>

                {/* Course Lessons */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    محتوى الدورة
                  </h2>
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-3">
                              {index + 1}.
                            </span>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {lesson.title}
                              </h3>
                              {lesson.duration && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {lesson.duration} دقيقة
                                </p>
                              )}
                            </div>
                          </div>
                          {enrollment ? (
                            <Link
                              href={`/courses/${course.id}/lessons/${lesson.id}`}
                              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
                            >
                              بدء الدرس
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              🔒 مقفل
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-8">
              {enrollment ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      أنت مسجل في هذه الدورة
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      تقدمك: {Math.round(enrollment.progress)}%
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>

                  {course.lessons.length > 0 && (
                    <Link
                      href={`/courses/${course.id}/lessons/${course.lessons[0].id}`}
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                    >
                      متابعة التعلم
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      ابدأ رحلتك التعليمية
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      سجل في هذه الدورة للوصول إلى جميع الدروس والميزات التفاعلية
                    </p>
                  </div>

                  {user ? (
                    <EnrollButton courseId={course.id} />
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/auth/register"
                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                      >
                        إنشاء حساب والتسجيل
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="w-full border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition-colors text-center block"
                      >
                        تسجيل الدخول
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      ما ستحصل عليه:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        الوصول إلى جميع الدروس
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        مساعد ذكي تفاعلي
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        أدوات تلخيص النصوص
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        تتبع التقدم
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
