import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { callGemini, DEFAULT_MODEL, PROMPTS } from '@/lib/openai'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, length = 'medium', lessonId } = body

    if (!text) {
      return NextResponse.json(
        { error: 'النص مطلوب' },
        { status: 400 }
      )
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'النص قصير جداً للتلخيص' },
        { status: 400 }
      )
    }

    // Prepare prompt based on length
    let lengthInstruction = ''
    switch (length) {
      case 'short':
        lengthInstruction = 'في فقرة واحدة قصيرة'
        break
      case 'long':
        lengthInstruction = 'في عدة فقرات مفصلة'
        break
      default:
        lengthInstruction = 'في فقرتين أو ثلاث فقرات'
    }

    const prompt = `${PROMPTS.TEXT_SUMMARY.replace('{text}', text)}\n\nيرجى تقديم الملخص ${lengthInstruction}.`

    // Call Gemini API
    const startTime = Date.now()
    const summary = await callGemini(prompt)
    const responseTime = Date.now() - startTime

    // Calculate metrics (estimated for Gemini)
    const tokens = Math.ceil(text.length / 4) // Rough estimation
    const cost = (tokens / 1000) * 0.001 // Gemini is cheaper
    const originalLength = text.length
    const summaryLength = summary.length
    const compressionRatio = ((originalLength - summaryLength) / originalLength * 100).toFixed(1)

    // Log interaction
    await prisma.lLMInteractionLog.create({
      data: {
        userId: user.id,
        type: 'TEXT_SUMMARY',
        prompt: text.substring(0, 1000), // Store first 1000 chars
        response: summary,
        model: DEFAULT_MODEL,
        tokens,
        cost,
        responseTime,
        lessonId: lessonId || null,
      }
    })

    return NextResponse.json({
      summary,
      originalLength,
      summaryLength,
      compressionRatio: parseFloat(compressionRatio),
      tokens,
      cost
    })

  } catch (error) {
    console.error('LLM Summarize error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تلخيص النص' },
      { status: 500 }
    )
  }
}
