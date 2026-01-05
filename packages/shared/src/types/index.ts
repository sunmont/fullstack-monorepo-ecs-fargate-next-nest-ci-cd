// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

// Post Types
export interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: User;
    status: PostStatus;
    tags: string[];
    categories: string[];
    viewCount: number;
    likeCount: number;
    publishedAt?: Date;
    featuredImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

// Comment Types
export interface Comment {
    id: string;
    content: string;
    author: User;
    post: Post;
    parentComment?: Comment;
    depth: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Auth Types
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    profilePicture?: string;
}