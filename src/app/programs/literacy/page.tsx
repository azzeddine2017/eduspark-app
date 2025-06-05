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
  Play,
  Download,
  CheckCircle,
  Target,
  Award,
  Lightbulb,
  Heart
} from "lucide-react"

export const metadata: Metadata = {
  title: "برنامج محو الأمية - منصة فتح للتعلّم الذكي",
  description: "برنامج شامل لتعليم القراءة والكتابة والحساب الأساسي مجاناً للجميع",
}

export default function LiteracyProgramPage() {
  const courses = [
    {
      id: 1,
      title: "تعلم الحروف العربية",
      description: "تعلم شكل ونطق الحروف العربية الـ28",
      duration: "2 أسابيع",
      lessons: 14,
      level: "مبتدئ",
      progress: 0,
      isAvailable: true
    },
    {
      id: 2,
      title: "تكوين الكلمات",
      description: "تعلم كيفية ربط الحروف لتكوين كلمات",
      duration: "3 أسابيع",
      lessons: 18,
      level: "مبتدئ",
      progress: 0,
      isAvailable: true
    },
    {
      id: 3,
      title: "القراءة الأساسية",
      description: "قراءة الجمل البسيطة والنصوص القصيرة",
      duration: "4 أسابيع",
      lessons: 24,
      level: "مبتدئ",
      progress: 0,
      isAvailable: true
    },
    {
      id: 4,
      title: "الكتابة والإملاء",
      description: "تعلم كتابة الحروف والكلمات بشكل صحيح",
      duration: "3 أسابيع",
      lessons: 20,
      level: "مبتدئ",
      progress: 0,
      isAvailable: true
    },
    {
      id: 5,
      title: "الأرقام والحساب",
      description: "تعلم الأرقام والعمليات الحسابية الأساسية",
      duration: "2 أسابيع",
      lessons: 16,
      level: "مبتدئ",
      progress: 0,
      isAvailable: true
    }
  ]

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "مجاني 100%",
      description: "لا توجد أي رسوم أو تكاليف خفية"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "مجتمع داعم",
      description: "انضم لمجتمع من المتعلمين والمعلمين"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "مساعد ذكي",
      description: "مساعد ذكي يرافقك في رحلة التعلم"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "شهادة إتمام",
      description: "احصل على شهادة معتمدة عند إكمال البرنامج"
    }
  ]

  const testimonials = [
    {
      name: "أم محمد",
      age: 45,
      text: "تعلمت القراءة والكتابة بعد سن الأربعين. الآن أستطيع قراءة القرآن ومساعدة أطفالي في دروسهم.",
      rating: 5
    },
    {
      name: "أحمد علي",
      age: 35,
      text: "البرنامج ساعدني في تحسين مهاراتي في الحساب. الآن أستطيع إدارة محلي التجاري بشكل أفضل.",
      rating: 5
    },
    {
      name: "فاطمة حسن",
      age: 28,
      text: "المساعد الذكي كان صبوراً معي وساعدني في فهم الدروس خطوة بخطوة.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  🔤 برنامج محو الأمية
                </span>
              </div>
              <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
                تعلم القراءة والكتابة مجاناً
              </h1>
              <p className="text-lg text-medium-contrast arabic-text mb-6">
                برنامج شامل ومجاني لتعليم القراءة والكتابة والحساب الأساسي. مصمم خصيصاً للكبار الذين لم تتح لهم الفرصة للتعلم في الصغر.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary ml-2" />
                  <span className="text-medium-contrast arabic-text">1,250+ متعلم</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary ml-2" />
                  <span className="text-medium-contrast arabic-text">3-6 أشهر</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-primary ml-2" />
                  <span className="text-medium-contrast arabic-text">8 دورات</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-primary ml-2" />
                  <span className="text-medium-contrast arabic-text">تقييم 4.9/5</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register" className="btn btn-primary flex items-center justify-center">
                  <Play className="w-5 h-5 ml-2" />
                  ابدأ التعلم الآن
                </Link>
                <Link href="#courses" className="btn btn-outline flex items-center justify-center">
                  <BookOpen className="w-5 h-5 ml-2" />
                  استكشف الدورات
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold arabic-text mb-2">رحلة التعلم</h3>
                  <p className="opacity-90 arabic-text">من الحرف الأول إلى القراءة الطلقة</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-3" />
                    <span className="arabic-text">تعلم الحروف والأصوات</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-3" />
                    <span className="arabic-text">تكوين الكلمات والجمل</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-3" />
                    <span className="arabic-text">القراءة والفهم</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-3" />
                    <span className="arabic-text">الكتابة والإملاء</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 ml-3" />
                    <span className="arabic-text">الحساب الأساسي</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            مميزات البرنامج
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-high-contrast arabic-text mb-2">{feature.title}</h3>
                <p className="text-sm text-medium-contrast arabic-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div id="courses" className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            دورات البرنامج
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-high-contrast arabic-text mb-2">
                      {course.title}
                    </h3>
                    <p className="text-medium-contrast arabic-text text-sm mb-3">
                      {course.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-xs">
                    {course.level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-textSecondary ml-2" />
                    <span className="text-medium-contrast arabic-text">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-textSecondary ml-2" />
                    <span className="text-medium-contrast arabic-text">{course.lessons} درس</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 btn btn-primary text-sm">
                    ابدأ الدورة
                  </button>
                  <button className="btn btn-outline text-sm">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text text-center mb-8">
            قصص نجاح المتعلمين
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold ml-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-high-contrast arabic-text">{testimonial.name}</h4>
                    <p className="text-sm text-textSecondary arabic-text">{testimonial.age} سنة</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                
                <p className="text-medium-contrast arabic-text text-sm italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="card p-8 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">ابدأ رحلة التعلم اليوم</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            انضم لأكثر من 1,250 متعلم واكتسب مهارات القراءة والكتابة التي ستغير حياتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="btn bg-white text-blue-600 hover:bg-gray-100 flex items-center justify-center"
            >
              <Users className="w-5 h-5 ml-2" />
              انضم الآن مجاناً
            </Link>
            <Link
              href="/contact"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 flex items-center justify-center"
            >
              <Download className="w-5 h-5 ml-2" />
              تحميل المنهج
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link
            href="/programs"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors arabic-text"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للبرامج
          </Link>
          
          <Link
            href="/programs/life-skills"
            className="inline-flex items-center text-primary hover:text-primary-dark transition-colors arabic-text"
          >
            البرنامج التالي: المهارات الحياتية
            <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
