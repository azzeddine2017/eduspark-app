import type { Metadata } from "next";
import { Cairo, Noto_Sans_Arabic, Tajawal } from 'next/font/google';
import "./globals.css";
import "../styles/dark-mode-fix.css";
import Providers from "@/components/Providers";

// تحميل الخطوط العربية
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "منصة فتح للتعلّم الذكي",
  description: "منصة تعليمية ذكية تفتح لك أبواب المعرفة بتقنيات الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // إصلاح فوري للوضع المظلم
              (function() {
                const isDark = localStorage.getItem('theme') === 'dark' ||
                              (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#0F172A';
                  document.body.style.backgroundColor = '#0F172A';
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // إصلاح الخلفيات البيضاء بعد التحميل
              document.addEventListener('DOMContentLoaded', function() {
                function fixWhiteBackgrounds() {
                  const isDark = document.documentElement.classList.contains('dark');
                  if (!isDark) return;

                  const elements = document.querySelectorAll('*');
                  elements.forEach(function(el) {
                    const style = window.getComputedStyle(el);
                    if (style.backgroundColor === 'rgb(255, 255, 255)' ||
                        style.backgroundColor === 'white' ||
                        style.backgroundColor === '#ffffff' ||
                        style.backgroundColor === '#fff') {
                      el.style.backgroundColor = 'var(--color-surface)';
                    }
                  });
                }

                // تشغيل فوري
                fixWhiteBackgrounds();

                // مراقبة التغييرات
                const observer = new MutationObserver(fixWhiteBackgrounds);
                observer.observe(document.body, { childList: true, subtree: true });

                // إصلاح دوري
                setInterval(fixWhiteBackgrounds, 1000);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
