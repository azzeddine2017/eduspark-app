"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Calendar, Clock, Target } from "lucide-react"

interface ProgressData {
  date: string
  lessonsCompleted: number
  timeSpent: number
}

interface ProgressChartProps {
  userId: string
}

export default function ProgressChart({ userId }: ProgressChartProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    fetchProgressData()
  }, [userId, timeRange])

  const fetchProgressData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/progress?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setProgressData(data)
      }
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxLessons = Math.max(...progressData.map(d => d.lessonsCompleted), 1)
  const maxTime = Math.max(...progressData.map(d => d.timeSpent), 1)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === 'week') {
      return date.toLocaleDateString('ar-SA', { weekday: 'short' })
    } else if (timeRange === 'month') {
      return date.toLocaleDateString('ar-SA', { day: 'numeric' })
    } else {
      return date.toLocaleDateString('ar-SA', { month: 'short' })
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} دقيقة`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}س ${remainingMinutes}د`
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-surface rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-surface rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-high-contrast arabic-text flex items-center">
          <TrendingUp className="w-5 h-5 ml-2" />
          تقدم التعلم
        </h3>
        
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeRange === 'week' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-medium-contrast hover:bg-border'
            }`}
          >
            أسبوع
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeRange === 'month' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-medium-contrast hover:bg-border'
            }`}
          >
            شهر
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              timeRange === 'year' 
                ? 'bg-primary text-white' 
                : 'bg-surface text-medium-contrast hover:bg-border'
            }`}
          >
            سنة
          </button>
        </div>
      </div>

      {progressData.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-medium-contrast mx-auto mb-4" />
          <p className="text-medium-contrast arabic-text">لا توجد بيانات للفترة المحددة</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lessons Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-high-contrast arabic-text">الدروس المكتملة</span>
              <span className="text-sm text-medium-contrast">
                {progressData.reduce((sum, d) => sum + d.lessonsCompleted, 0)} درس
              </span>
            </div>
            
            <div className="relative h-20 bg-surface rounded-lg p-2">
              <div className="flex items-end justify-between h-full">
                {progressData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="relative w-full max-w-6 mx-1">
                      <div
                        className="bg-primary rounded-t transition-all duration-300 hover:bg-opacity-80"
                        style={{
                          height: `${(data.lessonsCompleted / maxLessons) * 100}%`,
                          minHeight: data.lessonsCompleted > 0 ? '4px' : '0'
                        }}
                        title={`${data.lessonsCompleted} درس في ${formatDate(data.date)}`}
                      ></div>
                    </div>
                    <span className="text-xs text-medium-contrast mt-1">
                      {formatDate(data.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-high-contrast arabic-text">وقت التعلم</span>
              <span className="text-sm text-medium-contrast">
                {formatTime(progressData.reduce((sum, d) => sum + d.timeSpent, 0))}
              </span>
            </div>
            
            <div className="relative h-20 bg-surface rounded-lg p-2">
              <div className="flex items-end justify-between h-full">
                {progressData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="relative w-full max-w-6 mx-1">
                      <div
                        className="bg-success rounded-t transition-all duration-300 hover:bg-opacity-80"
                        style={{
                          height: `${(data.timeSpent / maxTime) * 100}%`,
                          minHeight: data.timeSpent > 0 ? '4px' : '0'
                        }}
                        title={`${formatTime(data.timeSpent)} في ${formatDate(data.date)}`}
                      ></div>
                    </div>
                    <span className="text-xs text-medium-contrast mt-1">
                      {formatDate(data.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-primary ml-1" />
                <span className="text-sm text-medium-contrast arabic-text">متوسط يومي</span>
              </div>
              <p className="text-lg font-bold text-high-contrast">
                {Math.round(progressData.reduce((sum, d) => sum + d.lessonsCompleted, 0) / progressData.length || 0)} درس
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-4 h-4 text-success ml-1" />
                <span className="text-sm text-medium-contrast arabic-text">متوسط الوقت</span>
              </div>
              <p className="text-lg font-bold text-high-contrast">
                {formatTime(Math.round(progressData.reduce((sum, d) => sum + d.timeSpent, 0) / progressData.length || 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
