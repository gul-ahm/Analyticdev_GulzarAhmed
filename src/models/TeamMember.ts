/**
 * TeamMember Interface (MySQL)
 */
export interface ITeamMember {
    id: number;
    name: string;
    slug: string;
    position: string;
    bio?: string;
    image?: string;
    displayOrder?: number;
    quote?: string;
    headline?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITeamMemberInsert {
    name: string;
    slug: string;
    position: string;
    bio?: string;
    image?: string;
    displayOrder?: number;
    quote?: string;
    headline?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

export interface ITeamMemberUpdate {
    name?: string;
    slug?: string;
    position?: string;
    bio?: string;
    image?: string;
    displayOrder?: number;
    quote?: string;
    headline?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

