import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { callGemini, DEFAULT_MODEL, INTERACTION_LIMITS, PROMPTS } from '@/lib/openai'
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
    const { message, lessonId, conversationId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      )
    }

    // Check daily limits
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayInteractions = await prisma.lLMInteractionLog.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today
        }
      }
    })

    const limit = user.role === 'ADMIN' ? INTERACTION_LIMITS.ADMIN : INTERACTION_LIMITS.STUDENT

    if (todayInteractions >= limit) {
      return NextResponse.json(
        { error: `لقد تجاوزت الحد اليومي المسموح (${limit} تفاعلات)` },
        { status: 429 }
      )
    }

    // Get lesson context if provided
    let context = ''
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          title: true,
          content: true,
          course: {
            select: {
              title: true
            }
          }
        }
      })

      if (lesson) {
        context = `الدورة: ${lesson.course.title}\nالدرس: ${lesson.title}\nمحتوى الدرس: ${JSON.stringify(lesson.content)}`
      }
    }

    // Prepare prompt
    console.log('PROMPTS object:', PROMPTS)
    console.log('LESSON_ASSISTANT:', PROMPTS.LESSON_ASSISTANT)

    if (!PROMPTS.LESSON_ASSISTANT) {
      throw new Error('LESSON_ASSISTANT prompt is not defined')
    }

    const prompt = PROMPTS.LESSON_ASSISTANT
      .replace('{context}', context)
      .replace('{question}', message)

    // Call Gemini API
    const startTime = Date.now()
    const response = await callGemini(prompt)
    const responseTime = Date.now() - startTime

    // Calculate cost (estimated for Gemini)
    const tokens = Math.ceil(message.length / 4) // Rough estimation
    const cost = (tokens / 1000) * 0.001 // Gemini is cheaper

    // Log interaction
    await prisma.lLMInteractionLog.create({
      data: {
        userId: user.id,
        type: 'QUESTION_ANSWER',
        prompt: message,
        response,
        model: DEFAULT_MODEL,
        tokens,
        cost,
        responseTime,
        lessonId: lessonId || null,
      }
    })

    return NextResponse.json({
      response,
      conversationId: conversationId || `conv_${Date.now()}`,
      tokens,
      cost,
      suggestions: [
        'هل يمكنك توضيح هذه النقطة أكثر؟',
        'ما هي الأمثلة العملية على هذا؟',
        'كيف يمكنني تطبيق هذا المفهوم؟'
      ]
    })

  } catch (error) {
    console.error('LLM Chat error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة طلبك' },
      { status: 500 }
    )
  }
}
