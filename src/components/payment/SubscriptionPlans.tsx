'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// تحميل Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
  provider: string;
  providerPlanId: string;
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  createdAt: string;
  nextBillingDate?: string;
  plan?: SubscriptionPlan;
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  onSubscriptionCreated: (subscription: Subscription) => void;
}

export default function SubscriptionPlans({ 
  plans, 
  currentSubscription, 
  onSubscriptionCreated 
}: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paypal'>('stripe');

  const handleSubscribe = async (plan: SubscriptionPlan, provider: 'stripe' | 'paypal') => {
    try {
      setLoading(plan.id);

      // إنشاء الاشتراك
      const response = await fetch('/api/payment/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          provider,
          metadata: {
            planName: plan.name,
            userAgent: navigator.userAgent
          }
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'فشل في إنشاء الاشتراك');
      }

      // التعامل مع الاستجابة حسب البوابة
      if (provider === 'stripe' && data.data.redirectUrl) {
        // إعادة توجيه لصفحة تأكيد Stripe
        window.location.href = data.data.redirectUrl;
      } else if (provider === 'paypal' && data.data.redirectUrl) {
        // إعادة توجيه لصفحة موافقة PayPal
        window.location.href = data.data.redirectUrl;
      } else {
        // الاشتراك تم إنشاؤه بنجاح
        onSubscriptionCreated({
          id: data.data.subscriptionId,
          planId: plan.id,
          status: 'active',
          amount: plan.amount,
          currency: plan.currency,
          interval: plan.interval,
          createdAt: new Date().toISOString(),
          plan
        });
      }

    } catch (error) {
      console.error('خطأ في الاشتراك:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء الاشتراك');
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (amount: number, currency: string, interval: string) => {
    const formattedAmount = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);

    const intervalText = interval === 'month' ? 'شهرياً' : 'سنوياً';
    return `${formattedAmount} ${intervalText}`;
  };

  const getPlanBadge = (planId: string) => {
    switch (planId) {
      case 'basic':
        return { text: 'الأكثر شعبية', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' };
      case 'premium':
        return { text: 'الأفضل قيمة', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' };
      default:
        return null;
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          لا توجد خطط اشتراك متاحة
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          يرجى المحاولة مرة أخرى لاحقاً
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* اختيار بوابة الدفع */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          اختر طريقة الدفع المفضلة
        </h3>
        
        <div className="flex space-x-4 space-x-reverse">
          <button
            onClick={() => setSelectedProvider('stripe')}
            className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedProvider === 'stripe'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center ml-3">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Stripe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">بطاقات ائتمانية</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedProvider('paypal')}
            className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
              selectedProvider === 'paypal'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center ml-3">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">PayPal</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">حساب PayPal</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* خطط الاشتراك */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const badge = getPlanBadge(plan.id);
          const isCurrentPlan = currentSubscription?.planId === plan.id;
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                isCurrentPlan
                  ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* شارة الخطة */}
              {badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
              )}

              {/* شارة الخطة الحالية */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    خطتك الحالية
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* اسم الخطة والسعر */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.amount, plan.currency, plan.interval)}
                  </div>
                </div>

                {/* الميزات */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* زر الاشتراك */}
                <button
                  onClick={() => handleSubscribe(plan, selectedProvider)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : isLoading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري المعالجة...
                    </div>
                  ) : isCurrentPlan ? (
                    'خطتك الحالية'
                  ) : (
                    'اشترك الآن'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* معلومات إضافية */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 ml-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
              معلومات مهمة
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              <li>• يمكنك إلغاء الاشتراك في أي وقت</li>
              <li>• جميع المدفوعات آمنة ومشفرة</li>
              <li>• ستحصل على فاتورة تفصيلية بعد كل دفعة</li>
              <li>• يمكنك ترقية أو تخفيض الباقة في أي وقت</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
