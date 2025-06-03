"use client"

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getAvailableThemes, ThemeMode } from '@/lib/theme'

export default function ThemeToggle() {
  const { themeName, mode, isDark, setThemeName, setMode, toggleMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const availableThemes = getAvailableThemes()

  const modes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'نهاري', icon: '☀️' },
    { value: 'dark', label: 'ليلي', icon: '🌙' },
    { value: 'auto', label: 'تلقائي', icon: '🔄' }
  ]

  return (
    <div className="relative">
      {/* زر التبديل السريع */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-surface border border-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={isDark ? 'تبديل للوضع النهاري' : 'تبديل للوضع الليلي'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* زر الإعدادات المتقدمة */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mr-2 p-2 rounded-lg bg-surface border border-border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="إعدادات الألوان"
      >
        🎨
      </button>

      {/* قائمة الإعدادات */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            {/* اختيار الوضع */}
            <div>
              <h3 className="text-sm font-medium text-text mb-2">وضع العرض</h3>
              <div className="grid grid-cols-3 gap-2">
                {modes.map((modeOption) => (
                  <button
                    key={modeOption.value}
                    onClick={() => setMode(modeOption.value)}
                    className={`p-2 rounded-lg border text-sm transition-colors ${
                      mode === modeOption.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-lg mb-1">{modeOption.icon}</div>
                    <div>{modeOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* اختيار اللون */}
            <div>
              <h3 className="text-sm font-medium text-text mb-2">لون المنصة</h3>
              <div className="grid grid-cols-5 gap-2">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setThemeName(theme.name)}
                    className={`relative p-3 rounded-lg border transition-all ${
                      themeName === theme.name
                        ? 'border-2 border-gray-800 dark:border-gray-200'
                        : 'border-border hover:border-gray-400'
                    }`}
                    title={theme.displayName}
                  >
                    <div
                      className="w-full h-6 rounded"
                      style={{ backgroundColor: theme.preview }}
                    />
                    {themeName === theme.name && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-textSecondary text-center">
                {availableThemes.find(t => t.name === themeName)?.displayName}
              </div>
            </div>

            {/* معاينة الألوان */}
            <div>
              <h3 className="text-sm font-medium text-text mb-2">معاينة الألوان</h3>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="w-full h-8 rounded mb-1 bg-primary"></div>
                  <span className="text-textSecondary">أساسي</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-8 rounded mb-1 bg-secondary"></div>
                  <span className="text-textSecondary">ثانوي</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-8 rounded mb-1 bg-success"></div>
                  <span className="text-textSecondary">نجاح</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-8 rounded mb-1 bg-warning"></div>
                  <span className="text-textSecondary">تحذير</span>
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-between pt-2 border-t border-border">
              <button
                onClick={() => {
                  setThemeName('blue')
                  setMode('auto')
                }}
                className="text-sm text-textSecondary hover:text-text transition-colors"
              >
                إعادة تعيين
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-opacity-90 transition-colors"
              >
                تم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* خلفية لإغلاق القائمة */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
