import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // جلب جميع بيانات المستخدم
    const [
      userProfile,
      enrollments,
      lessonProgress,
      llmInteractions,
      userSettings,
      createdCourses
    ] = await Promise.all([
      // بيانات الملف الشخصي
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          bio: true,
          website: true,
          birthDate: true,
          occupation: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        }
      }),

      // التسجيلات في الدورات
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              createdAt: true
            }
          }
        }
      }),

      // تقدم الدروس
      prisma.lessonProgress.findMany({
        where: { userId: user.id },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      }),

      // تفاعلات المساعد الذكي
      prisma.lLMInteractionLog.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          prompt: true,
          response: true,
          createdAt: true,
          lessonId: true,
          cost: true
        },
        orderBy: { createdAt: 'desc' },
        take: 1000 // آخر 1000 تفاعل
      }),

      // إعدادات المستخدم
      prisma.userSettings.findUnique({
        where: { userId: user.id }
      }),

      // الدورات التي أنشأها المستخدم
      prisma.course.findMany({
        where: { authorId: user.id },
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              content: true,
              order: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              enrollments: true
            }
          }
        }
      })
    ])

    // إحصائيات إضافية
    const stats = {
      totalEnrollments: enrollments.length,
      completedLessons: lessonProgress.filter(p => p.completed).length,
      totalLessons: lessonProgress.length,
      totalLLMInteractions: llmInteractions.length,
      coursesCreated: createdCourses.length,
      totalStudentsEnrolled: createdCourses.reduce((sum, course) => sum + course._count.enrollments, 0)
    }

    // تجميع البيانات
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        exportVersion: "1.0",
        platform: "منصة فتح للتعلّم الذكي"
      },
      userProfile,
      stats,
      enrollments: enrollments.map(enrollment => ({
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        courseDescription: enrollment.course.description,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt
      })),
      lessonProgress: lessonProgress.map(progress => ({
        lessonId: progress.lesson.id,
        lessonTitle: progress.lesson.title,
        courseId: progress.lesson.course.id,
        courseTitle: progress.lesson.course.title,
        completed: progress.completed,
        completedAt: progress.completedAt,
        timeSpent: progress.timeSpent
      })),
      llmInteractions: llmInteractions.map(interaction => ({
        id: interaction.id,
        prompt: interaction.prompt,
        response: interaction.response,
        timestamp: interaction.createdAt,
        lessonId: interaction.lessonId,
        cost: interaction.cost
      })),
      userSettings: userSettings?.settings || {},
      createdCourses: createdCourses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        published: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        studentsEnrolled: course._count.enrollments,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          createdAt: lesson.createdAt,
          contentLength: lesson.content ? JSON.stringify(lesson.content).length : 0
        }))
      }))
    }

    // إنشاء استجابة JSON للتحميل
    const jsonString = JSON.stringify(exportData, null, 2)
    const buffer = Buffer.from(jsonString, 'utf-8')

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="fateh-data-${user.id}-${new Date().toISOString().split('T')[0]}.json"`,
        'Content-Length': buffer.length.toString(),
      },
    })

  } catch (error) {
    console.error("Error exporting user data:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء تصدير البيانات" },
      { status: 500 }
    )
  }
}
