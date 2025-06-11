'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LocalContentManagerProps {
  localContent: any[];
  nodeId: string;
}

export default function LocalContentManager({ localContent, nodeId }: LocalContentManagerProps) {
  const [selectedTab, setSelectedTab] = useState('local');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const contentTabs = [
    { id: 'local', name: 'المحتوى المحلي', count: localContent.length },
    { id: 'global', name: 'المحتوى العالمي', count: 45 },
    { id: 'translations', name: 'الترجمات', count: 12 },
    { id: 'customizations', name: 'التخصيصات', count: 8 }
  ];

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'math', name: 'الرياضيات' },
    { id: 'science', name: 'العلوم' },
    { id: 'language', name: 'اللغات' },
    { id: 'islamic', name: 'الدراسات الإسلامية' },
    { id: 'tech', name: 'التقنية' }
  ];

  // محتوى عالمي مؤقت للعرض
  const globalContent = [
    {
      id: 'global_1',
      title: 'أساسيات البرمجة',
      description: 'دورة شاملة في أساسيات البرمجة',
      category: 'tech',
      level: 'BEGINNER',
      isDistributed: true,
      isLocalized: false,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 'global_2',
      title: 'الرياضيات المتقدمة',
      description: 'مفاهيم متقدمة في الرياضيات',
      category: 'math',
      level: 'ADVANCED',
      isDistributed: false,
      isLocalized: true,
      createdAt: new Date(Date.now() - 172800000)
    }
  ];

  const getContentByTab = () => {
    switch (selectedTab) {
      case 'local':
        return localContent;
      case 'global':
        return globalContent;
      case 'translations':
        return localContent.filter(content => content.isTranslated);
      case 'customizations':
        return localContent.filter(content => content.isCustomized);
      default:
        return localContent;
    }
  };

  const filteredContent = getContentByTab().filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (content: any) => {
    if (selectedTab === 'global') {
      if (content.isLocalized) {
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">مُخصص محلياً</span>;
      }
      if (content.isDistributed) {
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">موزع</span>;
      }
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded-full">متاح</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full">محلي</span>;
  };

  const getLevelBadge = (level: string) => {
    const levelColors = {
      'BEGINNER': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'INTERMEDIATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'ADVANCED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'EXPERT': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };

    const levelNames = {
      'BEGINNER': 'مبتدئ',
      'INTERMEDIATE': 'متوسط',
      'ADVANCED': 'متقدم',
      'EXPERT': 'خبير'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[level as keyof typeof levelColors]}`}>
        {levelNames[level as keyof typeof levelNames]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* التبويبات */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {contentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              <span className="mr-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="البحث في المحتوى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          إضافة محتوى
        </button>
      </div>

      {/* قائمة المحتوى */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              لا يوجد محتوى
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              لم يتم العثور على محتوى يطابق معايير البحث
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContent.map((content) => (
              <div key={content.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {content.title}
                      </h3>
                      {getStatusBadge(content)}
                      {content.level && getLevelBadge(content.level)}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {content.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true, locale: ar })}
                      </span>
                      
                      {content.views && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {content.views} مشاهدة
                        </span>
                      )}
                      
                      {content.rating && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {content.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {selectedTab === 'global' && !content.isLocalized && (
                      <button className="inline-flex items-center px-3 py-1 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-600 dark:hover:bg-purple-900/30">
                        تخصيص محلياً
                      </button>
                    )}
                    
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      تحرير
                    </button>
                    
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
