/**
 * Contact Submission Repository - MySQL Version
 * Database operations for ContactSubmission entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IContactSubmission, IContactSubmissionInsert, IContactSubmissionUpdate } from '@/models/ContactSubmission';

export async function findAllContactSubmissions(status?: string): Promise<IContactSubmission[]> {
    let sql = `
        SELECT id, name, email, phone, company, message, status,
               created_at as createdAt, updated_at as updatedAt
        FROM contact_submissions
    `;
    const params: any[] = [];
    if (status) {
        sql += ' WHERE status = ?';
        params.push(status);
    }
    sql += ' ORDER BY created_at DESC';
    return await query<IContactSubmission>(sql, params);
}

export async function findContactSubmissionById(id: number): Promise<IContactSubmission | null> {
    const sql = `
        SELECT id, name, email, phone, company, message,status,
               created_at as createdAt, updated_at as updatedAt
        FROM contact_submissions WHERE id = ?
    `;
    return await queryOne<IContactSubmission>(sql, [id]);
}

export async function createContactSubmission(data: IContactSubmissionInsert): Promise<IContactSubmission> {
    const sql = `
        INSERT INTO contact_submissions (name, email, phone, company, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertId = await insert(sql, [
        data.name, data.email, data.phone || null,
        data.company || null, data.message, data.status || 'new'
    ]);
    const submission = await findContactSubmissionById(insertId);
    if (!submission) throw new Error('Failed to create contact submission');
    return submission;
}

export async function updateContactSubmission(id: number, data: IContactSubmissionUpdate): Promise<IContactSubmission> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
    if (data.phone !== undefined) { updates.push('phone = ?'); values.push(data.phone); }
    if (data.company !== undefined) { updates.push('company = ?'); values.push(data.company); }
    if (data.message !== undefined) { updates.push('message = ?'); values.push(data.message); }
    if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }

    if (updates.length === 0) {
        const submission = await findContactSubmissionById(id);
        if (!submission) throw new Error('Contact submission not found');
        return submission;
    }

    values.push(id);
    const sql = `UPDATE contact_submissions SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const submission = await findContactSubmissionById(id);
    if (!submission) throw new Error('Contact submission not found');
    return submission;
}

export async function deleteContactSubmission(id: number): Promise<void> {
    await execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
}

export async function countContactSubmissions(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM contact_submissions';
    const result = await queryOne<{ count: number }>(sql);
    return result?.count || 0;
}
