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
    const { message, lessonId, courseId, context, history } = body

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

    // Build context
    let fullContext = context || ''

    // Add lesson context if provided
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
        fullContext += `\nالدورة: ${lesson.course.title}\nالدرس: ${lesson.title}\nمحتوى الدرس: ${JSON.stringify(lesson.content)}`
      }
    }

    // Add course context if provided
    if (courseId && !lessonId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          title: true,
          description: true
        }
      })

      if (course) {
        fullContext += `\nالدورة: ${course.title}\nوصف الدورة: ${course.description}`
      }
    }

    // Add conversation history
    if (history && history.length > 0) {
      const historyText = history
        .filter((msg: { isUser: boolean; content: string }) => !msg.isUser) // Only AI responses for context
        .slice(-2) // Last 2 AI responses
        .map((msg: { isUser: boolean; content: string }) => msg.content)
        .join('\n')

      if (historyText) {
        fullContext += `\nالمحادثة السابقة: ${historyText}`
      }
    }

    // Prepare prompt
    const prompt = PROMPTS.LESSON_ASSISTANT
      .replace('{context}', fullContext)
      .replace('{question}', message)

    // Call Gemini API with user's API key
    const startTime = Date.now()
    const response = await callGemini(prompt, user.id)
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
      tokens,
      cost,
      remainingQuestions: limit - todayInteractions - 1,
      suggestions: [
        'هل يمكنك توضيح هذه النقطة أكثر؟',
        'ما هي الأمثلة العملية على هذا؟',
        'كيف يمكنني تطبيق هذا المفهوم؟',
        'ما هي المصادر الإضافية للتعلم؟'
      ]
    })

  } catch (error) {
    console.error('AI Chat error:', error)

    // رسائل خطأ مخصصة
    let errorMessage = 'حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'

    if (error instanceof Error) {
      if (error.message.includes('مفتاح API غير موجود')) {
        errorMessage = 'يرجى إضافة مفتاح Gemini API في الإعدادات لاستخدام المساعد الذكي.'
      } else if (error.message.includes('غير متاحة حالياً')) {
        errorMessage = 'خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة لاحقاً.'
      } else if (error.message.includes('تجاوز الحد المسموح')) {
        errorMessage = 'تم تجاوز الحد المسموح من الاستفسارات. يرجى المحاولة لاحقاً.'
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
