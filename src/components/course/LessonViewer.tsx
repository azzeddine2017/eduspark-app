'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Edit
} from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

interface LessonContent {
  type: string;
  content: string;
  examples: string[];
  activities: any[];
  resources: string[];
  hasInteractiveElements: boolean;
  metadata?: any;
  description?: string;
  objectives?: string[];
  moduleTitle?: string;
  moduleDuration?: number;
}

interface Lesson {
  id: string;
  title: string;
  content: LessonContent;
  order: number;
  duration: number;
  isPublished: boolean;
}

interface LessonViewerProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  onLessonChange: (index: number) => void;
  onEditLesson?: (lesson: Lesson) => void;
  isEditable?: boolean;
}

export default function LessonViewer({ 
  lessons, 
  currentLessonIndex, 
  onLessonChange, 
  onEditLesson,
  isEditable = false 
}: LessonViewerProps) {
  const [viewMode, setViewMode] = useState<'content' | 'activities' | 'resources'>('content');
  
  const currentLesson = lessons[currentLessonIndex];
  
  if (!currentLesson) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">لا توجد دروس متاحة</p>
      </div>
    );
  }

  const isModuleHeader = currentLesson.content.type === 'module_header';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              {isModuleHeader ? '📚' : '📖'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
              <div className="flex items-center gap-4 mt-1 text-blue-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentLesson.duration} دقيقة
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  الدرس {currentLesson.order}
                </span>
              </div>
            </div>
          </div>
          
          {isEditable && onEditLesson && (
            <button
              onClick={() => onEditLesson(currentLesson)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setViewMode('content')}
            className={`px-6 py-3 font-medium transition-colors ${
              viewMode === 'content'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            📖 المحتوى
          </button>
          {currentLesson.content.activities?.length > 0 && (
            <button
              onClick={() => setViewMode('activities')}
              className={`px-6 py-3 font-medium transition-colors ${
                viewMode === 'activities'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🎯 الأنشطة ({currentLesson.content.activities.length})
            </button>
          )}
          {currentLesson.content.resources?.length > 0 && (
            <button
              onClick={() => setViewMode('resources')}
              className={`px-6 py-3 font-medium transition-colors ${
                viewMode === 'resources'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📚 المصادر ({currentLesson.content.resources.length})
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'content' && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {isModuleHeader ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                    📚 {currentLesson.content.description || 'وحدة تعليمية'}
                  </h3>
                  {currentLesson.content.objectives && (
                    <div>
                      <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">🎯 أهداف الوحدة:</h4>
                      <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                        {currentLesson.content.objectives.map((objective: string, index: number) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="leading-relaxed whitespace-pre-wrap">
                  {currentLesson.content.content || 'محتوى الدرس غير متوفر'}
                </div>
              )}

              {/* Examples */}
              {currentLesson.content.examples?.length > 0 && (
                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    أمثلة تطبيقية
                  </h4>
                  <div className="space-y-3">
                    {currentLesson.content.examples.map((example: string, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
                        <p className="text-gray-700 dark:text-gray-300">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'activities' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                الأنشطة التفاعلية
              </h3>
              {currentLesson.content.activities?.map((activity: any, index: number) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200">{activity.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400">
                      <span>⏱️ {activity.estimatedTime} دقيقة</span>
                      <span>📊 صعوبة: {activity.difficulty}/10</span>
                    </div>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">{activity.description}</p>
                  {activity.instructions && (
                    <div>
                      <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📋 التعليمات:</h5>
                      <ul className="list-decimal list-inside space-y-1 text-blue-600 dark:text-blue-400">
                        {activity.instructions.map((instruction: string, i: number) => (
                          <li key={i}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'resources' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                المصادر الإضافية
              </h3>
              <div className="grid gap-4">
                {currentLesson.content.resources?.map((resource: string, index: number) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-green-800 dark:text-green-200 font-medium">{resource}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onLessonChange(currentLessonIndex - 1)}
            disabled={currentLessonIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            الدرس السابق
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentLessonIndex + 1} من {lessons.length}
          </span>
          
          <button
            onClick={() => onLessonChange(currentLessonIndex + 1)}
            disabled={currentLessonIndex === lessons.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            الدرس التالي
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
