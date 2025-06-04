import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // جلب بيانات المستخدم الكاملة
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        website: true,
        birthDate: true,
        occupation: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!fullUser) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json(fullUser)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الملف الشخصي" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      location,
      bio,
      website,
      birthDate,
      occupation,
      currentPassword,
      newPassword
    } = body

    // التحقق من صحة البيانات
    if (!name || !email) {
      return NextResponse.json(
        { error: "الاسم والبريد الإلكتروني مطلوبان" },
        { status: 400 }
      )
    }

    // التحقق من تفرد البريد الإلكتروني
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم من قبل مستخدم آخر" },
        { status: 400 }
      )
    }

    // إعداد البيانات للتحديث
    const updateData: any = {
      name,
      email,
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      website: website || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      occupation: occupation || null,
      updatedAt: new Date()
    }

    // التعامل مع تغيير كلمة المرور
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "كلمة المرور الحالية مطلوبة لتغيير كلمة المرور" },
          { status: 400 }
        )
      }

      // التحقق من كلمة المرور الحالية
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }
      })

      if (!currentUser || !await bcrypt.compare(currentPassword, currentUser.password)) {
        return NextResponse.json(
          { error: "كلمة المرور الحالية غير صحيحة" },
          { status: 400 }
        )
      }

      // تشفير كلمة المرور الجديدة
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        bio: true,
        website: true,
        birthDate: true,
        occupation: true,
        role: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: "تم تحديث الملف الشخصي بنجاح",
      user: updatedUser
    })

  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الملف الشخصي" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // حذف جميع البيانات المرتبطة بالمستخدم
    await prisma.$transaction(async (tx) => {
      // حذف سجلات التفاعل مع المساعد الذكي
      await tx.lLMInteractionLog.deleteMany({
        where: { userId: user.id }
      })

      // حذف تقدم الدروس
      await tx.lessonProgress.deleteMany({
        where: { userId: user.id }
      })

      // حذف التسجيلات في الدورات
      await tx.enrollment.deleteMany({
        where: { userId: user.id }
      })

      // حذف الدورات التي أنشأها المستخدم (إذا كان مدرساً)
      const userCourses = await tx.course.findMany({
        where: { authorId: user.id },
        select: { id: true }
      })

      for (const course of userCourses) {
        // حذف الدروس
        await tx.lesson.deleteMany({
          where: { courseId: course.id }
        })

        // حذف التسجيلات في الدورة
        await tx.enrollment.deleteMany({
          where: { courseId: course.id }
        })
      }

      // حذف الدورات
      await tx.course.deleteMany({
        where: { authorId: user.id }
      })

      // أخيراً، حذف المستخدم
      await tx.user.delete({
        where: { id: user.id }
      })
    })

    return NextResponse.json({
      message: "تم حذف الحساب بنجاح"
    })

  } catch (error) {
    console.error("Error deleting user account:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الحساب" },
      { status: 500 }
    )
  }
}
