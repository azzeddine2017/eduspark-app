import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DetailedReports from '@/components/analytics/DetailedReports'

export const metadata: Metadata = {
  title: 'التقارير المفصلة - منصة فتح',
  description: 'تقارير تفصيلية شاملة لجميع جوانب المنصة'
}

/**
 * صفحة التقارير المفصلة للإدارة
 */
export default async function ReportsPage() {
  // التحقق من المصادقة
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // التحقق من صلاحيات الإدارة
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  })

  if (!user || !['ADMIN', 'ANALYTICS_SPECIALIST'].includes(user.role)) {
    redirect('/dashboard')
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
                  📋 التقارير المفصلة
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  تقارير تفصيلية وقابلة للتصدير لجميع جوانب المنصة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="py-8">
        <DetailedReports />
      </div>
    </div>
  )
}
