/**
 * Page Model - MySQL Version
 * TypeScript interfaces for Page entity
 */

export interface IPage {
    id: number;
    slug: string;
    title: string;
    content?: any;
    metaTitle?: string;
    metaDescription?: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPageInsert {
    slug: string;
    title: string;
    content?: any;
    metaTitle?: string;
    metaDescription?: string;
    published?: boolean;
}

export interface IPageUpdate {
    slug?: string;
    title?: string;
    content?: any;
    metaTitle?: string;
    metaDescription?: string;
    published?: boolean;
}

