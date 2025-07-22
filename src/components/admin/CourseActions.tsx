'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseActionsProps {
  courseId: string;
  courseTitle: string;
}

export default function CourseActions({ courseId, courseTitle }: CourseActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الدورة "${courseTitle}"؟\n\nهذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع الدروس والبيانات المرتبطة بها.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ تم حذف الدورة بنجاح!');
        router.refresh(); // إعادة تحميل الصفحة
      } else {
        throw new Error(data.error || 'فشل في حذف الدورة');
      }
    } catch (error) {
      console.error('خطأ في حذف الدورة:', error);
      alert('❌ حدث خطأ أثناء حذف الدورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      {/* زر المعاينة */}
      <Link
        href={`/courses/${courseId}`}
        className="p-2 text-textSecondary hover:text-primary transition-colors"
        title="عرض الدورة"
      >
        <Eye className="w-4 h-4" />
      </Link>

      {/* زر التعديل */}
      <Link
        href={`/admin/course-generator?edit=${courseId}`}
        className="p-2 text-textSecondary hover:text-warning transition-colors"
        title="تعديل الدورة"
      >
        <Edit className="w-4 h-4" />
      </Link>

      {/* زر الحذف */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-2 transition-colors ${
          isDeleting 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-textSecondary hover:text-error'
        }`}
        title={isDeleting ? 'جاري الحذف...' : 'حذف الدورة'}
      >
        <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
}
