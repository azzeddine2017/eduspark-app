"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EnrollButtonProps {
  courseId: string
  className?: string
}

export default function EnrollButton({ courseId, className = "" }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh the page to show updated enrollment status
        router.refresh()
      } else {
        setError(data.error || 'حدث خطأ في التسجيل')
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {loading ? 'جاري التسجيل...' : 'التسجيل في الدورة'}
      </button>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
