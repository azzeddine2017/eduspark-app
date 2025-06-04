import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encrypt, decrypt, validateApiKey, maskApiKey, testGeminiKey } from "@/lib/encryption"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    // جلب مفاتيح API للمستخدم
    const userApiKeys = await prisma.userApiKey.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        geminiKey: true,
        openaiKey: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // إرجاع المفاتيح مع إخفاء القيم الحقيقية
    const response = {
      hasGeminiKey: !!userApiKeys?.geminiKey,
      hasOpenaiKey: !!userApiKeys?.openaiKey,
      geminiKeyMasked: userApiKeys?.geminiKey ? maskApiKey(decrypt(userApiKeys.geminiKey)) : null,
      openaiKeyMasked: userApiKeys?.openaiKey ? maskApiKey(decrypt(userApiKeys.openaiKey)) : null,
      isActive: userApiKeys?.isActive ?? true,
      lastUpdated: userApiKeys?.updatedAt
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب مفاتيح API" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { geminiKey, openaiKey, testKey = false } = body

    // التحقق من صحة المفاتيح
    if (geminiKey && !validateApiKey(geminiKey, 'gemini')) {
      return NextResponse.json(
        { error: "مفتاح Gemini API غير صحيح. يجب أن يبدأ بـ AIza" },
        { status: 400 }
      )
    }

    if (openaiKey && !validateApiKey(openaiKey, 'openai')) {
      return NextResponse.json(
        { error: "مفتاح OpenAI API غير صحيح. يجب أن يبدأ بـ sk-" },
        { status: 400 }
      )
    }

    // اختبار المفتاح إذا طُلب ذلك
    if (testKey && geminiKey) {
      const isValid = await testGeminiKey(geminiKey)
      if (!isValid) {
        return NextResponse.json(
          { error: "مفتاح Gemini API غير صالح أو منتهي الصلاحية" },
          { status: 400 }
        )
      }
    }

    // تشفير المفاتيح
    const encryptedData: any = {}
    if (geminiKey) {
      encryptedData.geminiKey = encrypt(geminiKey)
    }
    if (openaiKey) {
      encryptedData.openaiKey = encrypt(openaiKey)
    }

    // حفظ أو تحديث المفاتيح
    const userApiKeys = await prisma.userApiKey.upsert({
      where: { userId: user.id },
      update: {
        ...encryptedData,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        ...encryptedData,
        isActive: true
      }
    })

    return NextResponse.json({
      message: "تم حفظ مفاتيح API بنجاح",
      hasGeminiKey: !!userApiKeys.geminiKey,
      hasOpenaiKey: !!userApiKeys.openaiKey
    })

  } catch (error) {
    console.error("Error saving API keys:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ مفاتيح API" },
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

    // حذف مفاتيح API
    await prisma.userApiKey.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json({
      message: "تم حذف مفاتيح API بنجاح"
    })

  } catch (error) {
    console.error("Error deleting API keys:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف مفاتيح API" },
      { status: 500 }
    )
  }
}
