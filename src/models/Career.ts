/**
 * Career Model - MySQL Version
 * TypeScript interfaces for Career entity
 */

export interface ICareer {
    id: number;
    title: string;
    slug: string;
    description: string;
    benefits: string[];
    culturePoints: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICareerInsert {
    title: string;
    slug: string;
    description: string;
    benefits?: string[];
    culturePoints?: string[];
}

export interface ICareerUpdate {
    title?: string;
    slug?: string;
    description?: string;
    benefits?: string[];
    culturePoints?: string[];
}

