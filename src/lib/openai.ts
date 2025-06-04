// Gemini AI Integration
import { prisma } from './prisma'
import { decrypt } from './encryption'

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
export const DEFAULT_MODEL = 'gemini-pro'

// الحصول على مفتاح API للمستخدم
async function getUserApiKey(userId: string): Promise<string | null> {
  try {
    const userApiKey = await prisma.userApiKey.findUnique({
      where: { userId },
      select: { geminiKey: true, isActive: true }
    })

    if (!userApiKey || !userApiKey.isActive || !userApiKey.geminiKey) {
      return null
    }

    return decrypt(userApiKey.geminiKey)
  } catch (error) {
    console.error('Error getting user API key:', error)
    return null
  }
}

// Gemini API call function with user's API key
export async function callGemini(prompt: string, userId?: string): Promise<string> {
  try {
    // الحصول على مفتاح API (من المستخدم أو من البيئة)
    let apiKey: string | null = null

    if (userId) {
      apiKey = await getUserApiKey(userId)
    }

    // استخدام مفتاح البيئة كاحتياطي
    if (!apiKey) {
      apiKey = process.env.GEMINI_API_KEY || null
    }

    if (!apiKey) {
      throw new Error('مفتاح API غير موجود. يرجى إضافة مفتاح Gemini API في الإعدادات.')
    }

    console.log('Calling Gemini API with URL:', GEMINI_API_URL)

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    console.log('Gemini API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error Response:', errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Gemini API Response Data:', JSON.stringify(data, null, 2))

    // التحقق من وجود المحتوى في الاستجابة
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure:', data)
      return 'عذراً، لم أتمكن من الحصول على إجابة مناسبة. يرجى إعادة صياغة سؤالك.'
    }

    const responseText = data.candidates[0].content.parts[0]?.text
    if (!responseText) {
      console.error('No text in response:', data.candidates[0])
      return 'عذراً، لم أتمكن من الحصول على إجابة. يرجى المحاولة مرة أخرى.'
    }

    return responseText
  } catch (error) {
    console.error('Gemini API Error:', error)

    // رسائل خطأ مخصصة حسب نوع الخطأ
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة لاحقاً.')
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('مشكلة في التصريح. يرجى التواصل مع الدعم الفني.')
      } else if (error.message.includes('429')) {
        throw new Error('تم تجاوز الحد المسموح من الاستفسارات. يرجى المحاولة لاحقاً.')
      } else if (error.message.includes('مفتاح API غير موجود')) {
        throw new Error('خدمة الذكاء الاصطناعي غير مكونة بشكل صحيح.')
      }
    }

    throw new Error('حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.')
  }
}

export const INTERACTION_LIMITS = {
  STUDENT: 10,
  ADMIN: 50,
} as const

export const PROMPTS = {
  LESSON_ASSISTANT: `أنت مساعد تعليمي ذكي في منصة فتح للتعلّم الذكي. مهمتك مساعدة الطلاب في فهم المحتوى التعليمي والإجابة على أسئلتهم بطريقة واضحة ومفيدة.

السياق التعليمي: {context}
سؤال الطالب: {question}

قدم إجابة مفيدة وواضحة باللغة العربية، مع التركيز على:
- الشرح البسيط والواضح
- أمثلة عملية عند الإمكان
- ربط المفهوم بالحياة العملية
- تشجيع الطالب على التعلم

الإجابة:`,

  QUESTION_ANSWER: `أنت مساعد تعليمي ذكي. ساعد الطالب في فهم المحتوى التعليمي وأجب على أسئلته بطريقة واضحة ومفيدة.

السياق: {context}
السؤال: {question}

قدم إجابة مفيدة وواضحة باللغة العربية:`,

  TEXT_SUMMARY: `لخص النص التالي بطريقة واضحة ومفيدة باللغة العربية:

النص: {text}

الملخص:`,

  WRITING_ASSISTANCE: `ساعد الطالب في تحسين كتابته. راجع النص وقدم اقتراحات للتحسين:

النص: {text}

الاقتراحات:`,
} as const
