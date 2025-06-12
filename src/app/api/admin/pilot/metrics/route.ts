import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/pilot/metrics - جلب مؤشرات العقدة التجريبية
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d' // 7d, 30d, 90d
    const nodeId = searchParams.get('nodeId') || 'pilot-algiers-001'

    // حساب التواريخ بناءً على الإطار الزمني
    const now = new Date()
    let startDate = new Date()

    switch (timeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // جلب بيانات العقدة التجريبية
    const pilotNode = await prisma.localNode.findFirst({
      where: {
        id: nodeId
      },
      include: {
        partners: true,
        _count: {
          select: {
            users: true,
            challenges: true
          }
        }
      }
    })

    if (!pilotNode) {
      return NextResponse.json({
        success: false,
        error: 'العقدة التجريبية غير موجودة'
      }, { status: 404 })
    }

    // جلب إحصائيات بسيطة
    const totalUsers = await prisma.user.count({
      where: { localNodeId: nodeId }
    })

    const totalSubscriptions = await prisma.subscription.count({
      where: {
        user: {
          localNodeId: nodeId
        }
      }
    })

    const activeSubscriptions = await prisma.subscription.count({
      where: {
        user: {
          localNodeId: nodeId
        },
        status: 'ACTIVE'
      }
    })

    const totalRevenue = await prisma.subscription.aggregate({
      where: {
        user: {
          localNodeId: nodeId
        },
        status: 'ACTIVE'
      },
      _sum: {
        amount: true
      }
    })

    const totalChallenges = await prisma.pilotChallenge.count({
      where: { nodeId: nodeId }
    })

    const openChallenges = await prisma.pilotChallenge.count({
      where: {
        nodeId: nodeId,
        status: 'OPEN'
      }
    })

    // حساب المؤشرات الرئيسية
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0
    const revenueAmount = Number(totalRevenue._sum.amount || 0)

    // بيانات الأداء الأسبوعي (محاكاة)
    const weeklyData = [
      { date: '2025-01-07', newUsers: 8, revenue: 0, activities: 45 },
      { date: '2025-01-08', newUsers: 7, revenue: 180, activities: 52 },
      { date: '2025-01-09', newUsers: 6, revenue: 240, activities: 48 },
      { date: '2025-01-10', newUsers: 5, revenue: 200, activities: 55 },
      { date: '2025-01-11', newUsers: 7, revenue: 320, activities: 62 },
      { date: '2025-01-12', newUsers: 4, revenue: 180, activities: 58 },
      { date: '2025-01-13', newUsers: 5, revenue: 130, activities: 51 }
    ]

    // حالة النظام (محاكاة)
    const systemHealth = {
      uptime: 99.2,
      responseTime: 1.2,
      serverUsage: 68,
      syncStatus: 'connected',
      lastSync: new Date().toISOString(),
      errors: 0,
      warnings: 2
    }

    // الأنشطة الأخيرة (محاكاة)
    const recentActivities = [
      {
        id: '1',
        type: 'course_enrollment',
        description: 'تسجيل في دورة البرمجة للمبتدئين',
        user: 'مستخدم تجريبي 5',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // منذ ساعتين
      },
      {
        id: '2',
        type: 'lesson_completion',
        description: 'إكمال درس أساسيات JavaScript',
        user: 'مستخدم تجريبي 12',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // منذ 4 ساعات
      },
      {
        id: '3',
        type: 'subscription_created',
        description: 'اشتراك جديد في خطة التصميم الجرافيكي',
        user: 'مستخدم تجريبي 8',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // منذ 6 ساعات
      }
    ]

    // تحديات ومشاكل (محاكاة)
    const challenges = [
      {
        id: 1,
        title: 'بطء في التسجيل خلال ساعات الذروة',
        severity: 'medium',
        status: 'in_progress',
        assignee: 'محمد القحطاني',
        dueDate: '2025-01-15',
        createdAt: new Date('2025-01-10').toISOString()
      },
      {
        id: 2,
        title: 'طلبات تخصيص إضافي للمحتوى المحلي',
        severity: 'low',
        status: 'open',
        assignee: 'فاطمة الزهراني',
        dueDate: '2025-01-20',
        createdAt: new Date('2025-01-12').toISOString()
      }
    ]

    // فريق العقدة المحلية
    const teamMembers = [
      {
        id: 1,
        name: 'أحمد محمد السعيد',
        role: 'مدير العقدة المحلية',
        status: 'active',
        performance: 92,
        joinDate: '2025-01-01'
      },
      {
        id: 2,
        name: 'فاطمة علي الزهراني',
        role: 'منسقة المحتوى',
        status: 'active',
        performance: 88,
        joinDate: '2025-01-01'
      },
      {
        id: 3,
        name: 'محمد عبدالله القحطاني',
        role: 'مطور تقني محلي',
        status: 'active',
        performance: 95,
        joinDate: '2025-01-01'
      },
      {
        id: 4,
        name: 'نورا سعد العتيبي',
        role: 'منسقة المجتمع',
        status: 'active',
        performance: 90,
        joinDate: '2025-01-01'
      },
      {
        id: 5,
        name: 'خالد يوسف الدوسري',
        role: 'مساعد إداري',
        status: 'active',
        performance: 85,
        joinDate: '2025-01-01'
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        node: {
          id: pilotNode.id,
          name: pilotNode.name,
          region: pilotNode.region,
          status: pilotNode.status,
          partners: pilotNode.partners
        },
        metrics: {
          totalUsers,
          activeSubscriptions,
          totalRevenue: revenueAmount,
          conversionRate: Math.round(conversionRate * 100) / 100,
          dailyActiveUsers: 32, // محاكاة
          completionRate: 73, // محاكاة
          totalChallenges,
          openChallenges
        },
        weeklyData,
        systemHealth,
        recentActivities,
        challenges,
        teamMembers,
        timeframe,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('خطأ في جلب مؤشرات العقدة التجريبية:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في جلب البيانات'
    }, { status: 500 })
  }
}

