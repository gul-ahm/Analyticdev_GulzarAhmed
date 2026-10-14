'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

export default function NewReview() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        content: '',
        rating: 5,
        image: '',
        featured: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/reviews');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Client Review</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                        </label>
                        <div className="flex gap-1 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={` focus:outline-none ${star <= formData.rating ? 'text-amber-500' : 'text-slate-300'
                                        }`}
                                >
                                    <Star className="w-6 h-6" fill="currentColor" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.company}
                            onChange={(e) =>
                                setFormData({ ...formData, company: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role (e.g. CEO)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Content
                    </label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Image
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                        {formData.image ? (
                            <div className="relative h-20 w-20 rounded-full overflow-hidden border border-gray-200 group">
                                <img
                                    src={formData.image}
                                    alt="Client Preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: '' })}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                >
                                    <span className="text-xs">Remove</span>
                                </button>
                            </div>
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                                <span className="text-xs">No Image</span>
                            </div>
                        )}

                        <div className="flex-1">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (file.size > 25 * 1024 * 1024) {
                                        setError('File too large. Max 25MB.');
                                        return;
                                    }

                                    setUploading(true);
                                    setError('');

                                    const uploadData = new FormData();
                                    uploadData.append('file', file);

                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: uploadData,
                                        });
                                        const data = await res.json();

                                        if (data.success) {
                                            setFormData({ ...formData, image: data.url });
                                        } else {
                                            setError(data.error || 'Upload failed');
                                        }
                                    } catch (err) {
                                        setError('Upload failed');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </label>
                            <p className="mt-2 text-xs text-gray-500">
                                JPG, PNG, GIF up to 25MB
                            </p>
                        </div>
                    </div>
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
                        Featured (Visible on Home)
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
                        {loading ? 'Creating...' : 'Create Review'}
                    </button>
                </div>
            </form>
        </div>
    );
}
