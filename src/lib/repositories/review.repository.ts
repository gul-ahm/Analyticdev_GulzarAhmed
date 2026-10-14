/**
 * Review Repository - MySQL Version
 * Database operations for Review entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IReview, IReviewInsert, IReviewUpdate } from '@/models/Review';

export async function findAllReviews(featuredOnly = false): Promise<IReview[]> {
    let sql = `
        SELECT id, client_name as clientName, position, content, rating, image, featured,
               created_at as createdAt, updated_at as updatedAt
        FROM reviews
    `;
    if (featuredOnly) {
        sql += ' WHERE featured = TRUE';
    }
    sql += ' ORDER BY featured DESC, created_at DESC';
    return await query<IReview>(sql);
}

export async function findReviewById(id: number): Promise<IReview | null> {
    const sql = `
        SELECT id, client_name as clientName, position, content, rating, image, featured,
               created_at as createdAt, updated_at as updatedAt
        FROM reviews WHERE id = ?
    `;
    return await queryOne<IReview>(sql, [id]);
}

export async function createReview(data: IReviewInsert): Promise<IReview> {
    const sql = `
        INSERT INTO reviews (client_name, position, content, rating, image, featured)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertId = await insert(sql, [
        data.clientName, data.position || null, data.content,
        data.rating, data.image || null, data.featured || false
    ]);
    const review = await findReviewById(insertId);
    if (!review) throw new Error('Failed to create review');
    return review;
}

export async function updateReview(id: number, data: IReviewUpdate): Promise<IReview> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.clientName !== undefined) { updates.push('client_name = ?'); values.push(data.clientName); }
    if (data.position !== undefined) { updates.push('position = ?'); values.push(data.position); }
    if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
    if (data.rating !== undefined) { updates.push('rating = ?'); values.push(data.rating); }
    if (data.image !== undefined) { updates.push('image = ?'); values.push(data.image); }
    if (data.featured !== undefined) { updates.push('featured = ?'); values.push(data.featured); }

    if (updates.length === 0) {
        const review = await findReviewById(id);
        if (!review) throw new Error('Review not found');
        return review;
    }

    values.push(id);
    const sql = `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const review = await findReviewById(id);
    if (!review) throw new Error('Review not found');
    return review;
}

export async function deleteReview(id: number): Promise<void> {
    await execute('DELETE FROM reviews WHERE id = ?', [id]);
}
