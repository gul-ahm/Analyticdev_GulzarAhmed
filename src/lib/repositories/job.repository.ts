/**
 * Job Repository - MySQL Version
 * Database operations for Job entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IJob, IJobInsert, IJobUpdate } from '@/models/Job';

export async function findAllJobs(publishedOnly = false): Promise<IJob[]> {
    let sql = `
        SELECT id, title, slug, department, location, type, description, requirements, published,
               created_at as createdAt, updated_at as updatedAt
        FROM jobs
    `;
    if (publishedOnly) {
        sql += ' WHERE published = TRUE';
    }
    sql += ' ORDER BY created_at DESC';
    const results = await query<any>(sql);
    return results.map(row => ({
        ...row,
        requirements: typeof row.requirements === 'string' ? JSON.parse(row.requirements) : (row.requirements || [])
    }));
}

export async function findJobBySlug(slug: string): Promise<IJob | null> {
    const sql = `
        SELECT id, title, slug, department, location, type, description, requirements, published,
               created_at as createdAt, updated_at as updatedAt
        FROM jobs WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);
    if (!result) return null;
    return { ...result, requirements: typeof result.requirements === 'string' ? JSON.parse(result.requirements) : (result.requirements || []) };
}

export async function findJobById(id: number): Promise<IJob | null> {
    const sql = `
        SELECT id, title, slug, department, location, type, description, requirements, published,
               created_at as createdAt, updated_at as updatedAt
        FROM jobs WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);
    if (!result) return null;
    return { ...result, requirements: typeof result.requirements === 'string' ? JSON.parse(result.requirements) : (result.requirements || []) };
}

export async function createJob(data: IJobInsert): Promise<IJob> {
    const sql = `
        INSERT INTO jobs (title, slug, department, location, type, description, requirements, published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const requirements = JSON.stringify(data.requirements || []);
    const insertId = await insert(sql, [
        data.title, data.slug, data.department || null, data.location, data.type,
        data.description, requirements, data.published || true
    ]);
    const job = await findJobById(insertId);
    if (!job) throw new Error('Failed to create job');
    return job;
}

export async function updateJob(id: number, data: IJobUpdate): Promise<IJob> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.department !== undefined) { updates.push('department = ?'); values.push(data.department); }
    if (data.location !== undefined) { updates.push('location = ?'); values.push(data.location); }
    if (data.type !== undefined) { updates.push('type = ?'); values.push(data.type); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.requirements !== undefined) { updates.push('requirements = ?'); values.push(JSON.stringify(data.requirements)); }
    if (data.published !== undefined) { updates.push('published = ?'); values.push(data.published); }

    if (updates.length === 0) {
        const job = await findJobById(id);
        if (!job) throw new Error('Job not found');
        return job;
    }

    values.push(id);
    const sql = `UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const job = await findJobById(id);
    if (!job) throw new Error('Job not found');
    return job;
}

export async function deleteJob(id: number): Promise<void> {
    await execute('DELETE FROM jobs WHERE id = ?', [id]);
}
