/**
 * Service Repository - MySQL Version
 * Database operations for Service entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IService, IServiceInsert, IServiceUpdate } from '@/models/Service';

export async function findAllServices(): Promise<IService[]> {
    const sql = `
        SELECT id, title, slug, description, icon, features, \`order\`,
               created_at as createdAt, updated_at as updatedAt
        FROM services
        ORDER BY \`order\` ASC
    `;
    const results = await query<any>(sql);
    return results.map(row => ({
        ...row,
        features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || [])
    }));
}

export async function findServiceBySlug(slug: string): Promise<IService | null> {
    const sql = `
        SELECT id, title, slug, description, icon, features, \`order\`,
               created_at as createdAt, updated_at as updatedAt
        FROM services WHERE slug = ?
    `;
    const result = await queryOne<any>(sql, [slug]);
    if (!result) return null;
    return { ...result, features: typeof result.features === 'string' ? JSON.parse(result.features) : (result.features || []) };
}

export async function findServiceById(id: number): Promise<IService | null> {
    const sql = `
        SELECT id, title, slug, description, icon, features, \`order\`,
               created_at as createdAt, updated_at as updatedAt
        FROM services WHERE id = ?
    `;
    const result = await queryOne<any>(sql, [id]);
    if (!result) return null;
    return { ...result, features: typeof result.features === 'string' ? JSON.parse(result.features) : (result.features || []) };
}

export async function createService(data: IServiceInsert): Promise<IService> {
    const sql = `
        INSERT INTO services (title, slug, description, icon, features, \`order\`)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const features = JSON.stringify(data.features || []);
    const insertId = await insert(sql, [
        data.title, data.slug, data.description,
        data.icon || null, features, data.order || 0
    ]);
    const service = await findServiceById(insertId);
    if (!service) throw new Error('Failed to create service');
    return service;
}

export async function updateService(id: number, data: IServiceUpdate): Promise<IService> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
    if (data.slug !== undefined) { updates.push('slug = ?'); values.push(data.slug); }
    if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
    if (data.icon !== undefined) { updates.push('icon = ?'); values.push(data.icon); }
    if (data.features !== undefined) { updates.push('features = ?'); values.push(JSON.stringify(data.features)); }
    if (data.order !== undefined) { updates.push('`order` = ?'); values.push(data.order); }

    if (updates.length === 0) {
        const service = await findServiceById(id);
        if (!service) throw new Error('Service not found');
        return service;
    }

    values.push(id);
    const sql = `UPDATE services SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const service = await findServiceById(id);
    if (!service) throw new Error('Service not found');
    return service;
}

export async function deleteService(id: number): Promise<void> {
    await execute('DELETE FROM services WHERE id = ?', [id]);
}
