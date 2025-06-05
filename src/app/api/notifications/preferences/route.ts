import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * جلب تفضيلات الإشعارات للمستخدم الحالي
 * GET /api/notifications/preferences
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

    // جلب تفضيلات المستخدم
    const preferences = await prisma.notificationPreference.findUnique({
      where: {
        userId: session.user.id
      }
    })

    // إعدادات افتراضية إذا لم توجد
    const defaultPreferences = {
      enableInApp: true,
      enableEmail: true,
      enablePush: false,
      courseNotifications: true,
      quizNotifications: true,
      systemNotifications: true,
      roleNotifications: true,
      achievementNotifications: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
      weeklyDigest: false
    }

    return NextResponse.json({
      preferences: preferences || defaultPreferences
    })

  } catch (error) {
    console.error('خطأ في جلب تفضيلات الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التفضيلات' },
      { status: 500 }
    )
  }
}

/**
 * حفظ تفضيلات الإشعارات للمستخدم الحالي
 * POST /api/notifications/preferences
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

    // استخراج بيانات التفضيلات
    const body = await request.json()
    const {
      enableInApp,
      enableEmail,
      enablePush,
      courseNotifications,
      quizNotifications,
      systemNotifications,
      roleNotifications,
      achievementNotifications,
      quietHoursStart,
      quietHoursEnd,
      weeklyDigest
    } = body

    // التحقق من صحة البيانات الأساسية
    if (typeof enableInApp !== 'boolean' || typeof enableEmail !== 'boolean') {
      return NextResponse.json(
        { error: 'بيانات التفضيلات غير صحيحة' },
        { status: 400 }
      )
    }

    // التحقق من صحة أوقات الهدوء
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (quietHoursStart && !timeRegex.test(quietHoursStart)) {
      return NextResponse.json(
        { error: 'وقت بداية ساعات الهدوء غير صحيح' },
        { status: 400 }
      )
    }

    if (quietHoursEnd && !timeRegex.test(quietHoursEnd)) {
      return NextResponse.json(
        { error: 'وقت نهاية ساعات الهدوء غير صحيح' },
        { status: 400 }
      )
    }

    // حفظ أو تحديث التفضيلات
    const preferences = await prisma.notificationPreference.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        enableInApp: enableInApp ?? true,
        enableEmail: enableEmail ?? true,
        enablePush: enablePush ?? false,
        courseNotifications: courseNotifications ?? true,
        quizNotifications: quizNotifications ?? true,
        systemNotifications: systemNotifications ?? true,
        roleNotifications: roleNotifications ?? true,
        achievementNotifications: achievementNotifications ?? true,
        quietHoursStart: quietHoursStart || '22:00',
        quietHoursEnd: quietHoursEnd || '08:00',
        weeklyDigest: weeklyDigest ?? false,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        enableInApp: enableInApp ?? true,
        enableEmail: enableEmail ?? true,
        enablePush: enablePush ?? false,
        courseNotifications: courseNotifications ?? true,
        quizNotifications: quizNotifications ?? true,
        systemNotifications: systemNotifications ?? true,
        roleNotifications: roleNotifications ?? true,
        achievementNotifications: achievementNotifications ?? true,
        quietHoursStart: quietHoursStart || '22:00',
        quietHoursEnd: quietHoursEnd || '08:00',
        weeklyDigest: weeklyDigest ?? false
      }
    })

    return NextResponse.json({
      message: 'تم حفظ التفضيلات بنجاح',
      preferences
    })

  } catch (error) {
    console.error('خطأ في حفظ تفضيلات الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حفظ التفضيلات' },
      { status: 500 }
    )
  }
}

/**
 * حذف تفضيلات الإشعارات (إعادة تعيين للافتراضي)
 * DELETE /api/notifications/preferences
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

    // حذف التفضيلات الحالية (سيتم استخدام الافتراضية)
    await prisma.notificationPreference.deleteMany({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      message: 'تم إعادة تعيين التفضيلات للقيم الافتراضية'
    })

  } catch (error) {
    console.error('خطأ في حذف تفضيلات الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين التفضيلات' },
      { status: 500 }
    )
  }
}
