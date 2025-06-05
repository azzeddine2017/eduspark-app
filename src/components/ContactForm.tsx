"use client"

import { useState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  const categories = [
    { value: 'general', label: 'استفسار عام' },
    { value: 'technical', label: 'دعم فني' },
    { value: 'content', label: 'محتوى تعليمي' },
    { value: 'account', label: 'مشكلة في الحساب' },
    { value: 'suggestion', label: 'اقتراح أو فكرة' },
    { value: 'bug', label: 'بلاغ عن خطأ' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'الموضوع مطلوب'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'الرسالة قصيرة جداً (10 أحرف على الأقل)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // مسح الخطأ عند التعديل
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // محاكاة إرسال النموذج
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // في التطبيق الحقيقي، ستقوم بإرسال البيانات إلى API
      console.log('Contact form submitted:', formData)
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-high-contrast arabic-text mb-2">
          تم إرسال رسالتك بنجاح!
        </h3>
        <p className="text-medium-contrast arabic-text mb-6">
          شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="btn btn-primary"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'error' && (
        <div className="notification notification-error">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-error ml-2" />
            <span className="arabic-text">حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            الاسم الكامل *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input ${errors.name ? 'border-error' : ''}`}
            placeholder="أدخل اسمك الكامل"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input ${errors.email ? 'border-error' : ''}`}
            placeholder="أدخل بريدك الإلكتروني"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          نوع الاستفسار
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="input"
          disabled={isSubmitting}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          الموضوع *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className={`input ${errors.subject ? 'border-error' : ''}`}
          placeholder="موضوع رسالتك"
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-error text-sm mt-1 arabic-text">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          الرسالة *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={6}
          className={`input resize-none ${errors.message ? 'border-error' : ''}`}
          placeholder="اكتب رسالتك هنا..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-error text-sm mt-1 arabic-text">{errors.message}</p>
        )}
        <p className="text-textSecondary text-sm mt-1 arabic-text">
          {formData.message.length}/500 حرف
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 ml-2" />
            إرسال الرسالة
          </>
        )}
      </button>

      <p className="text-textSecondary text-sm text-center arabic-text">
        * الحقول المطلوبة
      </p>
    </form>
  )
}
