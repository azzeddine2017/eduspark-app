import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scale,
  Mail,
  ArrowLeft,
  Info,
  Clock,
  BookOpen,
  UserCheck,
  Globe
} from "lucide-react"

export const metadata: Metadata = {
  title: "شروط الاستخدام - منصة فتح للتعلّم الذكي",
  description: "شروط وأحكام استخدام منصة فتح للتعلّم الذكي - القواعد والمسؤوليات والحقوق والواجبات",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              📋 القواعد والأحكام
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            شروط الاستخدام
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-2xl mx-auto">
            هذه الشروط تحكم استخدامك لمنصة فتح للتعلّم الذكي. يرجى قراءتها بعناية قبل استخدام المنصة.
          </p>
          <div className="mt-6 flex items-center justify-center text-sm text-textSecondary arabic-text">
            <Clock className="w-4 h-4 ml-2" />
            آخر تحديث: 1 يناير 2024
          </div>
        </div>

        {/* Agreement Notice */}
        <div className="notification notification-info mb-12">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-info ml-2 mt-1 flex-shrink-0" />
            <div className="arabic-text">
              <p className="font-semibold mb-1">موافقة على الشروط</p>
              <p className="text-sm">
                باستخدام منصة فتح، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Platform Description */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <BookOpen className="w-6 h-6 text-primary ml-2" />
              وصف المنصة
            </h2>
            
            <div className="space-y-4">
              <p className="text-medium-contrast arabic-text">
                منصة فتح للتعلّم الذكي هي منصة تعليمية مجانية مفتوحة المصدر تهدف إلى توفير تعليم عالي الجودة 
                للجميع باستخدام تقنيات الذكاء الاصطناعي المتطورة.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-surface rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold text-high-contrast arabic-text mb-1">مجانية بالكامل</h3>
                  <p className="text-xs text-medium-contrast arabic-text">لا توجد رسوم خفية</p>
                </div>
                <div className="p-4 bg-surface rounded-lg text-center">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-high-contrast arabic-text mb-1">مفتوحة المصدر</h3>
                  <p className="text-xs text-medium-contrast arabic-text">شفافة وقابلة للتطوير</p>
                </div>
                <div className="p-4 bg-surface rounded-lg text-center">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <h3 className="font-semibold text-high-contrast arabic-text mb-1">مجتمعية</h3>
                  <p className="text-xs text-medium-contrast arabic-text">مبنية من المجتمع للمجتمع</p>
                </div>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <UserCheck className="w-6 h-6 text-secondary ml-2" />
              مسؤوليات المستخدم
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">الاستخدام المسؤول</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    استخدام المنصة للأغراض التعليمية المشروعة فقط
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    احترام حقوق الملكية الفكرية للمحتوى
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    عدم مشاركة معلومات تسجيل الدخول مع الآخرين
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    الإبلاغ عن أي مشاكل أو أخطاء تقنية
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">السلوك المقبول</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    التفاعل بأدب واحترام مع المستخدمين الآخرين
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    مشاركة المعرفة والخبرات بطريقة بناءة
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    تقديم ملاحظات وتقييمات صادقة ومفيدة
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                    احترام خصوصية وحقوق المستخدمين الآخرين
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <XCircle className="w-6 h-6 text-error ml-2" />
              الأنشطة المحظورة
            </h2>
            
            <div className="notification notification-warning mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-warning ml-2 mt-1 flex-shrink-0" />
                <div className="arabic-text">
                  <p className="font-semibold mb-1">تحذير مهم</p>
                  <p className="text-sm">
                    مخالفة هذه القواعد قد تؤدي إلى تعليق أو إنهاء حسابك دون سابق إنذار.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">محتوى محظور</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    المحتوى المسيء أو المهين
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    المحتوى المخالف للقانون
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    انتهاك حقوق الطبع والنشر
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    المحتوى الإعلاني غير المرغوب
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">أنشطة محظورة</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    محاولة اختراق النظام
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    إنشاء حسابات وهمية متعددة
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    التلاعب في النظام أو النتائج
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-4 h-4 text-error ml-2 mt-1 flex-shrink-0" />
                    إساءة استخدام المساعد الذكي
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Shield className="w-6 h-6 text-success ml-2" />
              الملكية الفكرية
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">محتوى المنصة</h3>
                <p className="text-medium-contrast arabic-text mb-4">
                  جميع المحتويات التعليمية والمواد المتاحة على المنصة محمية بحقوق الطبع والنشر. 
                  يمكنك استخدامها للأغراض التعليمية الشخصية فقط.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success bg-opacity-10 rounded-lg">
                    <h4 className="font-semibold text-success arabic-text mb-2">مسموح</h4>
                    <ul className="text-sm text-medium-contrast arabic-text space-y-1">
                      <li>• التعلم الشخصي</li>
                      <li>• المشاركة التعليمية</li>
                      <li>• الاستخدام غير التجاري</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-error bg-opacity-10 rounded-lg">
                    <h4 className="font-semibold text-error arabic-text mb-2">غير مسموح</h4>
                    <ul className="text-sm text-medium-contrast arabic-text space-y-1">
                      <li>• الاستخدام التجاري</li>
                      <li>• إعادة التوزيع</li>
                      <li>• التعديل دون إذن</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">المحتوى المُنشأ من المستخدمين</h3>
                <p className="text-medium-contrast arabic-text">
                  عند رفع أو إنشاء محتوى على المنصة، فإنك تمنحنا ترخيصاً غير حصري لاستخدام هذا المحتوى 
                  لأغراض تشغيل وتحسين المنصة، مع الاحتفاظ بحقوق الملكية الأصلية.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-warning ml-2" />
              إخلاء المسؤولية
            </h2>
            
            <div className="space-y-4">
              <div className="notification notification-warning">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-warning ml-2 mt-1 flex-shrink-0" />
                  <div className="arabic-text">
                    <p className="font-semibold mb-1">الخدمة "كما هي"</p>
                    <p className="text-sm">
                      نوفر المنصة "كما هي" دون أي ضمانات صريحة أو ضمنية. 
                      نبذل قصارى جهدنا لضمان دقة المحتوى ولكن لا نضمن خلوه من الأخطاء.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">حدود المسؤولية</h3>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• لا نتحمل مسؤولية أي أضرار مباشرة أو غير مباشرة</li>
                  <li>• لا نضمن استمرارية الخدمة دون انقطاع</li>
                  <li>• لا نتحمل مسؤولية محتوى الروابط الخارجية</li>
                  <li>• المستخدم مسؤول عن استخدامه للمعلومات المقدمة</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Shield className="w-6 h-6 text-info ml-2" />
              الخصوصية والبيانات
            </h2>
            
            <p className="text-medium-contrast arabic-text mb-4">
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. لمعرفة المزيد حول كيفية جمع واستخدام وحماية بياناتك، 
              يرجى مراجعة سياسة الخصوصية الخاصة بنا.
            </p>
            
            <Link
              href="/privacy"
              className="btn btn-outline flex items-center w-fit"
            >
              <Shield className="w-4 h-4 ml-2" />
              اقرأ سياسة الخصوصية
            </Link>
          </section>

          {/* Termination */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <XCircle className="w-6 h-6 text-error ml-2" />
              إنهاء الخدمة
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">إنهاء من قبل المستخدم</h3>
                <p className="text-medium-contrast arabic-text">
                  يمكنك إنهاء حسابك في أي وقت من خلال إعدادات الحساب أو التواصل معنا. 
                  سيتم حذف بياناتك وفقاً لسياسة الخصوصية.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">إنهاء من قبل المنصة</h3>
                <p className="text-medium-contrast arabic-text mb-3">
                  نحتفظ بالحق في تعليق أو إنهاء حسابك في الحالات التالية:
                </p>
                <ul className="space-y-2 text-medium-contrast arabic-text text-sm">
                  <li>• مخالفة شروط الاستخدام</li>
                  <li>• السلوك المسيء أو المضر</li>
                  <li>• النشاط المشبوه أو غير القانوني</li>
                  <li>• عدم النشاط لفترة طويلة (أكثر من سنتين)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <FileText className="w-6 h-6 text-primary ml-2" />
              تعديل الشروط
            </h2>
            
            <p className="text-medium-contrast arabic-text mb-4">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإشعارك بأي تغييرات مهمة عبر:
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-surface rounded-lg">
                <Mail className="w-5 h-5 text-primary ml-2" />
                <span className="text-sm text-medium-contrast arabic-text">البريد الإلكتروني</span>
              </div>
              <div className="flex items-center p-3 bg-surface rounded-lg">
                <Info className="w-5 h-5 text-info ml-2" />
                <span className="text-sm text-medium-contrast arabic-text">إشعار على المنصة</span>
              </div>
              <div className="flex items-center p-3 bg-surface rounded-lg">
                <Clock className="w-5 h-5 text-warning ml-2" />
                <span className="text-sm text-medium-contrast arabic-text">تحديث التاريخ</span>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Scale className="w-6 h-6 text-secondary ml-2" />
              القانون المطبق
            </h2>
            
            <p className="text-medium-contrast arabic-text">
              تخضع هذه الشروط وتفسر وفقاً للقوانين المعمول بها. أي نزاع ينشأ عن استخدام المنصة 
              سيتم حله بالطرق الودية أولاً، وإذا تعذر ذلك فسيتم اللجوء للقضاء المختص.
            </p>
          </section>

          {/* Contact */}
          <section className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
              <Mail className="w-6 h-6 text-primary ml-2" />
              تواصل معنا
            </h2>
            
            <p className="text-medium-contrast arabic-text mb-4">
              إذا كان لديك أي أسئلة حول شروط الاستخدام، لا تتردد في التواصل معنا:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-primary ml-2" />
                <span className="text-medium-contrast arabic-text">legal@fateh-platform.com</span>
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
