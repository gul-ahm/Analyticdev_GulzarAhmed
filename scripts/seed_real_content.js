// Replaces the placeholder projects and reviews with the real ones.
// Talks to MySQL directly using the credentials already in .env
//   node scripts/seed_real_content.js

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const icon = (path) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const BOX = icon('<path d="M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>');
const CHART = icon('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>');
const BOT = icon('<rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="M8 16h.01"/><path d="M16 16h.01"/>');
const GLOBE = icon('<circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/><path d="M2 12h20"/>');

const projects = [
    {
        title: 'Quantity surveying AI system',
        slug: 'quantity-surveying-ai-system',
        description: 'An agentic system that reads construction drawings and documents and produces the take-off work a quantity surveyor would otherwise do by hand.',
        content: `## The problem

Quantity surveying is slow because it is manual. Someone opens a drawing set, counts what is in it, and writes the numbers down. On a large job that is days of work, and two surveyors rarely arrive at the same figure.

## What I built

An agentic system that reads the drawings and documents and produces the take-off, with every number traceable back to the page it came from. The surveyor checks the output instead of starting from nothing.

I owned the AI side of this product end to end, from the first design through to production, between May 2025 and January 2026.

## Stack

Python, LLM agents with tool use, document parsing, FastAPI.`,
        client: 'MEP QS Services',
        tags: ['Python', 'LLM agents', 'FastAPI', 'Construction'],
        svg_icons: [BOT],
        featured: true
    },
    {
        title: 'Real estate platform for Al Bosuala Group',
        slug: 'al-bosuala-real-estate-platform',
        description: 'Property listings, enquiries and an admin panel for a real estate group in Oman.',
        content: `## What it does

Staff add and update properties through an admin panel. Buyers browse listings and send enquiries, which land where the sales team can act on them.

## Stack

Next.js on the front, FastAPI and PostgreSQL behind it, deployed across AWS Amplify, Render and Supabase.`,
        client: 'Al Bosuala Group, Oman',
        tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'AWS'],
        svg_icons: [GLOBE],
        featured: true
    },
    {
        title: 'Ecommerce store run by an AI layer',
        slug: 'ig-collection-autonomous-store',
        description: 'A linen clothing store where the catalogue, product pages and content are managed by an AI layer wired straight into the site.',
        content: `## What it does

Most small store owners lose hours every week to the same jobs: adding a product, fixing a description, updating a page. Here that work goes through an AI layer connected directly to the site, so it happens on instruction instead of by hand.

## Stack

WordPress, an MCP server exposing the site's own operations, LLM tool use.`,
        client: 'IG Collection',
        tags: ['WordPress', 'MCP', 'Automation', 'Ecommerce'],
        svg_icons: [BOT],
        featured: true
    },
    {
        title: 'Construction cost and schedule analysis',
        slug: 'construction-data-analysis',
        description: 'Twenty analysis problems across cost, schedule and material data, built into one linked workbook with dashboards and a written report.',
        content: `## The problem

On most sites the analysis lives in one person's head. When that person is busy, nobody can answer a simple question about cost or delay.

## What I built

A multi-sheet workbook where every figure traces back to source data through formulas, with dashboards on top and a written report explaining what each number means. Anyone on the team can open it and get the answer.

## Stack

Excel, structured formula modelling, Python for the data preparation.`,
        client: 'Commercial construction',
        tags: ['Excel', 'Python', 'Data analysis', 'Reporting'],
        svg_icons: [CHART],
        featured: false
    },
    {
        title: 'Retail inventory and sales platform',
        slug: 'retail-inventory-sales-platform',
        description: 'Inventory and sales data work on a retail platform. My first year of production experience.',
        content: `Worked on the data side of a retail inventory and sales platform: cleaning the incoming data, building the reporting on top of it, and keeping the numbers consistent across the system.

## Stack

Python, SQL, reporting dashboards.`,
        client: 'Deepak Cyber Solution',
        tags: ['Python', 'SQL', 'Retail'],
        svg_icons: [CHART],
        featured: false
    },
    {
        title: 'Marketing website for a construction tech firm',
        slug: 'mep-qs-services-website',
        description: 'The public website for a quantity surveying software company, built alongside their product.',
        content: `A React site explaining what the company does, who it is for, and how to get in touch, built to load fast and be editable by the team without calling a developer.

## Stack

React, modern CSS, static hosting.`,
        client: 'MEP QS Services',
        tags: ['React', 'TypeScript', 'Web'],
        svg_icons: [GLOBE],
        featured: false
    },
    {
        title: 'Medical supply chain optimisation',
        slug: 'medical-supply-chain-optimisation',
        description: 'A multi-agent system for medical supply logistics. Against a heuristic baseline it cut logistics cost by 38.8% and prevented 98% of simulated shortages.',
        content: `## What it does

Medical supply runs on a hard constraint: a shortage is not an inconvenience, it is a patient without a drug. This system plans and reroutes supply to avoid that.

A hierarchy of agents handles planning and execution. Kafka moves the events, OR-Tools does the optimisation, XGBoost and Prophet handle forecasting, and a SimPy digital twin lets the whole thing be tested before it touches anything real.

## Results

Measured against a heuristic baseline in simulation: logistics cost down 38.8%, and 98% of shortages prevented. Built to FDA 21 CFR Part 11 record requirements.

## Note

This is my own project, not client work. I can walk through the code and the test results.`,
        client: 'Own project',
        tags: ['Python', 'Kafka', 'OR-Tools', 'XGBoost', 'SimPy'],
        svg_icons: [BOX],
        featured: true
    },
    {
        title: 'FinSight AI',
        slug: 'finsight-ai',
        description: 'A financial research assistant that answers from real data instead of guessing, pulling from five financial APIs and sentiment across fifteen subreddits.',
        content: `## What it does

Ask it a question about a company or a market and it answers from retrieved data, with the source attached. If it does not have the data, it says so rather than inventing a number.

## Stack

Llama 3 on Groq, LangChain, five financial APIs, Reddit sentiment from over fifteen subreddits. Next.js and TypeScript on the front, MongoDB behind it, with a Jest and Playwright test suite.

## Note

My own project. Code available on request.`,
        client: 'Own project',
        tags: ['LangChain', 'Llama 3', 'Next.js', 'MongoDB'],
        svg_icons: [CHART],
        featured: false
    },
    {
        title: 'Cold outreach and personalisation engine',
        slug: 'cold-outreach-engine',
        description: 'Cleans a prospect list, writes a message specific to each company, sends it, and handles the bounces on its own.',
        content: `## What it does

Mail merge sends the same message to everyone and gets ignored. This reads what each company actually does and writes to that, then sends, tracks and cleans up bounces without anyone watching.

Runs on scheduled jobs with no server to pay for or maintain.

## Stack

Python, LLM drafting, GitHub Actions, SMTP and bounce handling.`,
        client: 'Own project',
        tags: ['Python', 'GitHub Actions', 'LLM', 'Automation'],
        svg_icons: [BOT],
        featured: false
    },
    {
        title: 'YouTube publishing pipeline',
        slug: 'youtube-publishing-pipeline',
        description: 'Takes a finished video and does everything after it: transcribes the audio, then writes the title, description, tags and thumbnail direction from what was actually said.',
        content: `## What it does

Editing a video is the fun part. Writing the title, the description and twenty tags afterwards is the part people stop doing, and that is the part the algorithm reads.

This pulls the audio, transcribes it, and uses a language model to write the title, description, tags and thumbnail direction from the actual content of the video, not from the file name. Then it uploads on a schedule and never publishes the same video twice.

## Stack

Python, speech to text, LLM, YouTube Data API, GitHub Actions.`,
        client: 'Own project',
        tags: ['Python', 'LLM', 'YouTube API', 'Automation'],
        svg_icons: [BOT],
        featured: false
    },
    {
        title: 'Resume tailoring and interview practice',
        slug: 'resume-tailoring-interview-platform',
        description: 'Reads a job description, rewrites a resume against it, and then runs an interview practice session on the same material.',
        content: `## What it does

Two jobs that are really one. It reads the job description, rewrites the resume to match what that role is asking for, and then interviews you on the resume it just wrote, so you are not caught out by your own document.

## Stack

Python, LLM, LaTeX resume generation, Next.js front end.`,
        client: 'Own project',
        tags: ['Python', 'LLM', 'LaTeX', 'Next.js'],
        svg_icons: [BOT],
        featured: false
    },
    {
        title: 'In-game player performance monitoring',
        slug: 'player-performance-monitoring',
        description: 'Live tracking and analysis of player performance on a gaming platform.',
        content: `Collects player events as they happen and turns them into performance measures the platform can act on, with the analysis running close enough to live to be useful during a session rather than after it.

## Stack

Python, event processing, analytics dashboards.`,
        client: 'Gaming platform',
        tags: ['Python', 'Analytics', 'Gaming'],
        svg_icons: [CHART],
        featured: false
    },
    {
        title: 'School activity platform',
        slug: 'school-activity-platform',
        description: 'One parent platform where every school gets its own sub-platform for student activity, under shared administration.',
        content: `## What it does

Each school needs its own space, its own students and its own staff, but nobody wants to run twenty separate systems. This is one platform with a separate sub-platform per school, administered centrally.

## Stack

Next.js, PostgreSQL, role-based access control.`,
        client: 'Education',
        tags: ['Next.js', 'PostgreSQL', 'Multi-tenant'],
        svg_icons: [GLOBE],
        featured: false
    }
];

async function run() {
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    const [oldProjects] = await conn.execute('SELECT title FROM projects');
    const [oldReviews] = await conn.execute('SELECT client_name FROM reviews');

    await conn.execute('DELETE FROM projects');
    await conn.execute('DELETE FROM reviews');
    console.log(`removed ${oldProjects.length} projects and ${oldReviews.length} reviews`);
    oldProjects.forEach((p) => console.log(`  - ${p.title}`));
    oldReviews.forEach((r) => console.log(`  - review by ${r.client_name}`));

    for (const p of projects) {
        await conn.execute(
            `INSERT INTO projects (title, slug, description, content, images, tags, client, live_url, featured, svg_icons)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                p.title,
                p.slug,
                p.description,
                p.content,
                JSON.stringify([]),
                JSON.stringify(p.tags),
                p.client,
                null,
                p.featured ? 1 : 0,
                JSON.stringify(p.svg_icons)
            ]
        );
        console.log(`added: ${p.title}`);
    }

    await conn.end();
    console.log(`\nDone. ${projects.length} projects live.`);
    console.log('Reviews are empty on purpose. Add one when a real client writes it.');
}

run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
