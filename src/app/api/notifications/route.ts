import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationType, NotificationPriority, NotificationStatus } from '@prisma/client'

/**
 * جلب إشعارات المستخدم الحالي
 * GET /api/notifications
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // استخراج معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as NotificationStatus | null
    const type = searchParams.get('type') as NotificationType | null
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // بناء شروط الاستعلام
    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    if (unreadOnly) {
      where.status = 'UNREAD'
    }

    // حساب الإزاحة للصفحات
    const skip = (page - 1) * limit

    // جلب الإشعارات مع العدد الإجمالي
    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        status: 'UNREAD'
      }
    })

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      },
      unreadCount
    })

  } catch (error) {
    console.error('خطأ في جلب الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإشعارات' },
      { status: 500 }
    )
  }
}

/**
 * إنشاء إشعار جديد
 * POST /api/notifications
 */
export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // التحقق من صلاحيات الإرسال (فقط المدراء والمدرسين)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'INSTRUCTOR', 'CONTENT_CREATOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بإرسال الإشعارات' },
        { status: 403 }
      )
    }

    // استخراج بيانات الطلب
    const body = await request.json()
    const {
      title,
      message,
      type,
      priority = 'MEDIUM',
      userId,
      userIds,
      metadata,
      actionUrl,
      expiresAt
    } = body

    // التحقق من صحة البيانات المطلوبة
    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'العنوان والرسالة والنوع مطلوبة' },
        { status: 400 }
      )
    }

    // تحديد المستلمين
    let recipientIds: string[] = []
    
    if (userId) {
      // إرسال لمستخدم واحد
      recipientIds = [userId]
    } else if (userIds && Array.isArray(userIds)) {
      // إرسال لعدة مستخدمين
      recipientIds = userIds
    } else {
      return NextResponse.json(
        { error: 'يجب تحديد المستلم أو المستلمين' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستلمين
    const existingUsers = await prisma.user.findMany({
      where: {
        id: { in: recipientIds }
      },
      select: { id: true }
    })

    if (existingUsers.length !== recipientIds.length) {
      return NextResponse.json(
        { error: 'بعض المستخدمين المحددين غير موجودين' },
        { status: 400 }
      )
    }

    // إنشاء الإشعارات
    const notifications = await prisma.notification.createMany({
      data: recipientIds.map(recipientId => ({
        title,
        message,
        type: type as NotificationType,
        priority: priority as NotificationPriority,
        userId: recipientId,
        senderId: session.user.id,
        metadata: metadata || null,
        actionUrl: actionUrl || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }))
    })

    return NextResponse.json({
      message: 'تم إرسال الإشعارات بنجاح',
      count: notifications.count
    }, { status: 201 })

  } catch (error) {
    console.error('خطأ في إنشاء الإشعار:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الإشعار' },
      { status: 500 }
    )
  }
}

/**
 * تحديث حالة عدة إشعارات
 * PATCH /api/notifications
 */
export async function PATCH(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // استخراج بيانات الطلب
    const body = await request.json()
    const { notificationIds, status, markAllAsRead } = body

    if (markAllAsRead) {
      // تحديد جميع الإشعارات كمقروءة
      const result = await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          status: 'UNREAD'
        },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      })

      return NextResponse.json({
        message: 'تم تحديد جميع الإشعارات كمقروءة',
        updatedCount: result.count
      })
    }

    // التحقق من صحة البيانات
    if (!notificationIds || !Array.isArray(notificationIds) || !status) {
      return NextResponse.json(
        { error: 'معرفات الإشعارات والحالة مطلوبة' },
        { status: 400 }
      )
    }

    // تحديث الإشعارات المحددة
    const updateData: any = { status }
    if (status === 'read') {
      updateData.readAt = new Date()
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id // التأكد من أن المستخدم يملك هذه الإشعارات
      },
      data: updateData
    })

    return NextResponse.json({
      message: 'تم تحديث الإشعارات بنجاح',
      updatedCount: result.count
    })

  } catch (error) {
    console.error('خطأ في تحديث الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الإشعارات' },
      { status: 500 }
    )
  }
}

/**
 * حذف إشعارات
 * DELETE /api/notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // استخراج معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const notificationIds = searchParams.get('ids')?.split(',') || []
    const deleteAll = searchParams.get('deleteAll') === 'true'

    if (deleteAll) {
      // حذف جميع الإشعارات المقروءة والمؤرشفة
      const result = await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
          status: { in: ['read', 'ARCHIVED'] }
        }
      })

      return NextResponse.json({
        message: 'تم حذف جميع الإشعارات المقروءة',
        deletedCount: result.count
      })
    }

    if (notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'لم يتم تحديد إشعارات للحذف' },
        { status: 400 }
      )
    }

    // حذف الإشعارات المحددة
    const result = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id // التأكد من أن المستخدم يملك هذه الإشعارات
      }
    })

    return NextResponse.json({
      message: 'تم حذف الإشعارات بنجاح',
      deletedCount: result.count
    })

  } catch (error) {
    console.error('خطأ في حذف الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الإشعارات' },
      { status: 500 }
    )
  }
}
