import { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  MessageCircle,
  Users,
  Clock,
  ArrowLeft,
  Pin,
  TrendingUp,
  Eye,
  MessageSquare,
  Plus,
  Search,
  Filter,
  Star,
  Award,
  BookOpen
} from "lucide-react"

export const metadata: Metadata = {
  title: "المنتدى - منصة فتح للتعلّم الذكي",
  description: "منتدى منصة فتح للمناقشات التعليمية والتفاعل مع المجتمع",
}

export default function ForumPage() {
  // بيانات تجريبية للمنتدى
  const categories = [
    {
      id: 1,
      name: "الأسئلة العامة",
      description: "اطرح أسئلتك العامة حول المنصة والتعلم",
      icon: "❓",
      topics: 45,
      posts: 234,
      lastActivity: "منذ 5 دقائق"
    },
    {
      id: 2,
      name: "البرمجة والتطوير",
      description: "مناقشات حول البرمجة ولغات التطوير",
      icon: "💻",
      topics: 78,
      posts: 456,
      lastActivity: "منذ 10 دقائق"
    },
    {
      id: 3,
      name: "التصميم والإبداع",
      description: "مشاركة الأعمال الإبداعية والتصاميم",
      icon: "🎨",
      topics: 32,
      posts: 189,
      lastActivity: "منذ 15 دقيقة"
    },
    {
      id: 4,
      name: "المساعد الذكي",
      description: "نصائح وحيل لاستخدام المساعد الذكي",
      icon: "🤖",
      topics: 23,
      posts: 98,
      lastActivity: "منذ 30 دقيقة"
    }
  ]

  const recentTopics = [
    {
      id: 1,
      title: "كيف أبدأ في تعلم البرمجة؟",
      author: "أحمد محمد",
      category: "البرمجة والتطوير",
      replies: 12,
      views: 156,
      lastReply: "منذ 5 دقائق",
      isPinned: true
    },
    {
      id: 2,
      title: "أفضل الممارسات في تصميم واجهات المستخدم",
      author: "فاطمة أحمد",
      category: "التصميم والإبداع",
      replies: 8,
      views: 89,
      lastReply: "منذ 15 دقيقة",
      isPinned: false
    },
    {
      id: 3,
      title: "مشكلة في استخدام المساعد الذكي",
      author: "محمد علي",
      category: "المساعد الذكي",
      replies: 5,
      views: 67,
      lastReply: "منذ 25 دقيقة",
      isPinned: false
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
              💬 منتدى المجتمع
            </span>
          </div>
          <h1 className="text-4xl font-bold text-high-contrast arabic-text mb-4">
            منتدى فتح
          </h1>
          <p className="text-lg text-medium-contrast arabic-text max-w-2xl mx-auto">
            شارك في المناقشات، اطرح الأسئلة، وتفاعل مع مجتمع المتعلمين والمعلمين
          </p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث في المنتدى..."
              className="input pr-10"
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline flex items-center">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </button>
            <button className="btn btn-primary flex items-center">
              <Plus className="w-4 h-4 ml-2" />
              موضوع جديد
            </button>
          </div>
        </div>

        {/* Forum Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-high-contrast arabic-text mb-6">
            أقسام المنتدى
          </h2>
          <div className="grid gap-4">
            {categories.map((category) => (
              <div key={category.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-high-contrast arabic-text mb-1">
                        {category.name}
                      </h3>
                      <p className="text-medium-contrast arabic-text text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-bold text-high-contrast">{category.topics}</div>
                        <div className="text-textSecondary arabic-text">موضوع</div>
                      </div>
                      <div>
                        <div className="font-bold text-high-contrast">{category.posts}</div>
                        <div className="text-textSecondary arabic-text">مشاركة</div>
                      </div>
                      <div>
                        <div className="text-xs text-textSecondary arabic-text">
                          آخر نشاط
                        </div>
                        <div className="text-xs text-medium-contrast arabic-text">
                          {category.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Topics */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-high-contrast arabic-text">
              المواضيع الحديثة
            </h2>
            <Link href="/forum/topics" className="text-primary hover:text-primary-dark transition-colors arabic-text">
              عرض الكل
            </Link>
          </div>
          
          <div className="card">
            <div className="divide-y divide-border">
              {recentTopics.map((topic) => (
                <div key={topic.id} className="p-6 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        {topic.isPinned && (
                          <Pin className="w-4 h-4 text-warning" />
                        )}
                        <h3 className="text-lg font-semibold text-high-contrast arabic-text hover:text-primary transition-colors cursor-pointer">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-medium-contrast arabic-text">
                        <span>بواسطة {topic.author}</span>
                        <span>في {topic.category}</span>
                        <span>آخر رد {topic.lastReply}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 space-x-reverse text-sm text-textSecondary">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 ml-1" />
                        {topic.replies}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 ml-1" />
                        {topic.views}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forum Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">178</div>
            <div className="text-sm text-medium-contrast arabic-text">إجمالي المواضيع</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">1,234</div>
            <div className="text-sm text-medium-contrast arabic-text">عضو نشط</div>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-high-contrast mb-1">2,567</div>
            <div className="text-sm text-medium-contrast arabic-text">إجمالي المشاركات</div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="card p-8 text-center bg-gradient-to-r from-primary to-secondary text-white">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold arabic-text mb-4">قريباً - منتدى تفاعلي كامل</h3>
          <p className="text-lg opacity-90 arabic-text mb-6">
            نعمل على تطوير منتدى تفاعلي كامل مع جميع الميزات المتقدمة
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
