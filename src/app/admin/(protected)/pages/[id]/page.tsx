'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import DynamicContentForm from '@/components/admin/DynamicContentForm';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: {} as any,
        metaTitle: '',
        metaDescription: '',
        published: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { id } = use(params);

    useEffect(() => {
        fetchPage();
    }, [id]);

    const fetchPage = async () => {
        try {
            const res = await fetch(`/api/pages/${id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    title: data.data.title,
                    slug: data.data.slug,
                    content: data.data.content || {},
                    metaTitle: data.data.metaTitle || '',
                    metaDescription: data.data.metaDescription || '',
                    published: data.data.published,
                });
            } else {
                setError('Page not found');
            }
        } catch (err) {
            setError('Failed to fetch page');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            alert('Page updated successfully');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Page: {formData.title}</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border">

                {/* Meta & Slug Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
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
                            Slug (URL Path)
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 bg-gray-100 text-gray-500 cursor-not-allowed"
                            value={formData.slug}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Title (SEO)
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
                            Meta Description (SEO)
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.metaDescription}
                            onChange={(e) =>
                                setFormData({ ...formData, metaDescription: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Dynamic Content Editor */}
                <div>
                    <DynamicContentForm
                        content={formData.content}
                        onChange={(newContent) => setFormData({ ...formData, content: newContent })}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="published"
                        className="h-4 w-4 text-slate-900 focus:ring-slate-700 border-gray-300 rounded"
                        checked={formData.published}
                        onChange={(e) =>
                            setFormData({ ...formData, published: e.target.checked })
                        }
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        Publish Page
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-4 hover:bg-gray-200"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50 font-medium"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
