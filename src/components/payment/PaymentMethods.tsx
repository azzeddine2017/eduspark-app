'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Building, Gift, CheckCircle, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank' | 'free';
  name: string;
  details: string;
  isDefault: boolean;
  icon: React.ComponentType<any>;
}

interface PaymentMethodsProps {
  userId: string;
}

export default function PaymentMethods({ userId }: PaymentMethodsProps) {
  // يمكن استخدام userId لجلب طرق الدفع الخاصة بالمستخدم
  console.log('User ID:', userId);
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'free',
      name: 'منصة فتح المجانية',
      details: 'جميع الخدمات مجانية بالكامل',
      isDefault: true,
      icon: Gift
    }
  ]);

  const getMethodIcon = (method: PaymentMethod) => {
    const IconComponent = method.icon;
    return <IconComponent className="w-6 h-6" />;
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'card':
        return 'text-blue-600';
      case 'mobile':
        return 'text-green-600';
      case 'bank':
        return 'text-purple-600';
      case 'free':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-text arabic-text">طرق الدفع</h3>
          <p className="text-textSecondary arabic-text">إدارة طرق الدفع المحفوظة</p>
        </div>
        <button className="btn btn-outline flex items-center" disabled>
          <Plus className="w-4 h-4 ml-2" />
          إضافة طريقة دفع
        </button>
      </div>

      {/* Free Platform Notice */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Gift className="w-8 h-8 text-emerald-600" />
          <div>
            <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 arabic-text">
              🎉 منصة فتح مجانية بالكامل!
            </h4>
            <p className="text-emerald-700 dark:text-emerald-300 arabic-text">
              لا حاجة لطرق دفع - جميع الدورات والخدمات متاحة مجاناً
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${getMethodColor(method.type)}`}>
                  {getMethodIcon(method)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text arabic-text">{method.name}</h4>
                  <p className="text-textSecondary arabic-text">{method.details}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                {method.isDefault && (
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600 font-medium">افتراضي</span>
                  </div>
                )}
                <button className="btn btn-sm btn-outline" disabled>
                  تحرير
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Payment Methods (Future) */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-text arabic-text mb-4">طرق الدفع المتاحة (مستقبلاً)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-border rounded-lg text-center opacity-50">
            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h5 className="font-medium text-text arabic-text">البطاقات الائتمانية</h5>
            <p className="text-sm text-textSecondary arabic-text">Visa, Mastercard</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg text-center opacity-50">
            <Smartphone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h5 className="font-medium text-text arabic-text">المحافظ الرقمية</h5>
            <p className="text-sm text-textSecondary arabic-text">Apple Pay, STC Pay</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg text-center opacity-50">
            <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h5 className="font-medium text-text arabic-text">التحويل البنكي</h5>
            <p className="text-sm text-textSecondary arabic-text">جميع البنوك المحلية</p>
          </div>
          
          <div className="p-4 border border-border rounded-lg text-center">
            <Gift className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h5 className="font-medium text-text arabic-text">مجاني</h5>
            <p className="text-sm text-textSecondary arabic-text">متاح الآن</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-textSecondary arabic-text">
            طرق الدفع الأخرى ستكون متاحة في المستقبل للخدمات الإضافية الاختيارية
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="text-center">
          <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 arabic-text mb-2">
            🔒 الأمان والخصوصية
          </h4>
          <p className="text-blue-700 dark:text-blue-300 arabic-text">
            عندما نقدم خدمات مدفوعة في المستقبل، سنستخدم أعلى معايير الأمان لحماية بياناتك المالية
          </p>
        </div>
      </div>
    </div>
  );
}
