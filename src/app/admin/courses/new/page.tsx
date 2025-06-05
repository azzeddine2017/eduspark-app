"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Header from "@/components/Header"
import {
  BookOpen,
  Save,
  ArrowLeft,
  Upload,
  Eye,
  Settings,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export default function NewCoursePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    level: 'BEGINNER',
    duration: '',
    thumbnail: '',
    isPublished: false
  })

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: '',
      content: '',
      order: 1,
      duration: ''
    }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          duration: parseInt(courseData.duration) || null,
          lessons: lessons.filter(lesson => lesson.title.trim() !== '')
        }),
      })

      if (response.ok) {
        const course = await response.json()
        setSuccess('تم إنشاء الدورة بنجاح!')
        setTimeout(() => {
          router.push(`/admin/courses/${course.id}`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'حدث خطأ أثناء إنشاء الدورة')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const addLesson = () => {
    setLessons([...lessons, {
      id: lessons.length + 1,
      title: '',
      content: '',
      order: lessons.length + 1,
      duration: ''
    }])
  }

  const removeLesson = (id: number) => {
    setLessons(lessons.filter(lesson => lesson.id !== id))
  }

  const updateLesson = (id: number, field: string, value: string) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ))
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-high-contrast arabic-text mb-4">
            غير مصرح لك بالوصول
          </h1>
          <p className="text-medium-contrast arabic-text mb-6">
            هذه الصفحة مخصصة للمديرين فقط
          </p>
          <Link href="/" className="btn btn-primary">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-high-contrast arabic-text">
                إنشاء دورة جديدة
              </h1>
              <p className="text-medium-contrast arabic-text mt-2">
                أنشئ محتوى تعليمي جديد للمنصة
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="btn btn-outline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للدورات
            </Link>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="notification notification-error mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 ml-2" />
              <span className="arabic-text">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="notification notification-success mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 ml-2" />
              <span className="arabic-text">{success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Basic Info */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <BookOpen className="w-5 h-5 ml-2" />
              معلومات الدورة الأساسية
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  عنوان الدورة *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="أدخل عنوان الدورة"
                  value={courseData.title}
                  onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  المستوى
                </label>
                <select
                  className="input"
                  value={courseData.level}
                  onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                >
                  <option value="BEGINNER">مبتدئ</option>
                  <option value="INTERMEDIATE">متوسط</option>
                  <option value="ADVANCED">متقدم</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  وصف الدورة
                </label>
                <textarea
                  className="input min-h-[100px]"
                  placeholder="أدخل وصفاً مفصلاً للدورة"
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  المدة المتوقعة (بالدقائق)
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="120"
                  value={courseData.duration}
                  onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  صورة الدورة (URL)
                </label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://example.com/image.jpg"
                  value={courseData.thumbnail}
                  onChange={(e) => setCourseData({...courseData, thumbnail: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={courseData.isPublished}
                  onChange={(e) => setCourseData({...courseData, isPublished: e.target.checked})}
                />
                <span className="text-sm text-text arabic-text">نشر الدورة فوراً</span>
              </label>
            </div>
          </div>

          {/* Lessons */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-high-contrast arabic-text flex items-center">
                <BookOpen className="w-5 h-5 ml-2" />
                دروس الدورة
              </h2>
              <button
                type="button"
                onClick={addLesson}
                className="btn btn-outline flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة درس
              </button>
            </div>

            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-text arabic-text">
                      الدرس {index + 1}
                    </h3>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(lesson.id)}
                        className="text-error hover:text-error-dark transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text arabic-text mb-2">
                        عنوان الدرس
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="أدخل عنوان الدرس"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text arabic-text mb-2">
                        المدة (بالدقائق)
                      </label>
                      <input
                        type="number"
                        className="input"
                        placeholder="30"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text arabic-text mb-2">
                        محتوى الدرس
                      </label>
                      <textarea
                        className="input min-h-[120px]"
                        placeholder="أدخل محتوى الدرس..."
                        value={lesson.content}
                        onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Link
              href="/admin/courses"
              className="btn btn-outline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              إلغاء
            </Link>

            <div className="flex gap-4">
              <button
                type="button"
                className="btn btn-secondary flex items-center"
                onClick={() => setCourseData({...courseData, isPublished: false})}
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ كمسودة
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center"
              >
                {loading ? (
                  <div className="loading-spinner ml-2"></div>
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                {courseData.isPublished ? 'إنشاء ونشر' : 'إنشاء الدورة'}
              </button>
            </div>
          </div>
        </form>

        {/* Help Notice */}
        <div className="card p-6 mt-8 bg-gradient-to-r from-info to-primary text-white">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 ml-3 mt-1 opacity-90" />
            <div>
              <h3 className="font-bold arabic-text mb-2">نصائح لإنشاء دورة ناجحة</h3>
              <ul className="text-sm opacity-90 arabic-text space-y-1">
                <li>• اختر عنواناً واضحاً ومحدداً للدورة</li>
                <li>• اكتب وصفاً مفصلاً يوضح ما سيتعلمه الطالب</li>
                <li>• قسم المحتوى إلى دروس قصيرة ومترابطة</li>
                <li>• استخدم أمثلة عملية وتطبيقات واقعية</li>
                <li>• احفظ كمسودة أولاً لمراجعة المحتوى قبل النشر</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
