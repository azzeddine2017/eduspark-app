import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Prisma, CourseLevel } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: Prisma.CourseWhereInput = {
      isPublished: true,
    }

    if (category) {
      where.categories = {
        some: {
          name: category
        }
      }
    }

    if (level && Object.values(CourseLevel).includes(level as CourseLevel)) {
      where.level = level as CourseLevel
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            }
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.course.count({ where })
    ])

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الدورات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بإنشاء دورات' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, level, thumbnail } = body

    if (!title) {
      return NextResponse.json(
        { error: 'عنوان الدورة مطلوب' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level || 'BEGINNER',
        thumbnail,
        authorId: user.id,
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
      message: 'تم إنشاء الدورة بنجاح',
      course
    })

  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الدورة' },
      { status: 500 }
    )
  }
}
