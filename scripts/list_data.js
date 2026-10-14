
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

async function listData() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        const [projects] = await connection.execute('SELECT id, title FROM projects');
        console.log('--- PROJECTS ---');
        console.table(projects);

        const [reviews] = await connection.execute('SELECT id, client_name FROM reviews');
        console.log('--- REVIEWS ---');
        console.table(reviews);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

listData();
