/**
 * Job Model - MySQL Version
 * TypeScript interfaces for Job entity
 */

export interface IJob {
    id: number;
    title: string;
    slug: string;
    department?: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IJobInsert {
    title: string;
    slug: string;
    department?: string;
    location: string;
    type: string;
    description: string;
    requirements?: string[];
    published?: boolean;
}

export interface IJobUpdate {
    title?: string;
    slug?: string;
    department?: string;
    location?: string;
    type?: string;
    description?: string;
    requirements?: string[];
    published?: boolean;
}

