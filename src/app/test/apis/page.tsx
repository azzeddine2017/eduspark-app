'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Code, 
  Database,
  Server,
  Activity
} from 'lucide-react';

export default function APITestPage() {
  const [results, setResults] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { success: true, data: result } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testMetricsAPI = async () => {
    const response = await fetch('/api/admin/pilot/metrics?nodeId=pilot-riyadh-001&timeframe=7d');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  };

  const testChallengesAPI = async () => {
    const response = await fetch('/api/admin/pilot/challenges?nodeId=pilot-riyadh-001');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  };

  const createTestChallenge = async () => {
    const challengeData = {
      nodeId: 'pilot-riyadh-001',
      title: `تحدي تجريبي - ${new Date().toLocaleTimeString('ar')}`,
      description: 'هذا تحدي تجريبي تم إنشاؤه لاختبار النظام',
      severity: 'LOW',
      assignee: 'فريق الاختبار',
      tags: ['test', 'automated']
    };

    const response = await fetch('/api/admin/pilot/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challengeData)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  };

  const addTestMetric = async () => {
    const metricData = {
      nodeId: 'pilot-riyadh-001',
      metricType: 'test_performance',
      value: Math.floor(Math.random() * 100),
      metadata: {
        source: 'automated_test',
        timestamp: new Date().toISOString(),
        testId: Math.random().toString(36).substr(2, 9)
      }
    };

    const response = await fetch('/api/admin/pilot/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metricData)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  };

  const updateNodeStatus = async () => {
    const statusData = {
      nodeId: 'pilot-riyadh-001',
      status: 'ACTIVE',
      notes: `تحديث حالة العقدة - اختبار في ${new Date().toLocaleString('ar')}`
    };

    const response = await fetch('/api/admin/pilot/metrics', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  };

  const runAllTests = async () => {
    const tests = [
      { name: 'metrics', fn: testMetricsAPI },
      { name: 'challenges', fn: testChallengesAPI },
      { name: 'addMetric', fn: addTestMetric },
      { name: 'createChallenge', fn: createTestChallenge },
      { name: 'updateStatus', fn: updateNodeStatus }
    ];

    for (const test of tests) {
      await runTest(test.name, test.fn);
      // انتظار قصير بين الاختبارات
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getResultIcon = (testName: string) => {
    if (loading[testName]) return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
    if (!results[testName]) return <Play className="w-5 h-5 text-gray-400" />;
    return results[testName].success ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getResultColor = (testName: string) => {
    if (loading[testName]) return 'border-blue-200 bg-blue-50';
    if (!results[testName]) return 'border-gray-200 bg-gray-50';
    return results[testName].success ? 
      'border-green-200 bg-green-50' : 
      'border-red-200 bg-red-50';
  };

  const tests = [
    {
      id: 'metrics',
      title: 'اختبار API مؤشرات الأداء',
      description: 'جلب مؤشرات الأداء للعقدة التجريبية',
      icon: Activity,
      endpoint: 'GET /api/admin/pilot/metrics',
      action: () => runTest('metrics', testMetricsAPI)
    },
    {
      id: 'challenges',
      title: 'اختبار API التحديات',
      description: 'جلب قائمة التحديات والمشاكل',
      icon: Database,
      endpoint: 'GET /api/admin/pilot/challenges',
      action: () => runTest('challenges', testChallengesAPI)
    },
    {
      id: 'addMetric',
      title: 'إضافة مؤشر جديد',
      description: 'إضافة مؤشر أداء تجريبي',
      icon: Server,
      endpoint: 'POST /api/admin/pilot/metrics',
      action: () => runTest('addMetric', addTestMetric)
    },
    {
      id: 'createChallenge',
      title: 'إنشاء تحدي جديد',
      description: 'إنشاء تحدي تجريبي جديد',
      icon: Code,
      endpoint: 'POST /api/admin/pilot/challenges',
      action: () => runTest('createChallenge', createTestChallenge)
    },
    {
      id: 'updateStatus',
      title: 'تحديث حالة العقدة',
      description: 'تحديث حالة العقدة التجريبية',
      icon: CheckCircle,
      endpoint: 'PUT /api/admin/pilot/metrics',
      action: () => runTest('updateStatus', updateNodeStatus)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div className="mr-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    🧪 اختبار APIs العقدة التجريبية
                  </h1>
                  <p className="text-gray-600">
                    اختبار شامل لجميع APIs النظام
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runAllTests}
                disabled={Object.values(loading).some(Boolean)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                🚀 تشغيل جميع الاختبارات
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tests */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {tests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`border-2 rounded-xl p-6 transition-all duration-300 ${getResultColor(test.id)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <test.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {test.description}
                    </p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                      {test.endpoint}
                    </code>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  {getResultIcon(test.id)}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={test.action}
                    disabled={loading[test.id]}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {loading[test.id] ? 'جاري الاختبار...' : 'تشغيل الاختبار'}
                  </motion.button>
                </div>
              </div>

              {/* Result Display */}
              {results[test.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-white rounded-lg border"
                >
                  <h4 className="font-semibold mb-2">
                    {results[test.id].success ? '✅ نجح الاختبار' : '❌ فشل الاختبار'}
                  </h4>
                  <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(
                      results[test.id].success ? results[test.id].data : results[test.id].error, 
                      null, 
                      2
                    )}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 ملخص نتائج الاختبار
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(results).filter(r => r?.success).length}
              </div>
              <div className="text-sm text-green-700">اختبارات ناجحة</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(results).filter(r => r && !r.success).length}
              </div>
              <div className="text-sm text-red-700">اختبارات فاشلة</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {tests.length - Object.keys(results).length}
              </div>
              <div className="text-sm text-gray-700">لم يتم اختبارها</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
