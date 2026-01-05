import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers);

    // Security headers
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (adjust based on your needs)
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com;"
    );

    // Cache control for static assets
    if (request.nextUrl.pathname.startsWith('/_next/static')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
    }

    // API route protection
    if (request.nextUrl.pathname.startsWith('/api')) {
        const token = request.headers.get('authorization');

        if (!token && !request.nextUrl.pathname.includes('/api/auth')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Rate limiting (simplified)
        const ip = request.ip || 'unknown';
        const rateLimitKey = `rate-limit:${ip}`;

        // You would implement Redis or similar here
        const requests = 0; // Get from Redis

        if (requests > 100) { // 100 requests per minute
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }
    }

    // Authentication check for protected routes
    const protectedRoutes = ['/dashboard', '/admin', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        const token = request.cookies.get('access_token');

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};