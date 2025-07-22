import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
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
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      )
    }

    if (!course.isPublished) {
      const user = await getCurrentUser()
      if (!user || (user.role !== 'ADMIN' && user.id !== course.authorId)) {
        return NextResponse.json(
          { error: 'الدورة غير متاحة' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ course })

  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الدورة' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعديل الدورات' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, level, thumbnail, isPublished } = body

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        level,
        thumbnail,
        isPublished,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم تحديث الدورة بنجاح',
      course
    })

  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الدورة' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بحذف الدورات' },
        { status: 403 }
      )
    }

    await prisma.course.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'تم حذف الدورة بنجاح'
    })

  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الدورة' },
      { status: 500 }
    )
  }
}

// تحديث تفاصيل الدورة
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      )
    }

    const body = await request.json()

    // التحقق من وجود الدورة والصلاحيات
    const course = await prisma.course.findUnique({
      where: { id },
      select: { authorId: true, title: true }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة', success: false },
        { status: 404 }
      )
    }

    if (user.role !== 'ADMIN' && course.authorId !== user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل هذه الدورة', success: false },
        { status: 403 }
      )
    }

    // تحديث الدورة
    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.level !== undefined) updateData.level = body.level
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished

      // إذا تم نشر الدورة، نشر جميع الدروس أيضاً
      if (body.isPublished) {
        await prisma.lesson.updateMany({
          where: { courseId: id },
          data: { isPublished: true }
        })
      }
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { name: true, email: true }
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true
          }
        }
      }
    })

    console.log(`✅ تم تحديث الدورة "${updatedCourse.title}":`, {
      courseId: id,
      updates: Object.keys(updateData),
      isPublished: updatedCourse.isPublished,
      userId: user.id
    })

    return NextResponse.json({
      success: true,
      course: {
        id: updatedCourse.id,
        title: updatedCourse.title,
        description: updatedCourse.description,
        level: updatedCourse.level,
        duration: updatedCourse.duration,
        isPublished: updatedCourse.isPublished,
        author: updatedCourse.author,
        lessonsCount: updatedCourse._count.lessons,
        enrollments: updatedCourse._count.enrollments,
        updatedAt: updatedCourse.updatedAt
      },
      message: body.isPublished ? 'تم نشر الدورة بنجاح!' : 'تم تحديث الدورة بنجاح!'
    })

  } catch (error) {
    console.error('خطأ في تحديث الدورة:', error)
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء تحديث الدورة',
        success: false
      },
      { status: 500 }
    )
  }
}
