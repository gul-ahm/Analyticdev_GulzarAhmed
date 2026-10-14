const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'analyticsdev',
        });

        console.log('Running migration: Add reset password columns to users table...');

        // Check if columns exist to avoid error
        const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'reset_password_token'");

        if (columns.length === 0) {
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN reset_password_token VARCHAR(255) NULL,
                ADD COLUMN reset_password_expires DATETIME NULL
            `);
            console.log('Migration successful: Columns added.');
        } else {
            console.log('Migration skipped: Columns already exist.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
