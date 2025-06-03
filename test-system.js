// اختبار شامل للنظام
const BASE_URL = 'http://localhost:3000'

async function testSystem() {
  console.log('🧪 بدء اختبار النظام المتكامل...\n')

  // 1. اختبار الصفحة الرئيسية
  console.log('1️⃣ اختبار الصفحة الرئيسية...')
  try {
    const response = await fetch(`${BASE_URL}/`)
    console.log(`✅ الصفحة الرئيسية: ${response.status === 200 ? 'تعمل' : 'لا تعمل'}`)
  } catch (error) {
    console.log('❌ خطأ في الصفحة الرئيسية:', error.message)
  }

  // 2. اختبار صفحة التسجيل
  console.log('\n2️⃣ اختبار صفحة التسجيل...')
  try {
    const response = await fetch(`${BASE_URL}/auth/register`)
    console.log(`✅ صفحة التسجيل: ${response.status === 200 ? 'تعمل' : 'لا تعمل'}`)
  } catch (error) {
    console.log('❌ خطأ في صفحة التسجيل:', error.message)
  }

  // 3. اختبار صفحة تسجيل الدخول
  console.log('\n3️⃣ اختبار صفحة تسجيل الدخول...')
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`)
    console.log(`✅ صفحة تسجيل الدخول: ${response.status === 200 ? 'تعمل' : 'لا تعمل'}`)
  } catch (error) {
    console.log('❌ خطأ في صفحة تسجيل الدخول:', error.message)
  }

  // 4. اختبار صفحة الدورات
  console.log('\n4️⃣ اختبار صفحة الدورات...')
  try {
    const response = await fetch(`${BASE_URL}/courses`)
    console.log(`✅ صفحة الدورات: ${response.status === 200 ? 'تعمل' : 'لا تعمل'}`)
  } catch (error) {
    console.log('❌ خطأ في صفحة الدورات:', error.message)
  }

  // 5. اختبار Gemini API
  console.log('\n5️⃣ اختبار Gemini API...')
  try {
    const GEMINI_API_KEY = "AIzaSyCDt644306ilaKtzNN8BNSZqZ5kbdtlCAE"
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'اختبار سريع - أجب بكلمة واحدة: ما هو 2+2؟'
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text
      console.log(`✅ Gemini API يعمل! الإجابة: ${result}`)
    } else {
      console.log('❌ Gemini API لا يعمل')
    }
  } catch (error) {
    console.log('❌ خطأ في Gemini API:', error.message)
  }

  console.log('\n🎉 انتهى الاختبار!')
  console.log('\n📋 الخطوات التالية:')
  console.log('1. افتح http://localhost:3000 في المتصفح')
  console.log('2. سجل حساب جديد أو ادخل بحساب موجود')
  console.log('3. جرب التسجيل في دورة')
  console.log('4. اختبر المساعد الذكي')
  console.log('5. للأدمن: ادخل على /admin لإدارة النظام')
  console.log('6. للأدمن: ادخل على /admin/roles لإدارة الأدوار')
  console.log('7. للأدمن: ادخل على /admin/holacracy لنظام الهولاكراسي')
}

testSystem()
