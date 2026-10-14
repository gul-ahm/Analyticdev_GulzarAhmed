/**
 * Article Interface (MySQL)
 * Blog posts and articles written from the admin panel.
 */

export type ArticleStatus = 'draft' | 'published';

export interface IArticleFaq {
    question: string;
    answer: string;
}

export interface IArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    coverAlt?: string;
    category?: string;
    tags: string[];
    /** Short answer-first lines shown above the body and used by answer engines. */
    takeaways: string[];
    faq: IArticleFaq[];
    seoTitle?: string;
    seoDescription?: string;
    status: ArticleStatus;
    publishedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IArticleInsert {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    coverAlt?: string;
    category?: string;
    tags?: string[];
    takeaways?: string[];
    faq?: IArticleFaq[];
    seoTitle?: string;
    seoDescription?: string;
    status?: ArticleStatus;
}

export type IArticleUpdate = Partial<IArticleInsert>;

/** Rough reading time, at 200 words a minute, minimum one. */
export function readingMinutes(content: string): number {
    const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

/** Turn a title into a url safe slug. */
export function toSlug(input: string): string {
    return (input || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 80);
}
