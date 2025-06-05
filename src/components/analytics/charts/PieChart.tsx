'use client'

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// واجهة بيانات الدائرة
interface PieData {
  name: string
  value: number
  color?: string
}

// واجهة خصائص المكون
interface PieChartProps {
  data: PieData[]
  height?: number
  showLegend?: boolean
  showLabels?: boolean
  innerRadius?: number
  outerRadius?: number
  colors?: string[]
  formatTooltip?: (value: any, name: string) => [string, string]
}

// ألوان افتراضية
const DEFAULT_COLORS = [
  '#3b82f6', // أزرق
  '#10b981', // أخضر
  '#f59e0b', // أصفر
  '#ef4444', // أحمر
  '#8b5cf6', // بنفسجي
  '#06b6d4', // سماوي
  '#84cc16', // أخضر فاتح
  '#f97316', // برتقالي
  '#ec4899', // وردي
  '#6b7280'  // رمادي
]

/**
 * مكون الرسم البياني الدائري
 */
export default function PieChart({
  data,
  height = 300,
  showLegend = true,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 80,
  colors = DEFAULT_COLORS,
  formatTooltip
}: PieChartProps) {
  
  // تنسيق التلميح الافتراضي
  const defaultTooltipFormatter = (value: any, name: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
    return [`${value.toLocaleString('ar-SA')} (${percentage}%)`, name]
  }

  // تنسيق التسميات
  const renderLabel = (entry: any) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0'
    return `${percentage}%`
  }

  // إضافة الألوان للبيانات
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  }))

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showLabels ? renderLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {dataWithColors.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
          
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
          />
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ 
                direction: 'rtl', 
                paddingTop: '20px',
                fontSize: '14px'
              }}
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
