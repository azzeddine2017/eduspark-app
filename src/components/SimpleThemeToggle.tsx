"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

export default function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-11 h-6 bg-border rounded-full animate-pulse"></div>
    )
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'فاتح'
      case 'dark':
        return 'مظلم'
      default:
        return 'تلقائي'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-surface transition-colors"
      title={`الوضع الحالي: ${getLabel()}`}
    >
      {getIcon()}
      <span className="text-sm text-medium-contrast">{getLabel()}</span>
    </button>
  )
}
