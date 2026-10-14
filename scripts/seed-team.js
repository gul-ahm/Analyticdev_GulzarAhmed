// The studio is one person. This replaces whatever is in team_members with that.
//   node scripts/seed-team.js

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const member = {
    name: 'Gulzar Ahmed',
    slug: 'gulzar-ahmed',
    position: 'Founder & Engineer',
    headline: 'The whole studio',
    quote: 'If a simpler thing works, I build the simpler thing.',
    bio: 'I write the code, answer the emails and stay on the project after it goes live. Background in data science and full-stack work: a diploma in computer engineering, then a BTech in computer science with an AI specialisation, and production work since 2024. Before starting this studio I worked on retail data systems and owned the AI side of a construction-tech product end to end.',
    displayOrder: 1
};

async function seedTeam() {
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'analyticsdev'
    });

    const [existing] = await conn.execute('SELECT name FROM team_members');
    await conn.execute('DELETE FROM team_members');
    existing.forEach((m) => console.log(`removed: ${m.name}`));

    await conn.execute(
        `INSERT INTO team_members (name, slug, position, headline, quote, bio, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [member.name, member.slug, member.position, member.headline, member.quote, member.bio, member.displayOrder]
    );
    console.log(`added: ${member.name}`);

    await conn.end();
}

seedTeam().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
