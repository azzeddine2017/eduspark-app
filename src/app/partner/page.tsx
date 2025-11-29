'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, BookOpen, Activity } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

interface PartnerStats {
    nodeName: string;
    region: string;
    totalStudents: number;
    totalRevenue: number;
    activeCourses: number;
    currency: string;
}

export default function PartnerDashboard() {
    const [stats, setStats] = useState<PartnerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/partner/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex h-full items-center justify-center">جاري التحميل...</div>;
    }

    if (error) {
        return <div className="text-red-500">حدث خطأ: {error}</div>;
    }

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    لوحة تحكم الشريك - {stats.nodeName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    نظرة عامة على أداء عقدتك في {stats.region}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="إجمالي الطلاب"
                    value={stats.totalStudents}
                    icon={<Users className="h-6 w-6 text-blue-600" />}
                    change={12}
                    color="info"
                />
                <StatCard
                    title="إجمالي الإيرادات"
                    value={`${stats.totalRevenue} ${stats.currency}`}
                    icon={<DollarSign className="h-6 w-6 text-green-600" />}
                    change={8}
                    color="success"
                />
                <StatCard
                    title="الدورات النشطة"
                    value={stats.activeCourses}
                    icon={<BookOpen className="h-6 w-6 text-purple-600" />}
                    color="primary"
                />
                <StatCard
                    title="معدل النشاط"
                    value="95%"
                    icon={<Activity className="h-6 w-6 text-orange-600" />}
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">نمو الإيرادات</h3>
                    <div className="flex h-64 items-center justify-center text-gray-400">
                        مخطط بياني للإيرادات (قريباً)
                    </div>
                </div>
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">توزيع الطلاب</h3>
                    <div className="flex h-64 items-center justify-center text-gray-400">
                        مخطط بياني للطلاب (قريباً)
                    </div>
                </div>
            </div>
        </div>
    );
}
