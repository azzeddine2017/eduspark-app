import { Suspense } from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PaymentDashboard from '@/components/payment/PaymentDashboard';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

export const metadata: Metadata = {
  title: 'الدفع والاشتراكات - منصة فتح الموزعة',
  description: 'إدارة المدفوعات والاشتراكات بطريقة آمنة ومرنة',
};

export default async function PaymentPage() {
  // التحقق من المصادقة
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  الدفع والاشتراكات 💳
                </h1>
                <p className="text-green-100">
                  اختر الباقة المناسبة لك وادفع بطريقة آمنة
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm font-medium">دفع آمن ومشفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <PaymentDashboard userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}
