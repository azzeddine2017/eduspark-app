import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotificationList from '@/components/notifications/NotificationList'

export const metadata: Metadata = {
  title: 'الإشعارات - منصة فتح',
  description: 'عرض وإدارة جميع الإشعارات الخاصة بك'
}

/**
 * صفحة الإشعارات الرئيسية
 */
export default async function NotificationsPage() {
  // التحقق من المصادقة
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  الإشعارات
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  تابع جميع التحديثات والإشعارات المهمة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="py-8">
        <NotificationList />
      </div>
    </div>
  )
}
