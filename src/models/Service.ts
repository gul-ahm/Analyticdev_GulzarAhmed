/**
 * Service Model - MySQL Version
 * TypeScript interfaces for Service entity
 */

export interface IService {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon?: string;
    features: string[];
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IServiceInsert {
    title: string;
    slug: string;
    description: string;
    icon?: string;
    features?: string[];
    order?: number;
}

export interface IServiceUpdate {
    title?: string;
    slug?: string;
    description?: string;
    icon?: string;
    features?: string[];
    order?: number;
}

