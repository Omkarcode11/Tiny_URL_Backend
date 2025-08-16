export interface UrlResponse {
    id: string;
    originalUrl: string;
    shortUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    clickCount: number;
}

export interface CreateUrlInput {   
    originalUrl: string;
    userId: string;
    shortUrl: string;
}

export interface UpdateUrlInput {
    id: string;
    originalUrl: string;
    shortUrl: string;
}

export interface CreateUrlResponse {
    id: string;
    originalUrl: string;
    shortUrl: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    clickCount: number;
}

