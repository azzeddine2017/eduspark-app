import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * جلب إحصائيات الإشعارات للمستخدم الحالي
 * GET /api/notifications/stats
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

    const userId = session.user.id

    // جلب الإحصائيات الأساسية
    const [
      totalNotifications,
      unreadNotifications,
      readNotifications,
      archivedNotifications,
      todayNotifications,
      thisWeekNotifications
    ] = await Promise.all([
      // إجمالي الإشعارات
      prisma.notification.count({
        where: { userId }
      }),
      
      // الإشعارات غير المقروءة
      prisma.notification.count({
        where: { 
          userId,
          status: 'UNREAD'
        }
      }),
      
      // الإشعارات المقروءة
      prisma.notification.count({
        where: { 
          userId,
          status: 'read'
        }
      }),
      
      // الإشعارات المؤرشفة
      prisma.notification.count({
        where: { 
          userId,
          status: 'ARCHIVED'
        }
      }),
      
      // إشعارات اليوم
      prisma.notification.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      
      // إشعارات هذا الأسبوع
      prisma.notification.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      })
    ])

    // إحصائيات حسب النوع
    const notificationsByType = await prisma.notification.groupBy({
      by: ['type'],
      where: { userId },
      _count: {
        id: true
      }
    })

    // إحصائيات حسب الأولوية
    const notificationsByPriority = await prisma.notification.groupBy({
      by: ['priority'],
      where: { userId },
      _count: {
        id: true
      }
    })

    // إحصائيات الإشعارات اليومية للأسبوع الماضي
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'UNREAD' THEN 1 ELSE 0 END) as unread_count
      FROM notifications 
      WHERE userId = ${userId}
        AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    ` as Array<{
      date: string
      count: number
      unread_count: number
    }>

    // معدل القراءة (نسبة الإشعارات المقروءة)
    const readRate = totalNotifications > 0 
      ? Math.round((readNotifications / totalNotifications) * 100) 
      : 0

    // متوسط وقت القراءة (بالدقائق)
    const avgReadTime = await prisma.$queryRaw`
      SELECT AVG(TIMESTAMPDIFF(MINUTE, createdAt, readAt)) as avg_read_time
      FROM notifications 
      WHERE userId = ${userId} 
        AND readAt IS NOT NULL
        AND readAt > createdAt
    ` as Array<{ avg_read_time: number | null }>

    const averageReadTimeMinutes = avgReadTime[0]?.avg_read_time || 0

    // أحدث الإشعارات غير المقروءة (أول 5)
    const recentUnread = await prisma.notification.findMany({
      where: {
        userId,
        status: 'UNREAD'
      },
      select: {
        id: true,
        title: true,
        type: true,
        priority: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    return NextResponse.json({
      summary: {
        total: totalNotifications,
        unread: unreadNotifications,
        read: readNotifications,
        archived: archivedNotifications,
        today: todayNotifications,
        thisWeek: thisWeekNotifications,
        readRate,
        averageReadTimeMinutes: Math.round(averageReadTimeMinutes)
      },
      byType: notificationsByType.map(item => ({
        type: item.type,
        count: item._count.id
      })),
      byPriority: notificationsByPriority.map(item => ({
        priority: item.priority,
        count: item._count.id
      })),
      dailyStats: dailyStats.map(stat => ({
        date: stat.date,
        total: Number(stat.count),
        unread: Number(stat.unread_count),
        read: Number(stat.count) - Number(stat.unread_count)
      })),
      recentUnread
    })

  } catch (error) {
    console.error('خطأ في جلب إحصائيات الإشعارات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    )
  }
}
