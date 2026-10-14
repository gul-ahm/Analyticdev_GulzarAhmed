
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
// Load environment variables (optional, for local dev)
try {
    const dotenv = require('dotenv');
    dotenv.config();
} catch (e) {
    // dotenv not found, assuming env vars are set by host (cPanel)
}

const EMAIL = process.env.ADMIN_SEED_EMAIL || 'devadmin@analyticsdev.xyz';
const PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'LJio7uiAk&X+yiIL';
const SALT_ROUNDS = 12;

if (!EMAIL || !PASSWORD) {
    console.error('Missing ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD in .env');
    process.exit(1);
}

async function seedAdmin() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER || 'analytic_user_admin',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'analytic_user_analyticsdev',
        });

        console.log(`Checking for existing admin: ${EMAIL}`);

        // Check if user exists
        const [users] = await connection.execute(
            'SELECT id, role FROM users WHERE email = ?',
            [EMAIL]
        );

        if (users.length > 0) {
            console.log('Admin user already exists. Skipping creation.');
            process.exit(0);
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

        console.log('Creating admin user...');
        await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Administrator', EMAIL, hashedPassword, 'admin']
        );

        console.log('Admin user created successfully.');

    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

seedAdmin();
