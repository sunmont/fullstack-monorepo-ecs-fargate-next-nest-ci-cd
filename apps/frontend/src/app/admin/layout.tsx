'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    BarChart3,
    Shield,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarItem, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto space-y-4">
                    <Skeleton className="h-12 w-64" />
                    <div className="grid grid-cols-4 gap-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SidebarHeader>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-primary" />
                            <span className="font-bold">Admin Panel</span>
                        </div>
                        <SidebarTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-4 w-4" />
                            </Button>
                        </SidebarTrigger>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <div className="space-y-1 p-2">
                        <SidebarItem href="/admin" icon={LayoutDashboard}>
                            Dashboard
                        </SidebarItem>
                        <SidebarItem href="/admin/users" icon={Users}>
                            Users
                        </SidebarItem>
                        <SidebarItem href="/admin/posts" icon={FileText}>
                            Posts
                        </SidebarItem>
                        <SidebarItem href="/admin/analytics" icon={BarChart3}>
                            Analytics
                        </SidebarItem>
                        <SidebarItem href="/admin/settings" icon={Settings}>
                            Settings
                        </SidebarItem>
                    </div>

                    <div className="mt-auto p-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={logout}
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </SidebarContent>
            </Sidebar>

            <main className={sidebarOpen ? 'ml-64' : 'ml-0'}>
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="icon"
                className="fixed bottom-4 right-4 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="h-4 w-4" />
            </Button>
        </div>
    );
}