// POST /api/admin/pilot/metrics - إضافة مؤشر جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, metricType, value, metadata } = body

    // التحقق من صحة البيانات
    if (!nodeId || !metricType || value === undefined) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير مكتملة'
      }, { status: 400 })
    }

    // التحقق من وجود العقدة
    const node = await prisma.localNode.findUnique({
      where: { id: nodeId }
    })

    if (!node) {
      return NextResponse.json({
        success: false,
        error: 'العقدة غير موجودة'
      }, { status: 404 })
    }

    // إنشاء سجل مؤشر جديد (محاكاة)
    const metric = {
      id: `metric_${Date.now()}`,
      metricName: metricType,
      metricValue: value.toString(),
      metadata: metadata || {},
      nodeId: nodeId,
      timestamp: new Date()
    }

    return NextResponse.json({
      success: true,
      data: metric
    })

  } catch (error) {
    console.error('خطأ في إضافة مؤشر:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إضافة المؤشر'
    }, { status: 500 })
  }
}

// PUT /api/admin/pilot/metrics - تحديث حالة العقدة التجريبية
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { nodeId, status, notes } = body

    // التحقق من صحة البيانات
    if (!nodeId || !status) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير مكتملة'
      }, { status: 400 })
    }

    // تحديث حالة العقدة
    const updatedNode = await prisma.localNode.update({
      where: { id: nodeId },
      data: {
        status: status,
        settings: {
          lastStatusUpdate: new Date().toISOString(),
          statusNotes: notes
        }
      }
    })

    // تسجيل النشاط (محاكاة)
    console.log(`تم تحديث حالة العقدة ${nodeId} إلى ${status}`)
    console.log(`ملاحظات: ${notes}`)

    return NextResponse.json({
      success: true,
      data: updatedNode
    })

  } catch (error) {
    console.error('خطأ في تحديث حالة العقدة:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تحديث الحالة'
    }, { status: 500 })
  }
}
