'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiStringInput from '@/components/admin/MultiStringInput';

export default function NewProject() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        client: '',
        // Duplicate properties removed

        liveUrl: '',
        tags: '', // Comma separated string for input
        images: [] as string[], // Changed from string to string[]
        svg_icons: [] as string[],
        featured: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Process tags
            const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            // Images are already an array

            const payload = {
                ...formData,
                tags: tagsArray,
            };

            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/projects');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.title}
                            onChange={(e) => {
                                const title = e.target.value;
                                // Auto-generate slug
                                const slug = title
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
                                    .replace(/^-+|-+$/g, ''); // Trim hyphens

                                setFormData({ ...formData, title, slug });
                            }}
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
                        Short Description
                    </label>
                    <textarea
                        required
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Case Study Content (Markdown/HTML)
                    </label>
                    <textarea
                        rows={10}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 font-mono text-sm"
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="# Case Study Title\n\nWrite your detailed case study here..."
                    />
                </div>

                <div>
                    <MultiStringInput
                        label="SVG Icons"
                        description="Add one or more raw SVG codes. They will form a carousel in the public page hero section."
                        value={formData.svg_icons}
                        onChange={(newSvgs) => setFormData({ ...formData, svg_icons: newSvgs })}
                        placeholder="<svg>...</svg>"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.client}
                            onChange={(e) =>
                                setFormData({ ...formData, client: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Live URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.liveUrl}
                            onChange={(e) =>
                                setFormData({ ...formData, liveUrl: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tech Stack (Comma separated)
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.tags}
                        onChange={(e) =>
                            setFormData({ ...formData, tags: e.target.value })
                        }
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Images
                    </label>
                    <ImageUpload
                        value={formData.images}
                        onChange={(newImages) => setFormData({ ...formData, images: newImages })}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        className="h-4 w-4 text-slate-900 focus:ring-slate-700 border-gray-300 rounded"
                        checked={formData.featured}
                        onChange={(e) =>
                            setFormData({ ...formData, featured: e.target.checked })
                        }
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Featured Project
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
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
}
