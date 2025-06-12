'use client';

import { useState } from 'react';
import { FileText, Video, Image, Upload, Save, Eye, Plus } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'text' | 'video' | 'image' | 'document';
  status: 'draft' | 'published';
  lastModified: string;
}

export default function ContentStudio() {
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      title: 'مقدمة في البرمجة - الدرس الأول',
      type: 'text',
      status: 'published',
      lastModified: '2025-01-15'
    },
    {
      id: '2',
      title: 'فيديو شرح المتغيرات',
      type: 'video',
      status: 'draft',
      lastModified: '2025-01-14'
    },
    {
      id: '3',
      title: 'مخطط هيكل البيانات',
      type: 'image',
      status: 'published',
      lastModified: '2025-01-13'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'text':
        return 'نص';
      case 'video':
        return 'فيديو';
      case 'image':
        return 'صورة';
      case 'document':
        return 'مستند';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  const getStatusText = (status: string) => {
    return status === 'published' ? 'منشور' : 'مسودة';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text arabic-text">استوديو المحتوى</h2>
          <p className="text-textSecondary arabic-text">إنشاء وإدارة محتوى الدورات</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button 
            onClick={() => setActiveTab('list')}
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-outline'}`}
          >
            قائمة المحتوى
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Plus className="w-4 h-4 ml-2" />
            إنشاء محتوى
          </button>
        </div>
      </div>

      {/* Content List */}
      {activeTab === 'list' && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text arabic-text mb-4">محتوياتي</h3>
          
          <div className="space-y-4">
            {contents.map((content) => (
              <div key={content.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(content.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text arabic-text">{content.title}</h4>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-textSecondary">
                        <span>{getTypeText(content.type)}</span>
                        <span>آخر تعديل: {content.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(content.status)}`}>
                      {getStatusText(content.status)}
                    </span>
                    <button className="btn btn-sm btn-outline">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="btn btn-sm btn-primary">
                      تحرير
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {contents.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-textSecondary mx-auto mb-4" />
              <p className="text-textSecondary arabic-text">لا يوجد محتوى بعد</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="btn btn-primary mt-4"
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء أول محتوى
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content Creation */}
      {activeTab === 'create' && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text arabic-text mb-4">إنشاء محتوى جديد</h3>
          
          <div className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-medium text-text arabic-text mb-2">
                نوع المحتوى
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border border-border rounded-lg hover:border-primary transition-colors text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-text arabic-text">نص</span>
                </button>
                <button className="p-4 border border-border rounded-lg hover:border-primary transition-colors text-center">
                  <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-text arabic-text">فيديو</span>
                </button>
                <button className="p-4 border border-border rounded-lg hover:border-primary transition-colors text-center">
                  <Image className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-text arabic-text">صورة</span>
                </button>
                <button className="p-4 border border-border rounded-lg hover:border-primary transition-colors text-center">
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-text arabic-text">ملف</span>
                </button>
              </div>
            </div>

            {/* Content Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  عنوان المحتوى
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="أدخل عنوان المحتوى"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  وصف المحتوى
                </label>
                <textarea
                  className="form-input w-full h-32"
                  placeholder="أدخل وصف المحتوى"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-text arabic-text mb-2">
                  محتوى الدرس
                </label>
                <div className="border border-border rounded-lg p-4 min-h-[200px] bg-background">
                  <p className="text-textSecondary arabic-text text-center">
                    محرر المحتوى سيظهر هنا
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 space-x-reverse">
              <button className="btn btn-outline">
                <Eye className="w-4 h-4 ml-2" />
                معاينة
              </button>
              <button className="btn btn-secondary">
                <Save className="w-4 h-4 ml-2" />
                حفظ كمسودة
              </button>
              <button className="btn btn-primary">
                نشر المحتوى
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
