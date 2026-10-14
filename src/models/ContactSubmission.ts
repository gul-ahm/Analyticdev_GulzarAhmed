/**
 * Contact Submission Model - MySQL Version
 * TypeScript interfaces for ContactSubmission entity
 */

export interface IContactSubmission {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

export interface IContactSubmissionInsert {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    status?: 'new' | 'read' | 'replied' | 'archived';
}

export interface IContactSubmissionUpdate {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    status?: 'new' | 'read' | 'replied' | 'archived';
}

