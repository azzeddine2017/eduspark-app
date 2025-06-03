import Layout from "@/components/Layout"
import AIAssistant from "@/components/AIAssistant"

export default function TestPage() {
  return (
    <Layout title="صفحة اختبار النظام" showBackButton={true} backUrl="/">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text arabic-text mb-4">
            🧪 صفحة اختبار النظام
          </h1>
          <p className="text-lg text-textSecondary arabic-text">
            اختبر جميع مكونات منصة فتح للتعلّم الذكي
          </p>
        </div>

        {/* Theme Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">🎨</span>
            اختبار نظام الألوان والثيمات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-text arabic-text mb-3">
                الألوان الأساسية
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-primary rounded"></div>
                  <span className="text-text">اللون الأساسي</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-secondary rounded"></div>
                  <span className="text-text">اللون الثانوي</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-accent rounded"></div>
                  <span className="text-text">لون التمييز</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text arabic-text mb-3">
                ألوان الحالة
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-success rounded"></div>
                  <span className="text-text">نجاح</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-warning rounded"></div>
                  <span className="text-text">تحذير</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-error rounded"></div>
                  <span className="text-text">خطأ</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-info rounded"></div>
                  <span className="text-text">معلومات</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">🔘</span>
            اختبار الأزرار
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <button className="btn btn-primary w-full">
                زر أساسي
              </button>
              <button className="btn btn-secondary w-full">
                زر ثانوي
              </button>
              <button className="btn btn-primary w-full" disabled>
                زر معطل
              </button>
            </div>
            <div className="space-y-3">
              <button className="btn bg-success text-white w-full hover:opacity-90">
                زر نجاح
              </button>
              <button className="btn bg-warning text-white w-full hover:opacity-90">
                زر تحذير
              </button>
              <button className="btn bg-error text-white w-full hover:opacity-90">
                زر خطأ
              </button>
            </div>
          </div>
        </div>

        {/* Cards Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">🃏</span>
            اختبار البطاقات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-text arabic-text mb-2">
                بطاقة تعليمية
              </h3>
              <p className="text-textSecondary arabic-text text-sm">
                هذه بطاقة تجريبية لاختبار التصميم والألوان
              </p>
            </div>
            <div className="card p-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-text arabic-text mb-2">
                بطاقة نجاح
              </h3>
              <p className="text-textSecondary arabic-text text-sm">
                بطاقة تظهر حالة النجاح مع الألوان المناسبة
              </p>
            </div>
            <div className="card p-4 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-text arabic-text mb-2">
                بطاقة تحذير
              </h3>
              <p className="text-textSecondary arabic-text text-sm">
                بطاقة تظهر حالة التحذير مع الألوان المناسبة
              </p>
            </div>
          </div>
        </div>

        {/* Forms Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">📝</span>
            اختبار النماذج
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text arabic-text mb-2">
                حقل نصي
              </label>
              <input
                type="text"
                className="form-input w-full"
                placeholder="أدخل النص هنا"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text arabic-text mb-2">
                بريد إلكتروني
              </label>
              <input
                type="email"
                className="form-input w-full"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text arabic-text mb-2">
                كلمة مرور
              </label>
              <input
                type="password"
                className="form-input w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text arabic-text mb-2">
                قائمة منسدلة
              </label>
              <select className="form-input w-full">
                <option>اختر خياراً</option>
                <option>الخيار الأول</option>
                <option>الخيار الثاني</option>
                <option>الخيار الثالث</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-text arabic-text mb-2">
              منطقة نص
            </label>
            <textarea
              className="form-input w-full"
              rows={4}
              placeholder="اكتب رسالتك هنا..."
            ></textarea>
          </div>
        </div>

        {/* Notifications Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">🔔</span>
            اختبار الإشعارات
          </h2>
          <div className="space-y-4">
            <div className="notification notification-success">
              <div className="flex items-center">
                <span className="text-green-600 ml-2">✅</span>
                <span className="arabic-text">تم حفظ البيانات بنجاح!</span>
              </div>
            </div>
            <div className="notification notification-warning">
              <div className="flex items-center">
                <span className="text-yellow-600 ml-2">⚠️</span>
                <span className="arabic-text">تحذير: يرجى التحقق من البيانات</span>
              </div>
            </div>
            <div className="notification notification-error">
              <div className="flex items-center">
                <span className="text-red-600 ml-2">❌</span>
                <span className="arabic-text">خطأ: فشل في حفظ البيانات</span>
              </div>
            </div>
            <div className="notification notification-info">
              <div className="flex items-center">
                <span className="text-blue-600 ml-2">ℹ️</span>
                <span className="arabic-text">معلومة: تم تحديث النظام</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">⏳</span>
            اختبار التحميل
          </h2>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="loading-spinner"></div>
            <span className="text-text arabic-text">جاري التحميل...</span>
          </div>
        </div>

        {/* Animation Testing */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-text arabic-text mb-4 flex items-center">
            <span className="ml-2">✨</span>
            اختبار الرسوم المتحركة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="animate-fadeIn p-4 bg-surface rounded-lg text-center">
              <span className="text-2xl block mb-2">📈</span>
              <span className="text-text arabic-text">تأثير الظهور</span>
            </div>
            <div className="animate-slideIn p-4 bg-surface rounded-lg text-center">
              <span className="text-2xl block mb-2">➡️</span>
              <span className="text-text arabic-text">تأثير الانزلاق</span>
            </div>
            <div className="animate-pulse p-4 bg-surface rounded-lg text-center">
              <span className="text-2xl block mb-2">💓</span>
              <span className="text-text arabic-text">تأثير النبض</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold arabic-text mb-4">
            🎉 تهانينا! النظام يعمل بشكل ممتاز
          </h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            جميع المكونات تعمل بشكل صحيح مع نظام الألوان الجديد
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-primary hover:bg-gray-100">
              🏠 العودة للرئيسية
            </button>
            <button className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
              📚 تصفح الدورات
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant context="صفحة اختبار النظام - يمكنك سؤالي عن أي مكون في هذه الصفحة" />
    </Layout>
  )
}
