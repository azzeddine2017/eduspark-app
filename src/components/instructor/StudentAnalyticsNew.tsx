'use client';

import { useState } from 'react';
import { Users, TrendingUp, Award, BarChart3 } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  completedLessons: number;
  totalLessons: number;
  grade: number;
}

export default function StudentAnalytics() {
  const [students] = useState<StudentData[]>([
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      progress: 85,
      lastActive: '2025-01-15',
      completedLessons: 17,
      totalLessons: 20,
      grade: 88
    },
    {
      id: '2',
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      progress: 92,
      lastActive: '2025-01-15',
      completedLessons: 18,
      totalLessons: 20,
      grade: 94
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'students'>('overview');

  const totalStudents = students.length;
  const averageProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / totalStudents);
  const averageGrade = Math.round(students.reduce((sum, s) => sum + s.grade, 0) / totalStudents);
  const activeStudents = students.filter(s => {
    const lastActive = new Date(s.lastActive);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return lastActive >= threeDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text arabic-text">تحليلات الطلاب</h2>
          <p className="text-textSecondary arabic-text">مراقبة أداء وتقدم الطلاب</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline'}`}
          >
            نظرة عامة
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-outline'}`}
          >
            الطلاب
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-textSecondary">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold text-text">{totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-textSecondary">الطلاب النشطون</p>
                  <p className="text-2xl font-bold text-text">{activeStudents}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-textSecondary">متوسط التقدم</p>
                  <p className="text-2xl font-bold text-text">{averageProgress}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-textSecondary">متوسط الدرجات</p>
                  <p className="text-2xl font-bold text-text">{averageGrade}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-text arabic-text mb-4">قائمة الطلاب</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 font-medium text-text arabic-text">الطالب</th>
                  <th className="text-right py-3 px-4 font-medium text-text arabic-text">التقدم</th>
                  <th className="text-right py-3 px-4 font-medium text-text arabic-text">الدروس</th>
                  <th className="text-right py-3 px-4 font-medium text-text arabic-text">الدرجة</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border hover:bg-surface">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-text arabic-text">{student.name}</div>
                        <div className="text-sm text-textSecondary">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {student.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-text">
                        {student.completedLessons}/{student.totalLessons}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-text">
                        {student.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
