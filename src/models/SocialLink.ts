export interface ISocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    isActive: boolean;
    displayOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISocialLinkInsert {
    platform: string;
    url: string;
    icon: string;
    isActive?: boolean;
    displayOrder?: number;
}

export interface ISocialLinkUpdate {
    platform?: string;
    url?: string;
    icon?: string;
    isActive?: boolean;
    displayOrder?: number;
}
