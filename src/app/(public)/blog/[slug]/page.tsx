import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import * as articleRepo from '@/lib/repositories/article.repository';
import { readingMinutes } from '@/models/Article';
import ArticleBody from '@/components/public/ArticleBody';
import {
    articleDescription,
    articleJsonLd,
    articleUrl,
    extractHeadings,
    AUTHOR_NAME,
    SITE_URL
} from '@/lib/article-seo';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const article = await articleRepo.findPublishedArticleBySlug(slug).catch(() => null);

    if (!article) {
        return { title: 'Article not found | Analytics Dev', robots: { index: false, follow: true } };
    }

    const url = articleUrl(article.slug);
    const description = articleDescription(article);
    const image = article.coverImage
        ? article.coverImage.startsWith('http')
            ? article.coverImage
            : `${SITE_URL}${article.coverImage}`
        : undefined;

    return {
        title: `${article.seoTitle || article.title} | Analytics Dev`,
        description,
        keywords: article.tags?.length ? article.tags : undefined,
        authors: [{ name: AUTHOR_NAME, url: `${SITE_URL}/team` }],
        alternates: { canonical: url },
        openGraph: {
            title: article.seoTitle || article.title,
            description,
            url,
            type: 'article',
            publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
            modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
            authors: [AUTHOR_NAME],
            tags: article.tags,
            ...(image ? { images: [{ url: image, alt: article.coverAlt || article.title }] } : {})
        },
        twitter: {
            card: image ? 'summary_large_image' : 'summary',
            title: article.seoTitle || article.title,
            description,
            ...(image ? { images: [image] } : {})
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
        }
    };
}

function formatDate(value?: Date | null) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

export default async function ArticlePage({ params }: Params) {
    const { slug } = await params;
    const article = await articleRepo.findPublishedArticleBySlug(slug).catch((err) => {
        console.error('[article] database read failed:', err?.code || err?.message);
        return null;
    });

    if (!article) notFound();

    const headings = extractHeadings(article.content);
    const related = await articleRepo.findRelatedArticles(article.slug, 3).catch(() => []);
    const minutes = readingMinutes(article.content);

    return (
        <div className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
            />

            <article className="mx-auto w-full max-w-3xl px-6 pb-24 pt-36 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft aria-hidden className="h-3 w-3" />
                        All writing
                    </Link>
                </nav>

                <header>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                        {article.category ? <span className="text-slate-900">{article.category}</span> : null}
                        {article.publishedAt ? (
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                                {formatDate(article.publishedAt)}
                            </time>
                        ) : null}
                        <span className="flex items-center gap-1.5">
                            <Clock aria-hidden className="h-3 w-3" />
                            {minutes} min read
                        </span>
                    </div>

                    <h1 className="mt-4 text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
                        {article.title}
                    </h1>

                    {article.excerpt ? (
                        <p className="article-summary mt-5 text-lg leading-relaxed text-slate-600">
                            {article.excerpt}
                        </p>
                    ) : null}

                    <p className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500">
                        By{' '}
                        <Link
                            href="/team"
                            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
                        >
                            {AUTHOR_NAME}
                        </Link>
                        , who writes the code as well as the posts
                        {article.updatedAt && article.publishedAt &&
                        new Date(article.updatedAt).getTime() - new Date(article.publishedAt).getTime() > 86400000 ? (
                            <>
                                {'. Updated '}
                                <time dateTime={new Date(article.updatedAt).toISOString()}>
                                    {formatDate(article.updatedAt)}
                                </time>
                            </>
                        ) : null}
                    </p>
                </header>

                {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={article.coverImage}
                        alt={article.coverAlt || article.title}
                        className="mt-10 w-full rounded-xl border border-slate-200"
                        loading="eager"
                        decoding="async"
                    />
                ) : null}

                {article.takeaways?.length ? (
                    <section
                        aria-labelledby="takeaways-heading"
                        className="article-summary mt-12 border-l-4 border-slate-900 bg-slate-50 p-6 sm:p-7"
                    >
                        <h2
                            id="takeaways-heading"
                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
                        >
                            The short answer
                        </h2>
                        <ul className="mt-4 flex flex-col gap-3">
                            {article.takeaways.map((line) => (
                                <li key={line} className="flex gap-3 text-sm leading-relaxed text-slate-800">
                                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-900" />
                                    <span>{line}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                {headings.length > 2 ? (
                    <nav aria-labelledby="toc-heading" className="mt-10 border border-slate-200 p-6">
                        <h2
                            id="toc-heading"
                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
                        >
                            What is in here
                        </h2>
                        <ol className="mt-4 flex flex-col gap-2">
                            {headings.map((heading) => (
                                <li key={heading.id} className={heading.level === 3 ? 'pl-5' : ''}>
                                    <a
                                        href={`#${heading.id}`}
                                        className="text-sm text-slate-600 underline decoration-slate-200 underline-offset-4 transition-colors hover:text-slate-900 hover:decoration-slate-900"
                                    >
                                        {heading.text}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : null}

                <div className="mt-12">
                    <ArticleBody content={article.content} />
                </div>

                {article.faq?.length ? (
                    <section aria-labelledby="faq-heading" className="mt-16 border-t border-slate-200 pt-10">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                            Direct answers
                        </p>
                        <h2 id="faq-heading" className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                            Questions people ask about this
                        </h2>
                        <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                            {article.faq.map((item) => (
                                <div key={item.question} className="py-6">
                                    <dt className="text-base font-semibold text-slate-900">{item.question}</dt>
                                    <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                ) : null}

                {article.tags?.length ? (
                    <ul className="mt-10 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-slate-200 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                ) : null}

                <section className="mt-16 border border-slate-200 p-8 text-center sm:p-10">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                        Got a project this applies to?
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                        Tell me what you are stuck on. You get a scope and a number in writing
                        before you pay anything.
                    </p>
                    <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center justify-center gap-2 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        Start a project
                        <ArrowRight aria-hidden className="size-4" />
                    </Link>
                </section>

                {related.length ? (
                    <section aria-labelledby="related-heading" className="mt-16">
                        <h2
                            id="related-heading"
                            className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500"
                        >
                            Read next
                        </h2>
                        <ul className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                            {related.map((item) => (
                                <li key={item.id}>
                                    <Link href={`/blog/${item.slug}`} className="group block py-5">
                                        <p className="text-base font-semibold text-slate-900">{item.title}</p>
                                        {item.excerpt ? (
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                                {item.excerpt}
                                            </p>
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}
            </article>
        </div>
    );
}
