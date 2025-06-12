'use client';

// import { useState } from 'react'; // غير مستخدم حالياً
import { Calendar, DollarSign, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { Payment, Subscription } from '@/types/payment';

interface PaymentHistoryProps {
  payments?: Payment[];
  subscriptions?: Subscription[];
}

export default function PaymentHistory({
  payments: propPayments = [],
  subscriptions: propSubscriptions = []
}: PaymentHistoryProps) {
  // استخدام البيانات الممررة أو البيانات الافتراضية
  const defaultPayments: Payment[] = [
    {
      id: '1',
      amount: 0,
      currency: 'SAR',
      status: 'completed',
      provider: 'local',
      description: 'اشتراك منصة فتح الموزعة - مجاني',
      createdAt: '2025-01-15',
      completedAt: '2025-01-15'
    },
    {
      id: '2',
      amount: 0,
      currency: 'SAR',
      status: 'completed',
      provider: 'local',
      description: 'دورة البرمجة المتقدمة - مجانية',
      createdAt: '2025-01-10',
      completedAt: '2025-01-10'
    },
    {
      id: '3',
      amount: 0,
      currency: 'SAR',
      status: 'completed',
      provider: 'local',
      description: 'شهادة إنجاز - مجانية',
      createdAt: '2025-01-05',
      completedAt: '2025-01-05'
    }
  ];

  const payments = propPayments.length > 0 ? propPayments : defaultPayments;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد المعالجة';
      case 'failed':
        return 'فشل';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-text arabic-text">سجل المدفوعات</h3>
          <p className="text-textSecondary arabic-text">تاريخ جميع معاملاتك المالية</p>
        </div>
        <button className="btn btn-outline flex items-center">
          <Download className="w-4 h-4 ml-2" />
          تصدير التقرير
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">إجمالي المدفوعات</p>
              <p className="text-2xl font-bold text-text">0 ريال</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">المعاملات المكتملة</p>
              <p className="text-2xl font-bold text-text">
                {payments.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">هذا الشهر</p>
              <p className="text-2xl font-bold text-text">0 ريال</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Free Platform Notice */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h4 className="text-lg font-bold text-green-800 dark:text-green-200 arabic-text">
              🎉 منصة فتح مجانية بالكامل!
            </h4>
            <p className="text-green-700 dark:text-green-300 arabic-text">
              جميع الدورات والخدمات متاحة مجاناً كجزء من رؤيتنا لتعليم عادل ومتاح للجميع
            </p>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-text arabic-text mb-4">تاريخ المعاملات</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">الوصف</th>
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">المبلغ</th>
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">الطريقة</th>
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-text arabic-text">رقم المعاملة</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-surface">
                  <td className="py-3 px-4">
                    <span className="text-text">{payment.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-text arabic-text">{payment.description || 'معاملة مالية'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-text">
                      {payment.amount === 0 ? 'مجاني' : `${payment.amount} ${payment.currency}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-textSecondary arabic-text">{payment.provider || 'محلي'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-textSecondary font-mono text-sm">
                      {payment.id}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-textSecondary mx-auto mb-4" />
            <p className="text-textSecondary arabic-text">لا توجد معاملات مالية بعد</p>
            <p className="text-sm text-textSecondary arabic-text mt-2">
              جميع خدمات منصة فتح مجانية!
            </p>
          </div>
        )}
      </div>

      {/* Future Plans Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
        <div className="text-center">
          <h4 className="text-lg font-bold text-purple-800 dark:text-purple-200 arabic-text mb-2">
            🚀 خطط مستقبلية
          </h4>
          <p className="text-purple-700 dark:text-purple-300 arabic-text">
            في المستقبل، قد نقدم خدمات إضافية اختيارية مدفوعة لدعم تطوير المنصة، 
            لكن المحتوى التعليمي الأساسي سيبقى مجانياً دائماً
          </p>
        </div>
      </div>
    </div>
  );
}
