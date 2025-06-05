import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Video,
  ArrowLeft,
  Search,
  Phone,
  Mail,
  Clock,
  Users,
  Lightbulb,
  Settings,
  Shield,
  Zap,
  FileText,
  Download
} from "lucide-react"

export const metadata: Metadata = {
  title: "المساعدة والدعم - منصة فتح للتعلّم الذكي",
  description: "احصل على المساعدة والدعم الفني لاستخدام منصة فتح للتعلم الذكي",
}

export default function HelpPage() {
  const faqCategories = [
    {
      title: "البدء في المنصة",
      icon: "🚀",
      questions: [
        {
          q: "كيف أنشئ حساب جديد؟",
          a: "يمكنك إنشاء حساب جديد بالنقر على 'إنشاء حساب' في الصفحة الرئيسية وملء البيانات المطلوبة."
        },
        {
          q: "هل المنصة مجانية حقاً؟",
          a: "نعم، منصة فتح مجانية 100% لجميع المستخدمين ولن نطلب أي رسوم مقابل الخدمات التعليمية."
        },
        {
          q: "كيف أبدأ أول دورة تعليمية؟",
          a: "بعد تسجيل الدخول، اذهب إلى قسم 'الدورات' واختر الدورة المناسبة لمستواك وانقر على 'التسجيل'."
        }
      ]
    },
    {
      title: "استخدام المساعد الذكي",
      icon: "🤖",
      questions: [
        {
          q: "ما هو المساعد الذكي؟",
          a: "المساعد الذكي هو نظام ذكي مدعوم بتقنية Gemini AI يساعدك في التعلم والإجابة على أسئلتك."
        },
        {
          q: "كيف أستخدم المساعد الذكي؟",
          a: "يمكنك الوصول للمساعد الذكي من أي درس أو من لوحة التحكم الخاصة بك."
        },
        {
          q: "هل هناك حد لاستخدام المساعد الذكي؟",
          a: "نعم، هناك حد يومي للاستخدام لضمان العدالة بين جميع المستخدمين."
        }
      ]
    },
    {
      title: "المشاكل التقنية",
      icon: "⚙️",
      questions: [
        {
          q: "لا أستطيع تسجيل الدخول",
          a: "تأكد من صحة البريد الإلكتروني وكلمة المرور. إذا نسيت كلمة المرور، استخدم خيار 'نسيت كلمة المرور'."
        },
        {
          q: "الموقع لا يعمل بشكل صحيح",
          a: "جرب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت للمتصفح. إذا استمرت المشكلة، اتصل بنا."
        },
        {
          q: "لا تظهر الدروس بشكل صحيح",
          a: "تأكد من اتصالك بالإنترنت وجرب استخدام متصفح آخر. قد تحتاج لتفعيل JavaScript."
        }
      ]
    }
  ]

  const supportChannels = [
    {
      title: "المنتدى المجتمعي",
      description: "اطرح أسئلتك وشارك مع المجتمع",
      icon: <Users className="w-6 h-6" />,
      link: "/forum",
      available: "24/7"
    },
    {
      title: "الدعم الفني",
      description: "تواصل مع فريق الدعم التقني",
      icon: <MessageCircle className="w-6 h-6" />,
      link: "/contact",
      available: "9 ص - 6 م"
    },
    {
      title: "الأدلة التعليمية",
      description: "أدلة مفصلة لاستخدام المنصة",
      icon: <BookOpen className="w-6 h-6" />,
      link: "/guides",
      available: "متاح دائماً"
    },
    {
      title: "فيديوهات تعليمية",
      description: "شروحات مرئية لاستخدام المنصة",
      icon: <Video className="w-6 h-6" />,
      link: "/tutorials",
      available: "متاح دائماً"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              ❓ المساعدة والدعم
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            كيف يمكننا مساعدتك؟
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-2xl mx-auto">
            نحن هنا لمساعدتك في الحصول على أفضل تجربة تعليمية على منصة فتح
          </p>
        </div>

        {/* Search Help */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن إجابة لسؤالك..."
              className="input pr-12 text-lg py-4"
            />
          </div>
        </div>

        {/* Support Channels */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            طرق الحصول على المساعدة
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Link key={index} href={channel.link} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {channel.icon}
                </div>
                <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">
                  {channel.title}
                </h3>
                <p className="text-medium-contrast arabic-text text-sm mb-3">
                  {channel.description}
                </p>
                <div className="flex items-center justify-center text-xs text-textSecondary">
                  <Clock className="w-3 h-3 ml-1" />
                  {channel.available}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            الأسئلة الشائعة
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="card p-6">
                <div className="flex items-center mb-6">
                  <span className="text-2xl ml-3">{category.icon}</span>
                  <h3 className="text-xl font-bold text-high-contrast arabic-text">
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-3 bg-surface rounded-lg hover:bg-background transition-colors">
                        <span className="font-medium text-high-contrast arabic-text text-sm">
                          {faq.q}
                        </span>
                        <HelpCircle className="w-4 h-4 text-textSecondary group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-3 p-3 text-medium-contrast arabic-text text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            إجراءات سريعة
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/profile/settings" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-medium text-high-contrast arabic-text text-sm">إعدادات الحساب</div>
            </Link>
            
            <Link href="/privacy" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="font-medium text-high-contrast arabic-text text-sm">سياسة الخصوصية</div>
            </Link>
            
            <Link href="/terms" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <FileText className="w-8 h-8 text-info mx-auto mb-2" />
              <div className="font-medium text-high-contrast arabic-text text-sm">شروط الاستخدام</div>
            </Link>
            
            <Link href="/contact" className="card p-4 text-center hover:shadow-lg transition-shadow">
              <Mail className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="font-medium text-high-contrast arabic-text text-sm">اتصل بنا</div>
            </Link>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white mb-12">
          <Zap className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">هل تحتاج مساعدة عاجلة؟</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            فريق الدعم متاح لمساعدتك في حل أي مشكلة تقنية أو تعليمية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              تواصل معنا الآن
            </Link>
            <Link
              href="/forum"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
            >
              <Users className="w-5 h-5 ml-2" />
              اسأل المجتمع
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div className="card p-6 mb-12">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-6 h-6 text-warning ml-3" />
            <h3 className="text-xl font-bold text-high-contrast arabic-text">
              نصائح للحصول على أفضل مساعدة
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-medium-contrast arabic-text">
            <div className="flex items-start">
              <span className="text-primary ml-2">•</span>
              <span>كن محدداً في وصف المشكلة</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary ml-2">•</span>
              <span>اذكر نوع المتصفح والجهاز المستخدم</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary ml-2">•</span>
              <span>أرفق لقطة شاشة إذا أمكن</span>
            </div>
            <div className="flex items-start">
              <span className="text-primary ml-2">•</span>
              <span>ابحث في الأسئلة الشائعة أولاً</span>
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
