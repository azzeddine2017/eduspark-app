import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// الحصول على تفاصيل درس محدد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }



    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            authorId: true,
            isPublished: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'الدرس غير موجود', success: false },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    // التحقق من الصلاحيات
    if (user?.role !== 'ADMIN' && lesson.course.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لعرض هذا الدرس', success: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        courseId: lesson.courseId,
        course: lesson.course,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الدرس:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء جلب الدرس',
        success: false
      },
      { status: 500 }
    );
  }
}

// تحديث درس محدد
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();

    // التحقق من وجود الدرس والصلاحيات
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            authorId: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'الدرس غير موجود', success: false },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN' && lesson.course.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتعديل هذا الدرس', success: false },
        { status: 403 }
      );
    }

    // تحديث الدرس
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    console.log(`✏️ تم تحديث الدرس "${updatedLesson.title}" في الدورة "${updatedLesson.course.title}":`, {
      lessonId,
      updates: Object.keys(updateData),
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      lesson: {
        id: updatedLesson.id,
        title: updatedLesson.title,
        content: updatedLesson.content,
        order: updatedLesson.order,
        duration: updatedLesson.duration,
        isPublished: updatedLesson.isPublished,
        courseId: updatedLesson.courseId,
        course: updatedLesson.course,
        updatedAt: updatedLesson.updatedAt
      },
      message: 'تم تحديث الدرس بنجاح'
    });

  } catch (error) {
    console.error('خطأ في تحديث الدرس:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء تحديث الدرس',
        success: false
      },
      { status: 500 }
    );
  }
}

// حذف درس محدد
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: lessonId } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }



    // التحقق من وجود الدرس والصلاحيات
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            authorId: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'الدرس غير موجود', success: false },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN' && lesson.course.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لحذف هذا الدرس', success: false },
        { status: 403 }
      );
    }

    // حذف الدرس
    await prisma.lesson.delete({
      where: { id: lessonId }
    });

    console.log(`🗑️ تم حذف الدرس "${lesson.title}" من الدورة "${lesson.course.title}":`, {
      lessonId,
      courseId: lesson.courseId,
      userId: session.user.id
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الدرس بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف الدرس:', error);
    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء حذف الدرس',
        success: false
      },
      { status: 500 }
    );
  }
}
