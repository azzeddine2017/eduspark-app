"use client"

import { useState, useEffect } from "react"
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2, 
  TestTube, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  ExternalLink,
  Info
} from "lucide-react"

interface ApiKeyData {
  hasGeminiKey: boolean
  hasOpenaiKey: boolean
  geminiKeyMasked: string | null
  openaiKeyMasked: string | null
  isActive: boolean
  lastUpdated: string | null
}

export default function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKeyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  
  const [formData, setFormData] = useState({
    geminiKey: '',
    openaiKey: ''
  })

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      }
    } catch (error) {
      setError('فشل في تحميل مفاتيح API')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
    setSuccess(null)
  }

  const testGeminiKey = async () => {
    if (!formData.geminiKey) {
      setError('يرجى إدخال مفتاح Gemini API أولاً')
      return
    }

    setTesting(true)
    setError(null)

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geminiKey: formData.geminiKey,
          testKey: true
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('مفتاح Gemini API صالح ويعمل بشكل صحيح!')
      } else {
        setError(data.error || 'فشل في اختبار المفتاح')
      }
    } catch (error) {
      setError('حدث خطأ أثناء اختبار المفتاح')
    } finally {
      setTesting(false)
    }
  }

  const saveApiKeys = async () => {
    if (!formData.geminiKey && !formData.openaiKey) {
      setError('يرجى إدخال مفتاح واحد على الأقل')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم حفظ مفاتيح API بنجاح!')
        setFormData({ geminiKey: '', openaiKey: '' })
        await loadApiKeys()
      } else {
        setError(data.error || 'فشل في حفظ مفاتيح API')
      }
    } catch (error) {
      setError('حدث خطأ أثناء حفظ مفاتيح API')
    } finally {
      setSaving(false)
    }
  }

  const deleteApiKeys = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع مفاتيح API؟')) {
      return
    }

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('تم حذف مفاتيح API بنجاح!')
        await loadApiKeys()
      } else {
        setError('فشل في حذف مفاتيح API')
      }
    } catch (error) {
      setError('حدث خطأ أثناء حذف مفاتيح API')
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-surface rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-surface rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-high-contrast arabic-text flex items-center">
          <Key className="w-5 h-5 ml-2" />
          إدارة مفاتيح API
        </h3>
        
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-secondary text-sm flex items-center"
        >
          <ExternalLink className="w-4 h-4 ml-1" />
          الحصول على مفتاح Gemini
        </a>
      </div>

      {/* Info Box */}
      <div className="bg-info bg-opacity-10 border border-info border-opacity-20 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-3 mt-0.5" />
          <div>
            <p className="text-sm text-info arabic-text font-medium mb-2">
              لماذا أحتاج مفتاح API؟
            </p>
            <ul className="text-sm text-info arabic-text space-y-1">
              <li>• للتفاعل مع المساعد الذكي في المنصة</li>
              <li>• مفاتيحك محفوظة بشكل آمن ومشفرة</li>
              <li>• يمكنك حذفها في أي وقت</li>
              <li>• مجانية من Google AI Studio</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="notification notification-error mb-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-error ml-2" />
            <span className="arabic-text">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="notification notification-success mb-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-success ml-2" />
            <span className="arabic-text">{success}</span>
          </div>
        </div>
      )}

      {/* Current Keys Status */}
      {apiKeys && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-high-contrast arabic-text mb-4">
            الحالة الحالية
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <p className="text-sm font-medium text-high-contrast arabic-text">Gemini AI</p>
                <p className="text-xs text-medium-contrast arabic-text">
                  {apiKeys.hasGeminiKey ? apiKeys.geminiKeyMasked : 'غير مضاف'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${apiKeys.hasGeminiKey ? 'bg-success' : 'bg-error'}`}></div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <p className="text-sm font-medium text-high-contrast arabic-text">OpenAI</p>
                <p className="text-xs text-medium-contrast arabic-text">
                  {apiKeys.hasOpenaiKey ? apiKeys.openaiKeyMasked : 'غير مضاف'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${apiKeys.hasOpenaiKey ? 'bg-success' : 'bg-error'}`}></div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Update Keys */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-high-contrast arabic-text">
          إضافة أو تحديث المفاتيح
        </h4>

        {/* Gemini API Key */}
        <div>
          <label htmlFor="geminiKey" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            مفتاح Gemini AI API
          </label>
          <div className="relative">
            <input
              id="geminiKey"
              name="geminiKey"
              type={showGeminiKey ? "text" : "password"}
              className="form-input w-full pl-20"
              placeholder="AIza..."
              value={formData.geminiKey}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute left-12 top-1/2 transform -translate-y-1/2 text-medium-contrast hover:text-high-contrast"
              onClick={() => setShowGeminiKey(!showGeminiKey)}
            >
              {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={testGeminiKey}
              disabled={testing || !formData.geminiKey}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-secondary disabled:text-medium-contrast"
              title="اختبار المفتاح"
            >
              <TestTube className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-medium-contrast mt-1 arabic-text">
            احصل على مفتاحك مجاناً من Google AI Studio
          </p>
        </div>

        {/* OpenAI API Key */}
        <div>
          <label htmlFor="openaiKey" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            مفتاح OpenAI API (اختياري)
          </label>
          <div className="relative">
            <input
              id="openaiKey"
              name="openaiKey"
              type={showOpenaiKey ? "text" : "password"}
              className="form-input w-full pl-10"
              placeholder="sk-..."
              value={formData.openaiKey}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-contrast hover:text-high-contrast"
              onClick={() => setShowOpenaiKey(!showOpenaiKey)}
            >
              {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-medium-contrast mt-1 arabic-text">
            للاستخدام المستقبلي مع نماذج OpenAI
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={saveApiKeys}
            disabled={saving || (!formData.geminiKey && !formData.openaiKey)}
            className="btn btn-primary flex items-center"
          >
            {saving ? (
              <>
                <div className="loading-spinner ml-2"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                حفظ المفاتيح
              </>
            )}
          </button>

          {apiKeys && (apiKeys.hasGeminiKey || apiKeys.hasOpenaiKey) && (
            <button
              onClick={deleteApiKeys}
              className="btn bg-error text-white hover:bg-opacity-80 flex items-center"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف جميع المفاتيح
            </button>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-warning ml-3 mt-0.5" />
          <div>
            <p className="text-sm text-warning arabic-text font-medium mb-1">
              ملاحظة أمنية مهمة
            </p>
            <p className="text-sm text-warning arabic-text">
              مفاتيح API محفوظة بشكل مشفر وآمن. لا تشارك مفاتيحك مع أي شخص آخر.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
