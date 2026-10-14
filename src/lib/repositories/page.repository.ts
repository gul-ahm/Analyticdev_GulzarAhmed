/**
 * Page Repository - MySQL Version
 * Database operations for Page entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IPage, IPageInsert, IPageUpdate } from '@/models/Page';

export async function findAllPages(publishedOnly = false): Promise<IPage[]> {
    let sql = `
        SELECT id, slug, title, content, meta_title as metaTitle,
               meta_description as metaDescription, published,
               created_at as createdAt, updated_at as updatedAt
        FROM pages
    `;
    if (publishedOnly) {
        sql += ' WHERE published = TRUE';
    }
    sql += ' ORDER BY updated_at DESC';
    const results = await query<any>(sql);
    return results.map(row => ({
        ...row,
        content: typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {})
    }));
}

export async function findPageBySlug(slug: string): Promise<IPage | null> {
    const sql = `
        SELECT id, slug, title, content, meta_title as metaTitle,
               meta_description as metaDescription, published,
               created_at as createdAt, updated_at as updatedAt
        FROM pages WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);
    if (!result) return null;
    return {
        ...result,
        content: typeof result.content === 'string' ? JSON.parse(result.content || '{}') : (result.content || {})
    };
}

export async function findPageById(id: number): Promise<IPage | null> {
    const sql = `
        SELECT id, slug, title, content, meta_title as metaTitle,
               meta_description as metaDescription, published,
               created_at as createdAt, updated_at as updatedAt
        FROM pages WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);
    if (!result) return null;
    return {
        ...result,
        content: typeof result.content === 'string' ? JSON.parse(result.content || '{}') : (result.content || {})
    };
}

export async function createPage(data: IPageInsert): Promise<IPage> {
    const sql = `
        INSERT INTO pages (slug, title, content, meta_title, meta_description, published)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const contentJson = JSON.stringify(data.content || {});
    const insertId = await insert(sql, [
        data.slug, data.title, contentJson,
        data.metaTitle || null, data.metaDescription || null, data.published || true
    ]);
    const page = await findPageById(insertId);
    if (!page) throw new Error('Failed to create page');
    return page;
}

export async function updatePage(id: number, data: IPageUpdate): Promise<IPage> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(JSON.stringify(data.content)); }
    if (data.metaTitle !== undefined) { updates.push('meta_title = ?'); values.push(data.metaTitle); }
    if (data.metaDescription !== undefined) { updates.push('meta_description = ?'); values.push(data.metaDescription); }
    if (data.published !== undefined) { updates.push('published = ?'); values.push(data.published); }

    if (updates.length === 0) {
        const page = await findPageById(id);
        if (!page) throw new Error('Page not found');
        return page;
    }

    values.push(id);
    const sql = `UPDATE pages SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const page = await findPageById(id);
    if (!page) throw new Error('Page not found');
    return page;
}

export async function deletePage(id: number): Promise<void> {
    await execute('DELETE FROM pages WHERE id = ?', [id]);
}

export async function countPages(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM pages WHERE published = TRUE';
    const result = await queryOne<{ count: number }>(sql);
    return result?.count || 0;
}
