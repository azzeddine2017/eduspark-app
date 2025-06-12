"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, useEffect } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"

interface ProvidersProps {
  children: ReactNode
}

function DarkModeBackgroundFixer() {
  useEffect(() => {
    function fixBackgrounds() {
      const isDark = document.documentElement.classList.contains('dark');
      if (!isDark) return;

      // إصلاح الخلفيات البيضاء
      const whiteElements = document.querySelectorAll('*');
      whiteElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          style.backgroundColor === 'rgb(255, 255, 255)' ||
          style.backgroundColor === 'white' ||
          style.backgroundColor === '#ffffff' ||
          style.backgroundColor === '#fff'
        ) {
          (el as HTMLElement).style.backgroundColor = 'var(--color-surface)';
        }
      });

      // إصلاح العناصر الأساسية
      document.body.style.backgroundColor = 'var(--color-background)';
      document.documentElement.style.backgroundColor = 'var(--color-background)';
    }

    // تشغيل فوري
    fixBackgrounds();

    // مراقبة التغييرات
    const observer = new MutationObserver(() => {
      setTimeout(fixBackgrounds, 10);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // مراقبة تغيير الثيم
    const themeObserver = new MutationObserver(() => {
      setTimeout(fixBackgrounds, 50);
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // إصلاح دوري
    const interval = setInterval(fixBackgrounds, 2000);

    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <DarkModeBackgroundFixer />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
