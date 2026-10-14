/**
 * Application Repository - MySQL Version
 * Database operations for Application entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IApplication, IApplicationInsert, IApplicationUpdate } from '@/models/Application';

export async function findAllApplications(jobId?: number): Promise<IApplication[]> {
    let sql = `
        SELECT id, job_id as job, name, email, linkedin, resume, status,
               created_at as createdAt, updated_at as updatedAt
        FROM applications
    `;
    const params: any[] = [];
    if (jobId) {
        sql += ' WHERE job_id = ?';
        params.push(jobId);
    }
    sql += ' ORDER BY created_at DESC';
    return await query<IApplication>(sql, params);
}

export async function findApplicationById(id: number): Promise<IApplication | null> {
    const sql = `
        SELECT id, job_id as job, name, email, linkedin, resume, status,
               created_at as createdAt, updated_at as updatedAt
        FROM applications WHERE id = ?
    `;
    return await queryOne<IApplication>(sql, [id]);
}

export async function createApplication(data: IApplicationInsert): Promise<IApplication> {
    const sql = `
        INSERT INTO applications (job_id, name, email, linkedin, resume, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertId = await insert(sql, [
        data.job, data.name, data.email,
        data.linkedin || null, data.resume || null, data.status || 'new'
    ]);
    const application = await findApplicationById(insertId);
    if (!application) throw new Error('Failed to create application');
    return application;
}

export async function updateApplication(id: number, data: IApplicationUpdate): Promise<IApplication> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.job !== undefined) { updates.push('job_id = ?'); values.push(data.job); }
    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
    if (data.linkedin !== undefined) { updates.push('linkedin = ?'); values.push(data.linkedin); }
    if (data.resume !== undefined) { updates.push('resume = ?'); values.push(data.resume); }
    if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }

    if (updates.length === 0) {
        const application = await findApplicationById(id);
        if (!application) throw new Error('Application not found');
        return application;
    }

    values.push(id);
    const sql = `UPDATE applications SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const application = await findApplicationById(id);
    if (!application) throw new Error('Application not found');
    return application;
}

export async function deleteApplication(id: number): Promise<void> {
    await execute('DELETE FROM applications WHERE id = ?', [id]);
}
