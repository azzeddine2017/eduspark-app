import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationStatus } from '@prisma/client'

/**
 * جلب إشعار محدد
 * GET /api/notifications/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { id: notificationId } = await params

    // جلب الإشعار
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id // التأكد من أن المستخدم يملك هذا الإشعار
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }

    // تحديد الإشعار كمقروء إذا لم يكن كذلك
    if (notification.status === 'UNREAD') {
      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      })

      // تحديث الكائن المحلي
      notification.status = 'READ' as NotificationStatus
      notification.readAt = new Date()
    }

    return NextResponse.json({ notification })

  } catch (error) {
    console.error('خطأ في جلب الإشعار:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإشعار' },
      { status: 500 }
    )
  }
}

/**
 * تحديث إشعار محدد
 * PATCH /api/notifications/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { id: notificationId } = await params

    // التحقق من وجود الإشعار وملكية المستخدم له
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }

    // استخراج بيانات التحديث
    const body = await request.json()
    const { status } = body

    // التحقق من صحة الحالة
    if (!status || !['UNREAD', 'READ', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: 'حالة الإشعار غير صحيحة' },
        { status: 400 }
      )
    }

    // بناء بيانات التحديث
    const updateData: any = { status }

    if (status === 'READ' && existingNotification.status === 'UNREAD') {
      updateData.readAt = new Date()
    }

    // تحديث الإشعار
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم تحديث الإشعار بنجاح',
      notification: updatedNotification
    })

  } catch (error) {
    console.error('خطأ في تحديث الإشعار:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الإشعار' },
      { status: 500 }
    )
  }
}

/**
 * حذف إشعار محدد
 * DELETE /api/notifications/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    const { id: notificationId } = await params

    // التحقق من وجود الإشعار وملكية المستخدم له
    const existingNotification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id
      }
    })

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }

    // حذف الإشعار
    await prisma.notification.delete({
      where: { id: notificationId }
    })

    return NextResponse.json({
      message: 'تم حذف الإشعار بنجاح'
    })

  } catch (error) {
    console.error('خطأ في حذف الإشعار:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الإشعار' },
      { status: 500 }
    )
  }
}
