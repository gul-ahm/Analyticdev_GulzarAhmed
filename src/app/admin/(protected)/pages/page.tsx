'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';

interface Page {
    id: number;
    title: string;
    slug: string;
    isActive: boolean;
    updatedAt: string;
}

export default function AdminPages() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/pages');
            const data = await res.json();
            if (data.success) {
                setPages(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch pages', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePage = async (id: number) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPages(pages.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete page', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                <Link
                    href="/admin/pages/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-700"
                >
                    + New Page
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page) => (
                            <tr key={page.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {page.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    /{page.slug}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${page.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {page.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/admin/pages/${page.id}`}
                                        className="text-slate-900 hover:text-slate-900 mr-4 inline-block"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deletePage(page.id)}
                                        className="text-red-600 hover:text-red-900 inline-block"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pages.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No pages found.</div>
                )}
            </div>
        </div>
    );
}
