'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  BookOpen, 
  Users, 
  Clock, 
  Target, 
  Sparkles,
  Settings,
  Play,
  Save,
  Eye,
  Download
} from 'lucide-react';
import DarkModeWrapper, { Card, Header, Title, Text, Button } from '@/components/ui/DarkModeWrapper';

interface CourseGenerationForm {
  title: string;
  subject: string;
  targetAudience: 'children' | 'teenagers' | 'adults' | 'professionals';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: 'short' | 'medium' | 'long';
  language: 'arabic' | 'english' | 'bilingual';
  includeAssessments: boolean;
  includeInteractiveElements: boolean;
  culturalContext: 'saudi' | 'gulf' | 'arab' | 'international';
  learningObjectives: string[];
  prerequisites: string[];
}

export default function CourseGeneratorPage() {
  const [formData, setFormData] = useState<CourseGenerationForm>({
    title: '',
    subject: '',
    targetAudience: 'adults',
    difficultyLevel: 'beginner',
    duration: 'medium',
    language: 'arabic',
    includeAssessments: true,
    includeInteractiveElements: true,
    culturalContext: 'saudi',
    learningObjectives: [''],
    prerequisites: ['']
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const subjects = [
    { value: 'mathematics', label: 'الرياضيات' },
    { value: 'science', label: 'العلوم' },
    { value: 'language', label: 'اللغة العربية' },
    { value: 'english', label: 'اللغة الإنجليزية' },
    { value: 'history', label: 'التاريخ' },
    { value: 'geography', label: 'الجغرافيا' },
    { value: 'islamic_studies', label: 'التربية الإسلامية' },
    { value: 'computer_science', label: 'علوم الحاسوب' },
    { value: 'business', label: 'إدارة الأعمال' },
    { value: 'art', label: 'الفنون' }
  ];

  const handleInputChange = (field: keyof CourseGenerationForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'learningObjectives' | 'prerequisites', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'learningObjectives' | 'prerequisites') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'learningObjectives' | 'prerequisites', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generateCourse = async () => {
    if (!formData.title || !formData.subject) {
      alert('يرجى ملء العنوان والمادة على الأقل');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // محاكاة تقدم التوليد
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const response = await fetch('/api/marjan/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
          prerequisites: formData.prerequisites.filter(req => req.trim())
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCourse(data.course);
        setGenerationProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
        }, 1000);
      } else {
        throw new Error(data.error || 'فشل في توليد الدورة');
      }

    } catch (error) {
      console.error('خطأ في توليد الدورة:', error);
      alert('حدث خطأ أثناء توليد الدورة. يرجى المحاولة مرة أخرى.');
      setIsGenerating(false);
    }

    clearInterval(progressInterval);
  };

  return (
    <DarkModeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Header className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Bot className="w-12 h-12 text-blue-600" />
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>
            <Title className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مولد الدورات الذكي - مرجان
            </Title>
            <Text className="text-xl text-gray-600 dark:text-gray-300 mt-2">
              دع مرجان ينشئ دورات تعليمية شاملة ومتنوعة تلقائياً
            </Text>
          </Header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* نموذج التوليد */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">إعدادات الدورة</h2>
              </div>

              <div className="space-y-6">
                {/* العنوان والمادة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">عنوان الدورة *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: أساسيات الرياضيات للمبتدئين"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المادة *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر المادة</option>
                      {subjects.map(subject => (
                        <option key={subject.value} value={subject.value}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* الجمهور المستهدف ومستوى الصعوبة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الجمهور المستهدف</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="children">الأطفال (6-12 سنة)</option>
                      <option value="teenagers">المراهقون (13-18 سنة)</option>
                      <option value="adults">البالغون (18+ سنة)</option>
                      <option value="professionals">المهنيون</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">مستوى الصعوبة</label>
                    <select
                      value={formData.difficultyLevel}
                      onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">مبتدئ</option>
                      <option value="intermediate">متوسط</option>
                      <option value="advanced">متقدم</option>
                    </select>
                  </div>
                </div>

                {/* المدة والسياق الثقافي */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">مدة الدورة</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="short">قصيرة (1-3 ساعات)</option>
                      <option value="medium">متوسطة (4-8 ساعات)</option>
                      <option value="long">طويلة (9+ ساعات)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السياق الثقافي</label>
                    <select
                      value={formData.culturalContext}
                      onChange={(e) => handleInputChange('culturalContext', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="saudi">سعودي</option>
                      <option value="gulf">خليجي</option>
                      <option value="arab">عربي</option>
                      <option value="international">دولي</option>
                    </select>
                  </div>
                </div>

                {/* الخيارات المتقدمة */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="assessments"
                      checked={formData.includeAssessments}
                      onChange={(e) => handleInputChange('includeAssessments', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="assessments" className="text-sm font-medium">
                      تضمين التقييمات والاختبارات
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="interactive"
                      checked={formData.includeInteractiveElements}
                      onChange={(e) => handleInputChange('includeInteractiveElements', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="interactive" className="text-sm font-medium">
                      تضمين العناصر التفاعلية
                    </label>
                  </div>
                </div>

                {/* أهداف التعلم */}
                <div>
                  <label className="block text-sm font-medium mb-2">أهداف التعلم</label>
                  {formData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="هدف تعليمي..."
                      />
                      {formData.learningObjectives.length > 1 && (
                        <Button
                          onClick={() => removeArrayItem('learningObjectives', index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          حذف
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem('learningObjectives')}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    إضافة هدف
                  </Button>
                </div>

                {/* زر التوليد */}
                <Button
                  onClick={generateCourse}
                  disabled={isGenerating || !formData.title || !formData.subject}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      مرجان يولد الدورة... {Math.round(generationProgress)}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      توليد الدورة بواسطة مرجان
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* نتيجة التوليد */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">الدورة المولدة</h2>
              </div>

              {isGenerating && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <Bot className="w-full h-full text-blue-600" />
                  </motion.div>
                  <Text className="text-lg font-medium">مرجان يعمل على توليد دورتك...</Text>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <Text className="text-sm text-gray-600 mt-2">{Math.round(generationProgress)}% مكتمل</Text>
                </div>
              )}

              {generatedCourse && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <Text className="font-bold text-green-800 dark:text-green-200">تم التوليد بنجاح!</Text>
                    </div>
                    <Text className="text-green-700 dark:text-green-300">{generatedCourse.message || 'تم إنشاء الدورة بنجاح'}</Text>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <Text className="font-bold">الوحدات</Text>
                      </div>
                      <Text className="text-2xl font-bold text-blue-600">{generatedCourse.modules}</Text>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <Text className="font-bold">الدروس</Text>
                      </div>
                      <Text className="text-2xl font-bold text-purple-600">{generatedCourse.lessons}</Text>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <Text className="font-bold">المدة الإجمالية</Text>
                    </div>
                    <Text className="text-lg text-yellow-700 dark:text-yellow-300">
                      {Math.round(generatedCourse.duration / 60)} ساعة تقريباً
                    </Text>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      معاينة الدورة
                    </Button>
                    <Button className="flex-1 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      حفظ ونشر
                    </Button>
                  </div>
                </motion.div>
              )}

              {!generatedCourse && !isGenerating && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <Text>املأ النموذج واضغط "توليد الدورة" لبدء العملية</Text>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DarkModeWrapper>
  );
}
