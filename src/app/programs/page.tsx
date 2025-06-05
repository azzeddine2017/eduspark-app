import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  BookOpen,
  Users,
  Clock,
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  Heart,
  Zap,
  Globe
} from "lucide-react"

export const metadata: Metadata = {
  title: "البرامج التعليمية - منصة فتح للتعلّم الذكي",
  description: "اكتشف البرامج التعليمية المتنوعة في منصة فتح للتعلم الذكي",
}

export default function ProgramsPage() {
  const programs = [
    {
      id: "literacy",
      title: "برنامج محو الأمية",
      description: "برنامج شامل لتعليم القراءة والكتابة والحساب الأساسي",
      icon: "🔤",
      color: "from-blue-500 to-blue-600",
      participants: 1250,
      courses: 8,
      duration: "3-6 أشهر",
      level: "مبتدئ",
      features: [
        "تعلم الحروف والأرقام",
        "مهارات القراءة الأساسية",
        "الكتابة والإملاء",
        "الحساب الأساسي"
      ]
    },
    {
      id: "life-skills",
      title: "برنامج المهارات الحياتية",
      description: "تطوير المهارات الأساسية للحياة اليومية والتفاعل الاجتماعي",
      icon: "🛠️",
      color: "from-green-500 to-green-600",
      participants: 890,
      courses: 12,
      duration: "2-4 أشهر",
      level: "جميع المستويات",
      features: [
        "مهارات التواصل",
        "إدارة الوقت والمال",
        "حل المشكلات",
        "التفكير النقدي"
      ]
    },
    {
      id: "tech",
      title: "برنامج المهارات التقنية",
      description: "تعلم التقنيات الحديثة والمهارات الرقمية المطلوبة في سوق العمل",
      icon: "💻",
      color: "from-purple-500 to-purple-600",
      participants: 2100,
      courses: 15,
      duration: "4-8 أشهر",
      level: "مبتدئ إلى متقدم",
      features: [
        "البرمجة وتطوير المواقع",
        "التصميم الرقمي",
        "التسويق الإلكتروني",
        "إدارة البيانات"
      ]
    },
    {
      id: "crafts",
      title: "برنامج الفنون والحرف",
      description: "تعلم الحرف اليدوية والفنون التطبيقية لتطوير مهارات إبداعية ومصدر دخل",
      icon: "🎨",
      color: "from-pink-500 to-pink-600",
      participants: 650,
      courses: 10,
      duration: "2-6 أشهر",
      level: "مبتدئ إلى متوسط",
      features: [
        "الحرف اليدوية التقليدية",
        "الفنون التشكيلية",
        "التصميم والديكور",
        "تسويق المنتجات الحرفية"
      ]
    },
    {
      id: "business",
      title: "برنامج ريادة الأعمال",
      description: "تطوير مهارات إنشاء وإدارة المشاريع الصغيرة والمتوسطة",
      icon: "💼",
      color: "from-orange-500 to-orange-600",
      participants: 420,
      courses: 9,
      duration: "3-5 أشهر",
      level: "متوسط إلى متقدم",
      features: [
        "تطوير خطط الأعمال",
        "إدارة المشاريع",
        "التمويل والاستثمار",
        "التسويق والمبيعات"
      ]
    }
  ]

  const stats = [
    { label: "برنامج تعليمي", value: "5", icon: <BookOpen className="w-6 h-6" /> },
    { label: "مشارك نشط", value: "5,310", icon: <Users className="w-6 h-6" /> },
    { label: "دورة متاحة", value: "54", icon: <Star className="w-6 h-6" /> },
    { label: "معدل الإكمال", value: "87%", icon: <TrendingUp className="w-6 h-6" /> }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              📚 البرامج التعليمية
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            برامج تعليمية شاملة للجميع
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto">
            اكتشف مجموعة متنوعة من البرامج التعليمية المصممة لتلبية احتياجات المجتمع وتطوير المهارات الأساسية والمتقدمة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-high-contrast mb-1">{stat.value}</div>
              <div className="text-sm text-medium-contrast arabic-text">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            البرامج المتاحة
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program) => (
              <div key={program.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl ml-4">{program.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold arabic-text">{program.title}</h3>
                        <p className="opacity-90 arabic-text">{program.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{program.participants.toLocaleString()}</div>
                      <div className="text-xs opacity-90">مشارك</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{program.courses}</div>
                      <div className="text-xs opacity-90">دورة</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{program.duration}</div>
                      <div className="text-xs opacity-90">المدة</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-textSecondary arabic-text">المستوى:</span>
                    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm">
                      {program.level}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-high-contrast arabic-text mb-3">ما ستتعلمه:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-medium-contrast arabic-text">
                          <span className="w-2 h-2 bg-primary rounded-full ml-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/programs/${program.id}`}
                      className="flex-1 btn btn-primary text-center"
                    >
                      استكشف البرنامج
                    </Link>
                    <Link
                      href={`/programs/${program.id}/courses`}
                      className="btn btn-outline"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Our Programs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            لماذا تختار برامجنا التعليمية؟
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">مجاني 100%</h3>
              <p className="text-sm text-medium-contrast arabic-text">
                جميع البرامج مجانية تماماً للجميع
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">مدعوم بالذكاء الاصطناعي</h3>
              <p className="text-sm text-medium-contrast arabic-text">
                مساعد ذكي يرافقك في رحلة التعلم
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">مصمم للمجتمع</h3>
              <p className="text-sm text-medium-contrast arabic-text">
                برامج تلبي احتياجات المجتمع الفعلية
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-info bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-bold text-high-contrast arabic-text mb-2">متاح في أي وقت</h3>
              <p className="text-sm text-medium-contrast arabic-text">
                تعلم في الوقت الذي يناسبك
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white">
          <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">ابدأ رحلة التعلم اليوم</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            انضم لآلاف المتعلمين واكتسب مهارات جديدة تفتح لك آفاق المستقبل
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
            >
              <Users className="w-5 h-5 ml-2" />
              انضم الآن مجاناً
            </Link>
            <Link
              href="/courses"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 ml-2" />
              استكشف الدورات
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
