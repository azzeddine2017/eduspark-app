'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface LocalUserManagerProps {
  activeSubscriptions: any[];
  nodeId: string;
}

export default function LocalUserManager({ activeSubscriptions, nodeId }: LocalUserManagerProps) {
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  const userTabs = [
    { id: 'active', name: 'المستخدمين النشطين', count: activeSubscriptions.length },
    { id: 'pending', name: 'في الانتظار', count: 5 },
    { id: 'expired', name: 'منتهية الصلاحية', count: 12 },
    { id: 'analytics', name: 'التحليلات', count: 0 }
  ];

  const subscriptionTiers = [
    { id: 'all', name: 'جميع الباقات' },
    { id: 'BASIC', name: 'الباقة الأساسية' },
    { id: 'ADVANCED', name: 'الباقة المتقدمة' },
    { id: 'PREMIUM', name: 'الباقة المميزة' }
  ];

  // بيانات مؤقتة للمستخدمين المنتظرين والمنتهيين
  const pendingUsers = [
    {
      id: 'pending_1',
      user: { name: 'أحمد محمد', email: 'ahmed@example.com' },
      tier: 'BASIC',
      amount: 29,
      createdAt: new Date(Date.now() - 86400000),
      status: 'PENDING'
    }
  ];

  const expiredUsers = [
    {
      id: 'expired_1',
      user: { name: 'فاطمة علي', email: 'fatima@example.com' },
      tier: 'ADVANCED',
      amount: 49,
      endDate: new Date(Date.now() - 172800000),
      status: 'EXPIRED'
    }
  ];

  const getUsersByTab = () => {
    switch (selectedTab) {
      case 'active':
        return activeSubscriptions;
      case 'pending':
        return pendingUsers;
      case 'expired':
        return expiredUsers;
      default:
        return activeSubscriptions;
    }
  };

  const filteredUsers = getUsersByTab().filter(subscription => {
    const user = subscription.user;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || subscription.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier: string) => {
    const tierColors = {
      'BASIC': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'ADVANCED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'PREMIUM': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };

    const tierNames = {
      'BASIC': 'أساسية',
      'ADVANCED': 'متقدمة',
      'PREMIUM': 'مميزة'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tierColors[tier as keyof typeof tierColors]}`}>
        {tierNames[tier as keyof typeof tierNames]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'ACTIVE': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'EXPIRED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };

    const statusNames = {
      'ACTIVE': 'نشط',
      'PENDING': 'في الانتظار',
      'EXPIRED': 'منتهي'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {statusNames[status as keyof typeof statusNames]}
      </span>
    );
  };

  const getUserStats = () => {
    const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);
    const averageRevenue = activeSubscriptions.length > 0 ? totalRevenue / activeSubscriptions.length : 0;
    
    return {
      totalUsers: activeSubscriptions.length,
      totalRevenue,
      averageRevenue,
      basicUsers: activeSubscriptions.filter(sub => sub.tier === 'BASIC').length,
      advancedUsers: activeSubscriptions.filter(sub => sub.tier === 'ADVANCED').length,
      premiumUsers: activeSubscriptions.filter(sub => sub.tier === 'PREMIUM').length
    };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المستخدمين</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الإيرادات</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">متوسط الإيراد</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">${Math.round(stats.averageRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">الباقة المميزة</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.premiumUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {userTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="mr-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {selectedTab !== 'analytics' && (
        <>
          {/* أدوات البحث والفلترة */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="البحث في المستخدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {subscriptionTiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </select>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              تصدير
            </button>
          </div>

          {/* قائمة المستخدمين */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  لا يوجد مستخدمين
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  لم يتم العثور على مستخدمين يطابقون معايير البحث
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((subscription) => (
                  <div key={subscription.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {subscription.user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {subscription.user.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {subscription.user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          {getTierBadge(subscription.tier)}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ${subscription.amount}/شهر
                          </p>
                        </div>
                        
                        <div className="text-center">
                          {getStatusBadge(subscription.status || 'ACTIVE')}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {subscription.endDate 
                              ? formatDistanceToNow(new Date(subscription.endDate), { addSuffix: true, locale: ar })
                              : formatDistanceToNow(new Date(subscription.createdAt), { addSuffix: true, locale: ar })
                            }
                          </p>
                        </div>
                        
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedTab === 'analytics' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            تحليلات المستخدمين
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            ستتوفر تحليلات المستخدمين المفصلة قريباً...
          </p>
        </div>
      )}
    </div>
  );
}
