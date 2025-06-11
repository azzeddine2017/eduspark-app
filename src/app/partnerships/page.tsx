'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Award, 
  MapPin, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Target,
  Handshake
} from 'lucide-react';

export default function PartnershipsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [applicationStep, setApplicationStep] = useState(0);

  const regions = [
    { id: 'all', name: 'جميع المناطق', count: 50 },
    { id: 'arab', name: 'المنطقة العربية', count: 15, color: 'bg-green-500' },
    { id: 'europe', name: 'أوروبا', count: 10, color: 'bg-blue-500' },
    { id: 'america', name: 'أمريكا الشمالية', count: 10, color: 'bg-purple-500' },
    { id: 'asia', name: 'آسيا', count: 10, color: 'bg-orange-500' },
    { id: 'africa', name: 'أفريقيا', count: 5, color: 'bg-red-500' }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'نموذج مالي مربح',
      description: '70% من الإيرادات للشريك المحلي',
      highlight: '70%'
    },
    {
      icon: Users,
      title: 'دعم شامل',
      description: 'تدريب مكثف لمدة 8 أسابيع',
      highlight: '8 أسابيع'
    },
    {
      icon: Globe,
      title: 'شبكة عالمية',
      description: 'انضم لشبكة من 50+ شريك عالمي',
      highlight: '50+'
    },
    {
      icon: Award,
      title: 'شهادة معتمدة',
      description: 'شهادة هولاكراسي معتمدة دولياً',
      highlight: 'معتمدة'
    }
  ];

  const requirements = [
    'خبرة في التعليم أو الأعمال (3+ سنوات)',
    'قدرة مالية للاستثمار الأولي ($15,000)',
    'التزام بقيم ومبادئ منصة فتح',
    'فهم للثقافة المحلية والسوق',
    'مهارات قيادية وإدارية',
    'رؤية للتطوير المستدام'
  ];

  const applicationSteps = [
    {
      title: 'التقديم الأولي',
      description: 'ملء نموذج التقديم وإرفاق الوثائق',
      duration: '1 أسبوع'
    },
    {
      title: 'التقييم المتعمق',
      description: 'تقييم الخبرة والمؤهلات وخطة العمل',
      duration: '2 أسبوع'
    },
    {
      title: 'المقابلات',
      description: 'مقابلات متخصصة ودراسة حالة',
      duration: '1 أسبوع'
    },
    {
      title: 'القرار النهائي',
      description: 'اتخاذ القرار والإعلان عن النتيجة',
      duration: '3 أيام'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              انضم لشبكة
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {' '}فتح الموزعة
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              كن جزءاً من ثورة التعليم العالمية. أطلق عقدتك المحلية وساهم في بناء مستقبل التعليم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setApplicationStep(1)}
              >
                ابدأ التقديم الآن
                <ArrowRight className="inline-block mr-2 w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all duration-300"
              >
                تعرف على المزيد
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Network Map */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              شبكة عالمية متنامية
            </h2>
            <p className="text-xl text-gray-600">
              اكتشف الفرص المتاحة في مختلف المناطق حول العالم
            </p>
          </div>

          {/* Region Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {regions.map((region) => (
              <motion.button
                key={region.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRegion(region.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedRegion === region.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="inline-block ml-2 w-4 h-4" />
                {region.name}
                <span className="mr-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                  {region.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
            <Globe className="w-24 h-24 mx-auto text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              خريطة الشركاء التفاعلية
            </h3>
            <p className="text-gray-600">
              استكشف مواقع الشركاء الحاليين والفرص المتاحة في منطقتك
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              لماذا تختار شراكة فتح؟
            </h2>
            <p className="text-xl text-gray-600">
              مزايا استثنائية تضمن نجاحك وازدهارك
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {benefit.description}
                </p>
                <div className="text-2xl font-bold text-purple-600">
                  {benefit.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              متطلبات الشراكة
            </h2>
            <p className="text-xl text-gray-600">
              تأكد من استيفائك للمعايير الأساسية للانضمام
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {requirements.map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-4 space-x-reverse bg-gray-50 rounded-xl p-4"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{requirement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              عملية التقديم
            </h2>
            <p className="text-xl text-gray-600">
              رحلة بسيطة ومنظمة للانضمام لشبكة فتح
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {applicationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-bold text-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <div className="text-sm text-purple-600 font-semibold">
                    المدة: {step.duration}
                  </div>
                </div>
                {index < applicationSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-purple-300 transform -translate-y-1/2 translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ابدأ رحلتك معنا اليوم
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              انضم لشبكة الشركاء المتميزين وكن جزءاً من مستقبل التعليم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Handshake className="inline-block ml-2 w-5 h-5" />
                قدم طلب الشراكة
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                تحدث مع مستشار
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
