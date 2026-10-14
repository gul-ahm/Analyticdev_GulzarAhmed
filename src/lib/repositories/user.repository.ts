/**
 * User Repository
 * Database operations for User entity
 */

import { query, queryOne, insert, execute } from '../mysql';
import { IUser, IUserInsert, IUserUpdate } from '@/models/User';

/**
 * Find user by email
 */
export async function findUserByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const fields = includePassword
        ? 'id, name, email, password, role, created_at as createdAt, updated_at as updatedAt'
        : 'id, name, email, role, created_at as createdAt, updated_at as updatedAt';

    const sql = `SELECT ${fields} FROM users WHERE email = ?`;
    return await queryOne<IUser>(sql, [email]);
}

/**
 * Find user by ID
 */
export async function findUserById(id: number, includePassword = false): Promise<IUser | null> {
    const fields = includePassword
        ? 'id, name, email, password, role, created_at as createdAt, updated_at as updatedAt'
        : 'id, name, email, role, created_at as createdAt, updated_at as updatedAt';

    const sql = `SELECT ${fields} FROM users WHERE id = ?`;
    return await queryOne<IUser>(sql, [id]);
}

/**
 * Create a new user
 */
export async function createUser(data: IUserInsert): Promise<IUser> {
    const sql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;
    const role = data.role || 'user';
    const insertId = await insert(sql, [data.name, data.email, data.password, role]);

    const user = await findUserById(insertId);
    if (!user) {
        throw new Error('Failed to create user');
    }
    return user;
}

/**
 * Update user
 */
export async function updateUser(id: number, data: IUserUpdate): Promise<IUser> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
    }
    if (data.email !== undefined) {
        updates.push('email = ?');
        values.push(data.email);
    }
    if (data.password !== undefined) {
        updates.push('password = ?');
        values.push(data.password);
    }
    if (data.role !== undefined) {
        updates.push('role = ?');
        values.push(data.role);
    }

    if (updates.length === 0) {
        const user = await findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    values.push(id);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await execute(sql, values);

    const user = await findUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = ?';
    await execute(sql, [id]);
}

/**
 * Find all users
 */
export async function findAllUsers(): Promise<IUser[]> {
    const sql = `
        SELECT id, name, email, role, created_at as createdAt, updated_at as updatedAt
        FROM users
        ORDER BY created_at DESC
    `;
    return await query<IUser>(sql);
}

/**
 * Find user by reset token (if not expired)
 */
export async function findUserByResetToken(token: string): Promise<IUser | null> {
    const sql = `
        SELECT id, name, email, role, created_at as createdAt, updated_at as updatedAt
        FROM users 
        WHERE reset_password_token = ? 
        AND reset_password_expires > NOW()
    `;
    return await queryOne<IUser>(sql, [token]);
}

/**
 * Save reset token
 */
export async function saveResetToken(email: string, token: string, expires: Date): Promise<void> {
    const sql = `
        UPDATE users 
        SET reset_password_token = ?, reset_password_expires = ? 
        WHERE email = ?
    `;
    // Format date for MySQL
    const expiresStr = expires.toISOString().slice(0, 19).replace('T', ' ');
    await execute(sql, [token, expiresStr, email]);
}

/**
 * Clear reset token (after successful reset)
 */
export async function clearResetToken(id: number): Promise<void> {
    const sql = `
        UPDATE users 
        SET reset_password_token = NULL, reset_password_expires = NULL 
        WHERE id = ?
    `;
    await execute(sql, [id]);
}
