"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import SimpleThemeToggle from "@/components/SimpleThemeToggle"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Calendar, MapPin, Phone, Briefcase, GraduationCap, Users, Heart, Globe } from "lucide-react"

interface FormData {
  // المرحلة الأولى - المعلومات الأساسية
  name: string
  email: string
  password: string
  confirmPassword: string

  // المرحلة الثانية - المعلومات الشخصية
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  phone: string

  // المرحلة الثالثة - المعلومات التعليمية والمهنية
  education: string
  occupation: string
  experience: string
  interests: string[]

  // المرحلة الرابعة - الموقع والتفضيلات
  country: string
  city: string
  learningGoals: string[]

  // المرحلة الخامسة - نظام الهولاكراسي والتطوع
  agreeToTerms: boolean
  agreeToHolacracy: boolean
  wantToVolunteer: boolean
  volunteerAreas: string[]
}

export default function EnhancedRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // المرحلة الأولى
    name: "",
    email: "",
    password: "",
    confirmPassword: "",

    // المرحلة الثانية
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",

    // المرحلة الثالثة
    education: "",
    occupation: "",
    experience: "",
    interests: [],

    // المرحلة الرابعة
    country: "",
    city: "",
    learningGoals: [],

    // المرحلة الخامسة
    agreeToTerms: false,
    agreeToHolacracy: false,
    wantToVolunteer: false,
    volunteerAreas: []
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const totalSteps = 5

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleArrayChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword)
      case 2:
        return !!(formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender)
      case 3:
        return !!(formData.education && formData.interests.length > 0)
      case 4:
        return !!(formData.country && formData.city && formData.learningGoals.length > 0)
      case 5:
        return formData.agreeToTerms && formData.agreeToHolacracy
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(5)) return

    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            phone: formData.phone,
            education: formData.education,
            occupation: formData.occupation,
            experience: formData.experience,
            interests: formData.interests,
            country: formData.country,
            city: formData.city,
            learningGoals: formData.learningGoals,
            wantToVolunteer: formData.wantToVolunteer,
            volunteerAreas: formData.volunteerAreas
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/auth/signin?message=تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن")
      } else {
        setError(data.error || "حدث خطأ في إنشاء الحساب")
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4 space-x-reverse">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-primary text-white'
                : step < currentStep
                ? 'bg-success text-white'
                : 'bg-surface text-textSecondary border border-border'
            }`}>
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < totalSteps && (
              <div className={`w-8 h-0.5 mx-2 ${
                step < currentStep ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text arabic-text">المعلومات الشخصية</h3>
        <p className="text-textSecondary arabic-text">أخبرنا المزيد عنك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            الاسم الأول
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="الاسم الأول"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            اسم العائلة
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="اسم العائلة"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            <Calendar className="inline w-4 h-4 ml-1" />
            تاريخ الميلاد
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-input w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            الجنس
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
            <option value="other">آخر</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <Phone className="inline w-4 h-4 ml-1" />
          رقم الهاتف (اختياري)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="+966 50 123 4567"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text arabic-text">المعلومات التعليمية والمهنية</h3>
        <p className="text-textSecondary arabic-text">ساعدنا في تخصيص تجربتك التعليمية</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <GraduationCap className="inline w-4 h-4 ml-1" />
          المستوى التعليمي
        </label>
        <select
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="form-input w-full"
          required
        >
          <option value="">اختر المستوى التعليمي</option>
          <option value="primary">ابتدائي</option>
          <option value="middle">متوسط</option>
          <option value="high">ثانوي</option>
          <option value="diploma">دبلوم</option>
          <option value="bachelor">بكالوريوس</option>
          <option value="master">ماجستير</option>
          <option value="phd">دكتوراه</option>
          <option value="other">أخرى</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <Briefcase className="inline w-4 h-4 ml-1" />
          المهنة الحالية (اختياري)
        </label>
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="مثل: مطور برمجيات، معلم، طالب..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          سنوات الخبرة (اختياري)
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="form-input w-full"
        >
          <option value="">اختر سنوات الخبرة</option>
          <option value="0">بدون خبرة</option>
          <option value="1-2">1-2 سنة</option>
          <option value="3-5">3-5 سنوات</option>
          <option value="6-10">6-10 سنوات</option>
          <option value="10+">أكثر من 10 سنوات</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          اهتماماتك التعليمية (اختر ما يناسبك)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'البرمجة والتقنية',
            'التصميم والفنون',
            'الأعمال والإدارة',
            'العلوم والرياضيات',
            'اللغات',
            'الطبخ والحرف',
            'الصحة واللياقة',
            'التطوير الشخصي',
            'التاريخ والثقافة'
          ].map((interest) => (
            <label key={interest} className="flex items-center space-x-2 space-x-reverse">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleArrayChange('interests', interest)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text">{interest}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text arabic-text">الموقع وأهداف التعلم</h3>
        <p className="text-textSecondary arabic-text">ساعدنا في تقديم محتوى مناسب لك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            <Globe className="inline w-4 h-4 ml-1" />
            البلد
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="form-input w-full"
            required
          >
            <option value="">اختر البلد</option>
            <option value="SA">السعودية</option>
            <option value="AE">الإمارات</option>
            <option value="EG">مصر</option>
            <option value="JO">الأردن</option>
            <option value="LB">لبنان</option>
            <option value="SY">سوريا</option>
            <option value="IQ">العراق</option>
            <option value="KW">الكويت</option>
            <option value="QA">قطر</option>
            <option value="BH">البحرين</option>
            <option value="OM">عمان</option>
            <option value="YE">اليمن</option>
            <option value="MA">المغرب</option>
            <option value="TN">تونس</option>
            <option value="DZ">الجزائر</option>
            <option value="LY">ليبيا</option>
            <option value="SD">السودان</option>
            <option value="other">أخرى</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text arabic-text mb-2">
            <MapPin className="inline w-4 h-4 ml-1" />
            المدينة
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="أدخل اسم المدينة"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          أهدافك من التعلم (اختر ما يناسبك)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'تطوير مهارات جديدة للعمل',
            'تغيير المسار المهني',
            'التعلم للمتعة والثقافة',
            'تحسين الأداء في العمل الحالي',
            'بدء مشروع خاص',
            'التحضير للدراسة الجامعية',
            'تعلم هوايات جديدة',
            'التطوع ومساعدة المجتمع'
          ].map((goal) => (
            <label key={goal} className="flex items-center space-x-2 space-x-reverse">
              <input
                type="checkbox"
                checked={formData.learningGoals.includes(goal)}
                onChange={() => handleArrayChange('learningGoals', goal)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text">{goal}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text arabic-text">نظام الهولاكراسي والتطوع</h3>
        <p className="text-textSecondary arabic-text">انضم لمجتمع التعلم التشاركي</p>
      </div>

      {/* شرح نظام الهولاكراسي */}
      <div className="bg-primary bg-opacity-10 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-bold text-primary arabic-text mb-4 flex items-center">
          <Users className="w-5 h-5 ml-2" />
          ما هو نظام الهولاكراسي؟
        </h4>
        <div className="space-y-3 text-sm text-text arabic-text">
          <p>
            <strong>الهولاكراسي</strong> هو نظام إداري حديث يعتمد على توزيع السلطة والمسؤوليات بدلاً من التسلسل الهرمي التقليدي.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-background rounded-lg p-4">
              <h5 className="font-semibold text-success mb-2">✅ المبادئ الأساسية:</h5>
              <ul className="space-y-1 text-xs">
                <li>• الشفافية في اتخاذ القرارات</li>
                <li>• توزيع المسؤوليات حسب الخبرة</li>
                <li>• التطوير المستمر للعمليات</li>
                <li>• المشاركة الفعالة للجميع</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-4">
              <h5 className="font-semibold text-info mb-2">🎯 الفوائد لك:</h5>
              <ul className="space-y-1 text-xs">
                <li>• فرص قيادة مشاريع تعليمية</li>
                <li>• تطوير مهارات الإدارة والتنظيم</li>
                <li>• شبكة علاقات مهنية قوية</li>
                <li>• تأثير حقيقي في المجتمع</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* الاتفاقيات */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 space-x-reverse">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-1 rounded border-border text-primary focus:ring-primary"
            required
          />
          <span className="text-sm text-text arabic-text">
            أوافق على{" "}
            <Link href="/terms" className="text-primary hover:underline">
              شروط الاستخدام
            </Link>
            {" "}و{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              سياسة الخصوصية
            </Link>
          </span>
        </label>

        <label className="flex items-start space-x-3 space-x-reverse">
          <input
            type="checkbox"
            name="agreeToHolacracy"
            checked={formData.agreeToHolacracy}
            onChange={handleChange}
            className="mt-1 rounded border-border text-primary focus:ring-primary"
            required
          />
          <span className="text-sm text-text arabic-text">
            أوافق على المشاركة في نظام الهولاكراسي وأتعهد بالمساهمة الإيجابية في تطوير المنصة والمجتمع التعليمي
          </span>
        </label>

        <label className="flex items-start space-x-3 space-x-reverse">
          <input
            type="checkbox"
            name="wantToVolunteer"
            checked={formData.wantToVolunteer}
            onChange={handleChange}
            className="mt-1 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text arabic-text">
            <Heart className="inline w-4 h-4 ml-1 text-error" />
            أرغب في التطوع ومساعدة المجتمع التعليمي (اختياري)
          </span>
        </label>
      </div>

      {/* مجالات التطوع */}
      {formData.wantToVolunteer && (
        <div className="bg-success bg-opacity-10 rounded-lg p-4">
          <label className="block text-sm font-medium text-text arabic-text mb-3">
            مجالات التطوع التي تهمك:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'إنشاء محتوى تعليمي',
              'تدريس ومساعدة الطلاب',
              'الترجمة والتحرير',
              'التصميم والجرافيك',
              'البرمجة والتطوير',
              'إدارة المجتمع',
              'التسويق والإعلان',
              'الدعم الفني'
            ].map((area) => (
              <label key={area} className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  checked={formData.volunteerAreas.includes(area)}
                  onChange={() => handleArrayChange('volunteerAreas', area)}
                  className="rounded border-border text-success focus:ring-success"
                />
                <span className="text-sm text-text">{area}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* رسالة تشجيعية */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white text-center">
        <h4 className="text-lg font-bold arabic-text mb-2">🎉 مرحباً بك في مجتمع فتح!</h4>
        <p className="text-sm arabic-text opacity-90">
          أنت على وشك الانضمام لمجتمع تعليمي يؤمن بقوة التعلم التشاركي والإدارة الذاتية
        </p>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-text arabic-text">المعلومات الأساسية</h3>
        <p className="text-textSecondary arabic-text">ابدأ بإدخال معلوماتك الأساسية</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <User className="inline w-4 h-4 ml-1" />
          الاسم الكامل
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="أدخل اسمك الكامل"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <Mail className="inline w-4 h-4 ml-1" />
          البريد الإلكتروني
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="أدخل بريدك الإلكتروني"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <Lock className="inline w-4 h-4 ml-1" />
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input w-full pl-10"
            placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text arabic-text mb-2">
          <Lock className="inline w-4 h-4 ml-1" />
          تأكيد كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input w-full pl-10"
            placeholder="أعد إدخال كلمة المرور"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-error text-sm mt-1">كلمات المرور غير متطابقة</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <SimpleThemeToggle />
      </div>

      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">ف</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-text arabic-text">
            انضم لمجتمع التعلم الذكي! 🌟
          </h2>
          <p className="mt-2 text-textSecondary arabic-text">
            ابدأ رحلتك التعليمية مع منصة فتح
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="notification notification-error mb-6">
                <span>{error}</span>
              </div>
            )}

            {/* Render Current Step */}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                السابق
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="btn btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                  <ArrowRight className="w-4 h-4 mr-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !validateStep(5)}
                  className="btn btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner w-4 h-4 ml-2"></div>
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      إنشاء الحساب
                      <CheckCircle className="w-4 h-4 mr-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-textSecondary arabic-text">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/signin" className="text-primary hover:text-secondary font-medium">
                سجل الدخول
              </Link>
            </span>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-textSecondary hover:text-primary transition-colors arabic-text">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
