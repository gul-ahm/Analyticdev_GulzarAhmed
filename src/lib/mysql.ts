import mysql from 'mysql2/promise';

/**
 * MySQL Connection Pool - Production Optimized
 * Configured for shared hosting / cPanel environments
 */

interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

// The pool lives on globalThis, not in module scope. Next.js reloads this
// module on every edit in dev, and a module-level pool would leak five
// connections per reload until MySQL refuses with ER_CON_COUNT_ERROR.
declare global {
    // eslint-disable-next-line no-var
    var mysqlPool: mysql.Pool | null | undefined;
}

let isTestingConnection = false;

/**
 * Get connection pool configuration
 * Optimized for shared hosting with conservative limits
 */
function getPoolConfig(): MySQLConfig & mysql.PoolOptions {
    return {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'analyticsdev',

        // Shared hosting optimizations
        waitForConnections: true,
        connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '5'), // Reduced for shared hosting
        queueLimit: 10, // Prevent infinite queue buildup
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000, // 10 seconds

        // Reconnection settings
        connectTimeout: 10000, // 10 seconds

        // MySQL 8+ compatibility
        charset: 'utf8mb4',
    };
}

/**
 * Initialize MySQL connection pool
 */
function getPool(): mysql.Pool {
    if (global.mysqlPool) {
        return global.mysqlPool;
    }

    const config = getPoolConfig();
    const pool = mysql.createPool(config);
    global.mysqlPool = pool;

    // Handle pool errors gracefully
    pool.on('connection', (connection) => {
        // Connection acquired from pool
        connection.on('error', (err) => {
            // Log error but don't expose to client
            // IGNORE 4031 (Inactivity timeout) as it is auto-handled by retry logic
            if (process.env.NODE_ENV !== 'production' && (err as any).errno !== 4031) {
                console.error('MySQL connection error:', err.code);
            }
        });
    });

    return pool;
}

/**
 * Execute a query with automatic retry on connection failure
 */
export async function query<T = any>(
    sql: string,
    params?: any[]
): Promise<T[]> {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(sql, params);
        return rows as T[];
    } catch (error: any) {
        // Handle connection errors gracefully
        if (isConnectionError(error)) {
            // Reset pool on connection error
            await resetPool();

            // Retry once
            const pool = getPool();
            const [rows] = await pool.execute(sql, params);
            return rows as T[];
        }
        throw error;
    }
}

/**
 * Execute a query and return the first row
 */
export async function queryOne<T = any>(
    sql: string,
    params?: any[]
): Promise<T | null> {
    const results = await query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
}

/**
 * Execute an insert and return the inserted ID
 */
export async function insert(
    sql: string,
    params?: any[]
): Promise<number> {
    try {
        const pool = getPool();
        const [result] = await pool.execute(sql, params);
        return (result as mysql.ResultSetHeader).insertId;
    } catch (error: any) {
        if (isConnectionError(error)) {
            await resetPool();
            const pool = getPool();
            const [result] = await pool.execute(sql, params);
            return (result as mysql.ResultSetHeader).insertId;
        }
        throw error;
    }
}

/**
 * Execute an update/delete and return affected rows
 */
export async function execute(
    sql: string,
    params?: any[]
): Promise<number> {
    try {
        const pool = getPool();
        const [result] = await pool.execute(sql, params);
        return (result as mysql.ResultSetHeader).affectedRows;
    } catch (error: any) {
        if (isConnectionError(error)) {
            await resetPool();
            const pool = getPool();
            const [result] = await pool.execute(sql, params);
            return (result as mysql.ResultSetHeader).affectedRows;
        }
        throw error;
    }
}

/**
 * Begin a transaction
 */
export async function getConnection(): Promise<mysql.PoolConnection> {
    const pool = getPool();
    return await pool.getConnection();
}

/**
 * Test database connection (silent in production)
 */
export async function testConnection(): Promise<boolean> {
    if (isTestingConnection) {
        return false; // Prevent concurrent connection tests
    }

    isTestingConnection = true;
    try {
        const pool = getPool();
        await pool.query('SELECT 1');

        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
            // console.log('MySQL connection established');
        }

        return true;
    } catch (error) {
        // Only log errors in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('MySQL connection failed:', (error as Error).message);
        }
        return false;
    } finally {
        isTestingConnection = false;
    }
}

/**
 * Check if error is a connection-related error
 */
function isConnectionError(error: any): boolean {
    const connectionErrorCodes = [
        'PROTOCOL_CONNECTION_LOST',
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'EPIPE',
        'ER_CLIENT_INTERACTION_TIMEOUT',
        'ER_CON_COUNT_ERROR'
    ];

    // A query that was running while the pool closed carries no code, only the
    // message, so it has to be matched on text.
    const closed = typeof error?.message === 'string' && /pool is closed/i.test(error.message);

    return (
        closed ||
        connectionErrorCodes.includes(error.code) ||
        error.errno === 'ECONNREFUSED' ||
        error.errno === 4031 ||
        error.errno === 1040
    );
}

/**
 * Reset the connection pool
 */
async function resetPool(): Promise<void> {
    const pool = global.mysqlPool;
    if (!pool) return;

    // Clear the reference first, so anything asking for a pool after this point
    // builds a fresh one. Closing takes as long as the in-flight queries do, and
    // callers that waited on it used to come back to a pool already ended.
    global.mysqlPool = null;
    try {
        await pool.end();
    } catch (error) {
        // Ignore errors during pool closure
    }
}

/**
 * Close the connection pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
    await resetPool();
}

/**
 * Format date for MySQL DATETIME
 */
export function formatDate(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Parse MySQL DATETIME to JavaScript Date
 */
export function parseDate(mysqlDate: string): Date {
    return new Date(mysqlDate);
}

export default getPool;
