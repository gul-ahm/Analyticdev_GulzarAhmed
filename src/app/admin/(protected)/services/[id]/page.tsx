'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditService({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        icon: '',
        features: '',
        order: 0,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { id } = use(params);

    useEffect(() => {
        fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/services/${id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    title: data.data.title,
                    slug: data.data.slug,
                    description: data.data.description,
                    icon: data.data.icon || '',
                    features: data.data.features.join('\n'),
                    order: data.data.order || 0,
                });
            } else {
                setError('Service not found');
            }
        } catch (err) {
            setError('Failed to fetch service');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const featuresArray = formData.features.split('\n').map((f) => f.trim()).filter(Boolean);

            const payload = {
                ...formData,
                features: featuresArray,
                order: Number(formData.order),
            };

            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/services');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Service</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (One per line)
                    </label>
                    <textarea
                        rows={5}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.features}
                        onChange={(e) =>
                            setFormData({ ...formData, features: e.target.value })
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Icon Name (Lucide React)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.icon}
                            onChange={(e) =>
                                setFormData({ ...formData, icon: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.order}
                            onChange={(e) =>
                                setFormData({ ...formData, order: Number(e.target.value) })
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-4 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
