'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface Achievement {
    id: number;
    title: string;
    value: string;
    suffix?: string;
    order: number;
}

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        suffix: '',
        order: 0,
    });

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await fetch('/api/achievements');
            const data = await res.json();
            if (data.success) {
                setAchievements(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch achievements', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAchievement = async (id: number) => {
        if (!confirm('Delete this achievement?')) return;
        try {
            await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
            setAchievements(achievements.filter((a) => a.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setAchievements([...achievements, data.data].sort((a, b) => a.order - b.order));
                setFormData({ title: '', value: '', suffix: '', order: 0 }); // Reset form
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-2">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h1>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {achievements.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.value}{item.suffix}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteAchievement(item.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {achievements.length === 0 && <div className="p-8 text-center text-gray-500">No achievements yet.</div>}
                </div>
            </div>

            {/* Add Form */}
            <div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Add Achievement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border rounded-md"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Happy Clients"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder="e.g. 50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.suffix}
                                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                                    placeholder="e.g. +"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-md"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
                        >
                            Add Achievement
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
