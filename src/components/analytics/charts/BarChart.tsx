'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// واجهة بيانات الأعمدة
interface BarData {
  name: string
  value: number
  [key: string]: any
}

// واجهة خصائص المكون
interface BarChartProps {
  data: BarData[]
  bars: Array<{
    dataKey: string
    fill: string
    name: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  xAxisKey?: string
  orientation?: 'vertical' | 'horizontal'
  formatTooltip?: (value: any, name: string) => [string, string]
}

/**
 * مكون الرسم البياني بالأعمدة
 */
export default function BarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  xAxisKey = 'name',
  orientation = 'vertical',
  formatTooltip
}: BarChartProps) {
  
  // تنسيق التلميح الافتراضي
  const defaultTooltipFormatter = (value: any, name: string) => {
    return [value.toLocaleString('ar-SA'), name]
  }

  // تنسيق تسميات المحور
  const formatAxisLabel = (value: string) => {
    // إذا كان التاريخ، قم بتنسيقه
    if (value.includes('-')) {
      try {
        const date = new Date(value)
        return date.toLocaleDateString('ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        })
      } catch {
        return value
      }
    }
    
    // تقصير النصوص الطويلة
    if (value.length > 15) {
      return value.substring(0, 12) + '...'
    }
    
    return value
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              opacity={0.5}
            />
          )}
          
          {orientation === 'vertical' ? (
            <>
              <XAxis 
                dataKey={xAxisKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatAxisLabel}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => value.toLocaleString('ar-SA')}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                tickFormatter={(value) => value.toLocaleString('ar-SA')}
              />
              
              <YAxis 
                type="category"
                dataKey={xAxisKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatAxisLabel}
                axisLine={{ stroke: '#d1d5db' }}
                tickLine={{ stroke: '#d1d5db' }}
                width={100}
              />
            </>
          )}
          
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              direction: 'rtl'
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            formatter={formatTooltip || defaultTooltipFormatter}
            labelFormatter={(label) => `الفئة: ${label}`}
          />
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }}
            />
          )}
          
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
