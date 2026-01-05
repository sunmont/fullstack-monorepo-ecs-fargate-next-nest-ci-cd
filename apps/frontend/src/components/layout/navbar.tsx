'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold">
                        FullStackHub
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/posts"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Posts
                        </Link>
                        <Link
                            href="/users"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Users
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm">Welcome, {user.name}</span>
                            <Button variant="outline" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}