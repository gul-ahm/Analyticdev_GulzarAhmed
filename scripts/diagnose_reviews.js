const mysql = require('mysql2/promise');

async function check() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'analyticsdev'
    });

    console.log('Connected to DB.');

    // Check total reviews
    const [all] = await connection.execute('SELECT COUNT(*) as count FROM reviews');
    console.log('Total Reviews:', all[0].count);

    // Check featured reviews
    const [featured] = await connection.execute('SELECT COUNT(*) as count FROM reviews WHERE featured = 1');
    console.log('Featured Reviews:', featured[0].count);

    if (featured[0].count > 0) {
        const [rows] = await connection.execute('SELECT id, client_name, featured FROM reviews WHERE featured = 1 LIMIT 5');
        console.log('Sample Featured:', rows);
    }

    await connection.end();
}

check().catch(console.error);
