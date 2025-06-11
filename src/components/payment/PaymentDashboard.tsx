'use client';

import { useState, useEffect } from 'react';
import SubscriptionPlans from './SubscriptionPlans';
import PaymentHistory from './PaymentHistory';
import PaymentMethods from './PaymentMethods';
import CurrentSubscription from './CurrentSubscription';

interface PaymentDashboardProps {
  userId: string;
}

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

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export default function PaymentDashboard({ userId }: PaymentDashboardProps) {
  const [activeTab, setActiveTab] = useState('plans');
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  const tabs = [
    { id: 'plans', name: 'خطط الاشتراك', icon: '📋' },
    { id: 'current', name: 'اشتراكي الحالي', icon: '⭐' },
    { id: 'history', name: 'سجل المدفوعات', icon: '📊' },
    { id: 'methods', name: 'طرق الدفع', icon: '💳' }
  ];

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // جلب خطط الاشتراك
      const plansResponse = await fetch('/api/payment/create');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        if (plansData.success) {
          setPlans(plansData.data.plans);
        }
      }

      // جلب الاشتراكات والمدفوعات
      const subscriptionsResponse = await fetch('/api/payment/subscription');
      if (subscriptionsResponse.ok) {
        const subscriptionsData = await subscriptionsResponse.json();
        if (subscriptionsData.success) {
          setSubscriptions(subscriptionsData.data.subscriptions);
          
          // العثور على الاشتراك النشط
          const activeSubscription = subscriptionsData.data.subscriptions.find(
            (sub: Subscription) => sub.status === 'active'
          );
          setCurrentSubscription(activeSubscription || null);
        }
      }

      // جلب سجل المدفوعات (مؤقت - يجب إنشاء API endpoint)
      // const paymentsResponse = await fetch('/api/payment/history');
      // if (paymentsResponse.ok) {
      //   const paymentsData = await paymentsResponse.json();
      //   if (paymentsData.success) {
      //     setPayments(paymentsData.data.payments);
      //   }
      // }

    } catch (error) {
      console.error('خطأ في جلب بيانات الدفع:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionCreated = (subscription: Subscription) => {
    setSubscriptions(prev => [subscription, ...prev]);
    if (subscription.status === 'active') {
      setCurrentSubscription(subscription);
    }
    // الانتقال لتبويب الاشتراك الحالي
    setActiveTab('current');
  };

  const handleSubscriptionCancelled = () => {
    setCurrentSubscription(null);
    fetchData(); // إعادة جلب البيانات
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* هيكل تحميل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ملخص سريع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">حالة الاشتراك</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentSubscription ? 'نشط' : 'غير مشترك'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">الباقة الحالية</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentSubscription?.plan?.name || 'مجانية'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المدفوعات</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="ml-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويبات */}
      <div className="mt-8">
        {activeTab === 'plans' && (
          <SubscriptionPlans 
            plans={plans}
            currentSubscription={currentSubscription}
            onSubscriptionCreated={handleSubscriptionCreated}
          />
        )}

        {activeTab === 'current' && (
          <CurrentSubscription 
            subscription={currentSubscription}
            onSubscriptionCancelled={handleSubscriptionCancelled}
          />
        )}

        {activeTab === 'history' && (
          <PaymentHistory 
            payments={payments}
            subscriptions={subscriptions}
          />
        )}

        {activeTab === 'methods' && (
          <PaymentMethods userId={userId} />
        )}
      </div>
    </div>
  );
}
