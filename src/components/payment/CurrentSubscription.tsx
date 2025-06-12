'use client';

// import { useState } from 'react'; // غير مستخدم حالياً
import { Crown, Gift, Calendar, CheckCircle, Star, Zap, Users, Globe } from 'lucide-react';
import { Subscription } from '@/types/payment';

interface CurrentSubscriptionProps {
  subscription?: Subscription | null;
  onSubscriptionCancelled?: () => void;
}

export default function CurrentSubscription({
  subscription: propSubscription,
  onSubscriptionCancelled
}: CurrentSubscriptionProps) {
  // استخدام البيانات الممررة أو البيانات الافتراضية
  const defaultSubscription: Subscription = {
    id: 'free-plan',
    planId: 'free',
    status: 'active',
    amount: 0,
    currency: 'SAR',
    interval: 'lifetime',
    createdAt: '2025-01-01',
    startDate: '2025-01-01',
    price: 0,
    features: [
      'وصول كامل لجميع الدورات',
      'مساعد ذكي متطور مخصص ثقافياً',
      'شهادات إنجاز مجانية',
      'مجتمع تعليمي نشط',
      'دعم فني 24/7',
      'محتوى عالمي محلي',
      'تحديثات مستمرة',
      'بدون إعلانات',
      'تخزين غير محدود',
      'وصول من جميع الأجهزة'
    ],
    plan: {
      id: 'free',
      name: 'منصة فتح المجانية',
      description: 'وصول مجاني لجميع المحتويات',
      amount: 0,
      currency: 'SAR',
      interval: 'lifetime',
      features: [
        'وصول كامل لجميع الدورات',
        'مساعد ذكي متطور مخصص ثقافياً',
        'شهادات إنجاز مجانية'
      ],
      provider: 'local',
      providerPlanId: 'free-plan'
    }
  };

  const subscription = propSubscription || defaultSubscription;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'free':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'free':
        return 'مجاني';
      default:
        return 'غير معروف';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-text arabic-text">الاشتراك الحالي</h3>
          <p className="text-textSecondary arabic-text">تفاصيل خطة الاشتراك الخاصة بك</p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="card p-6 border-2 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-bold text-text arabic-text">{subscription.plan?.name || 'منصة فتح المجانية'}</h4>
              <div className="flex items-center space-x-2 space-x-reverse mt-1">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                  {getStatusText(subscription.status)}
                </span>
                <span className="text-textSecondary text-sm">
                  منذ {subscription.startDate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-left">
            <div className="text-3xl font-bold text-emerald-600">
              {(subscription.price || subscription.amount) > 0 ? `${subscription.price || subscription.amount} ${subscription.currency}` : 'مجاني'}
            </div>
            <div className="text-sm text-textSecondary">
              {(subscription.price || subscription.amount) > 0 ? (subscription.endDate ? `حتى ${subscription.endDate}` : 'شهرياً') : 'إلى الأبد'}
            </div>
            {(subscription.price || subscription.amount) > 0 && onSubscriptionCancelled && (
              <button
                onClick={onSubscriptionCancelled}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                إلغاء الاشتراك
              </button>
            )}
          </div>
        </div>

        {/* Plan Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {(subscription.features || subscription.plan?.features || []).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-text arabic-text text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Plan Benefits */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4">
          <h5 className="font-bold text-emerald-800 dark:text-emerald-200 arabic-text mb-2">
            🎉 مزايا خاصة بمنصة فتح الموزعة
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">شبكة عالمية موزعة</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">ذكاء اصطناعي متطور</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">حوكمة ديمقراطية</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Star className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">تخصيص ثقافي محلي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">الدورات المكتملة</p>
              <p className="text-2xl font-bold text-text">5</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">ساعات التعلم</p>
              <p className="text-2xl font-bold text-text">42</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary">الشهادات المحصلة</p>
              <p className="text-2xl font-bold text-text">3</p>
            </div>
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Future Plans */}
      <div className="card p-6">
        <h4 className="text-lg font-bold text-text arabic-text mb-4">خطط مستقبلية (اختيارية)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4 opacity-75">
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h5 className="font-bold text-text arabic-text">خطة المؤسسات</h5>
            </div>
            <p className="text-textSecondary arabic-text text-sm mb-3">
              للمؤسسات التعليمية الكبيرة مع ميزات إدارية متقدمة
            </p>
            <div className="text-lg font-bold text-yellow-600">قريباً</div>
          </div>
          
          <div className="border border-border rounded-lg p-4 opacity-75">
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <Star className="w-6 h-6 text-purple-600" />
              <h5 className="font-bold text-text arabic-text">خطة المطورين</h5>
            </div>
            <p className="text-textSecondary arabic-text text-sm mb-3">
              للمطورين الذين يريدون إنشاء تطبيقات على منصة فتح
            </p>
            <div className="text-lg font-bold text-purple-600">قريباً</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-textSecondary arabic-text">
            الخطط المدفوعة ستكون اختيارية وستدعم تطوير المنصة، لكن المحتوى الأساسي سيبقى مجانياً دائماً
          </p>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="text-center">
          <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 arabic-text mb-2">
            💝 دعم المنصة
          </h4>
          <p className="text-blue-700 dark:text-blue-300 arabic-text mb-4">
            إذا كنت تريد دعم تطوير منصة فتح، يمكنك المساهمة في المشروع مفتوح المصدر أو التطوع معنا
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <button className="btn btn-outline btn-sm">
              المساهمة في الكود
            </button>
            <button className="btn btn-outline btn-sm">
              التطوع معنا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
