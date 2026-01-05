import type { Metadata } from "next";
import { Inter  } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'FullStack Monorepo - Professional Template',
    description: 'Modern Next.js + Nest.js + MongoDB application',
    keywords: ['nextjs', 'nestjs', 'mongodb', 'fullstack', 'monorepo'],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
                <Navbar />
                <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
        </Providers>
        </body>
        </html>
    );
}