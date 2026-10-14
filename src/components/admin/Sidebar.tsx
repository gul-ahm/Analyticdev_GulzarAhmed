'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Users,
    Wrench,
    Star,
    BriefcaseBusiness,
    Mail,
    Settings,
    X,
    Share2,
    Newspaper,
    LogOut
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Articles', href: '/admin/articles', icon: Newspaper },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Careers', href: '/admin/careers', icon: BriefcaseBusiness },
    { name: 'Contact', href: '/admin/contact-submissions', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-6 bg-slate-950">
                    <span className="text-xl font-bold tracking-tight text-slate-400">
                        Analytics Dev
                    </span>
                    <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                    ? 'bg-slate-900 text-white'
                                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={`mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                        }`}
                                />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <Link
                    href="/admin/socials"
                    onClick={() => onClose()}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        pathname.startsWith("/admin/socials")
                            ? "bg-slate-900 text-white"
                            : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <Share2 size={20} className={cn(
                        "flex-shrink-0",
                        pathname.startsWith("/admin/socials") ? "text-white" : "text-gray-400 group-hover:text-white"
                    )} />
                    <span>Socials (Footer)</span>
                </Link>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Admin User</p>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                        >
                            <LogOut size={20} className="text-red-400" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
