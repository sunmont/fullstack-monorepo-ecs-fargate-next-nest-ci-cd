'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Users,
    FileText,
    Eye,
    ThumbsUp,
    TrendingUp,
    Clock,
    Calendar
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
    users: {
        total: number;
        active: number;
        newToday: number;
    };
    posts: {
        total: number;
        published: number;
        draft: number;
        totalViews: number;
        totalLikes: number;
    };
    comments: {
        total: number;
        avgPerPost: number;
    };
    recentActivity: Array<{
        id: string;
        type: 'post' | 'comment' | 'user';
        action: 'created' | 'updated' | 'deleted';
        user: string;
        target: string;
        timestamp: string;
    }>;
}

export default function AdminDashboard() {
    const [timeRange, setTimeRange] = useState('today');

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats', timeRange],
        queryFn: async () => {
            const response = await apiClient.get<DashboardStats>('/admin/stats', {
                params: { range: timeRange },
            });
            return response.data;
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-96" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-gray-500">
                        Overview of your application&apos;s performance
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                    <Button>Export Report</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.users.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            +{stats?.users.newToday || 0} new today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.posts.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.posts.published || 0} published
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.posts.totalViews?.toLocaleString() || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.posts.totalLikes?.toLocaleString() || 0} likes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.comments.avgPerPost?.toFixed(1) || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            avg comments per post
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Activity */}
            <Tabs defaultValue="activity" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="top-content">Top Content</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest actions in your application
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats?.recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-full bg-primary/10">
                                                {activity.type === 'post' && (
                                                    <FileText className="h-4 w-4 text-primary" />
                                                )}
                                                {activity.type === 'comment' && (
                                                    <ThumbsUp className="h-4 w-4 text-primary" />
                                                )}
                                                {activity.type === 'user' && (
                                                    <Users className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {activity.user}{' '}
                                                    <span className="text-gray-500 font-normal">
                            {activity.action} {activity.type}
                          </span>
                                                </p>
                                                <p className="text-sm text-gray-500">{activity.target}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Clock className="h-4 w-4" />
                                            <span>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                        })}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics Overview</CardTitle>
                            <CardDescription>
                                Performance metrics and trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 flex items-center justify-center border rounded-lg">
                                <div className="text-center">
                                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium">Analytics Chart</h3>
                                    <p className="text-gray-500">
                                        Chart visualization would be implemented here
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}