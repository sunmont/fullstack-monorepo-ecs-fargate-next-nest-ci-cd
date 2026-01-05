'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, Eye, Heart, MessageSquare, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Post {
    id: string;
    title: string;
    excerpt?: string;
    content: string;
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

interface PostsListProps {
    posts: Post[];
    showActions?: boolean;
    onDelete?: (postId: string) => void;
    onEdit?: (postId: string) => void;
    compact?: boolean;
}

export function PostsList({
                              posts,
                              showActions = false,
                              onDelete,
                              onEdit,
                              compact = false
                          }: PostsListProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                    <MessageSquare className="w-full h-full" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to create a post!</p>
                <Link href="/posts/create">
                    <Button className="mt-4">Create Post</Button>
                </Link>
            </div>
        );
    }

    if (compact) {
        return (
            <div className="space-y-3">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="block group"
                    >
                        <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate group-hover:text-primary">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <span>{post.author.name}</span>
                                    <span>•</span>
                                    <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                    })}
                  </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewCount}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likeCount}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {post.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {post.status === 'draft' && (
                                <Badge className="absolute top-2 left-2 bg-yellow-500">
                                    Draft
                                </Badge>
                            )}
                        </div>
                    )}

                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                    <Link href={`/posts/${post.id}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                {post.excerpt && (
                                    <CardDescription className="line-clamp-2">
                                        {post.excerpt}
                                    </CardDescription>
                                )}
                            </div>

                            {showActions && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit?.(post.id)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete?.(post.id)}
                                            className="text-red-600"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.author.profilePicture} />
                                    <AvatarFallback>
                                        {post.author.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">
                  {post.author.name}
                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays className="h-3 w-3" />
                                <span>
                  {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                      addSuffix: true,
                  })}
                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                </Badge>
                            ))}
                            {post.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0 border-t">
                        <div className="flex items-center justify-between w-full text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likeCount}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>0</span> {/* Comment count would come from API */}
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readingTime || 5} min read</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export function PostsListSkeleton({ count = 3, compact = false }: { count?: number; compact?: boolean }) {
    if (compact) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                            <Skeleton className="h-4 w-8" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader className="pb-3">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}