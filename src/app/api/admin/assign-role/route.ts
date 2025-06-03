import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    // التحقق من أن المستخدم مدير
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعيين الأدوار' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'معرف المستخدم والدور مطلوبان' },
        { status: 400 }
      )
    }

    // التحقق من صحة الدور
    const validRoles: UserRole[] = [
      'STUDENT',
      'ADMIN', 
      'INSTRUCTOR',
      'CONTENT_CREATOR',
      'MENTOR',
      'COMMUNITY_MANAGER',
      'QUALITY_ASSURANCE',
      'ANALYTICS_SPECIALIST',
      'SUPPORT_SPECIALIST'
    ]

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'دور غير صحيح' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // منع تغيير دور المدير الحالي إذا كان هو نفسه
    if (targetUser.id === user.id && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'لا يمكنك تغيير دورك الخاص من مدير إلى دور آخر' },
        { status: 400 }
      )
    }

    // تحديث دور المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    // تسجيل العملية في سجل القرارات (للشفافية)
    await prisma.decision.create({
      data: {
        title: `تعيين دور جديد للمستخدم ${targetUser.name}`,
        description: `تم تغيير دور المستخدم ${targetUser.name} (${targetUser.email}) من ${targetUser.role} إلى ${role}`,
        proposerId: user.id,
        status: 'IMPLEMENTED',
        decidedAt: new Date(),
      }
    })

    return NextResponse.json({
      message: 'تم تعيين الدور بنجاح',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error assigning role:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تعيين الدور' },
      { status: 500 }
    )
  }
}
