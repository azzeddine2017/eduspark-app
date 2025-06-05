import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Heart,
  Target,
  Users,
  BookOpen,
  Bot,
  Globe,
  Award,
  Lightbulb,
  Shield,
  Zap,
  ArrowLeft,
  CheckCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "عن المنصة - منصة فتح للتعلّم الذكي",
  description: "تعرف على منصة فتح للتعلّم الذكي - منصة تعليمية مجانية تفتح أبواب المعرفة للجميع بتقنيات الذكاء الاصطناعي المتطورة",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              🌟 مدرسة المجتمع الذكية
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast sm:text-5xl md:text-6xl arabic-text mb-6">
            عن منصة فتح
            <span className="text-primary block mt-2">للتعلّم الذكي</span>
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto leading-relaxed">
            منصة تعليمية مجانية مفتوحة المصدر تهدف إلى فتح أبواب المعرفة للجميع
            <br />
            <span className="text-primary font-semibold">تعليم للجميع - لا أحد يُترك خلف الركب</span>
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card p-8">
            <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-4">رؤيتنا</h2>
            <p className="text-medium-contrast arabic-text leading-relaxed">
              أن نكون المنصة التعليمية الرائدة في العالم العربي التي تجمع بين التعلم التقليدي 
              والذكاء الاصطناعي لتوفير تعليم عالي الجودة ومجاني للجميع، مما يساهم في بناء 
              مجتمع معرفي متقدم ومتمكن.
            </p>
          </div>

          <div className="card p-8">
            <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-4">رسالتنا</h2>
            <p className="text-medium-contrast arabic-text leading-relaxed">
              نسعى لتوفير تعليم ذكي ومجاني للجميع من خلال منصة مفتوحة المصدر تدعم 
              التعلم الذاتي والتفاعلي، وتستخدم أحدث تقنيات الذكاء الاصطناعي لتخصيص 
              التجربة التعليمية لكل متعلم.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            قيمنا الأساسية
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">الوصول المجاني</h3>
              <p className="text-medium-contrast arabic-text">
                التعليم حق للجميع، لذلك نوفر جميع خدماتنا مجاناً بدون أي قيود أو رسوم خفية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">الابتكار التقني</h3>
              <p className="text-medium-contrast arabic-text">
                نستخدم أحدث تقنيات الذكاء الاصطناعي لتوفير تجربة تعليمية مخصصة وتفاعلية
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-info bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-info" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">المجتمع التعاوني</h3>
              <p className="text-medium-contrast arabic-text">
                نؤمن بقوة التعلم الجماعي والمشاركة المعرفية بين أفراد المجتمع
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            ما يميز منصة فتح
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مساعد ذكي متطور</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                مساعد ذكي يدعم اللغة العربية ويساعدك في فهم المواد وحل التمارين
              </p>
            </div>

            <div className="card p-6">
              <BookOpen className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">محتوى تعليمي متنوع</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                دورات ودروس في مختلف المجالات مع تحديث مستمر للمحتوى
              </p>
            </div>

            <div className="card p-6">
              <Shield className="w-8 h-8 text-success mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مفتوح المصدر</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                كود المنصة متاح للجميع للمساهمة والتطوير والتحسين
              </p>
            </div>

            <div className="card p-6">
              <Zap className="w-8 h-8 text-warning mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">تعلم تفاعلي</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                تجربة تعليمية تفاعلية مع اختبارات وتمارين عملية
              </p>
            </div>

            <div className="card p-6">
              <Award className="w-8 h-8 text-info mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">شهادات إنجاز</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                احصل على شهادات إنجاز عند إتمام الدورات والمسارات التعليمية
              </p>
            </div>

            <div className="card p-6">
              <Users className="w-8 h-8 text-accent mb-4" />
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مجتمع نشط</h3>
              <p className="text-medium-contrast arabic-text text-sm">
                انضم لمجتمع من المتعلمين والمعلمين المتحمسين للمعرفة
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold arabic-text text-center mb-8">إنجازاتنا</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm opacity-90 arabic-text">مجاني للجميع</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90 arabic-text">متاح دائماً</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">∞</div>
              <div className="text-sm opacity-90 arabic-text">إمكانيات لا محدودة</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">🌍</div>
              <div className="text-sm opacity-90 arabic-text">للمجتمع العالمي</div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            التقنيات المستخدمة
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-4">الواجهة الأمامية</h3>
              <ul className="space-y-2 text-medium-contrast arabic-text">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  Next.js 15 مع TypeScript
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  Tailwind CSS مع دعم RTL
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  React Hook Form و Zod
                </li>
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-4">الواجهة الخلفية</h3>
              <ul className="space-y-2 text-medium-contrast arabic-text">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  Next.js API Routes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  Prisma ORM مع MySQL
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-success ml-2" />
                  NextAuth.js للمصادقة
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text mb-6">
            ابدأ رحلتك التعليمية اليوم
          </h2>
          <p className="text-lg text-medium-contrast arabic-text mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المتعلمين الذين يطورون مهاراتهم ومعارفهم من خلال منصة فتح
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              <Users className="w-5 h-5 ml-2" />
              انضم إلينا الآن
            </Link>
            <Link
              href="/courses"
              className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 ml-2" />
              تصفح الدورات
            </Link>
          </div>
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
