'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AdvancedAIAssistant from '@/components/ai/AdvancedAIAssistant';
import DarkModeWrapper, { Card, Header, Title, Text, Button } from '@/components/ui/DarkModeWrapper';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Globe, 
  Lightbulb,
  BookOpen,
  BarChart3,
  Zap,
  Star,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

export default function AIPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const aiFeatures = [
    {
      id: 'content-analysis',
      title: 'تحليل المحتوى الذكي',
      description: 'تحليل عميق للمواد التعليمية مع ملخصات ذكية ونقاط رئيسية',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      benefits: ['تلخيص تلقائي', 'استخراج النقاط الرئيسية', 'تحليل الصعوبة', 'اقتراح التحسينات']
    },
    {
      id: 'personalized-recommendations',
      title: 'التوصيات المخصصة',
      description: 'اقتراحات تعليمية ذكية مبنية على أسلوب تعلمك وتقدمك الشخصي',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      benefits: ['مسارات تعليمية مخصصة', 'محتوى مناسب للمستوى', 'توقيت مثالي للدراسة', 'أهداف قابلة للتحقيق']
    },
    {
      id: 'progress-tracking',
      title: 'تتبع التقدم الذكي',
      description: 'مراقبة دقيقة لتقدمك مع تحليلات مفصلة وتوصيات للتحسين',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-600',
      benefits: ['تحليل الأداء', 'تحديد نقاط القوة', 'اكتشاف الفجوات', 'خطط التحسين']
    },
    {
      id: 'cultural-adaptation',
      title: 'التكيف الثقافي',
      description: 'محتوى وأمثلة مخصصة حسب ثقافتك ومنطقتك الجغرافية',
      icon: Globe,
      color: 'from-orange-500 to-red-600',
      benefits: ['أمثلة محلية', 'سياق ثقافي', 'لغة مناسبة', 'تطبيقات عملية']
    },
    {
      id: 'smart-tutoring',
      title: 'التدريس الذكي',
      description: 'شرح تفاعلي متقدم مع أمثلة وتمارين مخصصة لاحتياجاتك',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      benefits: ['شرح متدرج', 'أمثلة متنوعة', 'تمارين تفاعلية', 'تقييم فوري']
    },
    {
      id: 'study-planning',
      title: 'تخطيط الدراسة الذكي',
      description: 'جداول دراسية مثلى مبنية على وقتك المتاح وأهدافك التعليمية',
      icon: BookOpen,
      color: 'from-pink-500 to-purple-600',
      benefits: ['جدولة ذكية', 'توزيع الأحمال', 'تذكيرات مخصصة', 'مرونة في التعديل']
    }
  ];

  const stats = [
    { label: 'مستخدم نشط', value: '10,000+', icon: Users, color: 'text-blue-600' },
    { label: 'سؤال يومياً', value: '50,000+', icon: Brain, color: 'text-green-600' },
    { label: 'معدل الرضا', value: '96%', icon: Star, color: 'text-yellow-600' },
    { label: 'وقت الاستجابة', value: '< 1ث', icon: Clock, color: 'text-purple-600' }
  ];

  return (
    <DarkModeWrapper>
      {/* Header */}
      <Header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <Title level={1} className="mb-4">
                🤖 الذكاء الاصطناعي المتطور
              </Title>
              
              <Text className="text-xl max-w-3xl mx-auto mb-8">
                مساعدك الذكي المخصص الذي يفهم احتياجاتك التعليمية ويقدم تجربة تعلم مخصصة وفعالة
              </Text>

              <div className="flex justify-center space-x-4 space-x-reverse">
                <Button 
                  variant="primary"
                  className="px-8 py-3 text-lg"
                  onClick={() => setActiveDemo('chat')}
                >
                  <Play className="w-5 h-5 ml-2" />
                  جرب المساعد الآن
                </Button>
                <Button 
                  variant="outline"
                  className="px-8 py-3 text-lg"
                >
                  <BarChart3 className="w-5 h-5 ml-2" />
                  عرض الإحصائيات
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Header>

      {/* Stats */}
      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center p-6">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-2xl font-bold text-text mb-1">{stat.value}</div>
                  <div className="text-sm text-textSecondary arabic-text">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="mb-4">
              🧠 قدرات الذكاء الاصطناعي المتقدمة
            </Title>
            <Text className="text-lg max-w-2xl mx-auto">
              اكتشف كيف يمكن للذكاء الاصطناعي أن يحول تجربة التعلم الخاصة بك
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setActiveDemo(feature.id)}
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <Title level={3} className="mb-3">
                    {feature.title}
                  </Title>
                  
                  <Text secondary className="mb-4">
                    {feature.description}
                  </Text>

                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2 space-x-reverse">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-textSecondary arabic-text">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center text-primary group-hover:text-secondary transition-colors">
                    <span className="text-sm font-medium arabic-text">جرب الآن</span>
                    <ArrowRight className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Title level={2} className="mb-4">
              🎯 جرب المساعد الذكي الآن
            </Title>
            <Text className="text-lg">
              اختبر قدرات الذكاء الاصطناعي المتطور واكتشف كيف يمكنه مساعدتك
            </Text>
          </div>

          <Card className="p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-12 h-12 text-white" />
              </div>
              
              <Title level={3} className="mb-4">
                المساعد الذكي جاهز للمساعدة
              </Title>
              
              <Text className="mb-6">
                انقر على الزر العائم في الأسفل لبدء محادثة مع المساعد الذكي المتطور
              </Text>

              <div className="flex justify-center space-x-4 space-x-reverse">
                <Button variant="primary" className="px-6 py-3">
                  <Zap className="w-5 h-5 ml-2" />
                  ابدأ المحادثة
                </Button>
                <Button variant="outline" className="px-6 py-3">
                  <Volume2 className="w-5 h-5 ml-2" />
                  تجربة صوتية
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Advanced AI Assistant */}
      <AdvancedAIAssistant
        nodeId="pilot-algiers-001"
        culturalContext={{
          region: 'الجزائر العاصمة',
          language: 'العربية',
          level: 'متقدم'
        }}
      />
    </DarkModeWrapper>
  );
}
