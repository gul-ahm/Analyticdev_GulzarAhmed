/**
 * Application Model - MySQL Version
 * TypeScript interfaces for Application entity
 */

export interface IApplication {
    id: number;
    job: number; // Foreign key to jobs.id
    name: string;
    email: string;
    linkedin?: string;
    resume?: string;
    status: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
    createdAt: Date;
    updatedAt: Date;
}

export interface IApplicationInsert {
    job: number;
    name: string;
    email: string;
    linkedin?: string;
    resume?: string;
    status?: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
}

export interface IApplicationUpdate {
    job?: number;
    name?: string;
    email?: string;
    linkedin?: string;
    resume?: string;
    status?: 'new' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
}

