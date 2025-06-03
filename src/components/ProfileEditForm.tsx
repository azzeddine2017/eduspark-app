"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Globe, Briefcase, Calendar } from "lucide-react"

interface ProfileEditFormProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
    location?: string
    bio?: string
    website?: string
    birthDate?: string
    occupation?: string
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export default function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    website: user.website || '',
    birthDate: user.birthDate || '',
    occupation: user.occupation || ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'رابط الموقع يجب أن يبدأ بـ http:// أو https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <User className="inline w-4 h-4 ml-1" />
            الاسم الكامل *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={`form-input w-full ${errors.name ? 'border-error' : ''}`}
            placeholder="أدخل اسمك الكامل"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <Mail className="inline w-4 h-4 ml-1" />
            البريد الإلكتروني *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`form-input w-full ${errors.email ? 'border-error' : ''}`}
            placeholder="أدخل بريدك الإلكتروني"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="text-error text-sm mt-1 arabic-text">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <Phone className="inline w-4 h-4 ml-1" />
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-input w-full"
            placeholder="أدخل رقم هاتفك"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <MapPin className="inline w-4 h-4 ml-1" />
            الموقع
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="form-input w-full"
            placeholder="المدينة، البلد"
            value={formData.location}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <Calendar className="inline w-4 h-4 ml-1" />
            تاريخ الميلاد
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            className="form-input w-full"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
            <Briefcase className="inline w-4 h-4 ml-1" />
            المهنة
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            className="form-input w-full"
            placeholder="مهنتك أو تخصصك"
            value={formData.occupation}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          <Globe className="inline w-4 h-4 ml-1" />
          الموقع الإلكتروني
        </label>
        <input
          id="website"
          name="website"
          type="url"
          className={`form-input w-full ${errors.website ? 'border-error' : ''}`}
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleInputChange}
        />
        {errors.website && (
          <p className="text-error text-sm mt-1 arabic-text">{errors.website}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-high-contrast arabic-text mb-2">
          نبذة شخصية
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          className="form-input w-full"
          placeholder="اكتب نبذة مختصرة عن نفسك..."
          value={formData.bio}
          onChange={handleInputChange}
        />
        <p className="text-xs text-medium-contrast mt-1 arabic-text">
          {formData.bio.length}/500 حرف
        </p>
      </div>

      <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={loading}
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center"
        >
          {loading ? (
            <>
              <div className="loading-spinner ml-2"></div>
              جاري الحفظ...
            </>
          ) : (
            'حفظ التغييرات'
          )}
        </button>
      </div>
    </form>
  )
}
