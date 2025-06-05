import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  Mail,
  ArrowLeft,
  CheckCircle,
  Info,
  Clock,
  Globe
} from "lucide-react"

export const metadata: Metadata = {
  title: "سياسة الخصوصية - منصة فتح للتعلّم الذكي",
  description: "سياسة الخصوصية لمنصة فتح للتعلّم الذكي - كيف نجمع ونستخدم ونحمي بياناتك الشخصية",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              🔒 حماية خصوصيتك أولويتنا
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-2xl mx-auto">
            نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك.
          </p>
          <div className="mt-6 flex items-center justify-center text-sm text-textSecondary arabic-text">
            <Clock className="w-4 h-4 ml-2" />
            آخر تحديث: 1 يناير 2024
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
            <Info className="w-6 h-6 text-primary ml-2" />
            نظرة سريعة
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">شفافية كاملة</h3>
              <p className="text-sm text-medium-contrast arabic-text">نوضح بوضوح ما نجمعه وكيف نستخدمه</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">حماية قوية</h3>
              <p className="text-sm text-medium-contrast arabic-text">نستخدم أحدث تقنيات الحماية</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">تحكم كامل</h3>
              <p className="text-sm text-medium-contrast arabic-text">لك الحق في إدارة بياناتك</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Data Collection */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Database className="w-6 h-6 text-primary ml-2" />
              البيانات التي نجمعها
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">المعلومات الشخصية</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    الاسم الكامل والبريد الإلكتروني
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    معلومات الملف الشخصي (الصورة، النبذة، الموقع)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    تفضيلات التعلم والاهتمامات
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">بيانات الاستخدام</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    تقدمك في الدورات والدروس
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    تفاعلاتك مع المساعد الذكي
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    أوقات الدخول ونشاطك على المنصة
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">البيانات التقنية</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    عنوان IP ونوع المتصفح
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    نوع الجهاز ونظام التشغيل
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    ملفات تعريف الارتباط (Cookies)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Eye className="w-6 h-6 text-secondary ml-2" />
              كيف نستخدم بياناتك
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">تحسين الخدمة</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• تخصيص تجربة التعلم</li>
                  <li>• تحسين المساعد الذكي</li>
                  <li>• تطوير محتوى جديد</li>
                  <li>• إصلاح الأخطاء والمشاكل</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">التواصل معك</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• إرسال تحديثات الدورات</li>
                  <li>• إشعارات التقدم والإنجازات</li>
                  <li>• الرد على استفساراتك</li>
                  <li>• إشعارات أمنية مهمة</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Shield className="w-6 h-6 text-success ml-2" />
              حماية البيانات
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">التدابير الأمنية</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <Lock className="w-5 h-5 text-primary ml-2" />
                    <span className="text-sm text-medium-contrast arabic-text">تشفير SSL/TLS</span>
                  </div>
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <Shield className="w-5 h-5 text-success ml-2" />
                    <span className="text-sm text-medium-contrast arabic-text">تشفير كلمات المرور</span>
                  </div>
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <Database className="w-5 h-5 text-info ml-2" />
                    <span className="text-sm text-medium-contrast arabic-text">نسخ احتياطية آمنة</span>
                  </div>
                  <div className="flex items-center p-3 bg-surface rounded-lg">
                    <UserCheck className="w-5 h-5 text-warning ml-2" />
                    <span className="text-sm text-medium-contrast arabic-text">مراقبة الوصول</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">سياسة الاحتفاظ</h3>
                <p className="text-medium-contrast arabic-text">
                  نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات. 
                  يمكنك طلب حذف بياناتك في أي وقت من خلال إعدادات الحساب أو التواصل معنا.
                </p>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <UserCheck className="w-6 h-6 text-warning ml-2" />
              حقوقك
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">حقوق الوصول والتحكم</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• الوصول لبياناتك الشخصية</li>
                  <li>• تصحيح المعلومات الخاطئة</li>
                  <li>• حذف حسابك وبياناتك</li>
                  <li>• تصدير بياناتك</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">حقوق الخصوصية</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• إيقاف الإشعارات</li>
                  <li>• تحديد مستوى الخصوصية</li>
                  <li>• الاعتراض على المعالجة</li>
                  <li>• تقديم شكوى</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third Parties */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Globe className="w-6 h-6 text-info ml-2" />
              الأطراف الثالثة
            </h2>
            
            <div className="space-y-4">
              <div className="notification notification-info">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-info ml-2 mt-1 flex-shrink-0" />
                  <div className="arabic-text">
                    <p className="font-semibold mb-1">لا نبيع بياناتك</p>
                    <p className="text-sm">نحن لا نبيع أو نؤجر أو نتاجر ببياناتك الشخصية لأي طرف ثالث.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">الخدمات المتكاملة</h3>
                <p className="text-medium-contrast arabic-text mb-3">
                  نستخدم بعض الخدمات الخارجية لتحسين تجربتك:
                </p>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• Google Analytics (لتحليل الاستخدام)</li>
                  <li>• Google Gemini AI (للمساعد الذكي)</li>
                  <li>• خدمات التخزين السحابي الآمنة</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">
              ملفات تعريف الارتباط (Cookies)
            </h2>
            
            <div className="space-y-4">
              <p className="text-medium-contrast arabic-text">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك التحكم في هذه الملفات من خلال إعدادات المتصفح.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-surface rounded-lg">
                  <h4 className="font-semibold text-high-contrast arabic-text mb-2">ضرورية</h4>
                  <p className="text-xs text-medium-contrast arabic-text">مطلوبة لعمل الموقع</p>
                </div>
                <div className="p-4 bg-surface rounded-lg">
                  <h4 className="font-semibold text-high-contrast arabic-text mb-2">وظيفية</h4>
                  <p className="text-xs text-medium-contrast arabic-text">تحسن تجربة الاستخدام</p>
                </div>
                <div className="p-4 bg-surface rounded-lg">
                  <h4 className="font-semibold text-high-contrast arabic-text mb-2">تحليلية</h4>
                  <p className="text-xs text-medium-contrast arabic-text">تساعد في فهم الاستخدام</p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-warning ml-2" />
              تحديثات السياسة
            </h2>
            
            <p className="text-medium-contrast arabic-text mb-4">
              قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات مهمة عبر:
            </p>
            
            <ul className="space-y-2 text-medium-contrast arabic-text">
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-primary ml-2" />
                إشعار عبر البريد الإلكتروني
              </li>
              <li className="flex items-center">
                <Info className="w-4 h-4 text-info ml-2" />
                إشعار على المنصة
              </li>
              <li className="flex items-center">
                <Globe className="w-4 h-4 text-secondary ml-2" />
                تحديث تاريخ آخر تعديل
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Mail className="w-6 h-6 text-primary ml-2" />
              تواصل معنا
            </h2>
            
            <p className="text-medium-contrast arabic-text mb-4">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية أو كيفية التعامل مع بياناتك، لا تتردد في التواصل معنا:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-primary ml-2" />
                <span className="text-medium-contrast arabic-text">privacy@fateh-platform.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-secondary ml-2" />
                <Link href="/contact" className="text-primary hover:text-primary-dark transition-colors arabic-text">
                  صفحة اتصل بنا
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors arabic-text"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
