import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import { jwtVerify } from 'jose';

/**
 * Retrieves the current authenticated user from cookies.
 * Works in Server Components and API Routes.
 */
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        // We can use verifyToken (jsonwebtoken) since this runs in Node.js runtime (Server Components)
        // But for consistency with Middleware, we could use jose, or stick to jsonwebtoken.
        // verifyToken returns Synchronously usually if not utilizing callbacks, but here it is fine.
        // Check lib/auth.ts implementation.

        // Using jsonwebtoken from lib/auth
        const payload = verifyToken(token);
        return payload;
    } catch (error) {
        return null;
    }
}

/**
 * Edge compatible version if needed for specific edge routes
 */
export async function getCurrentUserEdge(token: string) {
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
}
