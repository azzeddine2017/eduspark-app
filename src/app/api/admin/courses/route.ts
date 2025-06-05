import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "غير مصرح لك بهذا الإجراء" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, level, duration, thumbnail, isPublished, lessons } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { message: "العنوان والوصف مطلوبان" },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        level: level || 'BEGINNER',
        duration: duration || null,
        thumbnail: thumbnail || null,
        isPublished: isPublished || false,
        authorId: session.user.id,
      }
    })

    // Create lessons if provided
    if (lessons && lessons.length > 0) {
      const validLessons = lessons.filter((lesson: any) => lesson.title?.trim())
      
      if (validLessons.length > 0) {
        await prisma.lesson.createMany({
          data: validLessons.map((lesson: any, index: number) => ({
            title: lesson.title,
            content: {
              blocks: [
                {
                  type: 'text',
                  data: lesson.content || ''
                }
              ]
            },
            order: index + 1,
            duration: parseInt(lesson.duration) || null,
            courseId: course.id,
            isPublished: isPublished || false
          }))
        })
      }
    }

    // Return the created course with lessons count
    const courseWithCount = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        _count: {
          select: { lessons: true }
        }
      }
    })

    return NextResponse.json(courseWithCount, { status: 201 })

  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الدورة" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: "غير مصرح لك بهذا الإجراء" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const level = searchParams.get('level') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    if (status === 'published') {
      where.isPublished = true
    } else if (status === 'draft') {
      where.isPublished = false
    }
    
    if (level) {
      where.level = level.toUpperCase()
    }

    // Get courses with pagination
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              lessons: true
            }
          }
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
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب الدورات" },
      { status: 500 }
    )
  }
}
