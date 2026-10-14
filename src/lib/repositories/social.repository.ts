/**
 * Social Link Repository - MySQL Version
 * Database operations for SocialLink entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { ISocialLink, ISocialLinkInsert, ISocialLinkUpdate } from '@/models/SocialLink';

export async function findAllSocialLinks(activeOnly: boolean = false): Promise<ISocialLink[]> {
    let sql = `
        SELECT id, platform, url, icon, is_active as isActive, display_order as displayOrder,
               created_at as createdAt, updated_at as updatedAt
        FROM social_links
    `;

    if (activeOnly) {
        sql += ` WHERE is_active = TRUE`;
    }

    sql += ` ORDER BY display_order ASC, created_at ASC`;

    const results = await query<ISocialLink>(sql);
    return results;
}

export async function findSocialLinkById(id: number): Promise<ISocialLink | null> {
    const sql = `
        SELECT id, platform, url, icon, is_active as isActive, display_order as displayOrder,
               created_at as createdAt, updated_at as updatedAt
        FROM social_links WHERE id = ?
    `;
    const result = await queryOne<ISocialLink>(sql, [id]);
    return result || null;
}

export async function createSocialLink(data: ISocialLinkInsert): Promise<ISocialLink> {
    const sql = `
        INSERT INTO social_links (platform, url, icon, is_active, display_order)
        VALUES (?, ?, ?, ?, ?)
    `;
    const insertId = await insert(sql, [
        data.platform, data.url, data.icon,
        data.isActive !== undefined ? data.isActive : true,
        data.displayOrder || 0
    ]);

    const link = await findSocialLinkById(insertId);
    if (!link) throw new Error('Failed to create social link');
    return link;
}

export async function updateSocialLink(id: number, data: ISocialLinkUpdate): Promise<ISocialLink> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.platform !== undefined) { updates.push('platform = ?'); values.push(data.platform); }
    if (data.url !== undefined) { updates.push('url = ?'); values.push(data.url); }
    if (data.icon !== undefined) { updates.push('icon = ?'); values.push(data.icon); }
    if (data.isActive !== undefined) { updates.push('is_active = ?'); values.push(data.isActive); }
    if (data.displayOrder !== undefined) { updates.push('display_order = ?'); values.push(data.displayOrder); }

    if (updates.length === 0) {
        const link = await findSocialLinkById(id);
        if (!link) throw new Error('Social link not found');
        return link;
    }

    values.push(id);
    const sql = `UPDATE social_links SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const link = await findSocialLinkById(id);
    if (!link) throw new Error('Social link not found');
    return link;
}

export async function deleteSocialLink(id: number): Promise<void> {
    await execute('DELETE FROM social_links WHERE id = ?', [id]);
}
