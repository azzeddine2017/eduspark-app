import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { globalPlatformService } from '@/lib/distributed-platform';
import LocalDashboardContent from '@/components/partner/LocalDashboardContent';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'لوحة تحكم الشريك المحلي - منصة فتح الموزعة',
  description: 'إدارة العقدة المحلية والمحتوى والمستخدمين',
};

// جلب بيانات العقدة المحلية
async function getLocalNodeData(userId: string) {
  try {
    // جلب العقدة التي يديرها المستخدم
    const partnership = await prisma.nodePartner.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        node: {
          include: {
            nodeSettings: true,
            localContent: {
              include: {
                globalContent: true
              }
            },
            subscriptions: {
              where: {
                isActive: true,
                endDate: {
                  gte: new Date()
                }
              },
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!partnership) {
      throw new Error('لا توجد عقدة مرتبطة بهذا المستخدم');
    }

    const node = partnership.node;

    // جلب إحصائيات العقدة
    const nodeStats = await globalPlatformService.getNodeSubscriptionStats(node.id);

    // جلب المحتوى المحلي
    const localContent = node.localContent;

    // جلب الاشتراكات النشطة
    const activeSubscriptions = node.subscriptions;

    // حساب إحصائيات إضافية
    const totalUsers = activeSubscriptions.length;
    const monthlyRevenue = activeSubscriptions.reduce((sum: number, sub: any) => sum + Number(sub.amount), 0);
    
    // جلب آخر الأنشطة المحلية
    const recentActivity = [
      {
        id: '1',
        type: 'user_registered',
        message: 'انضم مستخدم جديد للعقدة',
        timestamp: new Date(),
        userId: 'user_1'
      },
      {
        id: '2',
        type: 'content_localized',
        message: 'تم تخصيص دورة "أساسيات البرمجة" محلياً',
        timestamp: new Date(Date.now() - 3600000),
        contentId: 'content_1'
      },
      {
        id: '3',
        type: 'subscription_created',
        message: 'اشتراك جديد في الباقة المتقدمة',
        timestamp: new Date(Date.now() - 7200000),
        amount: 49
      }
    ];

    // تحضير بيانات المخططات
    const revenueChartData = generateLocalRevenueData();
    const userGrowthData = generateUserGrowthData();
    const contentPerformanceData = generateContentPerformanceData(localContent);

    return {
      node,
      partnership,
      localStats: {
        totalUsers,
        monthlyRevenue,
        totalContent: localContent.length,
        activeSubscriptions: activeSubscriptions.length,
        ...nodeStats
      },
      activeSubscriptions,
      localContent,
      recentActivity,
      charts: {
        revenue: revenueChartData,
        userGrowth: userGrowthData,
        contentPerformance: contentPerformanceData
      }
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات العقدة المحلية:', error);
    throw error;
  }
}

// توليد بيانات الإيرادات المحلية (مؤقت)
function generateLocalRevenueData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    revenue: Math.floor(Math.random() * 5000) + 2000 + index * 500,
    subscriptions: Math.floor(Math.random() * 20) + 10 + index * 2
  }));
}

// توليد بيانات نمو المستخدمين (مؤقت)
function generateUserGrowthData() {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
  return months.map((month, index) => ({
    month,
    totalUsers: Math.floor(Math.random() * 50) + 50 + index * 20,
    activeUsers: Math.floor(Math.random() * 40) + 40 + index * 15,
    newUsers: Math.floor(Math.random() * 15) + 5 + index * 2
  }));
}

// توليد بيانات أداء المحتوى (مؤقت)
function generateContentPerformanceData(localContent: any[]) {
  return localContent.slice(0, 5).map((content) => ({
    id: content.id,
    title: content.title,
    views: Math.floor(Math.random() * 500) + 100,
    completions: Math.floor(Math.random() * 200) + 50,
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
    revenue: Math.floor(Math.random() * 1000) + 200
  }));
}

export default async function LocalDashboardPage() {
  // التحقق من المصادقة والصلاحيات
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // التحقق من أن المستخدم شريك محلي
  if (!['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
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
                  لوحة تحكم الشريك المحلي
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  إدارة العقدة المحلية والمحتوى والمستخدمين
                </p>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* زر إضافة محتوى */}
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إضافة محتوى
                </button>
                
                {/* زر إعدادات العقدة */}
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  إعدادات العقدة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى لوحة التحكم */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <LocalDashboardDataWrapper userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}

// مكون لتحميل البيانات وعرضها
async function LocalDashboardDataWrapper({ userId }: { userId: string }) {
  try {
    const dashboardData = await getLocalNodeData(userId);
    return <LocalDashboardContent {...dashboardData} />;
  } catch (error: unknown) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          خطأ في تحميل بيانات العقدة
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {(error instanceof Error ? error.message : String(error)) || 'حدث خطأ أثناء جلب بيانات العقدة المحلية. يرجى المحاولة مرة أخرى.'}
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
