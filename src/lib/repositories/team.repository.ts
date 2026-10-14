/**
 * Team Member Repository - MySQL Version
 * Database operations for TeamMember entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { ITeamMember, ITeamMemberInsert, ITeamMemberUpdate } from '@/models/TeamMember';

export async function findAllTeamMembers(): Promise<ITeamMember[]> {
    const sql = `
        SELECT id, name, slug, position, bio, image, display_order as displayOrder, quote, headline, social_links as socialLinks,
               created_at as createdAt, updated_at as updatedAt
        FROM team_members
        ORDER BY display_order ASC, created_at DESC
    `;
    const results = await query<any>(sql);
    return results.map(row => ({
        ...row,
        socialLinks: typeof row.socialLinks === 'string' ? JSON.parse(row.socialLinks) : (row.socialLinks || undefined)
    }));
}

export async function findTeamMemberBySlug(slug: string): Promise<ITeamMember | null> {
    const sql = `
        SELECT id, name, slug, position, bio, image, display_order as displayOrder, quote, headline, social_links as socialLinks,
               created_at as createdAt, updated_at as updatedAt
        FROM team_members WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);
    if (!result) return null;
    return { ...result, socialLinks: typeof result.socialLinks === 'string' ? JSON.parse(result.socialLinks) : (result.socialLinks || undefined) };
}

export async function findTeamMemberById(id: number): Promise<ITeamMember | null> {
    const sql = `
        SELECT id, name, slug, position, bio, image, display_order as displayOrder, quote, headline, social_links as socialLinks,
               created_at as createdAt, updated_at as updatedAt
        FROM team_members WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);
    if (!result) return null;
    return { ...result, socialLinks: typeof result.socialLinks === 'string' ? JSON.parse(result.socialLinks) : (result.socialLinks || undefined) };
}

export async function createTeamMember(data: ITeamMemberInsert): Promise<ITeamMember> {
    const sql = `
        INSERT INTO team_members (name, slug, position, bio, image, display_order, quote, headline, social_links)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const socialLinks = data.socialLinks ? JSON.stringify(data.socialLinks) : null;
    const insertId = await insert(sql, [
        data.name, data.slug, data.position,
        data.bio || null, data.image || null,
        data.displayOrder || 0,
        data.quote || null,
        data.headline || null,
        socialLinks
    ]);
    const member = await findTeamMemberById(insertId);
    if (!member) throw new Error('Failed to create team member');
    return member;
}

export async function updateTeamMember(id: number, data: ITeamMemberUpdate): Promise<ITeamMember> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.position !== undefined) { updates.push('position = ?'); values.push(data.position); }
    if (data.bio !== undefined) { updates.push('bio = ?'); values.push(data.bio); }
    if (data.image !== undefined) { updates.push('image = ?'); values.push(data.image); }
    if (data.displayOrder !== undefined) { updates.push('display_order = ?'); values.push(data.displayOrder); }
    if (data.quote !== undefined) { updates.push('quote = ?'); values.push(data.quote); }
    if (data.headline !== undefined) { updates.push('headline = ?'); values.push(data.headline); }
    if (data.socialLinks !== undefined) { updates.push('social_links = ?'); values.push(JSON.stringify(data.socialLinks)); }

    if (updates.length === 0) {
        const member = await findTeamMemberById(id);
        if (!member) throw new Error('Team member not found');
        return member;
    }

    values.push(id);
    const sql = `UPDATE team_members SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const member = await findTeamMemberById(id);
    if (!member) throw new Error('Team member not found');
    return member;
}

export async function deleteTeamMember(id: number): Promise<void> {
    await execute('DELETE FROM team_members WHERE id = ?', [id]);
}
