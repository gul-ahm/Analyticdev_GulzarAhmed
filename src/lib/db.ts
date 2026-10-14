import { testConnection } from './mysql';

/**
 * Database connection utility
 * Maintains backward compatibility while using MySQL
 */

interface DBCache {
    connected: boolean;
    promise: Promise<boolean> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var dbCache: DBCache;
}

let cached = global.dbCache;

if (!cached) {
    cached = global.dbCache = { connected: false, promise: null };
}

async function dbConnect() {
    const MYSQL_HOST = process.env.MYSQL_HOST;

    if (!MYSQL_HOST) {
        console.warn('MySQL environment variables not defined. Database features will not work.');
        return null;
    }

    if (cached.connected) {
        return true;
    }

    // A failed attempt is never cached. Caching it meant one bad moment, such
    // as MySQL refusing with "Too many connections", left every later request
    // reading from the fallback until the server was restarted.
    if (!cached.promise) {
        cached.promise = testConnection().then((success) => {
            cached.connected = success;
            if (!success) {
                cached.promise = null;
            }
            return success;
        });
    }

    try {
        const connected = await cached.promise;
        return connected ? true : null;
    } catch (e) {
        cached.promise = null;
        cached.connected = false;
        throw e;
    }
}

export default dbConnect;
