'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

type Row = {
    id: number;
    title: string;
    slug: string;
    category?: string;
    status: 'draft' | 'published';
    publishedAt?: string | null;
    updatedAt?: string | null;
};

export default function AdminArticlesPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            const res = await fetch('/api/articles');
            const data = await res.json();
            if (data.success) setRows(data.data);
            else setError(data.error || 'Could not load articles');
        } catch {
            setError('Could not load articles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const remove = async (id: number, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
        if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
        else setError('Could not delete that article');
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Drafts stay private. The public Blog link appears only once something is published.
                    </p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-700"
                >
                    + Write an article
                </Link>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">{error}</div>}

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Published</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    Loading
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    No articles yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{row.title}</p>
                                        <p className="font-mono text-xs text-gray-400">/blog/{row.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={
                                                row.status === 'published'
                                                    ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'
                                                    : 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'
                                            }
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {row.publishedAt
                                            ? new Date(row.publishedAt).toLocaleDateString('en-GB')
                                            : 'Not yet'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            {row.status === 'published' && (
                                                <a
                                                    href={`/blog/${row.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-gray-400 hover:text-slate-900"
                                                    aria-label="View on the site"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/articles/${row.id}`}
                                                className="text-gray-400 hover:text-slate-900"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => remove(row.id, row.title)}
                                                className="text-gray-400 hover:text-red-600"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
