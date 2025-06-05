"use client"

import { useState } from "react"
import { Send, CheckCircle, AlertCircle, Upload } from "lucide-react"

interface VolunteerFormData {
  name: string
  email: string
  phone: string
  location: string
  role: string
  experience: string
  availability: string
  motivation: string
  skills: string
  portfolio: string
}

export default function VolunteerForm() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    experience: '',
    availability: '',
    motivation: '',
    skills: '',
    portfolio: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<VolunteerFormData>>({})

  const roles = [
    { value: '', label: 'اختر الدور المناسب' },
    { value: 'content-creator', label: 'منشئ محتوى تعليمي' },
    { value: 'developer', label: 'مطور برمجيات' },
    { value: 'designer', label: 'مصمم UI/UX' },
    { value: 'community-manager', label: 'مدير مجتمع' },
    { value: 'quality-reviewer', label: 'مراجع جودة' },
    { value: 'educational-consultant', label: 'مستشار تعليمي' },
    { value: 'translator', label: 'مترجم' },
    { value: 'other', label: 'أخرى (حدد في الوصف)' }
  ]

  const availabilityOptions = [
    { value: '', label: 'اختر مدى التفرغ' },
    { value: '2-5', label: '2-5 ساعات أسبوعياً' },
    { value: '5-10', label: '5-10 ساعات أسبوعياً' },
    { value: '10-20', label: '10-20 ساعة أسبوعياً' },
    { value: '20+', label: 'أكثر من 20 ساعة أسبوعياً' },
    { value: 'flexible', label: 'مرن حسب الحاجة' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<VolunteerFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب'
    }

    if (!formData.role) {
      newErrors.role = 'يرجى اختيار الدور المناسب'
    }

    if (!formData.availability) {
      newErrors.availability = 'يرجى تحديد مدى التفرغ'
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'يرجى كتابة دافعك للتطوع'
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = 'يرجى كتابة دافع أكثر تفصيلاً (50 حرف على الأقل)'
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'يرجى وصف خبرتك'
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
    if (errors[name as keyof VolunteerFormData]) {
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
      console.log('Volunteer form submitted:', formData)
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        experience: '',
        availability: '',
        motivation: '',
        skills: '',
        portfolio: ''
      })
    } catch (error) {
      console.error('Error submitting volunteer form:', error)
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
          تم إرسال طلبك بنجاح!
        </h3>
        <p className="text-medium-contrast arabic-text mb-6">
          شكراً لاهتمامك بالتطوع معنا. سنراجع طلبك ونتواصل معك خلال 3-5 أيام عمل.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="btn btn-primary"
        >
          تقديم طلب آخر
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
            <span className="arabic-text">حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.</span>
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

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`input ${errors.phone ? 'border-error' : ''}`}
            placeholder="أدخل رقم هاتفك"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            الموقع الجغرافي
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="input"
            placeholder="المدينة، البلد"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            الدور المطلوب *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className={`input ${errors.role ? 'border-error' : ''}`}
            disabled={isSubmitting}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.role}</p>
          )}
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            مدى التفرغ *
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className={`input ${errors.availability ? 'border-error' : ''}`}
            disabled={isSubmitting}
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.availability && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.availability}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          الخبرة والمؤهلات *
        </label>
        <textarea
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          rows={4}
          className={`input resize-none ${errors.experience ? 'border-error' : ''}`}
          placeholder="اكتب عن خبرتك ومؤهلاتك في المجال المطلوب..."
          disabled={isSubmitting}
        />
        {errors.experience && (
          <p className="text-error text-sm mt-1 arabic-text">{errors.experience}</p>
        )}
      </div>

      <div>
        <label htmlFor="motivation" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          دافعك للتطوع *
        </label>
        <textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleInputChange}
          rows={4}
          className={`input resize-none ${errors.motivation ? 'border-error' : ''}`}
          placeholder="لماذا تريد التطوع مع منصة فتح؟ ما الذي يحفزك؟"
          disabled={isSubmitting}
        />
        {errors.motivation && (
          <p className="text-error text-sm mt-1 arabic-text">{errors.motivation}</p>
        )}
        <p className="text-textSecondary text-sm mt-1 arabic-text">
          {formData.motivation.length}/500 حرف
        </p>
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          المهارات الإضافية
        </label>
        <textarea
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          rows={3}
          className="input resize-none"
          placeholder="أي مهارات أخرى قد تكون مفيدة (لغات برمجة، تصميم، لغات، إلخ)"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="portfolio" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          رابط الأعمال السابقة (اختياري)
        </label>
        <input
          type="url"
          id="portfolio"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleInputChange}
          className="input"
          placeholder="https://..."
          disabled={isSubmitting}
        />
        <p className="text-textSecondary text-sm mt-1 arabic-text">
          رابط لموقعك الشخصي، GitHub، Behance، أو أي منصة تعرض أعمالك
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
            إرسال طلب التطوع
          </>
        )}
      </button>

      <p className="text-textSecondary text-sm text-center arabic-text">
        * الحقول المطلوبة
      </p>
    </form>
  )
}
