import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import VolunteerForm from "@/components/VolunteerForm"
import {
  Heart,
  Users,
  BookOpen,
  Code,
  Palette,
  MessageCircle,
  Award,
  Clock,
  Target,
  Lightbulb,
  ArrowLeft,
  CheckCircle,
  Star,
  Globe,
  Zap
} from "lucide-react"

export const metadata: Metadata = {
  title: "التطوع معنا - منصة فتح للتعلّم الذكي",
  description: "انضم لفريق المتطوعين في منصة فتح وساهم في نشر التعليم المجاني للجميع - فرص تطوع متنوعة في التعليم والتقنية",
}

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              🤝 كن جزءاً من التغيير
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast sm:text-5xl md:text-6xl arabic-text mb-6">
            تطوع معنا
            <span className="text-primary block mt-2">وساهم في نشر التعليم</span>
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto leading-relaxed">
            انضم لفريق من المتطوعين المتحمسين الذين يؤمنون بأن التعليم حق للجميع
            <br />
            <span className="text-primary font-semibold">مساهمتك الصغيرة تصنع فرقاً كبيراً في حياة الآلاف</span>
          </p>
        </div>

        {/* Why Volunteer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            لماذا التطوع مع فتح؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">أثر إيجابي حقيقي</h3>
              <p className="text-medium-contrast arabic-text">
                ساهم في تعليم آلاف الطلاب وتطوير مهاراتهم وتحسين مستقبلهم
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">مجتمع متميز</h3>
              <p className="text-medium-contrast arabic-text">
                انضم لمجتمع من المتطوعين المتحمسين والمتخصصين في مختلف المجالات
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-3">تطوير المهارات</h3>
              <p className="text-medium-contrast arabic-text">
                اكتسب خبرات جديدة وطور مهاراتك في التعليم والتقنية والإدارة
              </p>
            </div>
          </div>
        </div>

        {/* Volunteer Opportunities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            فرص التطوع المتاحة
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">منشئ محتوى تعليمي</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                إنشاء دورات ودروس تعليمية في مختلف المجالات
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                5-10 ساعات أسبوعياً
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مطور برمجيات</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                تطوير وتحسين المنصة وإضافة ميزات جديدة
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                3-8 ساعات أسبوعياً
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-warning bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مصمم UI/UX</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                تصميم واجهات المستخدم وتحسين تجربة الاستخدام
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                4-6 ساعات أسبوعياً
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-info bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مدير مجتمع</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                إدارة المجتمع والتفاعل مع المستخدمين
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                2-5 ساعات أسبوعياً
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-success bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مراجع جودة</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                مراجعة المحتوى التعليمي وضمان جودته
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                3-5 ساعات أسبوعياً
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">مستشار تعليمي</h3>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                تقديم الاستشارات التعليمية والتوجيه للطلاب
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                2-4 ساعات أسبوعياً
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            ما نبحث عنه في المتطوعين
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-4">المهارات الأساسية</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-medium-contrast arabic-text">
                  <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                  الشغف بالتعليم ومساعدة الآخرين
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                  الالتزام والمسؤولية في العمل
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                  مهارات التواصل الجيدة
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                  القدرة على العمل ضمن فريق
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-4">المهارات التقنية (حسب الدور)</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 flex-shrink-0" />
                  خبرة في المجال المطلوب
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 flex-shrink-0" />
                  إجادة اللغة العربية
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 flex-shrink-0" />
                  معرفة أساسية بالتقنيات الحديثة
                </li>
                <li className="flex items-center text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 flex-shrink-0" />
                  الرغبة في التعلم والتطوير
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold arabic-text text-center mb-8">مزايا التطوع معنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-bold arabic-text mb-2">شبكة علاقات واسعة</h3>
              <p className="text-sm opacity-90 arabic-text">تواصل مع خبراء ومتخصصين من جميع أنحاء العالم</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-bold arabic-text mb-2">شهادات تقدير</h3>
              <p className="text-sm opacity-90 arabic-text">احصل على شهادات تقدير وتوصيات مهنية</p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-lg font-bold arabic-text mb-2">تطوير مهني</h3>
              <p className="text-sm opacity-90 arabic-text">فرص للتدريب وتطوير المهارات المهنية</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">انضم لفريق المتطوعين</h2>
            <VolunteerForm />
          </div>

          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4">عملية التقديم</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center ml-3 flex-shrink-0 text-primary font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-high-contrast arabic-text">املأ النموذج</h4>
                    <p className="text-sm text-medium-contrast arabic-text">أكمل نموذج التقديم بمعلوماتك</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center ml-3 flex-shrink-0 text-primary font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-high-contrast arabic-text">مراجعة الطلب</h4>
                    <p className="text-sm text-medium-contrast arabic-text">سنراجع طلبك خلال 3-5 أيام عمل</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center ml-3 flex-shrink-0 text-primary font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-high-contrast arabic-text">مقابلة قصيرة</h4>
                    <p className="text-sm text-medium-contrast arabic-text">مقابلة ودية للتعارف ومناقشة الدور</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-success bg-opacity-20 rounded-full flex items-center justify-center ml-3 flex-shrink-0 text-success font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-high-contrast arabic-text">البدء في التطوع</h4>
                    <p className="text-sm text-medium-contrast arabic-text">انضم للفريق وابدأ رحلة التطوع</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-high-contrast arabic-text mb-4">أسئلة شائعة</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-high-contrast arabic-text text-sm mb-1">
                    هل يمكنني التطوع بدوام جزئي؟
                  </h4>
                  <p className="text-xs text-medium-contrast arabic-text">
                    نعم، معظم أدوار التطوع مرنة ويمكن القيام بها بدوام جزئي
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-high-contrast arabic-text text-sm mb-1">
                    هل أحتاج خبرة سابقة؟
                  </h4>
                  <p className="text-xs text-medium-contrast arabic-text">
                    نرحب بالمتطوعين من جميع المستويات، والأهم هو الشغف والالتزام
                  </p>
                </div>
              </div>
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
