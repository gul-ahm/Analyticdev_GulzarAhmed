/**
 * Career Repository - MySQL Version
 * Database operations for Career entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { ICareer, ICareerInsert, ICareerUpdate } from '@/models/Career';

export async function findAllCareers(): Promise<ICareer[]> {
    const sql = `
        SELECT id, title, slug, description, benefits, culture_points as culturePoints,
               created_at as createdAt, updated_at as updatedAt
        FROM careers
        ORDER BY created_at DESC
    `;
    const results = await query<any>(sql);
    return results.map(row => ({
        ...row,
        benefits: typeof row.benefits === 'string' ? JSON.parse(row.benefits) : (row.benefits || []),
        culturePoints: typeof row.culturePoints === 'string' ? JSON.parse(row.culturePoints) : (row.culturePoints || [])
    }));
}

export async function findCareerBySlug(slug: string): Promise<ICareer | null> {
    const sql = `
        SELECT id, title, slug, description, benefits, culture_points as culturePoints,
               created_at as createdAt, updated_at as updatedAt
        FROM careers WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);
    if (!result) return null;
    return {
        ...result,
        benefits: typeof result.benefits === 'string' ? JSON.parse(result.benefits) : (result.benefits || []),
        culturePoints: typeof result.culturePoints === 'string' ? JSON.parse(result.culturePoints) : (result.culturePoints || [])
    };
}

export async function findCareerById(id: number): Promise<ICareer | null> {
    const sql = `
        SELECT id, title, slug, description, benefits, culture_points as culturePoints,
               created_at as createdAt, updated_at as updatedAt
        FROM careers WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);
    if (!result) return null;
    return {
        ...result,
        benefits: typeof result.benefits === 'string' ? JSON.parse(result.benefits) : (result.benefits || []),
        culturePoints: typeof result.culturePoints === 'string' ? JSON.parse(result.culturePoints) : (result.culturePoints || [])
    };
}

export async function createCareer(data: ICareerInsert): Promise<ICareer> {
    const sql = `
        INSERT INTO careers (title, slug, description, benefits, culture_points)
        VALUES (?, ?, ?, ?, ?)
    `;
    const benefits = JSON.stringify(data.benefits || []);
    const culturePoints = JSON.stringify(data.culturePoints || []);
    const insertId = await insert(sql, [
        data.title, data.slug, data.description, benefits, culturePoints
    ]);
    const career = await findCareerById(insertId);
    if (!career) throw new Error('Failed to create career');
    return career;
}

export async function updateCareer(id: number, data: ICareerUpdate): Promise<ICareer> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.benefits !== undefined) { updates.push('benefits = ?'); values.push(JSON.stringify(data.benefits)); }
    if (data.culturePoints !== undefined) { updates.push('culture_points = ?'); values.push(JSON.stringify(data.culturePoints)); }

    if (updates.length === 0) {
        const career = await findCareerById(id);
        if (!career) throw new Error('Career not found');
        return career;
    }

    values.push(id);
    const sql = `UPDATE careers SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const career = await findCareerById(id);
    if (!career) throw new Error('Career not found');
    return career;
}

export async function deleteCareer(id: number): Promise<void> {
    await execute('DELETE FROM careers WHERE id = ?', [id]);
}
