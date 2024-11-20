export interface TextureMetadata {
    name: string;
    path: string;
    category?: string;
    tags?: string[];
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    hasMore: boolean;
    nextCursor?: string;
}

export interface TextureQueryParams {
    search?: string;
    category?: string;
    limit?: number;
    cursor?: string;
}
