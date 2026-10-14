import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { LRUCache } from 'lru-cache';
import { getClientIp } from '@/lib/security';

const rateLimit = new LRUCache({
    max: 500, // Max tokens
    ttl: 60 * 1000, // 1 minute window
});

const LIMIT_CONFIG: Record<string, number> = {
    '/api/contact': 5, // 5 requests per minute
    '/api/reviews/public': 10,
    '/api/applications': 5,
};

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-here-change-in-production'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. ADMIN ROUTE PROTECTION
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        try {
            await jwtVerify(token, JWT_SECRET);
        } catch (error) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('token');
            return response;
        }
    }

    // 2. API RATE LIMITING
    if (pathname.startsWith('/api')) {
        const ip = getClientIp(request);
        const limit = LIMIT_CONFIG[pathname] || 100;

        // DEBUG LOGGING: Help user check proxy configuration
        if (pathname === '/api/contact') {
            console.log(`[Middleware] Rate Limit Check: ${pathname} | IP: ${ip} | X-Real-IP: ${request.headers.get('x-real-ip')} | X-Forwarded-For: ${request.headers.get('x-forwarded-for')}`);
        }

        const tokenCount = (rateLimit.get(ip) as number) || 0;

        if (tokenCount >= limit) {
            console.warn(`[Middleware] Rate Limit Exceeded for IP: ${ip} on ${pathname}`);
            return new NextResponse(
                JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        rateLimit.set(ip, tokenCount + 1);
    }

    const response = NextResponse.next();

    // 3. SECURITY HEADERS
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    const csp = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:;";
    response.headers.set('Content-Security-Policy', csp);

    return response;
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
