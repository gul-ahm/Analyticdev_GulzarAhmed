/**
 * User Model - MySQL Version
 * TypeScript interfaces for User entity
 */

export interface IUser {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserInsert {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user';
}

export interface IUserUpdate {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'user';
}

