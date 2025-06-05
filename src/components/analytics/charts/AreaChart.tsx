'use client'

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// واجهة بيانات المنطقة
interface AreaData {
  name: string
  value: number
  [key: string]: any
}

// واجهة خصائص المكون
interface AreaChartProps {
  data: AreaData[]
  areas: Array<{
    dataKey: string
    stroke: string
    fill: string
    name: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  xAxisKey?: string
  stacked?: boolean
  formatTooltip?: (value: any, name: string) => [string, string]
}

/**
 * مكون الرسم البياني بالمناطق
 */
export default function AreaChart({
  data,
  areas,
  height = 300,
  showGrid = true,
  showLegend = true,
  xAxisKey = 'name',
  stacked = false,
  formatTooltip
}: AreaChartProps) {
  
  // تنسيق التلميح الافتراضي
  const defaultTooltipFormatter = (value: any, name: string) => {
    return [value.toLocaleString('ar-SA'), name]
  }

  // تنسيق تسميات المحور السيني
  const formatXAxisLabel = (value: string) => {
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
    return value
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            {areas.map((area, index) => (
              <linearGradient 
                key={`gradient-${area.dataKey}`}
                id={`gradient-${area.dataKey}`} 
                x1="0" 
                y1="0" 
                x2="0" 
                y2="1"
              >
                <stop offset="5%" stopColor={area.stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={area.stroke} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
              opacity={0.5}
            />
          )}
          
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatXAxisLabel}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value.toLocaleString('ar-SA')}
          />
          
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
            labelFormatter={(label) => `التاريخ: ${formatXAxisLabel(label)}`}
          />
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ direction: 'rtl', paddingTop: '20px' }}
            />
          )}
          
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              stackId={stacked ? "1" : area.dataKey}
              stroke={area.stroke}
              fill={`url(#gradient-${area.dataKey})`}
              strokeWidth={2}
              name={area.name}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
