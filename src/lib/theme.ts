// نظام إدارة الألوان والثيمات
export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ColorTheme {
  name: string
  displayName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
}

// الثيمات المتاحة
export const themes: Record<string, ColorTheme> = {
  // الثيم الأزرق الافتراضي
  blue: {
    name: 'blue',
    displayName: 'الأزرق الكلاسيكي',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    }
  },

  // ثيم أخضر طبيعي
  green: {
    name: 'green',
    displayName: 'الأخضر الطبيعي',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#D1FAE5',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    }
  },

  // ثيم بنفسجي أنيق
  purple: {
    name: 'purple',
    displayName: 'البنفسجي الأنيق',
    colors: {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      background: '#FFFFFF',
      surface: '#FAF5FF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E9D5FF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    }
  },

  // ثيم برتقالي دافئ
  orange: {
    name: 'orange',
    displayName: 'البرتقالي الدافئ',
    colors: {
      primary: '#EA580C',
      secondary: '#F97316',
      accent: '#FB923C',
      background: '#FFFFFF',
      surface: '#FFF7ED',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#FED7AA',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    }
  },

  // ثيم وردي ناعم
  pink: {
    name: 'pink',
    displayName: 'الوردي الناعم',
    colors: {
      primary: '#DB2777',
      secondary: '#EC4899',
      accent: '#F472B6',
      background: '#FFFFFF',
      surface: '#FDF2F8',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#FBCFE8',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4'
    }
  }
}

// الثيمات المظلمة
export const darkThemes: Record<string, ColorTheme> = {
  // الثيم الأزرق المظلم
  blueDark: {
    name: 'blueDark',
    displayName: 'الأزرق المظلم',
    colors: {
      primary: '#60A5FA',
      secondary: '#818CF8',
      accent: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    }
  },

  // الثيم الأخضر المظلم
  greenDark: {
    name: 'greenDark',
    displayName: 'الأخضر المظلم',
    colors: {
      primary: '#34D399',
      secondary: '#6EE7B7',
      accent: '#A7F3D0',
      background: '#064E3B',
      surface: '#065F46',
      text: '#ECFDF5',
      textSecondary: '#A7F3D0',
      border: '#047857',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    }
  },

  // الثيم البنفسجي المظلم
  purpleDark: {
    name: 'purpleDark',
    displayName: 'البنفسجي المظلم',
    colors: {
      primary: '#A78BFA',
      secondary: '#C4B5FD',
      accent: '#DDD6FE',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#F3F4F6',
      textSecondary: '#C4B5FD',
      border: '#4C1D95',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    }
  },

  // الثيم البرتقالي المظلم
  orangeDark: {
    name: 'orangeDark',
    displayName: 'البرتقالي المظلم',
    colors: {
      primary: '#FB923C',
      secondary: '#FDBA74',
      accent: '#FED7AA',
      background: '#431407',
      surface: '#7C2D12',
      text: '#FFF7ED',
      textSecondary: '#FDBA74',
      border: '#9A3412',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    }
  },

  // الثيم الوردي المظلم
  pinkDark: {
    name: 'pinkDark',
    displayName: 'الوردي المظلم',
    colors: {
      primary: '#F472B6',
      secondary: '#F9A8D4',
      accent: '#FBCFE8',
      background: '#500724',
      surface: '#831843',
      text: '#FDF2F8',
      textSecondary: '#F9A8D4',
      border: '#BE185D',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#22D3EE'
    }
  }
}

// دالة للحصول على الثيم الحالي
export function getCurrentTheme(themeName: string, isDark: boolean): ColorTheme {
  if (isDark) {
    return darkThemes[`${themeName}Dark`] || darkThemes.blueDark
  }
  return themes[themeName] || themes.blue
}

// دالة لتطبيق الثيم على CSS Variables
export function applyTheme(theme: ColorTheme) {
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
}

// دالة للحصول على قائمة الثيمات المتاحة
export function getAvailableThemes() {
  return Object.values(themes).map(theme => ({
    name: theme.name,
    displayName: theme.displayName,
    preview: theme.colors.primary
  }))
}

// دالة لحفظ تفضيلات المستخدم
export function saveThemePreferences(themeName: string, mode: ThemeMode) {
  localStorage.setItem('theme-name', themeName)
  localStorage.setItem('theme-mode', mode)
}

// دالة لتحميل تفضيلات المستخدم
export function loadThemePreferences(): { themeName: string; mode: ThemeMode } {
  const themeName = localStorage.getItem('theme-name') || 'blue'
  const mode = (localStorage.getItem('theme-mode') as ThemeMode) || 'auto'
  
  return { themeName, mode }
}

// دالة لتحديد ما إذا كان الوضع المظلم مفعل
export function isDarkMode(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  
  // auto mode - check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}
