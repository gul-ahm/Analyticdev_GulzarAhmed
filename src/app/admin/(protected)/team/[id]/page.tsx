'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        headline: '',
        quote: '',
        bio: '',
        image: '',
        order: 0,
        linkedin: '',
        twitter: '',
        github: '',
    });
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { id } = use(params);

    useEffect(() => {
        fetchMember();
    }, [id]);

    const fetchMember = async () => {
        try {
            const res = await fetch(`/api/team/${id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    name: data.data.name || '',
                    role: data.data.role || '',
                    headline: data.data.headline || '',
                    quote: data.data.quote || '',
                    bio: data.data.bio || '',
                    image: data.data.image || '',
                    order: data.data.displayOrder || 0,
                    linkedin: data.data.socialLinks?.linkedin || '',
                    twitter: data.data.socialLinks?.twitter || '',
                    github: data.data.socialLinks?.github || '',
                });
            } else {
                setError('Member not found');
            }
        } catch (err) {
            setError('Failed to fetch member');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = {
                name: formData.name,
                role: formData.role,
                headline: formData.headline,
                quote: formData.quote,
                bio: formData.bio,
                image: formData.image,
                order: Number(formData.order),
                socialLinks: {
                    linkedin: formData.linkedin,
                    twitter: formData.twitter,
                    github: formData.github,
                },
            };

            const res = await fetch(`/api/team/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/team');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Team Member</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
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
                            Role
                        </label>
                        <input
                            type="text"
                            required
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
                        Section Headline (Optional)
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        placeholder="e.g. Vision & Leadership"
                        value={formData.headline}
                        onChange={(e) =>
                            setFormData({ ...formData, headline: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quote (Optional)
                    </label>
                    <textarea
                        rows={2}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        placeholder='"Innovation distinguishes between a leader and a follower."'
                        value={formData.quote}
                        onChange={(e) =>
                            setFormData({ ...formData, quote: e.target.value })
                        }
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                    </label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                        }
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Media (Image or Video)
                        </label>
                        <div className="flex flex-col gap-2">
                            {formData.image && (
                                <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-2 border">
                                    {formData.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video src={formData.image} className="w-full h-full object-cover" controls />
                                    ) : (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                                        title="Remove media"
                                    >
                                        X
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 text-sm"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (file.size > 30 * 1024 * 1024) {
                                        alert('File size too large. Max 30MB allowed.');
                                        return;
                                    }

                                    const uploadData = new FormData();
                                    uploadData.append('file', file);

                                    setUploading(true);
                                    try {
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: uploadData,
                                        });
                                        const data = await res.json();

                                        if (data.success) {
                                            setFormData(prev => ({ ...prev, image: data.url }));
                                        } else {
                                            alert('Upload failed: ' + data.error);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Upload failed. Please try again.');
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500">Supported: Images, Videos (MP4/WebM). Max 30MB.</p>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="/uploads/your-file.png"
                                className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 text-sm font-mono"
                            />
                            {uploading && <p className="text-xs text-slate-600">Uploading. Wait for the preview before saving.</p>}
                        </div>
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

                <h3 className="text-lg font-medium text-gray-900 border-t pt-6 mt-6 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.linkedin}
                            onChange={(e) =>
                                setFormData({ ...formData, linkedin: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Twitter/X URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.twitter}
                            onChange={(e) =>
                                setFormData({ ...formData, twitter: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.github}
                            onChange={(e) =>
                                setFormData({ ...formData, github: e.target.value })
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
                        disabled={saving || uploading}
                        className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700 disabled:opacity-50"
                    >
                        {uploading ? 'Uploading image...' : saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
