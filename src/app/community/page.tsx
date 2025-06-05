import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Users,
  MessageCircle,
  Heart,
  Star,
  Trophy,
  BookOpen,
  Globe,
  Zap,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Award,
  Target,
  TrendingUp,
  Activity,
  UserPlus,
  Send
} from "lucide-react"

export const metadata: Metadata = {
  title: "المجتمع - منصة فتح للتعلّم الذكي",
  description: "انضم لمجتمع منصة فتح النشط - تواصل مع المتعلمين والمعلمين، شارك في المناقشات، واستفد من الخبرات المتنوعة",
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              👥 مجتمع نشط ومتفاعل
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast sm:text-5xl md:text-6xl arabic-text mb-6">
            مجتمع فتح
            <span className="text-primary block mt-2">للتعلّم والتطوير</span>
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto leading-relaxed">
            انضم لمجتمع نشط من المتعلمين والمعلمين المتحمسين للمعرفة والتطوير
            <br />
            <span className="text-primary font-semibold">تعلم، شارك، وطور مهاراتك مع آلاف المتعلمين</span>
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">5,000+</div>
            <div className="text-sm text-medium-contrast arabic-text">عضو نشط</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">15,000+</div>
            <div className="text-sm text-medium-contrast arabic-text">مناقشة</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">200+</div>
            <div className="text-sm text-medium-contrast arabic-text">دورة تعليمية</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-warning" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">1,000+</div>
            <div className="text-sm text-medium-contrast arabic-text">شهادة إنجاز</div>
          </div>
        </div>

        {/* Community Platforms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            منصات التواصل
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-info bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                  <MessageCircle className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-high-contrast arabic-text">تليجرام</h3>
                  <p className="text-sm text-medium-contrast arabic-text">المجتمع الرئيسي</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                انضم لمجتمعنا الرئيسي على تليجرام للمناقشات اليومية والدعم الفوري
              </p>
              <a
                href="https://t.me/fateh_platform"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <Send className="w-4 h-4 ml-2" />
                انضم الآن
              </a>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-high-contrast arabic-text">منتدى المنصة</h3>
                  <p className="text-sm text-medium-contrast arabic-text">مناقشات متخصصة</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                منتدى داخلي للمناقشات المتخصصة حول الدورات والمواضيع التعليمية
              </p>
              <Link
                href="/forum"
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                زيارة المنتدى
              </Link>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center ml-3">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-high-contrast arabic-text">مجموعات الدراسة</h3>
                  <p className="text-sm text-medium-contrast arabic-text">تعلم جماعي</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                مجموعات دراسة متخصصة لكل دورة ومجال تعليمي
              </p>
              <Link
                href="/study-groups"
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <Users className="w-4 h-4 ml-2" />
                انضم لمجموعة
              </Link>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            قواعد المجتمع
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
                <Heart className="w-6 h-6 text-error ml-2" />
                القيم الأساسية
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 mt-1 flex-shrink-0" />
                  الاحترام المتبادل بين جميع الأعضاء
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 mt-1 flex-shrink-0" />
                  مشاركة المعرفة والخبرات بسخاء
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 mt-1 flex-shrink-0" />
                  التعلم المستمر والتطوير الذاتي
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Star className="w-4 h-4 text-warning ml-2 mt-1 flex-shrink-0" />
                  دعم ومساعدة المتعلمين الجدد
                </li>
              </ul>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-bold text-high-contrast arabic-text mb-6 flex items-center">
                <Target className="w-6 h-6 text-success ml-2" />
                آداب التفاعل
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Trophy className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                  استخدام لغة مهذبة وبناءة
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Trophy className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                  تجنب المحتوى غير المناسب
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Trophy className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                  احترام حقوق الملكية الفكرية
                </li>
                <li className="flex items-start text-medium-contrast arabic-text">
                  <Trophy className="w-4 h-4 text-success ml-2 mt-1 flex-shrink-0" />
                  الإبلاغ عن أي سلوك غير مناسب
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Community Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            فعاليات المجتمع
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-primary ml-2" />
                <h3 className="text-lg font-bold text-high-contrast arabic-text">ورش عمل أسبوعية</h3>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                ورش عمل تفاعلية كل أسبوع في مختلف المجالات التقنية والتعليمية
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Clock className="w-3 h-3 ml-1" />
                كل يوم سبت 8:00 م
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-secondary ml-2" />
                <h3 className="text-lg font-bold text-high-contrast arabic-text">لقاءات شهرية</h3>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                لقاءات شهرية لأعضاء المجتمع لمناقشة التطورات والخطط المستقبلية
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Calendar className="w-3 h-3 ml-1" />
                أول جمعة من كل شهر
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 text-warning ml-2" />
                <h3 className="text-lg font-bold text-high-contrast arabic-text">مسابقات تعليمية</h3>
              </div>
              <p className="text-medium-contrast arabic-text text-sm mb-4">
                مسابقات شهرية في البرمجة والتصميم والمحتوى التعليمي
              </p>
              <div className="flex items-center text-xs text-textSecondary arabic-text">
                <Award className="w-3 h-3 ml-1" />
                جوائز قيمة للفائزين
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            قصص نجاح من المجتمع
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-high-contrast arabic-text">أحمد محمد</h3>
                  <p className="text-sm text-medium-contrast arabic-text">مطور ويب</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm">
                "بدأت رحلتي مع فتح كمبتدئ في البرمجة، والآن أعمل كمطور ويب في شركة تقنية كبيرة. المجتمع ساعدني كثيراً في التعلم والتطوير."
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-high-contrast arabic-text">فاطمة أحمد</h3>
                  <p className="text-sm text-medium-contrast arabic-text">مصممة UI/UX</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm">
                "تعلمت التصميم من الصفر من خلال دورات فتح والتفاعل مع المجتمع. الآن أعمل كمصممة مستقلة وأساعد الآخرين في تعلم التصميم."
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center ml-3">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-high-contrast arabic-text">محمد علي</h3>
                  <p className="text-sm text-medium-contrast arabic-text">مدرس رياضيات</p>
                </div>
              </div>
              <p className="text-medium-contrast arabic-text text-sm">
                "استخدمت منصة فتح لتطوير مهاراتي في التعليم الرقمي. الآن أنشئ محتوى تعليمي يستفيد منه آلاف الطلاب."
              </p>
            </div>
          </div>
        </div>

        {/* Join Community CTA */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-16">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold arabic-text mb-4">انضم لمجتمعنا اليوم</h2>
            <p className="text-lg opacity-90 arabic-text mb-8 max-w-2xl mx-auto">
              كن جزءاً من مجتمع نشط ومتفاعل من المتعلمين والمعلمين المتحمسين للمعرفة والتطوير
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 ml-2" />
                إنشاء حساب جديد
              </Link>
              <a
                href="https://t.me/fateh_platform"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
              >
                <Send className="w-5 h-5 ml-2" />
                انضم لتليجرام
              </a>
            </div>
          </div>
        </div>

        {/* Community Metrics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-high-contrast arabic-text text-center mb-12">
            نشاط المجتمع
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-high-contrast mb-1">+25%</div>
              <div className="text-sm text-medium-contrast arabic-text">نمو شهري</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-high-contrast mb-1">95%</div>
              <div className="text-sm text-medium-contrast arabic-text">معدل النشاط</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-success" />
              </div>
              <div className="text-2xl font-bold text-high-contrast mb-1">4.9/5</div>
              <div className="text-sm text-medium-contrast arabic-text">تقييم المجتمع</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-warning" />
              </div>
              <div className="text-2xl font-bold text-high-contrast mb-1">24/7</div>
              <div className="text-sm text-medium-contrast arabic-text">دعم مستمر</div>
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
