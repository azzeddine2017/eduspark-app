import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || 'week'

    // تحديد نطاق التاريخ
    const now = new Date()
    let startDate: Date
    let dateFormat: string

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFormat = 'YYYY-MM-DD'
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateFormat = 'YYYY-MM-DD'
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        dateFormat = 'YYYY-MM'
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFormat = 'YYYY-MM-DD'
    }

    // جلب تقدم الدروس
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        completedAt: {
          gte: startDate,
          lte: now
        },
        completed: true
      },
      select: {
        completedAt: true,
        timeSpent: true
      }
    })

    // تجميع البيانات حسب التاريخ
    const progressMap = new Map<string, { lessonsCompleted: number; timeSpent: number }>()

    lessonProgress.forEach(progress => {
      if (!progress.completedAt) return

      const dateKey = range === 'year' 
        ? progress.completedAt.toISOString().substring(0, 7) // YYYY-MM
        : progress.completedAt.toISOString().substring(0, 10) // YYYY-MM-DD

      const existing = progressMap.get(dateKey) || { lessonsCompleted: 0, timeSpent: 0 }
      progressMap.set(dateKey, {
        lessonsCompleted: existing.lessonsCompleted + 1,
        timeSpent: existing.timeSpent + (progress.timeSpent || 0)
      })
    })

    // إنشاء مصفوفة البيانات مع ملء الأيام المفقودة
    const progressData = []
    const currentDate = new Date(startDate)

    while (currentDate <= now) {
      const dateKey = range === 'year'
        ? currentDate.toISOString().substring(0, 7)
        : currentDate.toISOString().substring(0, 10)

      const data = progressMap.get(dateKey) || { lessonsCompleted: 0, timeSpent: 0 }
      
      progressData.push({
        date: dateKey,
        lessonsCompleted: data.lessonsCompleted,
        timeSpent: Math.round(data.timeSpent / 60) // تحويل من ثواني إلى دقائق
      })

      // الانتقال للتاريخ التالي
      if (range === 'year') {
        currentDate.setMonth(currentDate.getMonth() + 1)
      } else {
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }

    return NextResponse.json(progressData)

  } catch (error) {
    console.error("Error fetching progress data:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات التقدم" },
      { status: 500 }
    )
  }
}
