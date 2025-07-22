import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// الحصول على دروس دورة محددة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }



    // التحقق من وجود الدورة والصلاحيات
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        authorId: true, 
        title: true,
        isPublished: true
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة', success: false },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    // التحقق من الصلاحيات
    if (user?.role !== 'ADMIN' && course.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لعرض دروس هذه الدورة', success: false },
        { status: 403 }
      );
    }

    // جلب الدروس
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        order: true,
        duration: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log(`📚 تم جلب ${lessons.length} درس للدورة "${course.title}":`, {
      courseId,
      lessonsCount: lessons.length,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      })),
      course: {
        id: courseId,
        title: course.title,
        isPublished: course.isPublished
      }
    });

  } catch (error) {
    console.error('خطأ في جلب دروس الدورة:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء جلب دروس الدورة',
        success: false
      },
      { status: 500 }
    );
  }
}

// إنشاء درس جديد
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: courseId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();

    // التحقق من وجود الدورة والصلاحيات
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        authorId: true, 
        title: true,
        _count: {
          select: { lessons: true }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة', success: false },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN' && course.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لإضافة دروس لهذه الدورة', success: false },
        { status: 403 }
      );
    }

    // إنشاء الدرس الجديد
    const newLesson = await prisma.lesson.create({
      data: {
        title: body.title || 'درس جديد',
        content: body.content || {
          type: 'text',
          content: 'محتوى الدرس...',
          examples: [],
          activities: [],
          resources: [],
          hasInteractiveElements: false
        },
        order: body.order || (course._count.lessons + 1),
        duration: body.duration || 30,
        courseId: courseId,
        isPublished: false
      }
    });

    console.log(`➕ تم إنشاء درس جديد "${newLesson.title}" في الدورة "${course.title}":`, {
      lessonId: newLesson.id,
      courseId,
      order: newLesson.order,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      lesson: {
        id: newLesson.id,
        title: newLesson.title,
        content: newLesson.content,
        order: newLesson.order,
        duration: newLesson.duration,
        isPublished: newLesson.isPublished,
        createdAt: newLesson.createdAt
      },
      message: 'تم إنشاء الدرس بنجاح'
    });

  } catch (error) {
    console.error('خطأ في إنشاء الدرس:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء إنشاء الدرس',
        success: false
      },
      { status: 500 }
    );
  }
}
