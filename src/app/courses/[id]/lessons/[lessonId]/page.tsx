import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AIAssistant from "@/components/AIAssistant"
import TextSummarizer from "@/components/TextSummarizer"

interface LessonPageProps {
  params: Promise<{
    id: string
    lessonId: string
  }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params
  const user = await getCurrentUser()

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
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
            },
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })

  if (!lesson) {
    notFound()
  }

  // Check if lesson is published or user has access
  if (!lesson.isPublished) {
    if (!user || (user.role !== 'ADMIN' && user.id !== lesson.course.authorId)) {
      notFound()
    }
  }

  // Check if course is published
  if (!lesson.course.isPublished) {
    if (!user || (user.role !== 'ADMIN' && user.id !== lesson.course.authorId)) {
      notFound()
    }
  }

  // Find current lesson index and navigation
  const currentIndex = lesson.course.lessons.findIndex(l => l.id === lesson.id)
  const previousLesson = currentIndex > 0 ? lesson.course.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lesson.course.lessons.length - 1 ? lesson.course.lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                منصة فتح
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/courses/${lesson.course.id}`}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
              >
                {lesson.course.title}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700 dark:text-gray-300">{lesson.title}</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-gray-700 dark:text-gray-300">
                  مرحباً، {user.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                محتويات الدورة
              </h3>
              <div className="space-y-2">
                {lesson.course.lessons.map((courseLesson, index) => (
                  <Link
                    key={courseLesson.id}
                    href={`/courses/${lesson.course.id}/lessons/${courseLesson.id}`}
                    className={`block p-3 rounded-md transition-colors ${
                      courseLesson.id === lesson.id
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">
                        {index + 1}.
                      </span>
                      <span className="text-sm">{courseLesson.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              {/* Lesson Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {lesson.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>الدرس {currentIndex + 1} من {lesson.course.lessons.length}</span>
                  {lesson.duration && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{lesson.duration} دقيقة</span>
                    </>
                  )}
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {/* Render lesson content based on its structure */}
                  {typeof lesson.content === 'object' && lesson.content && 'blocks' in lesson.content ? (
                    (lesson.content as { blocks: Array<{ type: string; data: Record<string, unknown> }> }).blocks?.map((block: { type: string; data: Record<string, unknown> }, index: number) => (
                      <div key={index} className="mb-6">
                        {block.type === 'text' && (
                          <div dangerouslySetInnerHTML={{ __html: block.data.text || block.data }} />
                        )}
                        {block.type === 'image' && (
                          <Image
                            src={(block.data.url || block.data.src) as string}
                            alt={(block.data.caption as string) || 'صورة الدرس'}
                            width={800}
                            height={400}
                            className="w-full rounded-lg"
                          />
                        )}
                        {block.type === 'video' && (
                          <div className="aspect-video">
                            <iframe
                              src={block.data.url as string}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-700 dark:text-gray-300">
                      {typeof lesson.content === 'string' ? lesson.content : JSON.stringify(lesson.content)}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  {previousLesson ? (
                    <Link
                      href={`/courses/${lesson.course.id}/lessons/${previousLesson.id}`}
                      className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      الدرس السابق
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {nextLesson ? (
                    <Link
                      href={`/courses/${lesson.course.id}/lessons/${nextLesson.id}`}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      الدرس التالي
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${lesson.course.id}`}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      إنهاء الدورة
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AI Tools Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Assistant */}
            <AIAssistant lessonId={lesson.id} />

            {/* Text Summarizer */}
            <TextSummarizer lessonId={lesson.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
