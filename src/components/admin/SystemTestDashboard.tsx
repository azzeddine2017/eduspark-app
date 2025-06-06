'use client'

import { useState } from 'react'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bell,
  BarChart3,
  Mail,
  Database,
  Zap,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

// واجهة لحالة النظام (يمكنك تخصيصها حسب الحاجة)
interface SystemStatus {
  [key: string]: unknown;
}

// واجهة نتيجة الاختبار
interface TestResult {
  test: string
  success: boolean
  duration?: string
  message?: string
  error?: string
  details?: unknown // استخدم unknown بدلاً من any
}

// واجهة ملخص الاختبار
interface TestSummary {
  total: number
  successful: number
  failed: number
  successRate: string
}

/**
 * مكون لوحة اختبار الأنظمة
 */
export default function SystemTestDashboard() {
  const [testResults, setTestResults] = useState<Record<string, TestResult[]>>({})
  const [testSummaries, setTestSummaries] = useState<Record<string, TestSummary>>({})
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)

  // تشغيل اختبار
  const runTest = async (system: string, testType: string) => {
    const testKey = `${system}_${testType}`
    setRunningTests(prev => new Set([...prev, testKey]))

    try {
      const response = await fetch(`/api/test/${system}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testType })
      })

      if (response.ok) {
        const data = await response.json()
        setTestResults(prev => ({
          ...prev,
          [testKey]: data.results
        }))
        setTestSummaries(prev => ({
          ...prev,
          [testKey]: data.summary
        }))
      } else {
        const error = await response.json()
        setTestResults(prev => ({
          ...prev,
          [testKey]: [{
            test: testType,
            success: false,
            error: error.error || 'فشل في تشغيل الاختبار'
          }]
        }))
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testKey]: [{
          test: testType,
          success: false,
          error: error instanceof Error ? error.message : 'خطأ في الاتصال'
        }]
      }))
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev)
        newSet.delete(testKey)
        return newSet
      })
    }
  }

  // جلب حالة النظام
  const fetchSystemStatus = async (system: string) => {
    try {
      const response = await fetch(`/api/test/${system}`)
      if (response.ok) {
        const data = await response.json()
        setSystemStatus((prev) => ({
          ...(prev || {}),
          [system]: data
        }))
      }
    } catch (error) {
      console.error(`خطأ في جلب حالة ${system}:`, error)
    }
  }

  // أنظمة الاختبار المتاحة
  const testSystems = [
    {
      id: 'notifications',
      name: 'نظام الإشعارات',
      icon: Bell,
      color: 'blue',
      tests: [
        { id: 'basic_notification', name: 'إشعار أساسي' },
        { id: 'email_notification', name: 'إشعار بريد إلكتروني' },
        { id: 'course_events', name: 'أحداث الدورات' },
        { id: 'bulk_notifications', name: 'إشعارات مجمعة' },
        { id: 'email_system', name: 'نظام البريد الإلكتروني' },
        { id: 'notification_preferences', name: 'تفضيلات الإشعارات' },
        { id: 'performance_test', name: 'اختبار الأداء' },
        { id: 'all_tests', name: 'جميع الاختبارات' }
      ]
    },
    {
      id: 'analytics',
      name: 'نظام التحليلات',
      icon: BarChart3,
      color: 'green',
      tests: [
        { id: 'basic_tracking', name: 'التتبع الأساسي' },
        { id: 'page_tracking', name: 'تتبع الصفحات' },
        { id: 'learning_analytics', name: 'تحليلات التعلم' },
        { id: 'ai_analytics', name: 'تحليلات المساعد الذكي' },
        { id: 'user_activity', name: 'نشاط المستخدم' },
        { id: 'system_metrics', name: 'مقاييس النظام' },
        { id: 'performance_test', name: 'اختبار الأداء' },
        { id: 'api_endpoints', name: 'API endpoints' },
        { id: 'all_tests', name: 'جميع الاختبارات' }
      ]
    }
  ]

  // رسم نتائج الاختبار
  const renderTestResults = (testKey: string) => {
    const results = testResults[testKey]
    const summary = testSummaries[testKey]

    if (!results) return null

    return (
      <div className="mt-4 space-y-2">
        {/* ملخص النتائج */}
        {summary && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span>الملخص:</span>
              <span className={`font-medium ${
                summary.successful === summary.total ? 'text-green-600' : 'text-red-600'
              }`}>
                {summary.successRate} ({summary.successful}/{summary.total})
              </span>
            </div>
          </div>
        )}

        {/* تفاصيل النتائج */}
        <div className="space-y-1">
          {results.map((result, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 rounded text-sm ${
                result.success 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 ml-2" />
                ) : (
                  <XCircle className="h-4 w-4 ml-2" />
                )}
                <span>{result.test}</span>
              </div>
              
              <div className="text-xs">
                {result.duration && <span className="ml-2">{result.duration}</span>}
                {result.error && (
                  <span className="text-red-600" title={result.error}>
                    خطأ
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* حالة النظام العامة */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <h3 className="text-lg font-semibold">قاعدة البيانات</h3>
              <p className="text-sm text-gray-600">متصلة وتعمل بشكل طبيعي</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-green-600" />
            <div className="mr-4">
              <h3 className="text-lg font-semibold">البريد الإلكتروني</h3>
              <p className="text-sm text-gray-600">جاهز للإرسال</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-purple-600" />
            <div className="mr-4">
              <h3 className="text-lg font-semibold">الأداء</h3>
              <p className="text-sm text-gray-600">ممتاز</p>
            </div>
          </div>
        </div>
      </div>

      {/* أنظمة الاختبار */}
      <div className="space-y-8">
        {testSystems.map((system) => (
          <div key={system.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <system.icon className="h-8 w-8 text-gray-600 ml-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{system.name}</h2>
                    <p className="text-sm text-gray-600">اختبار جميع مكونات النظام</p>
                  </div>
                </div>

                <button
                  onClick={() => fetchSystemStatus(system.id)}
                  className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث الحالة
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {system.tests.map((test) => {
                  const testKey = `${system.id}_${test.id}`
                  const isRunning = runningTests.has(testKey)
                  const hasResults = testResults[testKey]

                  return (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{test.name}</h3>
                        
                        <button
                          onClick={() => runTest(system.id, test.id)}
                          disabled={isRunning}
                          className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
                            isRunning
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : hasResults
                              ? testSummaries[testKey]?.successful === testSummaries[testKey]?.total
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <Clock className="h-4 w-4 ml-1 animate-spin" />
                              جاري التشغيل...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 ml-1" />
                              تشغيل
                            </>
                          )}
                        </button>
                      </div>

                      {/* عرض النتائج */}
                      {renderTestResults(testKey)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* تشغيل جميع الاختبارات */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">تشغيل جميع الاختبارات</h3>
              <p className="text-sm text-yellow-700">
                سيتم تشغيل جميع اختبارات الأنظمة. قد يستغرق هذا عدة دقائق.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              testSystems.forEach(system => {
                runTest(system.id, 'all_tests')
              })
            }}
            className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
          >
            <Play className="h-5 w-5 ml-2" />
            تشغيل جميع الاختبارات
          </button>
        </div>
      </div>
    </div>
  )
}
