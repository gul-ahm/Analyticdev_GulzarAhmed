const mysql = require('mysql2/promise');
require('dotenv').config();

const services = [
  {
    title: 'Websites and web applications',
    slug: 'web-engineering',
    description: 'Websites and web applications on Next.js, React and TypeScript. You get the price before the work starts, and it does not move unless you change what you asked for.',
    icon: 'Code2',
    order: 1,
    features: [
      'Fast on a phone, with a 95+ Lighthouse score in the contract',
      'The code, domain and hosting accounts are in your name',
      'Built so Google and AI search engines can read it properly',
      'Live in 14 to 21 working days'
    ]
  },
  {
    title: 'AI agents and automation',
    slug: 'ai-decision-systems',
    description: 'A repeated job handed over to software: outreach that writes a different message for each company, a pipeline that handles everything after a video is finished, an agent that reads documents and gives you an answer you can check.',
    icon: 'BrainCircuit',
    order: 2,
    features: [
      'Answers come from your own documents, with the source attached',
      'Output has to match a fixed shape before it is accepted',
      'A person signs off at the points that matter',
      'Connects to the tools you already use: CRM, email, webhooks'
    ]
  },
  {
    title: 'Data work and dashboards',
    slug: 'data-infrastructure',
    description: 'Four spreadsheets, three people, and no agreement on which number is right. I pull that into one place and build a view you can open on a Monday morning and trust.',
    icon: 'Database',
    order: 3,
    features: [
      'Your scattered data pulled into one clean database',
      'Dashboards where every figure traces back to its source',
      'Checks that tell you when a number stops making sense',
      'Handles the messy real file, not an idealised one'
    ]
  },
  {
    title: 'Hosting and deployment',
    slug: 'cloud-devops',
    description: 'Updates that go out without taking the site down, fast loading everywhere in the world, and monitoring that tells me something is wrong before you notice it.',
    icon: 'Server',
    order: 4,
    features: [
      'Deploys that do not take the site offline',
      'Fast loading worldwide through a CDN',
      'Protection against attacks and traffic floods',
      'Running on your own accounts, not mine'
    ]
  }
];

const socialLinks = [
  { platform: 'GitHub', url: 'https://github.com/gul-ahm', icon: 'github', display_order: 1 },
  { platform: 'LinkedIn', url: 'https://linkedin.com/in/gul-ahm', icon: 'linkedin', display_order: 2 },
  { platform: 'Twitter', url: 'https://x.com', icon: 'twitter', display_order: 3 }
];

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  console.log('Seeding services...');
  for (const s of services) {
    const [existing] = await conn.execute('SELECT id FROM services WHERE slug = ?', [s.slug]);
    if (existing.length === 0) {
      await conn.execute(
        'INSERT INTO services (title, slug, description, icon, `order`, features) VALUES (?, ?, ?, ?, ?, ?)',
        [s.title, s.slug, s.description, s.icon, s.order, JSON.stringify(s.features)]
      );
      console.log(`+ Added service: ${s.title}`);
    } else {
      await conn.execute(
        'UPDATE services SET title = ?, description = ?, icon = ?, `order` = ?, features = ? WHERE slug = ?',
        [s.title, s.description, s.icon, s.order, JSON.stringify(s.features), s.slug]
      );
      console.log(`~ Updated service: ${s.title}`);
    }
  }

  console.log('Seeding social links...');
  for (const sl of socialLinks) {
    const [existing] = await conn.execute('SELECT id FROM social_links WHERE platform = ?', [sl.platform]);
    if (existing.length === 0) {
      await conn.execute(
        'INSERT INTO social_links (platform, url, icon, is_active, display_order) VALUES (?, ?, ?, 1, ?)',
        [sl.platform, sl.url, sl.icon, sl.display_order]
      );
      console.log(`+ Added social link: ${sl.platform}`);
    }
  }

  await conn.end();
  console.log('Done!');
}

seed().catch(console.error);
