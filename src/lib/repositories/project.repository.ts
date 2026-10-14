/**
 * Project Repository
 * Database operations for Project entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IProject, IProjectInsert, IProjectUpdate } from '@/models/Project';

/**
 * Find all projects with optional filtering
 */
export async function findAllProjects(): Promise<IProject[]> {
    const sql = `
        SELECT 
            id, title, slug, description, content,
            images, tags, client, live_url as liveUrl,
            featured, svg_icons, created_at as createdAt, updated_at as updatedAt
        FROM projects
        ORDER BY featured DESC, updated_at DESC
    `;
    const results = await query<any>(sql);

    // Parse JSON fields
    return results.map(row => ({
        ...row,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
        svg_icons: typeof row.svg_icons === 'string' ? JSON.parse(row.svg_icons) : (row.svg_icons || [])
    }));
}

/**
 * Find project by slug
 */
export async function findProjectBySlug(slug: string): Promise<IProject | null> {
    const sql = `
        SELECT 
            id, title, slug, description, content,
            images, tags, client, live_url as liveUrl,
            featured, svg_icons, created_at as createdAt, updated_at as updatedAt
        FROM projects
        WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);

    if (!result) return null;

    return {
        ...result,
        images: typeof result.images === 'string' ? JSON.parse(result.images) : (result.images || []),
        tags: typeof result.tags === 'string' ? JSON.parse(result.tags) : (result.tags || []),
        svg_icons: typeof result.svg_icons === 'string' ? JSON.parse(result.svg_icons) : (result.svg_icons || [])
    };
}

/**
 * Find project by ID
 */
export async function findProjectById(id: number): Promise<IProject | null> {
    const sql = `
        SELECT 
            id, title, slug, description, content,
            images, tags, client, live_url as liveUrl,
            featured, svg_icons, created_at as createdAt, updated_at as updatedAt
        FROM projects
        WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);

    if (!result) return null;

    return {
        ...result,
        images: typeof result.images === 'string' ? JSON.parse(result.images) : (result.images || []),
        tags: typeof result.tags === 'string' ? JSON.parse(result.tags) : (result.tags || []),
        svg_icons: typeof result.svg_icons === 'string' ? JSON.parse(result.svg_icons) : (result.svg_icons || [])
    };
}

/**
 * Create a new project
 */
export async function createProject(data: IProjectInsert): Promise<IProject> {
    const sql = `
        INSERT INTO projects (title, slug, description, content, images, tags, client, live_url, featured, svg_icons)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const images = JSON.stringify(data.images || []);
    const tags = JSON.stringify(data.tags || []);
    const svg_icons = JSON.stringify(data.svg_icons || []);

    const insertId = await insert(sql, [
        data.title,
        data.slug,
        data.description,
        data.content || null,
        images,
        tags,
        data.client || null,
        data.liveUrl || null,
        data.featured || false,
        svg_icons
    ]);

    const project = await findProjectById(insertId);
    if (!project) {
        throw new Error('Failed to create project');
    }
    return project;
}

/**
 * Update project
 */
export async function updateProject(id: number, data: IProjectUpdate): Promise<IProject> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title);
    }
    if (data.slug !== undefined) {
        updates.push('slug = ?');
        values.push(data.slug);
    }
    if (data.description !== undefined) {
        updates.push('description = ?');
        values.push(data.description);
    }
    if (data.content !== undefined) {
        updates.push('content = ?');
        values.push(data.content);
    }
    if (data.images !== undefined) {
        updates.push('images = ?');
        values.push(JSON.stringify(data.images));
    }
    if (data.tags !== undefined) {
        updates.push('tags = ?');
        values.push(JSON.stringify(data.tags));
    }
    if (data.client !== undefined) {
        updates.push('client = ?');
        values.push(data.client);
    }
    if (data.liveUrl !== undefined) {
        updates.push('live_url = ?');
        values.push(data.liveUrl);
    }
    if (data.featured !== undefined) {
        updates.push('featured = ?');
        values.push(data.featured);
    }
    if (data.svg_icons !== undefined) {
        updates.push('svg_icons = ?');
        values.push(JSON.stringify(data.svg_icons));
    }

    if (updates.length === 0) {
        const project = await findProjectById(id);
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }

    values.push(id);
    const sql = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const project = await findProjectById(id);
    if (!project) {
        throw new Error('Project not found');
    }
    return project;
}

/**
 * Delete project
 */
export async function deleteProject(id: number): Promise<void> {
    const sql = 'DELETE FROM projects WHERE id = ?';
    await execute(sql, [id]);
}

/**
 * Count all projects
 */
export async function countProjects(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM projects';
    const result = await queryOne<{ count: number }>(sql);
    return result?.count || 0;
}
