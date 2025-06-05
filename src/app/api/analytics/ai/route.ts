import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * جلب تحليلات المساعد الذكي
 * GET /api/analytics/ai
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة والصلاحيات
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      )
    }

    // التحقق من صلاحيات الإدارة
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST'].includes(user.role)) {
      return NextResponse.json(
        { error: 'غير مصرح بعرض تحليلات المساعد الذكي' },
        { status: 403 }
      )
    }

    // استخراج معاملات الاستعلام
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // آخر 30 يوم افتراضياً
    const userId = searchParams.get('userId')

    // تحديد نطاق التاريخ
    const days = parseInt(period)
    const dateRange = {
      gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }

    // بناء شروط الاستعلام
    const whereClause: any = {
      createdAt: dateRange
    }
    if (userId) {
      whereClause.userId = userId
    }

    // جلب إحصائيات المساعد الذكي
    const [
      aiStats,
      topUsers,
      interactionTypes,
      dailyUsage,
      responseQuality,
      popularTopics,
      errorAnalysis,
      tokenUsage
    ] = await Promise.all([
      // إحصائيات عامة للمساعد الذكي
      prisma.lLMInteractionLog.aggregate({
        where: whereClause,
        _count: { id: true },
        _sum: {
          tokens: true,
          responseTime: true
        },
        _avg: {
          tokens: true,
          responseTime: true
        }
      }),

      // أكثر المستخدمين استخداماً للمساعد الذكي
      prisma.lLMInteractionLog.groupBy({
        by: ['userId'],
        where: whereClause,
        _count: { id: true },
        _sum: { tokens: true },
        _avg: { responseTime: true },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 20
      }),

      // أنواع التفاعلات
      prisma.lLMInteractionLog.groupBy({
        by: ['interactionType'],
        where: whereClause,
        _count: { id: true },
        _avg: {
          tokens: true,
          responseTime: true
        }
      }),

      // الاستخدام اليومي
      prisma.lLMInteractionLog.groupBy({
        by: ['createdAt'],
        where: whereClause,
        _count: { id: true },
        _sum: { tokens: true },
        orderBy: {
          createdAt: 'asc'
        }
      }),

      // جودة الاستجابات (بناءً على التقييمات إذا كانت متوفرة)
      prisma.lLMInteractionLog.findMany({
        where: {
          ...whereClause,
          feedback: { not: null }
        },
        select: {
          feedback: true,
          interactionType: true,
          responseTime: true,
          tokens: true
        }
      }),

      // المواضيع الشائعة (بناءً على الكلمات المفتاحية في الأسئلة)
      prisma.lLMInteractionLog.findMany({
        where: whereClause,
        select: {
          userMessage: true,
          interactionType: true
        },
        take: 1000 // عينة للتحليل
      }),

      // تحليل الأخطاء
      prisma.lLMInteractionLog.findMany({
        where: {
          ...whereClause,
          error: { not: null }
        },
        select: {
          error: true,
          interactionType: true,
          createdAt: true
        }
      }),

      // استخدام الرموز حسب النوع
      prisma.lLMInteractionLog.groupBy({
        by: ['interactionType'],
        where: whereClause,
        _sum: { tokens: true },
        _avg: { tokens: true },
        _count: { id: true }
      })
    ])

    // معالجة بيانات أكثر المستخدمين استخداماً
    const processedTopUsers = await Promise.all(
      topUsers.map(async (userStat) => {
        const user = await prisma.user.findUnique({
          where: { id: userStat.userId },
          select: { name: true, email: true, role: true }
        })

        return {
          userId: userStat.userId,
          userName: user?.name || 'مستخدم محذوف',
          userEmail: user?.email || '',
          userRole: user?.role || '',
          interactionsCount: userStat._count.id,
          totalTokens: userStat._sum.tokens || 0,
          averageResponseTime: Math.round((userStat._avg.responseTime || 0) * 100) / 100
        }
      })
    )

    // معالجة الاستخدام اليومي
    const dailyUsageStats = dailyUsage.reduce((acc, usage) => {
      const date = new Date(usage.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { interactions: 0, tokens: 0 }
      }
      acc[date].interactions += usage._count.id
      acc[date].tokens += usage._sum.tokens || 0
      return acc
    }, {} as Record<string, { interactions: number; tokens: number }>)

    // تحليل المواضيع الشائعة (تحليل بسيط للكلمات المفتاحية)
    const topicAnalysis = popularTopics.reduce((acc, interaction) => {
      if (!interaction.userMessage) return acc

      // كلمات مفتاحية شائعة في التعليم
      const keywords = [
        'شرح', 'تفسير', 'مساعدة', 'حل', 'مثال', 'تمرين', 'اختبار', 'درس',
        'دورة', 'تعلم', 'فهم', 'توضيح', 'سؤال', 'إجابة', 'مراجعة', 'ملخص'
      ]

      const message = interaction.userMessage.toLowerCase()
      keywords.forEach(keyword => {
        if (message.includes(keyword)) {
          acc[keyword] = (acc[keyword] || 0) + 1
        }
      })

      return acc
    }, {} as Record<string, number>)

    // تحليل الأخطاء
    const errorStats = errorAnalysis.reduce((acc, error) => {
      const errorType = error.error || 'خطأ غير محدد'
      acc[errorType] = (acc[errorType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // حساب معدل النجاح
    const totalInteractions = aiStats._count.id
    const errorCount = errorAnalysis.length
    const successRate = totalInteractions > 0 ? ((totalInteractions - errorCount) / totalInteractions) * 100 : 0

    // تحليل جودة الاستجابات
    const qualityStats = responseQuality.reduce((acc, response) => {
      if (response.feedback) {
        try {
          const feedback = JSON.parse(response.feedback)
          if (feedback.rating) {
            acc.ratings.push(feedback.rating)
          }
        } catch (e) {
          // تجاهل الأخطاء في تحليل JSON
        }
      }
      return acc
    }, { ratings: [] as number[] })

    const averageRating = qualityStats.ratings.length > 0
      ? qualityStats.ratings.reduce((sum, rating) => sum + rating, 0) / qualityStats.ratings.length
      : 0

    return NextResponse.json({
      summary: {
        totalInteractions: totalInteractions,
        totalTokensUsed: aiStats._sum.tokens || 0,
        averageTokensPerInteraction: Math.round((aiStats._avg.tokens || 0) * 100) / 100,
        averageResponseTime: Math.round((aiStats._avg.responseTime || 0) * 100) / 100,
        successRate: Math.round(successRate * 100) / 100,
        errorCount: errorCount,
        averageRating: Math.round(averageRating * 100) / 100
      },
      usage: {
        topUsers: processedTopUsers,
        byType: interactionTypes.map(type => ({
          type: type.interactionType,
          count: type._count.id,
          averageTokens: Math.round((type._avg.tokens || 0) * 100) / 100,
          averageResponseTime: Math.round((type._avg.responseTime || 0) * 100) / 100
        })),
        dailyStats: Object.entries(dailyUsageStats).map(([date, stats]) => ({
          date,
          interactions: stats.interactions,
          tokens: stats.tokens
        })).sort((a, b) => a.date.localeCompare(b.date))
      },
      performance: {
        tokenUsage: tokenUsage.map(usage => ({
          type: usage.interactionType,
          totalTokens: usage._sum.tokens || 0,
          averageTokens: Math.round((usage._avg.tokens || 0) * 100) / 100,
          interactionsCount: usage._count.id
        })),
        errors: Object.entries(errorStats).map(([error, count]) => ({
          errorType: error,
          count,
          percentage: Math.round((count / totalInteractions) * 100 * 100) / 100
        }))
      },
      insights: {
        popularTopics: Object.entries(topicAnalysis)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([topic, count]) => ({ topic, count })),
        peakUsageHour: calculatePeakUsageHour(dailyUsage),
        mostActiveUserType: processedTopUsers.length > 0 ? processedTopUsers[0].userRole : 'غير محدد',
        averageSessionLength: Math.round((aiStats._avg.responseTime || 0) * 100) / 100
      }
    })

  } catch (error) {
    console.error('خطأ في جلب تحليلات المساعد الذكي:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تحليلات المساعد الذكي' },
      { status: 500 }
    )
  }
}

// دالة مساعدة لحساب ساعة الذروة
function calculatePeakUsageHour(dailyUsage: any[]): string {
  const hourlyStats = dailyUsage.reduce((acc, usage) => {
    const hour = new Date(usage.createdAt).getHours()
    acc[hour] = (acc[hour] || 0) + usage._count.id
    return acc
  }, {} as Record<number, number>)

  const peakHour = Object.entries(hourlyStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0]

  return peakHour ? `${peakHour}:00` : 'غير محدد'
}
