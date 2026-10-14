import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Clock } from 'lucide-react';
import * as articleRepo from '@/lib/repositories/article.repository';
import { readingMinutes } from '@/models/Article';
import { blogIndexJsonLd, SITE_URL } from '@/lib/article-seo';
import ScrollReveal from '@/components/public/ScrollReveal';

export const dynamic = 'force-dynamic';

const TITLE = 'Notes on building websites, applications and AI systems';
const DESCRIPTION =
    'Working notes from Analytics Dev in Mumbai: what things cost, how projects actually run, and what goes wrong when they do not.';

export const metadata: Metadata = {
    title: `Blog | ${TITLE}`,
    description: DESCRIPTION,
    alternates: {
        canonical: `${SITE_URL}/blog`,
        types: { 'application/rss+xml': `${SITE_URL}/feed.xml` }
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/blog`,
        type: 'website'
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION }
};

function formatDate(value?: Date | null) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export default async function BlogIndexPage() {
    const articles = await articleRepo.findPublishedArticles().catch((err) => {
        console.error('[blog] database read failed:', err?.code || err?.message);
        return [];
    });

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexJsonLd(articles)) }}
            />

            <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-36 lg:px-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Writing
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tighter text-slate-900 md:text-6xl">
                    {TITLE}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                    {DESCRIPTION}
                </p>

                {articles.length === 0 ? (
                    <div className="mt-16 border border-dashed border-slate-300 p-10 text-center">
                        <p className="text-sm text-slate-600">
                            Nothing published yet. The first notes are being written.
                        </p>
                        <Link
                            href="/projects"
                            className="mt-4 inline-block text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
                        >
                            Read the work instead
                        </Link>
                    </div>
                ) : (
                    <ul className="mt-16 divide-y divide-slate-200 border-y border-slate-200">
                        {articles.map((article, index) => (
                            <li key={article.id}>
                                <ScrollReveal delay={Math.min(index, 4) * 0.06} width="100%">
                                    <Link
                                        href={`/blog/${article.slug}`}
                                        className="group block py-8 transition-colors hover:bg-slate-50"
                                    >
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                                            {article.category ? (
                                                <span className="text-slate-900">{article.category}</span>
                                            ) : null}
                                            {article.publishedAt ? (
                                                <time dateTime={new Date(article.publishedAt).toISOString()}>
                                                    {formatDate(article.publishedAt)}
                                                </time>
                                            ) : null}
                                            <span className="flex items-center gap-1.5">
                                                <Clock aria-hidden className="h-3 w-3" />
                                                {readingMinutes(article.content)} min read
                                            </span>
                                        </div>

                                        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                            {article.title}
                                        </h2>

                                        {article.excerpt ? (
                                            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
                                                {article.excerpt}
                                            </p>
                                        ) : null}

                                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                                            Read it
                                            <ArrowRight
                                                aria-hidden
                                                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </Link>
                                </ScrollReveal>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
