'use client';

import { useEffect, useState } from 'react';

interface NodeSetting {
    id: string;
    settingKey: string;
    settingValue: string;
}

export default function PartnerSettingsPage() {
    const [settings, setSettings] = useState<NodeSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch('/api/partner/settings');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const updates = [];

            for (const [key, value] of formData.entries()) {
                updates.push({ key, value });
            }

            const response = await fetch('/api/partner/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings: updates })
            });

            if (response.ok) {
                alert('تم حفظ الإعدادات بنجاح');
            } else {
                alert('فشل حفظ الإعدادات');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إعدادات العقدة</h1>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Example Settings - In a real app, these would be dynamic based on available settings */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">اسم العقدة المعروض</label>
                        <input
                            type="text"
                            name="displayName"
                            defaultValue={settings.find(s => s.settingKey === 'displayName')?.settingValue || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">رسالة الترحيب</label>
                        <textarea
                            name="welcomeMessage"
                            defaultValue={settings.find(s => s.settingKey === 'welcomeMessage')?.settingValue || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
