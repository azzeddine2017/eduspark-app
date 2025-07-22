'use client';

import { useState } from 'react';

interface LessonContentProps {
  content: any; // يمكن أن يكون string أو object
  title: string;
}

export default function LessonContent({ content, title }: LessonContentProps) {
  const [activeSection, setActiveSection] = useState<string>('content');

  // تحويل المحتوى إلى نص نظيف
  const getCleanContent = () => {
    if (typeof content === 'string') {
      return content;
    }

    if (typeof content === 'object' && content !== null) {
      // إذا كان المحتوى JSON object
      if (content.content) {
        return content.content;
      }
      
      // إذا كان المحتوى يحتوي على text
      if (content.text) {
        return content.text;
      }

      // محاولة استخراج النص من أي مكان
      return JSON.stringify(content, null, 2);
    }

    return 'محتوى الدرس غير متوفر';
  };

  // تنسيق النص لعرض أفضل
  const formatContent = (text: string) => {
    // إزالة رموز Markdown الزائدة
    let formatted = text
      .replace(/^#{1,6}\s*/gm, '') // إزالة عناوين Markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // إزالة النص العريض
      .replace(/\*(.*?)\*/g, '$1') // إزالة النص المائل
      .replace(/`(.*?)`/g, '$1') // إزالة الكود المضمن
      .replace(/^\s*[-*+]\s*/gm, '• ') // تحويل القوائم إلى نقاط
      .replace(/^\s*\d+\.\s*/gm, '• ') // تحويل القوائم المرقمة إلى نقاط
      .trim();

    return formatted;
  };

  // تقسيم المحتوى إلى أقسام
  const parseContentSections = (text: string) => {
    const sections: { [key: string]: string } = {};

    // البحث عن الأقسام المختلفة باستخدام regex بدون flag s
    const objectivesMatch = text.match(/🎯 أهداف الدرس:([\s\S]*?)(?=📚|💡|🔍|📝|$)/);
    const mainContentMatch = text.match(/📚 المحتوى الأساسي:([\s\S]*?)(?=💡|🔍|📝|🎯|$)/);
    const examplesMatch = text.match(/💡 أمثلة تطبيقية:([\s\S]*?)(?=🔍|📝|🎯|$)/);
    const activitiesMatch = text.match(/🔍 أنشطة تفاعلية:([\s\S]*?)(?=📝|🎯|$)/);
    const summaryMatch = text.match(/📝 ملخص الدرس:([\s\S]*?)(?=🎯|$)/);
    const assessmentMatch = text.match(/🎯 التقييم الذاتي:([\s\S]*?)$/);

    if (objectivesMatch) sections.objectives = formatContent(objectivesMatch[1]);
    if (mainContentMatch) sections.content = formatContent(mainContentMatch[1]);
    if (examplesMatch) sections.examples = formatContent(examplesMatch[1]);
    if (activitiesMatch) sections.activities = formatContent(activitiesMatch[1]);
    if (summaryMatch) sections.summary = formatContent(summaryMatch[1]);
    if (assessmentMatch) sections.assessment = formatContent(assessmentMatch[1]);

    return sections;
  };

  const cleanContent = getCleanContent();
  const sections = parseContentSections(cleanContent);

  // إذا لم نجد أقسام، اعرض المحتوى كاملاً
  const hasStructuredContent = Object.keys(sections).length > 0;

  if (!hasStructuredContent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {title}
        </h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
            {formatContent(cleanContent)}
          </div>
        </div>
      </div>
    );
  }

  const sectionTabs = [
    { key: 'content', label: '📚 المحتوى', icon: '📚' },
    { key: 'objectives', label: '🎯 الأهداف', icon: '🎯' },
    { key: 'examples', label: '💡 الأمثلة', icon: '💡' },
    { key: 'activities', label: '🔍 الأنشطة', icon: '🔍' },
    { key: 'summary', label: '📝 الملخص', icon: '📝' },
    { key: 'assessment', label: '🎯 التقييم', icon: '🎯' }
  ].filter(tab => sections[tab.key]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {sectionTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                activeSection === tab.key
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label.replace(/🎯|📚|💡|🔍|📝/g, '').trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {sections[activeSection] && (
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
              {sections[activeSection]}
            </div>
          </div>
        )}

        {!sections[activeSection] && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>هذا القسم غير متوفر في الدرس</p>
          </div>
        )}
      </div>
    </div>
  );
}
