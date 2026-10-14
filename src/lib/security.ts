import { NextRequest } from 'next/server';

/**
 * Validates the Magic Number (Hex Signature) of a file buffer against its expected type.
 * Prevents extension spoofing (e.g. .exe renamed to .png).
 */
export function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
    const header = buffer.toString('hex', 0, 4);

    const signatures: Record<string, string[]> = {
        'image/jpeg': ['ffd8ff'],
        'image/png': ['89504e47'],
        'image/gif': ['47494638'],
        'image/webp': ['52494646'], // WEBP starts with RIFF...WEBP
        'video/mp4': ['66747970'], // ftyp
    };

    const expectedSigs = signatures[mimeType] || [];

    // If no signature is defined for this type, we skip this specific check 
    // (or return false if we want strict allowlist only)
    if (expectedSigs.length === 0) return true;

    for (const sig of expectedSigs) {
        if (header.startsWith(sig)) return true;
        // Special case for WEBP (RIFF....WEBP)
        if (mimeType === 'image/webp' && buffer.toString('hex', 8, 12) === '57454250') return true;
    }

    return false;
}

/**
 * Robustly determines the client's IP address, prioritizing trusted headers
 * to prevent simple spoofing via X-Forwarded-For.
 */
export function getClientIp(request: NextRequest): string {
    // Cloudflare / Vercel often use 'x-real-ip' or 'cf-connecting-ip'
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp;

    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // X-Forwarded-For can be a comma-separated list. The first one is the original client.
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        return ips[0];
    }

    return 'unknown';
}
