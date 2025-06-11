'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Video, 
  Users, 
  Globe, 
  Mic, 
  Share2,
  Calendar,
  FileText,
  Languages,
  Zap,
  Clock,
  Star,
  Send,
  Phone,
  Monitor,
  Headphones,
  Settings,
  Bell
} from 'lucide-react';

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChannel, setSelectedChannel] = useState(null);

  const communicationStats = [
    { label: 'المستخدمون النشطون', value: '2,847', icon: Users, color: 'text-blue-600' },
    { label: 'الرسائل اليومية', value: '15,234', icon: MessageCircle, color: 'text-green-600' },
    { label: 'الاجتماعات الأسبوعية', value: '156', icon: Video, color: 'text-purple-600' },
    { label: 'اللغات المدعومة', value: '23', icon: Languages, color: 'text-orange-600' }
  ];

  const communicationChannels = [
    {
      id: 'instant-messaging',
      title: 'الرسائل الفورية',
      description: 'تواصل سريع وفعال مع الفرق والأفراد',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      features: ['رسائل فردية وجماعية', 'مشاركة الملفات', 'ترجمة فورية', 'إشعارات ذكية'],
      activeUsers: 1247,
      status: 'متاح'
    },
    {
      id: 'video-meetings',
      title: 'الاجتماعات المرئية',
      description: 'اجتماعات عالية الجودة مع أدوات تفاعلية',
      icon: Video,
      color: 'from-purple-500 to-pink-500',
      features: ['فيديو HD', 'مشاركة الشاشة', 'تسجيل الجلسات', 'غرف فرعية'],
      activeUsers: 456,
      status: 'متاح'
    },
    {
      id: 'voice-calls',
      title: 'المكالمات الصوتية',
      description: 'مكالمات صوتية واضحة ومؤتمرات صوتية',
      icon: Phone,
      color: 'from-green-500 to-emerald-500',
      features: ['جودة صوت عالية', 'إلغاء الضوضاء', 'مؤتمرات جماعية', 'تسجيل المكالمات'],
      activeUsers: 234,
      status: 'متاح'
    },
    {
      id: 'forums',
      title: 'المنتديات المتخصصة',
      description: 'نقاشات منظمة حول مواضيع محددة',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      features: ['تصنيف المواضيع', 'نظام التقييم', 'بحث متقدم', 'إشراف ذكي'],
      activeUsers: 892,
      status: 'متاح'
    },
    {
      id: 'workspaces',
      title: 'مساحات العمل التعاونية',
      description: 'أدوات متقدمة للعمل الجماعي والمشاريع',
      icon: Monitor,
      color: 'from-indigo-500 to-blue-500',
      features: ['لوحات كانبان', 'تحرير تعاوني', 'إدارة المهام', 'تتبع التقدم'],
      activeUsers: 567,
      status: 'متاح'
    },
    {
      id: 'announcements',
      title: 'نظام الإعلانات',
      description: 'نشر الأخبار والتحديثات المهمة',
      icon: Bell,
      color: 'from-yellow-500 to-orange-500',
      features: ['إعلانات مستهدفة', 'أولويات متعددة', 'جدولة النشر', 'تحليلات الوصول'],
      activeUsers: 1834,
      status: 'متاح'
    }
  ];

  const recentActivities = [
    {
      type: 'meeting',
      title: 'اجتماع المجلس العالمي الشهري',
      time: 'منذ ساعتين',
      participants: 12,
      status: 'مكتمل'
    },
    {
      type: 'message',
      title: 'رسالة جديدة في مجموعة التطوير التقني',
      time: 'منذ 15 دقيقة',
      participants: 45,
      status: 'جديد'
    },
    {
      type: 'forum',
      title: 'نقاش حول معايير الجودة الجديدة',
      time: 'منذ 30 دقيقة',
      participants: 23,
      status: 'نشط'
    },
    {
      type: 'announcement',
      title: 'إعلان عن برنامج التدريب الجديد',
      time: 'منذ ساعة',
      participants: 156,
      status: 'منشور'
    }
  ];

  const languageSupport = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦', users: 456 },
    { code: 'en', name: 'English', flag: '🇺🇸', users: 789 },
    { code: 'fr', name: 'Français', flag: '🇫🇷', users: 234 },
    { code: 'es', name: 'Español', flag: '🇪🇸', users: 345 },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', users: 123 },
    { code: 'zh', name: '中文', flag: '🇨🇳', users: 567 },
    { code: 'ja', name: '日本語', flag: '🇯🇵', users: 89 },
    { code: 'ko', name: '한국어', flag: '🇰🇷', users: 67 }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'meeting': return Video;
      case 'message': return MessageCircle;
      case 'forum': return Users;
      case 'announcement': return Bell;
      default: return MessageCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'جديد': return 'bg-blue-100 text-blue-800';
      case 'نشط': return 'bg-yellow-100 text-yellow-800';
      case 'منشور': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              منصة التواصل
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}والتنسيق
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تواصل وتعاون مع شبكة عالمية من المتعلمين والمدرسين والشركاء
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {communicationStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-gray-700 font-semibold">{stat.label}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: Globe },
              { id: 'channels', label: 'قنوات التواصل', icon: MessageCircle },
              { id: 'activities', label: 'الأنشطة الأخيرة', icon: Clock },
              { id: 'languages', label: 'الدعم اللغوي', icon: Languages }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Communication Channels */}
          {activeTab === 'channels' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                قنوات التواصل المتاحة
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communicationChannels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <div className={`bg-gradient-to-r ${channel.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                      <channel.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {channel.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {channel.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {channel.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 ml-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <Users className="inline-block ml-1 w-4 h-4" />
                        {channel.activeUsers} نشط
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {channel.status}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      ابدأ التواصل
                      <Send className="inline-block mr-2 w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Activities */}
          {activeTab === 'activities' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                الأنشطة الأخيرة
              </h2>
              <div className="space-y-6">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                            <ActivityIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {activity.title}
                            </h3>
                            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 ml-1" />
                                {activity.time}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 ml-1" />
                                {activity.participants} مشارك
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Language Support */}
          {activeTab === 'languages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                الدعم متعدد اللغات
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {languageSupport.map((language, index) => (
                  <motion.div
                    key={language.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                  >
                    <div className="text-4xl mb-3">{language.flag}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {language.name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <Users className="inline-block ml-1 w-4 h-4" />
                      {language.users} مستخدم
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                <Languages className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ترجمة فورية ذكية
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  تقنية الذكاء الاصطناعي المتقدمة تضمن ترجمة دقيقة وفورية لجميع المحادثات، 
                  مما يكسر حواجز اللغة ويربط العالم في مجتمع تعليمي واحد.
                </p>
              </div>
            </motion.div>
          )}

          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                منصة تواصل متطورة للشبكة العالمية
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-8">
                  منصة شاملة تجمع جميع أدوات التواصل والتعاون في مكان واحد، مع دعم متعدد اللغات 
                  وتقنيات متقدمة لضمان تواصل فعال عبر الحدود الجغرافية والثقافية.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      سرعة فائقة
                    </h3>
                    <p className="text-gray-600">
                      تواصل فوري مع زمن استجابة أقل من ثانية واحدة
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      تغطية عالمية
                    </h3>
                    <p className="text-gray-600">
                      شبكة موزعة تضمن الوصول من أي مكان في العالم
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      تخصيص كامل
                    </h3>
                    <p className="text-gray-600">
                      واجهات قابلة للتخصيص حسب احتياجات كل مستخدم
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
