// Test Gemini API connection
const GEMINI_API_KEY = "AIzaSyCDt644306ilaKtzNN8BNSZqZ5kbdtlCAE"
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

async function testGemini() {
  try {
    console.log('🧪 اختبار اتصال Gemini API...')

    // First, list available models
    console.log('📋 جلب النماذج المتاحة...')
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`)
    const modelsData = await modelsResponse.json()
    console.log('النماذج المتاحة:', modelsData.models?.map(m => m.name).slice(0, 5))

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'مرحباً! هل يمكنك أن تجيب باللغة العربية؟'
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

    console.log('📡 حالة الاستجابة:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ خطأ في Gemini API:', errorText)
      return
    }

    const data = await response.json()
    console.log('✅ استجابة Gemini:', data.candidates?.[0]?.content?.parts?.[0]?.text)

  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error)
  }
}

testGemini()
