'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MarjanTeacher from '@/components/MarjanTeacher';
import DarkModeWrapper, { Card, Header, Title, Text, Button } from '@/components/ui/DarkModeWrapper';
import {
  Bot,
  Brain,
  Sparkles,
  Target,
  MessageCircle,
  Lightbulb,
  BookOpen,
  Mic,
  PenTool,
  Star,
  Users,
  Clock,
  CheckCircle,
  Play,
  Eye
} from 'lucide-react';

export default function MarjanPage() {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [showMarjan, setShowMarjan] = useState(false);

  const demoScenarios = [
    {
      id: 'fractions',
      title: 'تعلم الكسور',
      description: 'مرجان يشرح الكسور بطريقة تفاعلية مع الرسم',
      subject: 'الرياضيات',
      difficulty: 'مبتدئ',
      icon: <Target className="w-6 h-6" />,
      initialMessage: 'يا مرجان، لا أفهم الكسور'
    },
    {
      id: 'pythagoras',
      title: 'نظرية فيثاغورس',
      description: 'شرح تفاعلي مع الرسم والتوضيح على السبورة',
      subject: 'الرياضيات',
      difficulty: 'متوسط',
      icon: <BookOpen className="w-6 h-6" />,
      initialMessage: 'اشرح لي نظرية فيثاغورس'
    },
    {
      id: 'ohms_law',
      title: 'قانون أوم',
      description: 'فهم الكهرباء مع رسم الدوائر الكهربائية',
      subject: 'الفيزياء',
      difficulty: 'متوسط',
      icon: <Sparkles className="w-6 h-6" />,
      initialMessage: 'ما هو قانون أوم؟'
    },
    {
      id: 'programming',
      title: 'أساسيات البرمجة',
      description: 'تعلم المتغيرات والدوال بطريقة سهلة',
      subject: 'البرمجة',
      difficulty: 'مبتدئ',
      icon: <Brain className="w-6 h-6" />,
      initialMessage: 'أريد تعلم البرمجة'
    },
    {
      id: 'photosynthesis',
      title: 'البناء الضوئي',
      description: 'كيف تصنع النباتات طعامها؟',
      subject: 'الأحياء',
      difficulty: 'متوسط',
      icon: <Lightbulb className="w-6 h-6" />,
      initialMessage: 'كيف تحصل النباتات على طعامها؟'
    },
    {
      id: 'chemical_reactions',
      title: 'التفاعلات الكيميائية',
      description: 'فهم التفاعلات من خلال أمثلة المطبخ',
      subject: 'الكيمياء',
      difficulty: 'متوسط',
      icon: <Users className="w-6 h-6" />,
      initialMessage: 'ماذا يحدث عندما نخلط الخل مع بيكربونات الصوديوم؟'
    },
    {
      id: 'algorithms',
      title: 'الخوارزميات',
      description: 'تعلم حل المشاكل خطوة بخطوة',
      subject: 'البرمجة',
      difficulty: 'متقدم',
      icon: <Clock className="w-6 h-6" />,
      initialMessage: 'ما هي الخوارزمية؟'
    },
    {
      id: 'cell_structure',
      title: 'تركيب الخلية',
      description: 'اكتشف أصغر وحدة في الحياة',
      subject: 'الأحياء',
      difficulty: 'مبتدئ',
      icon: <CheckCircle className="w-6 h-6" />,
      initialMessage: 'مما يتكون جسم الإنسان؟'
    }
  ];

  const marjanFeatures = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      title: 'الطريقة السقراطية',
      description: 'يطرح أسئلة توجيهية بدلاً من الإجابة المباشرة لتنمية التفكير النقدي'
    },
    {
      icon: <Mic className="w-8 h-8 text-green-500" />,
      title: 'التفاعل الصوتي',
      description: 'يتحدث ويستمع بالعربية لتجربة تعلم طبيعية ومريحة'
    },
    {
      icon: <PenTool className="w-8 h-8 text-purple-500" />,
      title: 'السبورة التفاعلية',
      description: 'يرسم ويوضح المفاهيم بصرياً أثناء الشرح'
    },
    {
      icon: <Brain className="w-8 h-8 text-orange-500" />,
      title: 'الذاكرة الذكية',
      description: 'يتذكر تقدمك ويتكيف مع مستواك وأسلوب تعلمك'
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: 'أمثلة من الحياة',
      description: 'يستخدم تشبيهات وأمثلة من الحياة اليومية لتبسيط المفاهيم'
    },
    {
      icon: <Star className="w-8 h-8 text-pink-500" />,
      title: 'التشجيع المستمر',
      description: 'يحفزك ويشجعك في رحلة التعلم ويحتفل بإنجازاتك'
    }
  ];

  return (
    <DarkModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        
        {/* Header */}
        <Header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Bot className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Title className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  مرجان
                </Title>
                <Text className="text-2xl md:text-3xl mb-4 text-gray-600 dark:text-gray-300">
                  معلمك الافتراضي الذكي
                </Text>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Text className="text-xl max-w-3xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
                  أول معلم افتراضي ناطق بالعربية يجمع بين الذكاء الاصطناعي والطريقة السقراطية والتفاعل الصوتي والرسم التوضيحي
                </Text>

                <div className="flex justify-center space-x-4 space-x-reverse">
                  <Button 
                    variant="primary"
                    className="px-8 py-4 text-lg"
                    onClick={() => setShowMarjan(true)}
                  >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تحدث مع مرجان الآن
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-8 py-4 text-lg"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Eye className="w-5 h-5 ml-2" />
                    اكتشف المميزات
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </Header>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Title className="text-4xl font-bold mb-4">
                ما يجعل مرجان مميزاً؟
              </Title>
              <Text className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                مرجان ليس مجرد مساعد ذكي، بل معلم حقيقي يفهم احتياجاتك ويتكيف مع أسلوب تعلمك
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {marjanFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      {feature.icon}
                      <Title className="text-xl font-bold mr-3">
                        {feature.title}
                      </Title>
                    </div>
                    <Text className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </Text>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Scenarios */}
        <section className="py-20 bg-white/50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Title className="text-4xl font-bold mb-4">
                جرب مرجان في سيناريوهات مختلفة
              </Title>
              <Text className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                اختر أحد السيناريوهات التعليمية لترى كيف يعمل مرجان مع مواضيع مختلفة
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {demoScenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedDemo(scenario.id);
                    setShowMarjan(true);
                  }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full mb-4 mx-auto">
                      {scenario.icon}
                    </div>
                    
                    <Title className="text-lg font-bold text-center mb-2">
                      {scenario.title}
                    </Title>
                    
                    <Text className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                      {scenario.description}
                    </Text>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {scenario.subject}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {scenario.difficulty}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Play className="w-4 h-4 ml-1" />
                      <span className="text-sm font-medium">جرب الآن</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                <Text className="text-gray-600 dark:text-gray-300">باللغة العربية</Text>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <Text className="text-gray-600 dark:text-gray-300">متاح دائماً</Text>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">∞</div>
                <Text className="text-gray-600 dark:text-gray-300">صبر لا محدود</Text>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">🧠</div>
                <Text className="text-gray-600 dark:text-gray-300">ذكي ومتكيف</Text>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <Title className="text-4xl font-bold text-white mb-6">
              ابدأ رحلة التعلم مع مرجان اليوم
            </Title>
            <Text className="text-xl text-purple-100 mb-8">
              اكتشف طريقة جديدة في التعلم مع أول معلم افتراضي ذكي ناطق بالعربية
            </Text>
            <Button 
              variant="secondary"
              className="px-8 py-4 text-lg bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => setShowMarjan(true)}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              ابدأ المحادثة مع مرجان
            </Button>
          </div>
        </section>

        {/* Marjan Teacher Component */}
        {showMarjan && (
          <MarjanTeacher 
            initialTopic={selectedDemo ? demoScenarios.find(s => s.id === selectedDemo)?.title : undefined}
            studentLevel="intermediate"
          />
        )}
      </div>
    </DarkModeWrapper>
  );
}
