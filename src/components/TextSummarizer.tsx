"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface TextSummarizerProps {
  lessonId?: string
  className?: string
}

export default function TextSummarizer({ lessonId, className = "" }: TextSummarizerProps) {
  const { data: session } = useSession()
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<{
    originalLength: number
    summaryLength: number
    compressionRatio: number
  } | null>(null)

  const summarizeText = async () => {
    if (!text.trim() || loading || !session) return

    if (text.length < 100) {
      alert("النص قصير جداً للتلخيص. يجب أن يكون على الأقل 100 حرف.")
      return
    }

    setLoading(true)
    setSummary("")
    setStats(null)

    try {
      const response = await fetch("/api/llm/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          length: length,
          lessonId: lessonId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
        setStats({
          originalLength: data.originalLength,
          summaryLength: data.summaryLength,
          compressionRatio: data.compressionRatio
        })
      } else {
        alert(data.error || "حدث خطأ في تلخيص النص")
      }
    } catch (error) {
      alert("حدث خطأ في الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setText("")
    setSummary("")
    setStats(null)
  }

  if (!session) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-800 text-sm">
          يجب تسجيل الدخول لاستخدام أداة تلخيص النصوص
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            أداة تلخيص النصوص
          </h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg 
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Input Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              النص المراد تلخيصه (100 حرف على الأقل)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="الصق النص هنا..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              rows={6}
              disabled={loading}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              عدد الأحرف: {text.length}
            </div>
          </div>

          {/* Length Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              طول الملخص
            </label>
            <div className="flex space-x-4 space-x-reverse">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="short"
                  checked={length === 'short'}
                  onChange={(e) => setLength(e.target.value as 'short')}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">قصير</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="medium"
                  checked={length === 'medium'}
                  onChange={(e) => setLength(e.target.value as 'medium')}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">متوسط</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="long"
                  checked={length === 'long'}
                  onChange={(e) => setLength(e.target.value as 'long')}
                  className="mr-2"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">طويل</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={summarizeText}
              disabled={loading || !text.trim() || text.length < 100}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  جاري التلخيص...
                </>
              ) : (
                "تلخيص النص"
              )}
            </button>
            <button
              onClick={clearAll}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              مسح الكل
            </button>
          </div>

          {/* Summary Result */}
          {summary && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الملخص:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
              
              {/* Statistics */}
              {stats && (
                <div className="mt-3 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    <div className="text-xs text-blue-600 dark:text-blue-400">النص الأصلي</div>
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {stats.originalLength} حرف
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <div className="text-xs text-green-600 dark:text-green-400">الملخص</div>
                    <div className="text-sm font-medium text-green-900 dark:text-green-300">
                      {stats.summaryLength} حرف
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                    <div className="text-xs text-purple-600 dark:text-purple-400">نسبة الضغط</div>
                    <div className="text-sm font-medium text-purple-900 dark:text-purple-300">
                      {stats.compressionRatio}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Usage Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 pt-2">
            يمكنك استخدام أداة التلخيص ضمن حدود الاستخدام اليومية
          </div>
        </div>
      )}
    </div>
  )
}
