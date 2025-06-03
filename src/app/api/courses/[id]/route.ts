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
