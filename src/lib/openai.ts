// Gemini AI Integration
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export const DEFAULT_MODEL = 'gemini-pro'

// Gemini API call function
export async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || 'عذراً، لم أتمكن من الحصول على إجابة.'
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('حدث خطأ في الاتصال بالذكاء الاصطناعي')
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
