import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // جلب إعدادات المستخدم
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    })

    // إعدادات افتراضية إذا لم توجد
    const defaultSettings = {
      // إعدادات الإشعارات
      emailNotifications: true,
      pushNotifications: true,
      courseUpdates: true,
      achievementNotifications: true,
      communityNotifications: false,
      weeklyDigest: true,
      
      // إعدادات الخصوصية
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: true,
      allowMessages: true,
      
      // إعدادات التعلم
      autoplay: false,
      subtitles: true,
      playbackSpeed: 1,
      language: 'ar',
      
      // إعدادات المساعد الذكي
      aiAssistant: true,
      aiSuggestions: true,
      aiReminders: false
    }

    return NextResponse.json(settings ? settings.settings : defaultSettings)
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإعدادات" },
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

    const settings = await request.json()

    // حفظ أو تحديث الإعدادات
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        settings: settings,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        settings: settings
      }
    })

    return NextResponse.json({
      message: "تم حفظ الإعدادات بنجاح"
    })

  } catch (error) {
    console.error("Error saving user settings:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الإعدادات" },
      { status: 500 }
    )
  }
}
