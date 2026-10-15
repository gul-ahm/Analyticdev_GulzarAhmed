'use client';

// Shared editor for a new or an existing article. Everything an article needs
// for search and for answer engines is on this one form: the body, the short
// answer lines, the questions, and the title and description search results use.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

export type ArticleFormValues = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    coverAlt: string;
    category: string;
    tags: string;
    takeaways: string[];
    faq: { question: string; answer: string }[];
    seoTitle: string;
    seoDescription: string;
    status: 'draft' | 'published';
};

export const EMPTY_ARTICLE: ArticleFormValues = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverAlt: '',
    category: '',
    tags: '',
    takeaways: [''],
    faq: [{ question: '', answer: '' }],
    seoTitle: '',
    seoDescription: '',
    status: 'draft'
};

const input =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-slate-700 focus:border-slate-700 text-sm';
const label = 'block text-sm font-medium text-gray-700 mb-1';

export default function ArticleForm({
    initial,
    articleId
}: {
    initial: ArticleFormValues;
    articleId?: number;
}) {
    const router = useRouter();
    const [form, setForm] = useState<ArticleFormValues>(initial);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const set = <K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const save = async (status: 'draft' | 'published') => {
        setSaving(true);
        setError('');

        const payload = {
            title: form.title,
            slug: form.slug || undefined,
            excerpt: form.excerpt,
            content: form.content,
            coverImage: form.coverImage,
            coverAlt: form.coverAlt,
            category: form.category,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            takeaways: form.takeaways.map((t) => t.trim()).filter(Boolean),
            faq: form.faq.filter((f) => f.question.trim() && f.answer.trim()),
            seoTitle: form.seoTitle,
            seoDescription: form.seoDescription,
            status
        };

        try {
            const res = await fetch(articleId ? `/api/articles/${articleId}` : '/api/articles', {
                method: articleId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');
            router.push('/admin/articles');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const upload = async (file: File) => {
        if (file.size > 30 * 1024 * 1024) {
            setError('That file is over 30MB.');
            return;
        }
        const body = new FormData();
        body.append('file', file);
        setUploading(true);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (data.success) {
                setError('');
                set('coverImage', data.url);
            } else {
                setError(data.error || 'The upload did not go through.');
            }
        } catch {
            setError('The upload did not go through.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                save(form.status);
            }}
            className="space-y-8 max-w-4xl"
        >
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">{error}</div>}

            <section className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="font-semibold text-gray-900">The article</h2>

                <div>
                    <label className={label}>Title</label>
                    <input
                        type="text"
                        required
                        className={input}
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="What a website should actually cost"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Slug (leave blank to build it from the title)</label>
                        <input
                            type="text"
                            className={`${input} font-mono`}
                            value={form.slug}
                            onChange={(e) => set('slug', e.target.value)}
                            placeholder="what-a-website-should-cost"
                        />
                    </div>
                    <div>
                        <label className={label}>Category</label>
                        <input
                            type="text"
                            className={input}
                            value={form.category}
                            onChange={(e) => set('category', e.target.value)}
                            placeholder="Pricing"
                        />
                    </div>
                </div>

                <div>
                    <label className={label}>
                        Summary. This is the description Google shows, so keep it under 160 characters
                    </label>
                    <textarea
                        rows={2}
                        className={input}
                        value={form.excerpt}
                        onChange={(e) => set('excerpt', e.target.value)}
                        placeholder="One or two sentences that answer the question in the title."
                    />
                    <p className="text-xs text-gray-500 mt-1">{form.excerpt.length} characters</p>
                </div>

                <div>
                    <label className={label}>Body, written in Markdown</label>
                    <textarea
                        rows={22}
                        className={`${input} font-mono leading-relaxed`}
                        value={form.content}
                        onChange={(e) => set('content', e.target.value)}
                        placeholder={'## A heading\n\nA paragraph.\n\n- A list item\n\n[A link](https://example.com)'}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Use ## for sections and ### for subsections. They become the contents list
                        on the page.
                    </p>
                </div>
            </section>

            <section className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="font-semibold text-gray-900">Cover image</h2>
                <div className="flex items-start gap-4">
                    {form.coverImage ? (
                        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
                        </div>
                    ) : null}
                    <div className="flex-1 space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            className={input}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) upload(file);
                            }}
                        />
                        {uploading && (
                            <p className="text-xs text-slate-600">Uploading. Wait for the preview before saving.</p>
                        )}
                        <input
                            type="text"
                            className={`${input} font-mono`}
                            value={form.coverImage}
                            onChange={(e) => set('coverImage', e.target.value)}
                            placeholder="/uploads/your-file.webp"
                        />
                        <input
                            type="text"
                            className={input}
                            value={form.coverAlt}
                            onChange={(e) => set('coverAlt', e.target.value)}
                            placeholder="Describe the image for screen readers and image search"
                        />
                    </div>
                </div>
            </section>

            <section className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <div>
                    <h2 className="font-semibold text-gray-900">The short answer</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Three or four lines that answer the title on their own. These sit at the top
                        of the article and are what ChatGPT, Perplexity and Google quote.
                    </p>
                </div>
                {form.takeaways.map((line, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            type="text"
                            className={input}
                            value={line}
                            onChange={(e) => {
                                const next = [...form.takeaways];
                                next[i] = e.target.value;
                                set('takeaways', next);
                            }}
                            placeholder="A plain five page website costs ₹35,000 to ₹45,000, fixed."
                        />
                        <button
                            type="button"
                            onClick={() => set('takeaways', form.takeaways.filter((_, k) => k !== i))}
                            className="px-3 text-gray-400 hover:text-red-600"
                            aria-label="Remove this line"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => set('takeaways', [...form.takeaways, ''])}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900"
                >
                    <Plus size={14} /> Add a line
                </button>
            </section>

            <section className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <div>
                    <h2 className="font-semibold text-gray-900">Questions and answers</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        These render at the bottom of the article and go out as FAQ structured data,
                        which is what can win a rich result or get read back by an assistant.
                    </p>
                </div>
                {form.faq.map((item, i) => (
                    <div key={i} className="space-y-2 border border-gray-200 rounded-md p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className={input}
                                value={item.question}
                                onChange={(e) => {
                                    const next = [...form.faq];
                                    next[i] = { ...next[i], question: e.target.value };
                                    set('faq', next);
                                }}
                                placeholder="Does the price include hosting?"
                            />
                            <button
                                type="button"
                                onClick={() => set('faq', form.faq.filter((_, k) => k !== i))}
                                className="px-3 text-gray-400 hover:text-red-600"
                                aria-label="Remove this question"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <textarea
                            rows={2}
                            className={input}
                            value={item.answer}
                            onChange={(e) => {
                                const next = [...form.faq];
                                next[i] = { ...next[i], answer: e.target.value };
                                set('faq', next);
                            }}
                            placeholder="Answer it in two or three sentences, no selling."
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => set('faq', [...form.faq, { question: '', answer: '' }])}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900"
                >
                    <Plus size={14} /> Add a question
                </button>
            </section>

            <section className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="font-semibold text-gray-900">Search listing</h2>
                <div>
                    <label className={label}>Title tag (leave blank to use the article title)</label>
                    <input
                        type="text"
                        className={input}
                        value={form.seoTitle}
                        onChange={(e) => set('seoTitle', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {(form.seoTitle || form.title).length} characters. Around 60 is the limit
                        before Google trims it.
                    </p>
                </div>
                <div>
                    <label className={label}>Meta description (leave blank to use the summary)</label>
                    <textarea
                        rows={2}
                        className={input}
                        value={form.seoDescription}
                        onChange={(e) => set('seoDescription', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {(form.seoDescription || form.excerpt).length} characters. Around 160 is the limit.
                    </p>
                </div>
                <div>
                    <label className={label}>Tags, separated by commas</label>
                    <input
                        type="text"
                        className={input}
                        value={form.tags}
                        onChange={(e) => set('tags', e.target.value)}
                        placeholder="pricing, websites, web applications"
                    />
                </div>
            </section>

            <div className="flex flex-wrap gap-3 pb-10">
                <button
                    type="button"
                    disabled={saving || uploading}
                    onClick={() => save('draft')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    {saving ? 'Saving' : 'Save as draft'}
                </button>
                <button
                    type="button"
                    disabled={saving || uploading}
                    onClick={() => save('published')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-700 disabled:opacity-50"
                >
                    {saving ? 'Saving' : 'Publish'}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/admin/articles')}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
