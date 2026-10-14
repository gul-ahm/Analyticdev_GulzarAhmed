'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Github, Linkedin, Twitter, Globe, Link as LinkIcon, Facebook, Instagram } from 'lucide-react';

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    isActive: boolean;
    displayOrder: number;
}

const AVAILABLE_ICONS = [
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'globe', label: 'Website', icon: Globe },
    { value: 'other', label: 'Other', icon: LinkIcon },
];

export default function SocialsPage() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newLink, setNewLink] = useState({ platform: '', url: '', icon: 'globe', displayOrder: 0 });

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setError(null);
            const res = await fetch('/api/admin/socials');
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Failed to fetch links (${res.status})`);
            }
            const data = await res.json();
            setLinks(data);
        } catch (error: any) {
            console.error('Failed to fetch links:', error);
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/socials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLink),
            });
            if (res.ok) {
                setIsAdding(false);
                setNewLink({ platform: '', url: '', icon: 'globe', displayOrder: 0 });
                fetchLinks();
            }
        } catch (error) {
            console.error('Failed to add link:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        try {
            const res = await fetch(`/api/admin/socials/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLinks(links.filter(l => l.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete link:', error);
        }
    };

    const toggleActive = async (link: SocialLink) => {
        try {
            const res = await fetch(`/api/admin/socials/${link.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !link.isActive }),
            });
            if (res.ok) {
                setLinks(links.map(l => l.id === link.id ? { ...l, isActive: !l.isActive } : l));
            }
        } catch (error) {
            console.error('Failed to toggle active:', error);
        }
    };

    const getIconComponent = (iconName: string) => {
        const found = AVAILABLE_ICONS.find(i => i.value === iconName);
        const Icon = found ? found.icon : LinkIcon;
        return <Icon size={20} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Social Links (Footer)</h1>
                    <p className="text-slate-500">Manage social media links displayed in the footer.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                                                <div>
                            <p className="font-semibold">Error loading social links</p>
                            <p className="text-sm">{error}</p>
                            <p className="text-xs mt-1 text-red-500">Check if the database migration (003) was run and .env is correct.</p>
                        </div>
                        <button onClick={fetchLinks} className="ml-auto text-sm underline hover:no-underline">Retry</button>
                    </div>
                )}
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <Plus size={20} /> Add New Link
                </button>
            </div>

            {/* Add New Form */}
            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAddLink} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Platform Name</label>
                            <input
                                type="text"
                                required
                                value={newLink.platform}
                                onChange={e => setNewLink({ ...newLink, platform: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                                placeholder="e.g. GitHub"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">URL</label>
                            <input
                                type="url"
                                required
                                value={newLink.url}
                                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Icon</label>
                            <select
                                value={newLink.icon}
                                onChange={e => setNewLink({ ...newLink, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                            >
                                {AVAILABLE_ICONS.map(icon => (
                                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Display Order</label>
                            <input
                                type="number"
                                value={newLink.displayOrder}
                                onChange={e => setNewLink({ ...newLink, displayOrder: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-slate-700"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save Link
                        </button>
                    </form>
                </div>
            )}

            {/* Links List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                        ) : links.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No social links found.</td></tr>
                        ) : (
                            links.map((link) => (
                                <tr key={link.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 text-slate-500">{link.displayOrder}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                {getIconComponent(link.icon)}
                                            </div>
                                            <span className="font-medium text-slate-900">{link.platform}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{link.url}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActive(link)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${link.isActive
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}
                                        >
                                            {link.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
