import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotificationSettings from '@/components/notifications/NotificationSettings'

export const metadata: Metadata = {
  title: 'إعدادات الإشعارات - منصة فتح',
  description: 'تخصيص تفضيلات الإشعارات الخاصة بك'
}

/**
 * صفحة إعدادات الإشعارات
 */
export default async function NotificationSettingsPage() {
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
                  إعدادات الإشعارات
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  تخصيص كيفية ووقت تلقي الإشعارات
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="py-8">
        <NotificationSettings />
      </div>
    </div>
  )
}
