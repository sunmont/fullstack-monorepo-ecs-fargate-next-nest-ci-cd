import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
    };
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    categories: string[];
    viewCount: number;
    likeCount: number;
    publishedAt?: string;
    featuredImage?: string;
    createdAt: string;
    updatedAt: string;
    readingTime: number;
}

interface PaginatedPosts {
    posts: Post[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface PostsFilters {
    page?: number;
    limit?: number;
    status?: string;
    author?: string;
    tags?: string[];
    category?: string;
    search?: string;
    includeDrafts?: boolean;
}

export function usePosts(filters: PostsFilters = {}) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Standard query with filters
    const query = useQuery({
        queryKey: ['posts', filters],
        queryFn: async () => {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, v));
                    } else {
                        params.append(key, value.toString());
                    }
                }
            });

            const response = await apiClient.get<PaginatedPosts>(`/posts?${params}`);
            return response.data;
        },
        keepPreviousData: true, // Smooth pagination
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Infinite scroll query
    const infiniteQuery = useInfiniteQuery({
        queryKey: ['posts-infinite', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                ...filters,
                page: pageParam.toString(),
                limit: '10',
            });

            const response = await apiClient.get<PaginatedPosts>(`/posts?${params}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.page < lastPage.meta.totalPages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        },
    });

    // Create post mutation with optimistic update
    const createPost = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await apiClient.post<Post>('/posts', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onMutate: async (newPost) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries(['posts']);

            // Snapshot the previous value
            const previousPosts = queryClient.getQueryData<PaginatedPosts>(['posts', filters]);

            // Optimistically update
            if (previousPosts) {
                queryClient.setQueryData<PaginatedPosts>(['posts', filters], {
                    ...previousPosts,
                    posts: [newPost as any, ...previousPosts.posts],
                    meta: {
                        ...previousPosts.meta,
                        total: previousPosts.meta.total + 1,
                    },
                });
            }

            return { previousPosts };
        },
        onError: (err, newPost, context) => {
            // Rollback on error
            if (context?.previousPosts) {
                queryClient.setQueryData(['posts', filters], context.previousPosts);
            }
            toast({
                title: 'Error creating post',
                description: 'Failed to create post. Please try again.',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Post created successfully',
            });
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(['posts']);
        },
    });

    // Update post mutation
    const updatePost = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
            const response = await apiClient.put<Post>(`/posts/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries(['posts', id]);

            const previousPost = queryClient.getQueryData<Post>(['posts', id]);

            // Optimistically update
            if (previousPost) {
                queryClient.setQueryData<Post>(['posts', id], {
                    ...previousPost,
                    ...Object.fromEntries(data.entries()),
                });
            }

            return { previousPost };
        },
    });

    // Like/Unlike mutation
    const likePost = useMutation({
        mutationFn: async (postId: string) => {
            const response = await apiClient.post<{ liked: boolean }>(`/posts/${postId}/like`);
            return { postId, liked: response.data.liked };
        },
        onMutate: async (postId) => {
            await queryClient.cancelQueries(['posts', postId]);

            const previousPost = queryClient.getQueryData<Post>(['posts', postId]);

            if (previousPost) {
                // Optimistically update like count
                queryClient.setQueryData<Post>(['posts', postId], {
                    ...previousPost,
                    likeCount: previousPost.likeCount + 1,
                    likedByUser: true,
                });
            }

            return { previousPost };
        },
        onError: (err, postId, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(['posts', postId], context.previousPost);
            }
        },
    });

    // Delete post mutation
    const deletePost = useMutation({
        mutationFn: async (postId: string) => {
            await apiClient.delete(`/posts/${postId}`);
            return postId;
        },
        onMutate: async (postId) => {
            await queryClient.cancelQueries(['posts']);

            const previousPosts = queryClient.getQueryData<PaginatedPosts>(['posts', filters]);

            if (previousPosts) {
                queryClient.setQueryData<PaginatedPosts>(['posts', filters], {
                    ...previousPosts,
                    posts: previousPosts.posts.filter(post => post.id !== postId),
                    meta: {
                        ...previousPosts.meta,
                        total: previousPosts.meta.total - 1,
                    },
                });
            }

            return { previousPosts };
        },
    });

    // Prefetch post on hover
    const prefetchPost = (postId: string) => {
        queryClient.prefetchQuery({
            queryKey: ['posts', postId],
            queryFn: async () => {
                const response = await apiClient.get<Post>(`/posts/${postId}`);
                return response.data;
            },
        });
    };

    return {
        posts: query.data?.posts || [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,

        // Infinite scroll
        infinitePosts: infiniteQuery.data?.pages.flatMap(page => page.posts) || [],
        fetchNextPage: infiniteQuery.fetchNextPage,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetchingNextPage: infiniteQuery.isFetchingNextPage,

        // Mutations
        createPost: createPost.mutate,
        updatePost: updatePost.mutate,
        likePost: likePost.mutate,
        deletePost: deletePost.mutate,

        // Status
        isCreating: createPost.isPending,
        isUpdating: updatePost.isPending,
        isLiking: likePost.isPending,
        isDeleting: deletePost.isPending,

        // Utilities
        prefetchPost,
    };
}