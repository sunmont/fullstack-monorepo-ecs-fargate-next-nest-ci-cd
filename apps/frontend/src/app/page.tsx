import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { PostsList } from '@/components/posts/posts-list';
import { fetchPosts } from '@/lib/actions/posts';

async function PostsSection() {
    const posts = await fetchPosts({ limit: 3 });

    return <PostsList posts={posts} />;
}

export default function HomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Build Modern FullStack Apps
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Professional monorepo with Next.js 15, NestJS, MongoDB, and AWS CDK
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button size="lg">Get Started</Button>
                    </Link>
                    <Link href="https://github.com" target="_blank">
                        <Button variant="outline" size="lg">
                            View on GitHub
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section>
                <h2 className="text-3xl font-bold text-center mb-8">Modern Stack</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Next.js 15</CardTitle>
                            <CardDescription>App Router & Server Components</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li>• Hybrid Rendering Strategies</li>
                                <li>• Built-in Image Optimization</li>
                                <li>• TypeScript Support</li>
                                <li>• File-based Routing</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>NestJS Backend</CardTitle>
                            <CardDescription>Enterprise-grade API</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li>• JWT Authentication</li>
                                <li>• MongoDB Integration</li>
                                <li>• Role-based Authorization</li>
                                <li>• Request Validation</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>AWS Infrastructure</CardTitle>
                            <CardDescription>CDK & Fargate</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li>• Infrastructure as Code</li>
                                <li>• ECS Fargate Deployment</li>
                                <li>• CI/CD Pipeline</li>
                                <li>• LocalStack Development</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Recent Posts */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Recent Posts</h2>
                    <Link href="/posts">
                        <Button variant="outline">View All</Button>
                    </Link>
                </div>
                <Suspense fallback={
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-20 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }>
                    <PostsSection />
                </Suspense>
            </section>
        </div>
    );
}