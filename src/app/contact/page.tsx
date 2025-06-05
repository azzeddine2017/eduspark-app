import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  Users,
  BookOpen,
  HelpCircle,
  Bug,
  Lightbulb,
  Heart
} from "lucide-react"

export const metadata: Metadata = {
  title: "اتصل بنا - منصة فتح للتعلّم الذكي",
  description: "تواصل مع فريق منصة فتح للتعلّم الذكي - نحن هنا لمساعدتك ودعمك في رحلتك التعليمية",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              📞 نحن هنا لمساعدتك
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast sm:text-5xl md:text-6xl arabic-text mb-6">
            تواصل معنا
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto leading-relaxed">
            لديك سؤال أو اقتراح أو تحتاج مساعدة؟ فريقنا مستعد لمساعدتك في أي وقت
            <br />
            <span className="text-primary font-semibold">نحن نقدر تواصلك ونسعى لخدمتك بأفضل ما لدينا</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-2">أرسل لنا رسالة</h2>
              <p className="text-medium-contrast arabic-text">
                املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">طرق التواصل</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center ml-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-1">البريد الإلكتروني</h3>
                    <p className="text-medium-contrast arabic-text mb-2">للاستفسارات العامة والدعم الفني</p>
                    <a href="mailto:support@fateh-platform.com" className="text-primary hover:text-primary-dark transition-colors">
                      support@fateh-platform.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center ml-4 flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-1">المجتمع والدردشة</h3>
                    <p className="text-medium-contrast arabic-text mb-2">انضم لمجتمعنا على تليجرام</p>
                    <a href="https://t.me/fateh_platform" className="text-primary hover:text-primary-dark transition-colors">
                      @fateh_platform
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-success bg-opacity-20 rounded-lg flex items-center justify-center ml-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-high-contrast arabic-text mb-1">أوقات الاستجابة</h3>
                    <p className="text-medium-contrast arabic-text">نسعى للرد خلال 24 ساعة</p>
                    <p className="text-sm text-medium-contrast arabic-text">الدعم متاح 7 أيام في الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Categories */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">أنواع الدعم</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-surface rounded-lg">
                  <HelpCircle className="w-8 h-8 text-info mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-high-contrast arabic-text mb-1">الدعم الفني</h3>
                  <p className="text-xs text-medium-contrast arabic-text">مشاكل تقنية وأخطاء</p>
                </div>

                <div className="text-center p-4 bg-surface rounded-lg">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-high-contrast arabic-text mb-1">المحتوى التعليمي</h3>
                  <p className="text-xs text-medium-contrast arabic-text">أسئلة حول الدورات</p>
                </div>

                <div className="text-center p-4 bg-surface rounded-lg">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-high-contrast arabic-text mb-1">الحساب والملف الشخصي</h3>
                  <p className="text-xs text-medium-contrast arabic-text">إدارة الحساب</p>
                </div>

                <div className="text-center p-4 bg-surface rounded-lg">
                  <Lightbulb className="w-8 h-8 text-warning mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-high-contrast arabic-text mb-1">اقتراحات وأفكار</h3>
                  <p className="text-xs text-medium-contrast arabic-text">تحسينات المنصة</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            الأسئلة الشائعة
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">
                هل المنصة مجانية حقاً؟
              </h3>
              <p className="text-medium-contrast arabic-text">
                نعم، منصة فتح مجانية بالكامل ولا توجد أي رسوم خفية. نحن نؤمن بأن التعليم حق للجميع.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">
                كيف يمكنني المساهمة في المنصة؟
              </h3>
              <p className="text-medium-contrast arabic-text">
                يمكنك المساهمة بطرق مختلفة: إنشاء محتوى تعليمي، تطوير الكود، أو مساعدة المتعلمين الآخرين.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">
                هل أحصل على شهادة عند إتمام الدورة؟
              </h3>
              <p className="text-medium-contrast arabic-text">
                نعم، نوفر شهادات إنجاز رقمية عند إتمام الدورات والمسارات التعليمية بنجاح.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-3">
                كيف يعمل المساعد الذكي؟
              </h3>
              <p className="text-medium-contrast arabic-text">
                المساعد الذكي يستخدم تقنيات الذكاء الاصطناعي لمساعدتك في فهم المواد وحل التمارين باللغة العربية.
              </p>
            </div>
          </div>
        </div>

        {/* Community Links */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold arabic-text mb-4">انضم لمجتمعنا</h2>
            <p className="text-lg opacity-90 arabic-text mb-6 max-w-2xl mx-auto">
              كن جزءاً من مجتمع نشط من المتعلمين والمعلمين المتحمسين للمعرفة والتطوير
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/community"
                className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
              >
                <Users className="w-5 h-5 ml-2" />
                صفحة المجتمع
              </Link>
              <Link
                href="/volunteer"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
              >
                <Heart className="w-5 h-5 ml-2" />
                التطوع معنا
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
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
