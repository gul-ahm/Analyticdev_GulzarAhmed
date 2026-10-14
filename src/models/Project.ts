/**
 * Project Model - MySQL Version
 * TypeScript interfaces for Project entity
 */

export interface IProject {
    id: number;
    title: string;
    slug: string;
    description: string;
    content?: string;
    images: string[];
    tags: string[];
    client?: string;
    liveUrl?: string;
    featured: boolean;
    svg_icons?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IProjectInsert {
    title: string;
    slug: string;
    description: string;
    content?: string;
    images?: string[];
    tags?: string[];
    client?: string;
    liveUrl?: string;
    featured?: boolean;
    svg_icons?: string[];
}

export interface IProjectUpdate {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    images?: string[];
    tags?: string[];
    client?: string;
    liveUrl?: string;
    featured?: boolean;
    svg_icons?: string[];
}

