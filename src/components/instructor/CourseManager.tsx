'use client';

import { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users, Clock, Star } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  students: number;
  duration: string;
  rating: number;
  status: 'draft' | 'published' | 'archived';
}

export default function CourseManager() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'مقدمة في البرمجة',
      description: 'دورة شاملة لتعلم أساسيات البرمجة',
      students: 45,
      duration: '8 أسابيع',
      rating: 4.8,
      status: 'published'
    },
    {
      id: '2',
      title: 'تطوير المواقع',
      description: 'تعلم تطوير المواقع الحديثة',
      students: 32,
      duration: '12 أسبوع',
      rating: 4.6,
      status: 'published'
    },
    {
      id: '3',
      title: 'الذكاء الاصطناعي',
      description: 'مقدمة في الذكاء الاصطناعي والتعلم الآلي',
      students: 0,
      duration: '10 أسابيع',
      rating: 0,
      status: 'draft'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشور';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      default:
        return 'غير معروف';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text arabic-text">إدارة الدورات</h2>
          <p className="text-textSecondary arabic-text">إدارة وتنظيم دوراتك التعليمية</p>
        </div>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          دورة جديدة
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">إجمالي الدورات</p>
              <p className="text-2xl font-bold text-text">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">الدورات المنشورة</p>
              <p className="text-2xl font-bold text-text">
                {courses.filter(c => c.status === 'published').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">إجمالي الطلاب</p>
              <p className="text-2xl font-bold text-text">
                {courses.reduce((sum, c) => sum + c.students, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">متوسط التقييم</p>
              <p className="text-2xl font-bold text-text">
                {(courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / 
                  courses.filter(c => c.rating > 0).length || 0).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-text arabic-text mb-4">دوراتي</h3>
        
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-2">
                    <h4 className="text-lg font-semibold text-text arabic-text">{course.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {getStatusText(course.status)}
                    </span>
                  </div>
                  
                  <p className="text-textSecondary arabic-text mb-3">{course.description}</p>
                  
                  <div className="flex items-center space-x-6 space-x-reverse text-sm text-textSecondary">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 ml-1" />
                      {course.students} طالب
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 ml-1" />
                      {course.duration}
                    </div>
                    {course.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 ml-1 text-yellow-500" />
                        {course.rating}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="btn btn-sm btn-outline">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-sm btn-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {courses.length === 0 && (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <p className="text-textSecondary arabic-text">لا توجد دورات بعد</p>
            <button className="btn btn-primary mt-4">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء أول دورة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
