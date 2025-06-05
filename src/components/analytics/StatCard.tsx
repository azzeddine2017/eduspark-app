'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// واجهة خصائص المكون
interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  description?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  loading?: boolean
  onClick?: () => void
}

/**
 * مكون بطاقة الإحصائيات
 */
export default function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  color = 'blue',
  loading = false,
  onClick
}: StatCardProps) {
  
  // ألوان البطاقة حسب النوع
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      value: 'text-blue-900',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      value: 'text-green-900',
      trend: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      value: 'text-yellow-900',
      trend: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      value: 'text-red-900',
      trend: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      value: 'text-purple-900',
      trend: 'text-purple-600'
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      value: 'text-gray-900',
      trend: 'text-gray-600'
    }
  }

  const colors = colorClasses[color]

  // تنسيق القيمة
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString('ar-SA')
    }
    return val
  }

  // أيقونة الاتجاه
  const getTrendIcon = () => {
    if (!trend) return null
    
    if (trend.value > 0) {
      return <TrendingUp className="h-4 w-4" />
    } else if (trend.value < 0) {
      return <TrendingDown className="h-4 w-4" />
    } else {
      return <Minus className="h-4 w-4" />
    }
  }

  // لون الاتجاه
  const getTrendColor = () => {
    if (!trend) return ''
    
    if (trend.isPositive) {
      return trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-red-600' : 'text-gray-600'
    } else {
      return trend.value > 0 ? 'text-red-600' : trend.value < 0 ? 'text-green-600' : 'text-gray-600'
    }
  }

  return (
    <div 
      className={`
        relative overflow-hidden rounded-lg border p-6 transition-all duration-200
        ${colors.bg} ${colors.border}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      {/* حالة التحميل */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* العنوان */}
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          
          {/* القيمة */}
          <p className={`text-2xl font-bold ${colors.value} mb-2`}>
            {loading ? '---' : formatValue(value)}
          </p>
          
          {/* الوصف */}
          {description && (
            <p className="text-xs text-gray-500">
              {description}
            </p>
          )}
          
          {/* الاتجاه */}
          {trend && !loading && (
            <div className={`flex items-center mt-2 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="mr-1">
                {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span className="text-gray-500 mr-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* الأيقونة */}
        {icon && (
          <div className={`flex-shrink-0 ${colors.icon}`}>
            <div className="h-8 w-8">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
