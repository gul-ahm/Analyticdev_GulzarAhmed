'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function EditJob({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salaryRange: '',
        isOpen: true,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { id } = use(params);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`);
            const data = await res.json();
            if (data.success) {
                setFormData({
                    title: data.data.title,
                    location: data.data.location,
                    type: data.data.type,
                    description: data.data.description,
                    requirements: data.data.requirements.join('\n'),
                    salaryRange: data.data.salaryRange || '',
                    isOpen: data.data.isOpen,
                });
            } else {
                setError('Job not found');
            }
        } catch (err) {
            setError('Failed to fetch job');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const requirementsArray = formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean);

            const payload = {
                ...formData,
                requirements: requirementsArray,
            };

            const res = await fetch(`/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push('/admin/careers');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Job</h1>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border">
                {/* Same fields as New Job */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
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
                            Location
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Employment Type
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700 bg-white"
                            value={formData.type}
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value })
                            }
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salary Range (Optional)
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                            value={formData.salaryRange}
                            onChange={(e) =>
                                setFormData({ ...formData, salaryRange: e.target.value })
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
                        Requirements (One per line)
                    </label>
                    <textarea
                        rows={5}
                        className="w-full px-3 py-2 border rounded-md focus:ring-slate-700 focus:border-slate-700"
                        value={formData.requirements}
                        onChange={(e) =>
                            setFormData({ ...formData, requirements: e.target.value })
                        }
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isOpen"
                        className="h-4 w-4 text-slate-900 focus:ring-slate-700 border-gray-300 rounded"
                        checked={formData.isOpen}
                        onChange={(e) =>
                            setFormData({ ...formData, isOpen: e.target.checked })
                        }
                    />
                    <label htmlFor="isOpen" className="ml-2 block text-sm text-gray-900">
                        Open for applications
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
