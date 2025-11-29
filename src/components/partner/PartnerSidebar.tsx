'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, DollarSign, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
    { name: 'لوحة التحكم', href: '/partner', icon: LayoutDashboard },
    { name: 'الإيرادات', href: '/partner/revenue', icon: DollarSign },
    { name: 'الإعدادات', href: '/partner/settings', icon: Settings },
];

export default function PartnerSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-white border-l border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-xl font-bold text-primary-600">بوابة الشركاء</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${isActive
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                }`}
                        >
                            <item.icon
                                className={`ml-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                                    }`}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                    <LogOut
                        className="ml-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500"
                        aria-hidden="true"
                    />
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );
}
