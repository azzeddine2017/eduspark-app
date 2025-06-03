import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'معرف الدورة مطلوب' },
        { status: 400 }
      )
    }

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        isPublished: true,
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      )
    }

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'الدورة غير متاحة للتسجيل' },
        { status: 400 }
      )
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'أنت مسجل في هذه الدورة بالفعل' },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        progress: 0,
      },
      include: {
        course: {
          select: {
            title: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: `تم التسجيل في دورة "${enrollment.course.title}" بنجاح`,
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt,
      }
    })

  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    )
  }
}
