'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Menu } from 'lucide-react';

export default function AdminSidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
                    <span className="text-lg font-semibold text-gray-800">Admin</span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
