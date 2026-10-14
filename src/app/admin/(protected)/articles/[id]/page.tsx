'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ArticleForm, { ArticleFormValues, EMPTY_ARTICLE } from '../ArticleForm';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [values, setValues] = useState<ArticleFormValues | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`/api/articles/${id}`);
                const data = await res.json();
                if (cancelled) return;
                if (!res.ok || !data.success) {
                    setError(data.error || 'Could not load that article');
                    return;
                }
                const a = data.data;
                setValues({
                    ...EMPTY_ARTICLE,
                    title: a.title || '',
                    slug: a.slug || '',
                    excerpt: a.excerpt || '',
                    content: a.content || '',
                    coverImage: a.coverImage || '',
                    coverAlt: a.coverAlt || '',
                    category: a.category || '',
                    tags: Array.isArray(a.tags) ? a.tags.join(', ') : '',
                    takeaways: a.takeaways?.length ? a.takeaways : [''],
                    faq: a.faq?.length ? a.faq : [{ question: '', answer: '' }],
                    seoTitle: a.seoTitle || '',
                    seoDescription: a.seoDescription || '',
                    status: a.status === 'published' ? 'published' : 'draft'
                });
            } catch {
                if (!cancelled) setError('Could not load that article');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    if (error) {
        return (
            <div className="py-20 text-center">
                <p className="text-sm text-gray-600">{error}</p>
                <Link href="/admin/articles" className="mt-4 inline-block text-sm font-medium text-slate-900 underline">
                    Back to articles
                </Link>
            </div>
        );
    }

    if (!values) return <div className="py-20 text-center text-sm text-gray-500">Loading</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit article</h1>
            <p className="text-sm text-gray-600 mb-8">
                Currently {values.status}. Publishing keeps the original publish date and updates
                the modified date, which is what search engines read.
            </p>
            <ArticleForm initial={values} articleId={parseInt(id, 10)} />
        </div>
    );
}
