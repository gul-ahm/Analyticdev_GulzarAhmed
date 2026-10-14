const fs = require('fs');
const path = require('path');

// FORCE local node_modules usage for cPanel/Shared Hosting
const localNodeModules = path.join(__dirname, '../node_modules');
console.log('[Migration] Adding to module.paths:', localNodeModules);
module.paths.push(localNodeModules);

console.log('Starting migration script...');
console.log('CWD:', process.cwd());

try {
    console.log('Resolving mysql2...');
    const mysqlPath = require.resolve('mysql2');
    console.log('Resolved mysql2 at:', mysqlPath);
} catch (e) {
    console.error('Could not resolve mysql2:', e.message);
    // Continue anyway to let the require fail naturally if it must
}

const mysql = require('mysql2');

// Load environment variables (optional, for local dev)
try {
    const dotenv = require('dotenv');
    dotenv.config();
} catch (e) {
    // dotenv not found, assuming env vars set by host
}

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');

        // Manual promise wrapper to avoid 'mysql2/promise' resolution issues
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER || 'analytic_user_admin',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'analytic_user_analyticsdev',
            multipleStatements: true,
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });

        connection = pool.promise();

        // Test connection
        await connection.query('SELECT 1');
        console.log('Connected to database.');

        // 002
        console.log('Running migration: 002_add_team_columns.sql');
        const sqlPath002 = path.join(__dirname, '../migrations/002_add_team_columns.sql');
        if (fs.existsSync(sqlPath002)) {
            const sql002 = fs.readFileSync(sqlPath002, 'utf8');
            try {
                await connection.query(sql002);
                console.log('Migration 002 complete.');
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log('Migration 002 already applied (columns exist).');
                } else {
                    console.warn('Migration 002 warning:', e.message);
                }
            }
        }

        // 003
        console.log('Running migration: 003_create_social_links.sql');
        const sqlPath003 = path.join(__dirname, '../migrations/003_create_social_links.sql');
        if (fs.existsSync(sqlPath003)) {
            const sql003 = fs.readFileSync(sqlPath003, 'utf8');
            try {
                await connection.query(sql003);
                console.log('Migration 003 complete (social_links table).');
            } catch (e) {
                if (e.code === 'ER_TABLE_EXISTS_ERROR') {
                    console.log('Table social_links already exists.');
                } else {
                    throw e;
                }
            }
        } else {
            console.error(`Migration file not found: ${sqlPath003}`);
        }

        console.log('All migrations finished.');
        process.exit(0);

    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist. No changes needed.');
        } else {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
