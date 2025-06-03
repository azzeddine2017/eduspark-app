import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center ml-3">
                <span className="text-white font-bold text-xl">ف</span>
              </div>
              <h3 className="text-xl font-bold text-text arabic-text">
                منصة فتح للتعلّم الذكي
              </h3>
            </div>
            <p className="text-textSecondary arabic-text leading-relaxed mb-4">
              مدرسة المجتمع الذكية - منصة تعليمية مجانية تفتح أبواب المعرفة للجميع
              بتقنيات الذكاء الاصطناعي المتطورة ونظام إداري مفتوح وشفاف.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success bg-opacity-20 text-success">
                🆓 مجاني 100%
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary bg-opacity-20 text-primary">
                🤖 مدعوم بالذكاء الاصطناعي
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-text arabic-text mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  📚 الدورات التعليمية
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  ℹ️ عن المنصة
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  🤝 التطوع
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  👥 المجتمع
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  ❓ المساعدة
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold text-text arabic-text mb-4">
              البرامج التعليمية
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/programs/literacy" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  🔤 محو الأمية
                </Link>
              </li>
              <li>
                <Link href="/programs/life-skills" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  🛠️ مهارات حياتية
                </Link>
              </li>
              <li>
                <Link href="/programs/tech" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  💻 مهارات تقنية
                </Link>
              </li>
              <li>
                <Link href="/programs/crafts" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  🎨 فنون وحرف
                </Link>
              </li>
              <li>
                <Link href="/programs/business" className="text-textSecondary hover:text-primary transition-colors arabic-text">
                  💼 ريادة الأعمال
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Community Impact Stats */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-textSecondary arabic-text">مجاني للجميع</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success mb-1">24/7</div>
              <div className="text-sm text-textSecondary arabic-text">متاح دائماً</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning mb-1">∞</div>
              <div className="text-sm text-textSecondary arabic-text">إمكانيات لا محدودة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-info mb-1">🌍</div>
              <div className="text-sm text-textSecondary arabic-text">للمجتمع العالمي</div>
            </div>
          </div>
        </div>

        {/* Holacracy Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-text arabic-text mb-2">
              🏛️ نظام الهولاكراسي (الإدارة المفتوحة)
            </h4>
            <p className="text-textSecondary arabic-text text-sm max-w-2xl mx-auto">
              منصة فتح تعمل بنظام إداري مفتوح وشفاف يشرك المجتمع في اتخاذ القرارات
              ويضمن توزيع المسؤوليات بعدالة وشفافية كاملة.
            </p>
            <Link 
              href="/admin/holacracy" 
              className="inline-flex items-center mt-2 text-primary hover:text-secondary transition-colors text-sm"
            >
              تعرف على النظام الإداري
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="text-textSecondary text-sm arabic-text">
            © 2024 منصة فتح للتعلّم الذكي. جميع الحقوق محفوظة.
          </div>
          <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
            <Link href="/privacy" className="text-textSecondary hover:text-primary text-sm transition-colors arabic-text">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-textSecondary hover:text-primary text-sm transition-colors arabic-text">
              شروط الاستخدام
            </Link>
            <Link href="/contact" className="text-textSecondary hover:text-primary text-sm transition-colors arabic-text">
              اتصل بنا
            </Link>
          </div>
        </div>

        {/* Open Source Notice */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-textSecondary text-xs arabic-text">
            🌟 منصة مفتوحة المصدر مبنية بـ Next.js و Prisma و Gemini AI
            <br />
            <span className="text-primary">مساهمتك في التطوير مرحب بها دائماً</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
