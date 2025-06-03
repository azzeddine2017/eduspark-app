// Gemini AI Integration
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export const DEFAULT_MODEL = 'gemini-1.5-flash'

// Interaction limits per day
export const INTERACTION_LIMITS = {
  STUDENT: 10,
  ADMIN: 50,
} as const

// Prompts for different interactions
export const PROMPTS = {
  LESSON_ASSISTANT: `أنت مساعد تعليمي ذكي متخصص في مساعدة الطلاب.
سياق الدرس: {context}

يرجى الإجابة على السؤال التالي بطريقة واضحة ومفيدة باللغة العربية:
{question}`,

  TEXT_SUMMARY: `يرجى تلخيص النص التالي باللغة العربية بطريقة واضحة ومفيدة:

{text}`,

  WRITING_ASSISTANT: `أنت مساعد كتابة ذكي. ساعد الطالب في تحسين النص التالي:

{text}

يرجى تقديم اقتراحات للتحسين باللغة العربية.`
} as const

// Gemini API call function
export async function callGemini(prompt: string): Promise<string> {
  try {
    console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...')

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
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    })

    console.log('Gemini API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error response:', errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Gemini API response data:', JSON.stringify(data, null, 2))

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!result) {
      console.error('No text in Gemini response:', data)
      return 'عذراً، لم أتمكن من الحصول على إجابة من الذكاء الاصطناعي.'
    }

    return result
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('حدث خطأ في الاتصال بالذكاء الاصطناعي: ' + (error as Error).message)
  }
}
