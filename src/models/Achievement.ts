/**
 * Achievement Model - MySQL Version
 * TypeScript interfaces for Achievement entity
 */

export interface IAchievement {
    id: number;
    title: string;
    description?: string;
    icon?: string;
    value?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAchievementInsert {
    title: string;
    description?: string;
    icon?: string;
    value?: string;
}

export interface IAchievementUpdate {
    title?: string;
    description?: string;
    icon?: string;
    value?: string;
}

