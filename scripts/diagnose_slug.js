const mysql = require('mysql2/promise');

async function check() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'analyticsdev'
    });

    console.log('Connected to DB.');

    const targetSlug = 'nexuscrm-migration';
    console.log(`Checking for slug: '${targetSlug}'`);

    const [rows] = await connection.execute('SELECT id, slug, title FROM projects WHERE slug = ?', [targetSlug]);

    if (rows.length > 0) {
        console.log('Found exact match:', rows[0]);
    } else {
        console.log('Exact match NOT found.');

        console.log('Fetching ALL slugs to inspect:');
        const [allProjects] = await connection.execute('SELECT id, slug, title FROM projects');

        allProjects.forEach(p => {
            console.log(`ID: ${p.id}, Title: "${p.title}", Slug: "${p.slug}"`);
            // Check char codes
            const codes = [];
            for (let i = 0; i < p.slug.length; i++) {
                codes.push(p.slug.charCodeAt(i));
            }
            console.log(`   Char codes: ${codes.join(', ')}`);
        });
    }

    await connection.end();
}

check().catch(console.error);
