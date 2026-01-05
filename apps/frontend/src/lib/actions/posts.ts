'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface FetchPostsOptions {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published' | 'archived';
    author?: string;
    tags?: string[];
    category?: string;
    search?: string;
    sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'likeCount';
    sortOrder?: 'asc' | 'desc';
}

export async function fetchPosts(options: FetchPostsOptions = {}) {
    try {
        const {
            page = 1,
            limit = 10,
            status = 'published',
            author,
            tags,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options;

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            status,
            sortBy,
            sortOrder,
        });

        if (author) params.append('author', author);
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (tags && tags.length > 0) {
            tags.forEach(tag => params.append('tags', tag));
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts?${params}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                next: {
                    tags: ['posts'],
                    revalidate: status === 'published' ? 60 : 0,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to fetch posts');
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function fetchPostById(id: string, options?: { preview?: boolean }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                    ...(options?.preview && { 'X-Preview-Mode': 'true' }),
                },
                next: {
                    tags: [`post-${id}`],
                    revalidate: options?.preview ? 0 : 60,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch post');
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching post ${id}:`, error);
        return null;
    }
}

export async function createPost(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            throw new Error('Unauthorized');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create post');
        }

        const post = await response.json();

        // Revalidate posts list
        revalidateTag('posts');
        revalidatePath('/posts');

        return { success: true, data: post };
    } catch (error) {
        console.error('Error creating post:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create post'
        };
    }
}

export async function updatePost(id: string, formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            throw new Error('Unauthorized');
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update post');
        }

        const post = await response.json();

        // Revalidate specific post and posts list
        revalidateTag(`post-${id}`);
        revalidateTag('posts');
        revalidatePath('/posts');
        revalidatePath(`/posts/${id}`);

        return { success: true, data: post };
    } catch (error) {
        console.error('Error updating post:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update post'
        };
    }
}

export async function deletePost(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            throw new Error('Unauthorized');
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete post');
        }

        // Revalidate posts list
        revalidateTag('posts');
        revalidatePath('/posts');

        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete post'
        };
    }
}

export async function likePost(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;

        if (!token) {
            throw new Error('Unauthorized');
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/like`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to like post');
        }

        const result = await response.json();

        // Revalidate specific post
        revalidateTag(`post-${id}`);

        return { success: true, data: result };
    } catch (error) {
        console.error('Error liking post:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to like post'
        };
    }
}

export async function searchPosts(query: string, filters?: FetchPostsOptions) {
    try {
        const params = new URLSearchParams({
            q: query,
            ...(filters?.limit && { limit: filters.limit.toString() }),
            ...(filters?.status && { status: filters.status }),
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/search?${params}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                next: {
                    revalidate: 60,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search posts');
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
}

export async function getTrendingPosts(limit: number = 5) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/trending?limit=${limit}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                next: {
                    revalidate: 300, // Revalidate every 5 minutes
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch trending posts');
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error('Error fetching trending posts:', error);
        return [];
    }
}

export async function getPostsByAuthor(authorId: string, options?: FetchPostsOptions) {
    try {
        const params = new URLSearchParams({
            author: authorId,
            ...(options?.limit && { limit: options.limit.toString() }),
            ...(options?.status && { status: options.status }),
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/posts?${params}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                next: {
                    tags: [`posts-author-${authorId}`],
                    revalidate: 60,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch author posts');
        }

        const data = await response.json();
        return data.posts || [];
    } catch (error) {
        console.error('Error fetching author posts:', error);
        return [];
    }
}

// Cache management utilities
export async function revalidatePostsCache() {
    revalidateTag('posts');
}

export async function revalidatePostCache(id: string) {
    revalidateTag(`post-${id}`);
}