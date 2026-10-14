/**
 * Review Model - MySQL Version
 * TypeScript interfaces for Review entity
 */

export interface IReview {
    id: number;
    clientName: string;
    position?: string;
    content: string;
    rating: number;
    image?: string;
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IReviewInsert {
    clientName: string;
    position?: string;
    content: string;
    rating: number;
    image?: string;
    featured?: boolean;
}

export interface IReviewUpdate {
    clientName?: string;
    position?: string;
    content?: string;
    rating?: number;
    image?: string;
    featured?: boolean;
}

