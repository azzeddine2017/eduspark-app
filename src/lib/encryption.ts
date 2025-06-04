import crypto from 'crypto'

// مفتاح التشفير - يجب أن يكون في متغيرات البيئة
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fateh-platform-default-key-32-chars'
const ALGORITHM = 'aes-256-cbc'

// التأكد من أن مفتاح التشفير بالطول الصحيح
const getEncryptionKey = (): Buffer => {
  const key = ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32)
  return Buffer.from(key, 'utf8')
}

/**
 * تشفير النص
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // دمج IV مع النص المشفر
    return iv.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('فشل في تشفير البيانات')
  }
}

/**
 * فك تشفير النص
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey()
    const parts = encryptedText.split(':')

    if (parts.length !== 2) {
      throw new Error('تنسيق البيانات المشفرة غير صحيح')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = parts[1]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('فشل في فك تشفير البيانات')
  }
}

/**
 * التحقق من صحة مفتاح API
 */
export function validateApiKey(key: string, type: 'gemini' | 'openai'): boolean {
  if (!key || typeof key !== 'string') {
    return false
  }

  switch (type) {
    case 'gemini':
      // مفاتيح Gemini تبدأ بـ AIza وطولها حوالي 39 حرف
      return key.startsWith('AIza') && key.length >= 35 && key.length <= 45

    case 'openai':
      // مفاتيح OpenAI تبدأ بـ sk- وطولها حوالي 51 حرف
      return key.startsWith('sk-') && key.length >= 45 && key.length <= 55

    default:
      return false
  }
}

/**
 * إخفاء مفتاح API للعرض (إظهار أول 8 أحرف فقط)
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) {
    return '••••••••'
  }

  const visiblePart = key.substring(0, 8)
  const hiddenPart = '•'.repeat(Math.max(8, key.length - 8))

  return visiblePart + hiddenPart
}

/**
 * اختبار مفتاح Gemini API
 */
export async function testGeminiKey(apiKey: string): Promise<boolean> {
  try {
    const testUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

    const response = await fetch(`${testUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'مرحبا'
          }]
        }]
      })
    })

    return response.ok
  } catch (error) {
    console.error('API key test error:', error)
    return false
  }
}

/**
 * اختبار مفتاح OpenAI API
 */
export async function testOpenAiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('OpenAI API key test error:', error)
    return false
  }
}
