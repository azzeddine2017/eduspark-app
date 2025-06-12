'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Users, 
  Globe, 
  Shield, 
  Target, 
  MessageCircle,
  BarChart3,
  CheckCircle,
  Clock,
  UserCheck,
  Settings,
  Zap,
  Eye,
  Scale
} from 'lucide-react';

// تعريف الأنواع
interface Vote {
  id: number;
  title: string;
  description: string;
  type: string;
  deadline: string;
  votes: { yes: number; no: number; abstain: number };
  status: string;
  category: string;
}

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);

  const governanceStats = [
    { label: 'الأعضاء النشطون', value: '1,247', icon: Users, color: 'text-blue-600' },
    { label: 'القرارات المتخذة', value: '89', icon: Vote, color: 'text-green-600' },
    { label: 'معدل المشاركة', value: '87%', icon: BarChart3, color: 'text-purple-600' },
    { label: 'الشفافية', value: '100%', icon: Eye, color: 'text-orange-600' }
  ];

  const activeVotes = [
    {
      id: 1,
      title: 'اعتماد معايير جودة جديدة للمحتوى التعليمي',
      description: 'اقتراح لتحديث معايير الجودة لضمان أفضل تجربة تعليمية',
      type: 'qualified', // 60% required
      deadline: '2025-01-20',
      votes: { yes: 156, no: 23, abstain: 12 },
      status: 'active',
      category: 'جودة'
    },
    {
      id: 2,
      title: 'توسيع الشبكة لتشمل منطقة جنوب شرق آسيا',
      description: 'خطة استراتيجية لإضافة 10 عقد جديدة في المنطقة',
      type: 'super', // 75% required
      deadline: '2025-01-25',
      votes: { yes: 234, no: 45, abstain: 18 },
      status: 'active',
      category: 'توسع'
    },
    {
      id: 3,
      title: 'تحديث نموذج توزيع الأرباح للشركاء',
      description: 'اقتراح لتعديل النسب لتحفيز الأداء المتميز',
      type: 'consensus', // 90% required
      deadline: '2025-02-01',
      votes: { yes: 89, no: 156, abstain: 34 },
      status: 'active',
      category: 'مالي'
    }
  ];

  const recentDecisions = [
    {
      title: 'اعتماد منصة التواصل الجديدة',
      date: '2025-01-10',
      result: 'مُوافق عليه',
      votes: '92% موافقة',
      impact: 'تحسين التواصل بين جميع العقد'
    },
    {
      title: 'برنامج التدريب المتقدم للشركاء',
      date: '2025-01-05',
      result: 'مُوافق عليه',
      votes: '88% موافقة',
      impact: 'رفع مستوى الخدمات المقدمة'
    },
    {
      title: 'معايير الأمان الجديدة',
      date: '2024-12-28',
      result: 'مُوافق عليه',
      votes: '95% موافقة',
      impact: 'تعزيز حماية البيانات والخصوصية'
    }
  ];

  const governancePrinciples = [
    {
      icon: Scale,
      title: 'الديمقراطية',
      description: 'كل عضو له صوت متساوٍ في القرارات المهمة'
    },
    {
      icon: Eye,
      title: 'الشفافية',
      description: 'جميع القرارات والعمليات مفتوحة ومرئية للجميع'
    },
    {
      icon: Zap,
      title: 'الكفاءة',
      description: 'عمليات سريعة ومنظمة لاتخاذ القرارات'
    },
    {
      icon: Shield,
      title: 'العدالة',
      description: 'تمثيل متوازن لجميع المناطق والفئات'
    }
  ];

  const getVoteTypeInfo = (type: string) => {
    switch (type) {
      case 'simple':
        return { threshold: '50%+1', color: 'bg-green-100 text-green-800', label: 'تصويت بسيط' };
      case 'qualified':
        return { threshold: '60%', color: 'bg-blue-100 text-blue-800', label: 'تصويت مؤهل' };
      case 'super':
        return { threshold: '75%', color: 'bg-purple-100 text-purple-800', label: 'تصويت خاص' };
      case 'consensus':
        return { threshold: '90%', color: 'bg-orange-100 text-orange-800', label: 'إجماع' };
      default:
        return { threshold: '50%', color: 'bg-gray-100 text-gray-800', label: 'عادي' };
    }
  };

  const calculateVotePercentage = (votes: { yes: number; no: number; abstain: number }) => {
    const total = votes.yes + votes.no + votes.abstain;
    return total > 0 ? Math.round((votes.yes / total) * 100) : 0;
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
              نظام الحوكمة
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}الموزعة
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ديمقراطية حقيقية تمكن كل عضو من المشاركة في صنع مستقبل التعليم
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {governanceStats.map((stat, index) => (
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
              { id: 'votes', label: 'التصويتات النشطة', icon: Vote },
              { id: 'decisions', label: 'القرارات الأخيرة', icon: CheckCircle },
              { id: 'principles', label: 'المبادئ', icon: Target }
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
          {/* Active Votes */}
          {activeTab === 'votes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                التصويتات النشطة
              </h2>
              <div className="space-y-6">
                {activeVotes.map((vote) => {
                  const voteInfo = getVoteTypeInfo(vote.type);
                  const percentage = calculateVotePercentage(vote.votes);
                  
                  return (
                    <motion.div
                      key={vote.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${voteInfo.color}`}>
                              {voteInfo.label}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {vote.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {vote.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {vote.description}
                          </p>
                        </div>
                        <div className="lg:text-left text-center">
                          <div className="text-sm text-gray-500 mb-1">
                            ينتهي في: {vote.deadline}
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {percentage}% موافقة
                          </div>
                          <div className="text-sm text-gray-500">
                            المطلوب: {voteInfo.threshold}
                          </div>
                        </div>
                      </div>
                      
                      {/* Vote Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>موافق: {vote.votes.yes}</span>
                          <span>معارض: {vote.votes.no}</span>
                          <span>ممتنع: {vote.votes.abstain}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="inline-block ml-2 w-5 h-5" />
                          موافق
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                        >
                          معارض
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                          ممتنع
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recent Decisions */}
          {activeTab === 'decisions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                القرارات الأخيرة
              </h2>
              <div className="space-y-6">
                {recentDecisions.map((decision, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {decision.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {decision.impact}
                        </p>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 ml-1" />
                            {decision.date}
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="w-4 h-4 ml-1" />
                            {decision.votes}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0">
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                          {decision.result}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Governance Principles */}
          {activeTab === 'principles' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                مبادئ الحوكمة
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {governancePrinciples.map((principle, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <principle.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {principle.title}
                    </h3>
                    <p className="text-gray-600">
                      {principle.description}
                    </p>
                  </motion.div>
                ))}
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
                نظام حوكمة ديمقراطي وشفاف
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-8">
                  نظام الحوكمة الموزعة في منصة فتح يضمن مشاركة جميع الأعضاء في صنع القرارات المهمة. 
                  من خلال آليات التصويت المتدرجة والشفافية الكاملة، نبني مستقبل التعليم معاً.
                </p>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                  <Globe className="w-24 h-24 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    شبكة عالمية موحدة
                  </h3>
                  <p className="text-gray-600">
                    مجلس عالمي، جمعيات إقليمية، ودوائر وظيفية تعمل معاً لضمان أفضل القرارات
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
