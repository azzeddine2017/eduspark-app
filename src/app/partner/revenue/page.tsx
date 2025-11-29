'use client';

import { useEffect, useState } from 'react';

interface RevenueRecord {
    id: string;
    amount: number;
    currency: string;
    transactionDate: string;
    description: string;
    netAmount: number;
}

export default function PartnerRevenuePage() {
    const [revenueHistory, setRevenueHistory] = useState<RevenueRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRevenue() {
            try {
                const response = await fetch('/api/partner/revenue');
                if (response.ok) {
                    const data = await response.json();
                    setRevenueHistory(data.revenueHistory);
                }
            } catch (error) {
                console.error('Error fetching revenue:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRevenue();
    }, []);

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">تقارير الإيرادات</h1>

            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">التاريخ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">الوصف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">المبلغ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">الصافي</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {revenueHistory.map((record) => (
                            <tr key={record.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                    {new Date(record.transactionDate).toLocaleDateString('ar-EG')}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{record.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                    {Number(record.amount).toFixed(2)} {record.currency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                                    {Number(record.netAmount).toFixed(2)} {record.currency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
