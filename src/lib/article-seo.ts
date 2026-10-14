import { IArticle, readingMinutes } from '@/models/Article';

export const SITE_URL = 'https://analyticsdev.xyz';
export const AUTHOR_NAME = 'Gulzar Ahmed';
export const AUTHOR_URL = `${SITE_URL}/team`;

/** Heading text to an anchor id, matching what the renderer emits. */
export function headingId(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 70);
}

export type Heading = { level: 2 | 3; text: string; id: string };

/** Pull h2 and h3 out of the markdown body for the contents list. */
export function extractHeadings(markdown: string): Heading[] {
    const out: Heading[] = [];
    let inFence = false;
    for (const raw of (markdown || '').split('\n')) {
        const line = raw.trimEnd();
        if (/^```/.test(line.trim())) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        const m = /^(#{2,3})\s+(.+)$/.exec(line);
        if (!m) continue;
        const text = m[2].replace(/[*_`]/g, '').trim();
        out.push({ level: m[1].length === 2 ? 2 : 3, text, id: headingId(text) });
    }
    return out;
}

export function wordCount(markdown: string): number {
    return (markdown || '').trim().split(/\s+/).filter(Boolean).length;
}

export function articleUrl(slug: string): string {
    return `${SITE_URL}/blog/${slug}`;
}

export function articleDescription(article: IArticle): string {
    return (article.seoDescription || article.excerpt || '').slice(0, 300);
}

/**
 * The structured data for one article. BlogPosting carries the facts search
 * engines index; speakable marks the lines an assistant can read aloud; the
 * FAQPage block is what answer engines quote back.
 */
export function articleJsonLd(article: IArticle) {
    const url = articleUrl(article.slug);
    const published = article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined;
    const modified = article.updatedAt ? new Date(article.updatedAt).toISOString() : published;

    const graph: any[] = [
        {
            '@type': 'BlogPosting',
            '@id': `${url}#article`,
            headline: article.title.slice(0, 110),
            name: article.title,
            description: articleDescription(article),
            url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            datePublished: published,
            dateModified: modified,
            wordCount: wordCount(article.content),
            timeRequired: `PT${readingMinutes(article.content)}M`,
            inLanguage: 'en',
            isAccessibleForFree: true,
            author: {
                '@type': 'Person',
                name: AUTHOR_NAME,
                url: AUTHOR_URL,
                jobTitle: 'Founder and Principal Engineer',
                worksFor: { '@id': `${SITE_URL}/#organization` }
            },
            publisher: { '@id': `${SITE_URL}/#organization` },
            ...(article.category ? { articleSection: article.category } : {}),
            ...(article.tags?.length ? { keywords: article.tags.join(', ') } : {}),
            ...(article.coverImage
                ? {
                      image: {
                          '@type': 'ImageObject',
                          url: article.coverImage.startsWith('http')
                              ? article.coverImage
                              : `${SITE_URL}${article.coverImage}`,
                          caption: article.coverAlt || article.title
                      }
                  }
                : {}),
            speakable: {
                '@type': 'SpeakableSpecification',
                cssSelector: ['.article-summary', 'h1']
            }
        },
        {
            '@type': 'BreadcrumbList',
            '@id': `${url}#breadcrumbs`,
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: article.title, item: url }
            ]
        }
    ];

    if (article.faq?.length) {
        graph.push({
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            mainEntity: article.faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer }
            }))
        });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
}

/** Structured data for the blog index. */
export function blogIndexJsonLd(articles: IArticle[]) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Blog',
                '@id': `${SITE_URL}/blog#blog`,
                url: `${SITE_URL}/blog`,
                name: 'Analytics Dev Notes',
                description:
                    'Notes on building websites, web applications and AI systems, written by the engineer who builds them.',
                inLanguage: 'en',
                publisher: { '@id': `${SITE_URL}/#organization` },
                blogPost: articles.map((article) => ({
                    '@type': 'BlogPosting',
                    '@id': `${articleUrl(article.slug)}#article`,
                    headline: article.title.slice(0, 110),
                    url: articleUrl(article.slug),
                    datePublished: article.publishedAt
                        ? new Date(article.publishedAt).toISOString()
                        : undefined,
                    author: { '@type': 'Person', name: AUTHOR_NAME, url: AUTHOR_URL }
                }))
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${SITE_URL}/blog#breadcrumbs`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` }
                ]
            }
        ]
    };
}
