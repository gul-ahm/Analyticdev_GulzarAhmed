'use client';

import { useEffect, useState } from 'react';
import { Trash2, Mail } from 'lucide-react';

interface Submission {
    id: number;
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function AdminContact() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/contact');
            const data = await res.json();
            if (data.success) {
                setSubmissions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSubmission = async (id: number) => {
        if (!confirm('Delete this submission?')) return;
        try {
            const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSubmissions(submissions.filter((s) => s.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete submission', error);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Read' })
            });
            if (res.ok) {
                setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'Read' } : s));
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((sub) => (
                            <tr key={sub.id} className={sub.status === 'New' ? 'bg-slate-100' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div>{sub.name}</div>
                                    <div className="text-gray-500 font-normal">{sub.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                    <div className="font-semibold mb-1">{sub.subject}</div>
                                    <div className="truncate">{sub.message}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'New' ? 'bg-slate-200 text-slate-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {sub.status === 'New' && (
                                        <button onClick={() => markAsRead(sub.id)} className="text-slate-900 hover:text-slate-900 mr-4 inline-block" title="Mark as Read">
                                            <Mail size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => deleteSubmission(sub.id)} className="text-red-600 hover:text-red-900 inline-block">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {submissions.length === 0 && <div className="p-8 text-center text-gray-500">No submissions yet.</div>}
            </div>
        </div>
    );
}
