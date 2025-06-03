"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  ThemeMode, 
  ColorTheme, 
  getCurrentTheme, 
  applyTheme, 
  saveThemePreferences, 
  loadThemePreferences, 
  isDarkMode 
} from '@/lib/theme'

interface ThemeContextType {
  themeName: string
  mode: ThemeMode
  currentTheme: ColorTheme
  isDark: boolean
  setThemeName: (name: string) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState('blue')
  const [mode, setModeState] = useState<ThemeMode>('auto')
  const [isDark, setIsDark] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => 
    getCurrentTheme('blue', false)
  )

  // تحميل التفضيلات عند بدء التطبيق
  useEffect(() => {
    const preferences = loadThemePreferences()
    setThemeNameState(preferences.themeName)
    setModeState(preferences.mode)
  }, [])

  // تحديث الوضع المظلم عند تغيير الوضع
  useEffect(() => {
    const dark = isDarkMode(mode)
    setIsDark(dark)
    
    // إضافة/إزالة class للوضع المظلم
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  // تحديث الثيم عند تغيير الاسم أو الوضع
  useEffect(() => {
    const theme = getCurrentTheme(themeName, isDark)
    setCurrentTheme(theme)
    applyTheme(theme)
  }, [themeName, isDark])

  // مراقبة تغيير تفضيلات النظام
  useEffect(() => {
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = () => {
        const dark = mediaQuery.matches
        setIsDark(dark)
        
        if (dark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode])

  const setThemeName = (name: string) => {
    setThemeNameState(name)
    saveThemePreferences(name, mode)
  }

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    saveThemePreferences(themeName, newMode)
  }

  const toggleMode = () => {
    const newMode = isDark ? 'light' : 'dark'
    setMode(newMode)
  }

  const value: ThemeContextType = {
    themeName,
    mode,
    currentTheme,
    isDark,
    setThemeName,
    setMode,
    toggleMode
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
