/**
 * Achievement Repository - MySQL Version
 * Database operations for Achievement entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IAchievement, IAchievementInsert, IAchievementUpdate } from '@/models/Achievement';

export async function findAllAchievements(): Promise<IAchievement[]> {
    const sql = `
        SELECT id, title, description, icon, value,
               created_at as createdAt, updated_at as updatedAt
        FROM achievements
        ORDER BY created_at DESC
    `;
    return await query<IAchievement>(sql);
}

export async function findAchievementById(id: number): Promise<IAchievement | null> {
    const sql = `
        SELECT id, title, description, icon, value,
               created_at as createdAt, updated_at as updatedAt
        FROM achievements WHERE id = ?
    `;
    return await queryOne<IAchievement>(sql, [id]);
}

export async function createAchievement(data: IAchievementInsert): Promise<IAchievement> {
    const sql = `
        INSERT INTO achievements (title, description, icon, value)
        VALUES (?, ?, ?, ?)
    `;
    const insertId = await insert(sql, [
        data.title, data.description || null, data.icon || null, data.value || null
    ]);
    const achievement = await findAchievementById(insertId);
    if (!achievement) throw new Error('Failed to create achievement');
    return achievement;
}

export async function updateAchievement(id: number, data: IAchievementUpdate): Promise<IAchievement> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.icon !== undefined) { updates.push('icon = ?'); values.push(data.icon); }
    if (data.value !== undefined) { updates.push('value = ?'); values.push(data.value); }

    if (updates.length === 0) {
        const achievement = await findAchievementById(id);
        if (!achievement) throw new Error('Achievement not found');
        return achievement;
    }

    values.push(id);
    const sql = `UPDATE achievements SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const achievement = await findAchievementById(id);
    if (!achievement) throw new Error('Achievement not found');
    return achievement;
}

export async function deleteAchievement(id: number): Promise<void> {
    await execute('DELETE FROM achievements WHERE id = ?', [id]);
}
