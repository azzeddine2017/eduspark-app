'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Users, 
  Globe, 
  Briefcase, 
  MapPin, 
  Star,
  TrendingUp,
  Award,
  Clock,
  Target,
  UserPlus,
  Search,
  Filter,
  ChevronRight,
  Badge,
  Zap
} from 'lucide-react';

export default function RolesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const roleCategories = [
    { id: 'all', name: 'جميع الأدوار', count: 275, color: 'bg-gray-500' },
    { id: 'global', name: 'أدوار عالمية', count: 10, color: 'bg-purple-500' },
    { id: 'regional', name: 'أدوار إقليمية', count: 25, color: 'bg-blue-500' },
    { id: 'functional', name: 'أدوار وظيفية', count: 40, color: 'bg-green-500' },
    { id: 'local', name: 'أدوار محلية', count: 200, color: 'bg-orange-500' }
  ];

  const featuredRoles = [
    {
      id: 1,
      title: 'رئيس المجلس العالمي',
      category: 'global',
      level: 'قيادي',
      duration: '3 سنوات',
      requirements: 'خبرة قيادية 10+ سنوات',
      description: 'قيادة الرؤية الاستراتيجية للشبكة العالمية',
      applicants: 12,
      status: 'مفتوح للترشيح',
      deadline: '2025-02-15',
      icon: Crown,
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      title: 'مدير التقنية العالمي',
      category: 'functional',
      level: 'تخصصي',
      duration: '2 سنة',
      requirements: 'خبرة تقنية 8+ سنوات',
      description: 'تطوير وإدارة البنية التقنية العالمية',
      applicants: 8,
      status: 'قيد التقييم',
      deadline: '2025-01-30',
      icon: Zap,
      color: 'from-green-600 to-blue-600'
    },
    {
      id: 3,
      title: 'منسق الجمعية العربية',
      category: 'regional',
      level: 'تنسيقي',
      duration: '2 سنة',
      requirements: 'خبرة إدارية 7+ سنوات',
      description: 'تنسيق العمل بين العقد في المنطقة العربية',
      applicants: 15,
      status: 'مفتوح للترشيح',
      deadline: '2025-02-01',
      icon: MapPin,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 4,
      title: 'مدير عقدة محلية - الرياض',
      category: 'local',
      level: 'إداري',
      duration: '1-2 سنة',
      requirements: 'خبرة أعمال 3+ سنوات',
      description: 'إدارة العقدة المحلية وتحقيق الأهداف',
      applicants: 6,
      status: 'مفتوح للترشيح',
      deadline: '2025-01-25',
      icon: Briefcase,
      color: 'from-blue-600 to-purple-600'
    }
  ];

  const roleStats = [
    { label: 'إجمالي الأدوار', value: '275', icon: Briefcase, color: 'text-blue-600' },
    { label: 'الأدوار المتاحة', value: '23', icon: UserPlus, color: 'text-green-600' },
    { label: 'المرشحون النشطون', value: '156', icon: Users, color: 'text-purple-600' },
    { label: 'معدل النجاح', value: '89%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const developmentPrograms = [
    {
      title: 'برنامج القيادة الموزعة',
      duration: '6 أشهر',
      participants: 45,
      description: 'تطوير مهارات القيادة في البيئة الموزعة'
    },
    {
      title: 'التطوير التقني المتقدم',
      duration: '4 أشهر',
      participants: 32,
      description: 'دورات في أحدث التقنيات والأدوات'
    },
    {
      title: 'مهارات التواصل متعدد الثقافات',
      duration: '3 أشهر',
      participants: 67,
      description: 'تطوير مهارات التواصل عبر الثقافات'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'مفتوح للترشيح':
        return 'bg-green-100 text-green-800';
      case 'قيد التقييم':
        return 'bg-yellow-100 text-yellow-800';
      case 'مغلق':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'قيادي':
        return 'bg-purple-100 text-purple-800';
      case 'تخصصي':
        return 'bg-blue-100 text-blue-800';
      case 'تنسيقي':
        return 'bg-green-100 text-green-800';
      case 'إداري':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRoles = featuredRoles.filter(role => {
    const matchesCategory = selectedCategory === 'all' || role.category === selectedCategory;
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              إدارة الأدوار
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}الموزعة
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اكتشف الفرص المتاحة وطور مسارك المهني في شبكة فتح العالمية
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {roleStats.map((stat, index) => (
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

      {/* Search and Filter */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن الأدوار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {roleCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                    <span className="mr-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                      {category.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Roles */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            الأدوار المميزة
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredRoles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-r ${role.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(role.status)}`}>
                      {role.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {role.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(role.level)}`}>
                    {role.level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <Clock className="inline-block ml-1 w-4 h-4" />
                    {role.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <Users className="inline-block ml-1 w-4 h-4" />
                    {role.applicants} مرشح
                  </div>
                  <div className="text-sm text-gray-500">
                    ينتهي: {role.deadline}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  تقدم للدور
                  <ChevronRight className="inline-block mr-2 w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Programs */}
      <section className="px-4 mb-16 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              برامج التطوير المهني
            </h2>
            <p className="text-xl text-gray-600">
              استثمر في مستقبلك المهني مع برامج التطوير المتخصصة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {developmentPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {program.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    <Clock className="inline-block ml-1 w-4 h-4" />
                    {program.duration}
                  </span>
                  <span>
                    <Users className="inline-block ml-1 w-4 h-4" />
                    {program.participants} مشارك
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  انضم للبرنامج
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ابدأ رحلتك المهنية معنا
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              انضم لشبكة من المحترفين المتميزين وساهم في بناء مستقبل التعليم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <UserPlus className="inline-block ml-2 w-5 h-5" />
                تقدم لدور جديد
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                استكشف البرامج التدريبية
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
