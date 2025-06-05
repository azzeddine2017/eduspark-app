'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// واجهة بيانات الخط
interface LineData {
  name: string
  value: number
  [key: string]: any
}

// واجهة خصائص المكون
interface LineChartProps {
  data: LineData[]
  lines: Array<{
    dataKey: string
    stroke: string
    name: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  xAxisKey?: string
  formatTooltip?: (value: any, name: string) => [string, string]
}

/**
 * مكون الرسم البياني الخطي
 */
export default function LineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  xAxisKey = 'name',
  formatTooltip
}: LineChartProps) {
  
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
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
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
              iconType="line"
            />
          )}
          
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              dot={{ fill: line.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.stroke, strokeWidth: 2 }}
              name={line.name}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
