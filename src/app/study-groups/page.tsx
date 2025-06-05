import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Users,
  BookOpen,
  Clock,
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Globe,
  Video,
  MessageCircle,
  Award,
  TrendingUp
} from "lucide-react"

export const metadata: Metadata = {
  title: "مجموعات الدراسة - منصة فتح للتعلّم الذكي",
  description: "انضم لمجموعات الدراسة التعاونية وتعلم مع زملائك في منصة فتح",
}

export default function StudyGroupsPage() {
  // بيانات تجريبية لمجموعات الدراسة
  const studyGroups = [
    {
      id: 1,
      name: "مجموعة تعلم JavaScript",
      description: "نتعلم أساسيات JavaScript ونطبق مشاريع عملية معاً",
      course: "دورة JavaScript للمبتدئين",
      members: 24,
      maxMembers: 30,
      level: "مبتدئ",
      language: "العربية",
      meetingType: "أونلاين",
      nextMeeting: "الأحد 8:00 م",
      tags: ["JavaScript", "برمجة", "مبتدئ"],
      isActive: true,
      rating: 4.8
    },
    {
      id: 2,
      name: "مجموعة تصميم UI/UX",
      description: "نناقش أحدث اتجاهات التصميم ونراجع أعمال بعضنا البعض",
      course: "دورة تصميم واجهات المستخدم",
      members: 18,
      maxMembers: 25,
      level: "متوسط",
      language: "العربية",
      meetingType: "مختلط",
      nextMeeting: "الثلاثاء 7:30 م",
      tags: ["UI/UX", "تصميم", "إبداع"],
      isActive: true,
      rating: 4.9
    },
    {
      id: 3,
      name: "مجموعة Python للذكاء الاصطناعي",
      description: "نستكشف عالم الذكاء الاصطناعي باستخدام Python",
      course: "دورة Python والذكاء الاصطناعي",
      members: 15,
      maxMembers: 20,
      level: "متقدم",
      language: "العربية",
      meetingType: "أونلاين",
      nextMeeting: "الخميس 9:00 م",
      tags: ["Python", "AI", "متقدم"],
      isActive: true,
      rating: 4.7
    },
    {
      id: 4,
      name: "مجموعة التسويق الرقمي",
      description: "نتعلم استراتيجيات التسويق الرقمي الحديثة",
      course: "دورة التسويق الرقمي",
      members: 32,
      maxMembers: 35,
      level: "مبتدئ",
      language: "العربية",
      meetingType: "أونلاين",
      nextMeeting: "السبت 6:00 م",
      tags: ["تسويق", "رقمي", "أعمال"],
      isActive: true,
      rating: 4.6
    }
  ]

  const categories = [
    { name: "البرمجة", count: 12, icon: "💻" },
    { name: "التصميم", count: 8, icon: "🎨" },
    { name: "الأعمال", count: 15, icon: "💼" },
    { name: "اللغات", count: 6, icon: "🌍" },
    { name: "العلوم", count: 9, icon: "🔬" },
    { name: "الفنون", count: 4, icon: "🎭" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-full text-sm font-medium mb-4">
              👥 تعلم جماعي
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            مجموعات الدراسة
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-3xl mx-auto">
            انضم لمجموعات الدراسة التعاونية وتعلم مع زملائك. شارك المعرفة، اطرح الأسئلة، وحقق أهدافك التعليمية معاً
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مجموعة دراسة..."
              className="input pr-10"
            />
          </div>
          <div className="flex gap-2">
            <select className="input w-auto">
              <option>جميع المستويات</option>
              <option>مبتدئ</option>
              <option>متوسط</option>
              <option>متقدم</option>
            </select>
            <select className="input w-auto">
              <option>نوع اللقاء</option>
              <option>أونلاين</option>
              <option>حضوري</option>
              <option>مختلط</option>
            </select>
            <button className="btn btn-primary flex items-center">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء مجموعة
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">
            التصنيفات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="card p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-high-contrast arabic-text mb-1">{category.name}</h3>
                <p className="text-sm text-textSecondary arabic-text">{category.count} مجموعة</p>
              </div>
            ))}
          </div>
        </div>

        {/* Study Groups */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text">
              المجموعات النشطة
            </h2>
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-textSecondary arabic-text">
              <span>{studyGroups.length} مجموعة متاحة</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <div key={group.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <h3 className="text-lg font-bold text-high-contrast arabic-text">
                        {group.name}
                      </h3>
                      {group.isActive && (
                        <span className="w-2 h-2 bg-success rounded-full"></span>
                      )}
                    </div>
                    <p className="text-medium-contrast arabic-text text-sm mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center space-x-1 space-x-reverse mb-2">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span className="text-sm text-medium-contrast">{group.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary arabic-text">الدورة:</span>
                    <span className="text-medium-contrast arabic-text">{group.course}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary arabic-text">الأعضاء:</span>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-textSecondary ml-1" />
                      <span className="text-medium-contrast">{group.members}/{group.maxMembers}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary arabic-text">المستوى:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      group.level === 'مبتدئ' ? 'bg-success bg-opacity-20 text-success' :
                      group.level === 'متوسط' ? 'bg-warning bg-opacity-20 text-warning' :
                      'bg-error bg-opacity-20 text-error'
                    }`}>
                      {group.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary arabic-text">نوع اللقاء:</span>
                    <div className="flex items-center">
                      {group.meetingType === 'أونلاين' ? (
                        <Video className="w-4 h-4 text-primary ml-1" />
                      ) : group.meetingType === 'حضوري' ? (
                        <MapPin className="w-4 h-4 text-secondary ml-1" />
                      ) : (
                        <Globe className="w-4 h-4 text-info ml-1" />
                      )}
                      <span className="text-medium-contrast arabic-text">{group.meetingType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-textSecondary arabic-text">اللقاء القادم:</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-textSecondary ml-1" />
                      <span className="text-medium-contrast arabic-text">{group.nextMeeting}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-surface text-textSecondary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn btn-primary text-sm">
                    انضم للمجموعة
                  </button>
                  <button className="btn btn-outline text-sm">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">54</div>
            <div className="text-sm text-medium-contrast arabic-text">مجموعة نشطة</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">1,234</div>
            <div className="text-sm text-medium-contrast arabic-text">عضو مشارك</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">89%</div>
            <div className="text-sm text-medium-contrast arabic-text">معدل إكمال الدورات</div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">قريباً - مجموعات دراسة تفاعلية</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            نعمل على تطوير نظام مجموعات الدراسة التفاعلية مع جميع الأدوات اللازمة للتعلم الجماعي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/community"
              className="btn bg-white text-primary hover:bg-gray-100 flex items-center justify-center"
            >
              <Users className="w-5 h-5 ml-2" />
              انضم للمجتمع الآن
            </Link>
            <Link
              href="/contact"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              اقترح ميزة
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
