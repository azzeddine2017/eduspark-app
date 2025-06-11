import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/pilot/challenges - جلب التحديات والمشاكل
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nodeId = searchParams.get('nodeId') || 'pilot-riyadh-001'
    const status = searchParams.get('status') // open, in_progress, resolved, closed
    const severity = searchParams.get('severity') // low, medium, high, critical
    const assignee = searchParams.get('assignee')

    // بناء شروط البحث
    const whereConditions: any = {
      nodeId: nodeId
    }

    if (status) {
      whereConditions.status = status.toUpperCase()
    }

    if (severity) {
      whereConditions.severity = severity.toUpperCase()
    }

    if (assignee) {
      whereConditions.assignee = {
        contains: assignee
      }
    }

    // جلب التحديات من قاعدة البيانات
    const challenges = await prisma.pilotChallenge.findMany({
      where: whereConditions,
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    // إحصائيات التحديات
    const stats = await prisma.pilotChallenge.groupBy({
      by: ['status', 'severity'],
      where: { nodeId },
      _count: {
        id: true
      }
    })

    // تنظيم الإحصائيات
    const statusStats = {
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0
    }

    const severityStats = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    }

    stats.forEach(stat => {
      if (stat.status in statusStats) {
        statusStats[stat.status as keyof typeof statusStats] += stat._count.id
      }
      if (stat.severity in severityStats) {
        severityStats[stat.severity as keyof typeof severityStats] += stat._count.id
      }
    })

    // حساب متوسط وقت الحل
    const resolvedChallenges = await prisma.pilotChallenge.findMany({
      where: {
        nodeId,
        status: 'RESOLVED',
        resolvedAt: { not: null }
      },
      select: {
        createdAt: true,
        resolvedAt: true
      }
    })

    let averageResolutionTime = 0
    if (resolvedChallenges.length > 0) {
      const totalTime = resolvedChallenges.reduce((sum, challenge) => {
        const created = new Date(challenge.createdAt).getTime()
        const resolved = new Date(challenge.resolvedAt!).getTime()
        return sum + (resolved - created)
      }, 0)
      averageResolutionTime = totalTime / resolvedChallenges.length / (1000 * 60 * 60 * 24) // بالأيام
    }

    return NextResponse.json({
      success: true,
      data: {
        challenges: challenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          severity: challenge.severity,
          status: challenge.status,
          assignee: challenge.assignee,
          dueDate: challenge.dueDate,
          createdAt: challenge.createdAt,
          updatedAt: challenge.updatedAt,
          resolvedAt: challenge.resolvedAt,
          tags: challenge.tags,
          metadata: challenge.metadata,
          commentsCount: challenge._count.comments,
          recentComments: challenge.comments
        })),
        stats: {
          byStatus: statusStats,
          bySeverity: severityStats,
          total: challenges.length,
          averageResolutionTime: Math.round(averageResolutionTime * 10) / 10
        }
      }
    })

  } catch (error) {
    console.error('خطأ في جلب التحديات:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في جلب التحديات'
    }, { status: 500 })
  }
}

// POST /api/admin/pilot/challenges - إنشاء تحدي جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nodeId,
      title,
      description,
      severity,
      assignee,
      dueDate,
      tags,
      metadata
    } = body

    // التحقق من صحة البيانات
    if (!nodeId || !title || !description || !severity) {
      return NextResponse.json({
        success: false,
        error: 'بيانات غير مكتملة'
      }, { status: 400 })
    }

    // التحقق من صحة مستوى الخطورة
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    const severityUpper = severity.toUpperCase()
    if (!validSeverities.includes(severityUpper)) {
      return NextResponse.json({
        success: false,
        error: 'مستوى خطورة غير صحيح'
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

    // إنشاء التحدي الجديد
    const challenge = await prisma.pilotChallenge.create({
      data: {
        nodeId,
        title,
        description,
        severity: severityUpper,
        status: 'OPEN',
        assignee: assignee || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        tags: tags || [],
        metadata: metadata || {}
      }
    })

    // إنشاء تعليق أولي
    await prisma.challengeComment.create({
      data: {
        challengeId: challenge.id,
        author: 'النظام',
        content: `تم إنشاء التحدي بواسطة النظام. مستوى الخطورة: ${severity}`,
        type: 'system'
      }
    })

    // تسجيل النشاط (محاكاة)
    console.log(`تم إنشاء تحدي جديد: ${title} - مستوى الخطورة: ${severity}`)

    return NextResponse.json({
      success: true,
      data: challenge
    })

  } catch (error) {
    console.error('خطأ في إنشاء التحدي:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في إنشاء التحدي'
    }, { status: 500 })
  }
}

