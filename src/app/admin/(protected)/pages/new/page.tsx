'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        isActive: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/pages');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Page</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Page Title
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
                        Content
                    </label>
                    <textarea
                        required
                        rows={10}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                    />
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                                value={formData.metaTitle}
                                onChange={(e) =>
                                    setFormData({ ...formData, metaTitle: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description
                            </label>
                            <textarea
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                                value={formData.metaDescription}
                                onChange={(e) =>
                                    setFormData({ ...formData, metaDescription: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        className="h-4 w-4 text-slate-900 focus:ring-slate-700 border-gray-300 rounded"
                        checked={formData.isActive}
                        onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                        }
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Publish Page
                    </label>
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
                        disabled={loading}
                        className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Page'}
                    </button>
                </div>
            </form>
        </div>
    );
}
