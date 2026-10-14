/**
 * Article Repository - MySQL
 * Database operations for the Article entity.
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IArticle, IArticleInsert, IArticleUpdate } from '@/models/Article';

const COLUMNS = `
    id, title, slug, excerpt, content,
    cover_image as coverImage, cover_alt as coverAlt,
    category, tags, takeaways, faq,
    seo_title as seoTitle, seo_description as seoDescription,
    status, published_at as publishedAt,
    created_at as createdAt, updated_at as updatedAt
`;

function parseJson<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== 'string') return value as T;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

function hydrate(row: any): IArticle {
    return {
        ...row,
        tags: parseJson<string[]>(row.tags, []),
        takeaways: parseJson<string[]>(row.takeaways, []),
        faq: parseJson<IArticle['faq']>(row.faq, [])
    };
}

/** Everything, newest first. Admin only. */
export async function findAllArticles(): Promise<IArticle[]> {
    const rows = await query<any>(`
        SELECT ${COLUMNS} FROM articles
        ORDER BY COALESCE(published_at, created_at) DESC
    `);
    return rows.map(hydrate);
}

/** Published articles only, for every public page and the feed. */
export async function findPublishedArticles(limit?: number): Promise<IArticle[]> {
    const sql = `
        SELECT ${COLUMNS} FROM articles
        WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
        ORDER BY published_at DESC
        ${limit ? 'LIMIT ?' : ''}
    `;
    const rows = await query<any>(sql, limit ? [limit] : undefined);
    return rows.map(hydrate);
}

/** Used to decide whether the public blog link appears at all. */
export async function countPublishedArticles(): Promise<number> {
    const row = await queryOne<any>(`
        SELECT COUNT(*) AS total FROM articles
        WHERE status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
    `);
    return Number(row?.total || 0);
}

export async function findPublishedArticleBySlug(slug: string): Promise<IArticle | null> {
    const row = await queryOne<any>(
        `SELECT ${COLUMNS} FROM articles
         WHERE slug = ? AND status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()`,
        [slug]
    );
    return row ? hydrate(row) : null;
}

export async function findArticleById(id: number): Promise<IArticle | null> {
    const row = await queryOne<any>(`SELECT ${COLUMNS} FROM articles WHERE id = ?`, [id]);
    return row ? hydrate(row) : null;
}

/** Other published articles, for the read next block. */
export async function findRelatedArticles(slug: string, limit = 3): Promise<IArticle[]> {
    const rows = await query<any>(
        `SELECT ${COLUMNS} FROM articles
         WHERE slug <> ? AND status = 'published' AND published_at IS NOT NULL AND published_at <= NOW()
         ORDER BY published_at DESC LIMIT ?`,
        [slug, limit]
    );
    return rows.map(hydrate);
}

export async function createArticle(data: IArticleInsert): Promise<IArticle> {
    const status = data.status === 'published' ? 'published' : 'draft';
    const id = await insert(
        `INSERT INTO articles
            (title, slug, excerpt, content, cover_image, cover_alt, category, tags, takeaways, faq,
             seo_title, seo_description, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${status === 'published' ? 'NOW()' : 'NULL'})`,
        [
            data.title,
            data.slug,
            data.excerpt || '',
            data.content || '',
            data.coverImage || null,
            data.coverAlt || null,
            data.category || null,
            JSON.stringify(data.tags || []),
            JSON.stringify(data.takeaways || []),
            JSON.stringify(data.faq || []),
            data.seoTitle || null,
            data.seoDescription || null,
            status
        ]
    );
    const article = await findArticleById(id);
    if (!article) throw new Error('Failed to create article');
    return article;
}

export async function updateArticle(id: number, data: IArticleUpdate): Promise<IArticle> {
    const sets: string[] = [];
    const values: any[] = [];

    const put = (column: string, value: any) => {
        sets.push(`${column} = ?`);
        values.push(value);
    };

    if (data.title !== undefined) put('title', data.title);
    if (data.slug !== undefined) put('slug', data.slug);
    if (data.excerpt !== undefined) put('excerpt', data.excerpt);
    if (data.content !== undefined) put('content', data.content);
    if (data.coverImage !== undefined) put('cover_image', data.coverImage || null);
    if (data.coverAlt !== undefined) put('cover_alt', data.coverAlt || null);
    if (data.category !== undefined) put('category', data.category || null);
    if (data.tags !== undefined) put('tags', JSON.stringify(data.tags));
    if (data.takeaways !== undefined) put('takeaways', JSON.stringify(data.takeaways));
    if (data.faq !== undefined) put('faq', JSON.stringify(data.faq));
    if (data.seoTitle !== undefined) put('seo_title', data.seoTitle || null);
    if (data.seoDescription !== undefined) put('seo_description', data.seoDescription || null);

    if (data.status !== undefined) {
        put('status', data.status);
        // The publish date is stamped the first time it goes live and kept
        // after that, so dateModified and datePublished stay honest.
        if (data.status === 'published') {
            sets.push('published_at = COALESCE(published_at, NOW())');
        }
    }

    if (sets.length === 0) {
        const current = await findArticleById(id);
        if (!current) throw new Error('Article not found');
        return current;
    }

    values.push(id);
    await execute(`UPDATE articles SET ${sets.join(', ')} WHERE id = ?`, values);

    const article = await findArticleById(id);
    if (!article) throw new Error('Article not found');
    return article;
}

export async function deleteArticle(id: number): Promise<void> {
    await execute('DELETE FROM articles WHERE id = ?', [id]);
}

/** True when the slug is taken by a different article. */
export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
    const row = await queryOne<any>(
        `SELECT id FROM articles WHERE slug = ? ${exceptId ? 'AND id <> ?' : ''} LIMIT 1`,
        exceptId ? [slug, exceptId] : [slug]
    );
    return !!row;
}