// PUT /api/admin/pilot/challenges - تحديث تحدي
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      challengeId,
      title,
      description,
      severity,
      status,
      assignee,
      dueDate,
      tags,
      metadata,
      comment
    } = body

    // التحقق من صحة البيانات
    if (!challengeId) {
      return NextResponse.json({
        success: false,
        error: 'معرف التحدي مطلوب'
      }, { status: 400 })
    }

    // التحقق من وجود التحدي
    const existingChallenge = await prisma.pilotChallenge.findUnique({
      where: { id: challengeId }
    })

    if (!existingChallenge) {
      return NextResponse.json({
        success: false,
        error: 'التحدي غير موجود'
      }, { status: 404 })
    }

    // بناء بيانات التحديث
    const updateData: any = {}
    
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (severity) updateData.severity = severity
    if (status) {
      updateData.status = status.toUpperCase()
      if (status.toUpperCase() === 'RESOLVED') {
        updateData.resolvedAt = new Date()
      }
    }
    if (assignee !== undefined) updateData.assignee = assignee
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (tags) updateData.tags = tags
    if (metadata) updateData.metadata = metadata

    // تحديث التحدي
    const updatedChallenge = await prisma.pilotChallenge.update({
      where: { id: challengeId },
      data: updateData
    })

    // إضافة تعليق إذا تم تقديمه
    if (comment) {
      await prisma.challengeComment.create({
        data: {
          challengeId: challengeId,
          author: 'المدير',
          content: comment,
          type: 'update'
        }
      })
    }

    // تسجيل النشاط (محاكاة)
    console.log(`تم تحديث التحدي: ${challengeId} - الحالة الجديدة: ${status || existingChallenge.status}`)

    return NextResponse.json({
      success: true,
      data: updatedChallenge
    })

  } catch (error) {
    console.error('خطأ في تحديث التحدي:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في تحديث التحدي'
    }, { status: 500 })
  }
}

// DELETE /api/admin/pilot/challenges - حذف تحدي
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const challengeId = searchParams.get('challengeId')

    if (!challengeId) {
      return NextResponse.json({
        success: false,
        error: 'معرف التحدي مطلوب'
      }, { status: 400 })
    }

    // التحقق من وجود التحدي
    const challenge = await prisma.pilotChallenge.findUnique({
      where: { id: challengeId }
    })

    if (!challenge) {
      return NextResponse.json({
        success: false,
        error: 'التحدي غير موجود'
      }, { status: 404 })
    }

    // حذف التعليقات المرتبطة أولاً
    await prisma.challengeComment.deleteMany({
      where: { challengeId: challengeId }
    })

    // حذف التحدي
    await prisma.pilotChallenge.delete({
      where: { id: challengeId }
    })

    // تسجيل النشاط (محاكاة)
    console.log(`تم حذف التحدي: ${challenge.title} - المعرف: ${challengeId}`)

    return NextResponse.json({
      success: true,
      message: 'تم حذف التحدي بنجاح'
    })

  } catch (error) {
    console.error('خطأ في حذف التحدي:', error)
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في حذف التحدي'
    }, { status: 500 })
  }
}
