/**
 * أدوات مساعدة لإصلاح الوضع المظلم
 * تضمن عدم وجود خلفيات بيضاء في التطبيق
 */

/**
 * إزالة جميع الخلفيات البيضاء من العناصر
 */
export function removeWhiteBackgrounds() {
  if (typeof window === 'undefined') return;

  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (!isDark) return;

    // البحث عن جميع العناصر التي تحتوي على خلفيات بيضاء
    const whiteBackgroundElements = document.querySelectorAll('*');
    
    whiteBackgroundElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      
      // التحقق من الخلفيات البيضاء
      if (
        backgroundColor === 'rgb(255, 255, 255)' ||
        backgroundColor === 'rgba(255, 255, 255, 1)' ||
        backgroundColor === '#ffffff' ||
        backgroundColor === '#fff' ||
        backgroundColor === 'white'
      ) {
        // تحديد نوع الخلفية المناسبة
        const isCard = element.classList.contains('card') || 
                      element.classList.contains('panel') ||
                      element.classList.contains('modal') ||
                      element.classList.contains('dropdown');
        
        const isBackground = element.classList.contains('page') ||
                           element.classList.contains('container') ||
                           element.classList.contains('wrapper') ||
                           element === document.body ||
                           element === document.documentElement;
        
        if (isCard) {
          (element as HTMLElement).style.backgroundColor = 'var(--color-surface)';
        } else if (isBackground) {
          (element as HTMLElement).style.backgroundColor = 'var(--color-background)';
        } else {
          (element as HTMLElement).style.backgroundColor = 'inherit';
        }
      }
    });
  });

  // مراقبة التغييرات في DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });

  // تشغيل فوري
  setTimeout(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      removeWhiteBackgrounds();
    }
  }, 100);
}

/**
 * إصلاح الخلفيات عند تغيير الوضع المظلم
 */
export function fixBackgroundsOnThemeChange() {
  if (typeof window === 'undefined') return;

  // مراقبة تغييرات فئة dark
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          setTimeout(removeWhiteBackgrounds, 50);
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
}

/**
 * إضافة CSS ديناميكي لإصلاح الخلفيات
 */
export function addDynamicDarkModeCSS() {
  if (typeof window === 'undefined') return;

  const styleId = 'dynamic-dark-mode-fix';
  
  // إزالة الـ style السابق إذا كان موجوداً
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* إصلاح ديناميكي للوضع المظلم */
    .dark * {
      background-color: inherit !important;
    }
    
    .dark html,
    .dark body {
      background-color: var(--color-background, #0F172A) !important;
    }
    
    .dark .bg-white,
    .dark .bg-gray-50,
    .dark .bg-gray-100 {
      background-color: var(--color-surface, #1E293B) !important;
    }
    
    .dark [style*="background-color: white"],
    .dark [style*="background-color: #fff"],
    .dark [style*="background-color: #ffffff"],
    .dark [style*="background: white"],
    .dark [style*="background: #fff"],
    .dark [style*="background: #ffffff"] {
      background-color: var(--color-surface, #1E293B) !important;
    }
    
    /* إصلاح العناصر المحددة */
    .dark div:not([class*="bg-gradient"]):not([class*="bg-blue"]):not([class*="bg-green"]):not([class*="bg-red"]):not([class*="bg-yellow"]):not([class*="bg-purple"]) {
      background-color: inherit !important;
    }
    
    .dark .card,
    .dark .panel,
    .dark .modal,
    .dark .dropdown {
      background-color: var(--color-surface, #1E293B) !important;
    }
    
    .dark .container,
    .dark .wrapper,
    .dark .page {
      background-color: var(--color-background, #0F172A) !important;
    }
  `;

  document.head.appendChild(style);
}

/**
 * تهيئة جميع إصلاحات الوضع المظلم
 */
export function initializeDarkModeFixes() {
  if (typeof window === 'undefined') return;

  // إضافة CSS ديناميكي
  addDynamicDarkModeCSS();
  
  // إصلاح الخلفيات عند التحميل
  document.addEventListener('DOMContentLoaded', () => {
    removeWhiteBackgrounds();
    fixBackgroundsOnThemeChange();
  });

  // إصلاح الخلفيات إذا كان DOM محمل بالفعل
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removeWhiteBackgrounds();
      fixBackgroundsOnThemeChange();
    });
  } else {
    removeWhiteBackgrounds();
    fixBackgroundsOnThemeChange();
  }

  // إصلاح دوري للتأكد
  setInterval(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      removeWhiteBackgrounds();
    }
  }, 2000);
}

/**
 * إصلاح فوري للخلفيات البيضاء
 */
export function forceFixWhiteBackgrounds() {
  if (typeof window === 'undefined') return;

  const isDark = document.documentElement.classList.contains('dark');
  if (!isDark) return;

  // إصلاح جميع العناصر
  const allElements = document.querySelectorAll('*');
  allElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlElement);
    
    if (
      computedStyle.backgroundColor === 'rgb(255, 255, 255)' ||
      computedStyle.backgroundColor === 'rgba(255, 255, 255, 1)' ||
      computedStyle.backgroundColor === 'white'
    ) {
      htmlElement.style.backgroundColor = 'var(--color-surface)';
    }
  });

  // إصلاح العناصر الأساسية
  document.body.style.backgroundColor = 'var(--color-background)';
  document.documentElement.style.backgroundColor = 'var(--color-background)';
}

/**
 * مراقب للتأكد من عدم ظهور خلفيات بيضاء
 */
export function startWhiteBackgroundWatcher() {
  if (typeof window === 'undefined') return;

  const observer = new MutationObserver(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      setTimeout(forceFixWhiteBackgrounds, 10);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // تشغيل فوري
  forceFixWhiteBackgrounds();
}
