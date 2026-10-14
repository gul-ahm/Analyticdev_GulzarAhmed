const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        console.log('Adding svg_icon column to projects table...');
        await connection.query(`
            ALTER TABLE projects 
            ADD COLUMN svg_icon TEXT NULL AFTER images
        `);
        console.log('Migration successful');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column svg_icon already exists');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        await connection.end();
    }
}

migrate();
