
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function clearData() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    try {
        console.log('Clearing projects...');
        await connection.execute('DELETE FROM projects');
        console.log('Projects cleared.');

        console.log('Clearing reviews...');
        await connection.execute('DELETE FROM reviews');
        console.log('Reviews cleared.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

clearData();
