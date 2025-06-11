import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { globalPlatformService } from '@/lib/distributed-platform';
import GlobalDashboardContent from '@/components/admin/GlobalDashboardContent';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'لوحة التحكم العامة - منصة فتح الموزعة',
  description: 'إدارة الشبكة العالمية للعقد المحلية والمحتوى التعليمي',
};

// جلب البيانات من الخادم
async function getDashboardData() {
  try {
    // جلب الإحصائيات العامة
    const globalStats = await globalPlatformService.collectGlobalStatistics();
    
    // جلب العقد النشطة
    const activeNodes = await globalPlatformService.getAllActiveNodes();
    
    // جلب آخر الأنشطة (يمكن تطويرها لاحقاً)
    const recentActivity = [
      {
        id: '1',
        type: 'node_created',
        message: 'تم إنشاء عقدة جديدة في المغرب',
        timestamp: new Date(),
        nodeId: 'node_1'
      },
      {
        id: '2',
        type: 'content_distributed',
        message: 'تم توزيع دورة "أساسيات البرمجة" لـ 15 عقدة',
        timestamp: new Date(Date.now() - 3600000),
        contentId: 'content_1'
      },
      {
        id: '3',
        type: 'revenue_milestone',
        message: 'تم تحقيق هدف الإيرادات الشهرية',
        timestamp: new Date(Date.now() - 7200000),
        amount: 50000
      }
    ];

    // حساب إحصائيات إضافية
    const totalRevenue = globalStats.nodeStatistics.reduce(
      (sum, node) => sum + node.revenue, 0
    );

    const averageRevenuePerNode = globalStats.totalNodes > 0 
      ? totalRevenue / globalStats.totalNodes 
      : 0;

    // تحضير بيانات المخططات
    const revenueChartData = generateRevenueChartData();
    const nodesGrowthData = generateNodesGrowthData();
    const contentDistributionData = generateContentDistributionData();

    return {
      globalStats: {
        ...globalStats,
        totalRevenue,
        averageRevenuePerNode
      },
      activeNodes,
      recentActivity,
      charts: {
        revenue: revenueChartData,
        nodesGrowth: nodesGrowthData,
        contentDistribution: contentDistributionData
      },
      systemHealth: {
        status: 'healthy',
        uptime: 99.9,
        responseTime: 120,
        activeConnections: globalStats.totalNodes
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة التحكم:', error);
    throw error;
  }
}

// توليد بيانات مخطط الإيرادات (مؤقت)
function generateRevenueChartData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    growth: Math.floor(Math.random() * 30) + 5
  }));
}

// توليد بيانات نمو العقد (مؤقت)
function generateNodesGrowthData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    nodes: Math.floor(Math.random() * 10) + index * 3 + 5,
    activeUsers: Math.floor(Math.random() * 1000) + index * 200 + 500
  }));
}

// توليد بيانات توزيع المحتوى (مؤقت)
function generateContentDistributionData() {
  return [
    { category: 'الرياضيات', count: 45, percentage: 25 },
    { category: 'العلوم', count: 38, percentage: 21 },
    { category: 'اللغات', count: 32, percentage: 18 },
    { category: 'الدراسات الإسلامية', count: 28, percentage: 16 },
    { category: 'التقنية', count: 22, percentage: 12 },
    { category: 'أخرى', count: 15, percentage: 8 }
  ];
}

export default async function GlobalDashboardPage() {
  // التحقق من المصادقة والصلاحيات
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* رأس الصفحة */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  لوحة التحكم العامة
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  إدارة الشبكة العالمية لمنصة فتح الموزعة
                </p>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* زر تحديث البيانات */}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  تحديث البيانات
                </button>
                
                {/* زر إعدادات النظام */}
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  إعدادات النظام
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى لوحة التحكم */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardDataWrapper />
        </Suspense>
      </div>
    </div>
  );
}

// مكون لتحميل البيانات وعرضها
async function DashboardDataWrapper() {
  try {
    const dashboardData = await getDashboardData();
    return <GlobalDashboardContent {...dashboardData} />;
  } catch (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          خطأ في تحميل البيانات
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          حدث خطأ أثناء جلب بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }
}
