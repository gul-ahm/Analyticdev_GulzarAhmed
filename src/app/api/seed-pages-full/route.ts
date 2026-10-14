
import { NextResponse } from 'next/server';
import { createPage, findPageBySlug, updatePage } from '@/lib/repositories/page.repository';
import { execute } from '@/lib/mysql';

const pages = [
    {
        slug: 'home',
        title: 'Home Page',
        content: {
            hero_tagline: 'Web & AI studio \u00b7 One engineer \u00b7 Mumbai, India',
            hero_headline: 'I build the software \n small teams keep putting off.',
            hero_subtext: 'Websites, internal tools, data pipelines and AI agents. Built by one engineer, shipped in weeks, handed over with the code in your name.',
            hero_cta_primary: 'Book a free call',
            hero_cta_secondary: 'See the work',
            trust_label: 'Track record',
            trust_headline: 'What I have \n actually built.',
            philosophy_label: 'HOW I WORK',
            philosophy_quote: '\u201cIf a simpler thing works, \n I build the simpler thing.\u201d',
            philosophy_author: 'Gulzar Ahmed',
            philosophy_role: 'Founder & Engineer',
            process_label: 'PROCESS',
            process_heading: 'How a project runs',
            process_subtext: 'Four steps. The price is fixed before we start, and you can see the work at every stage.',
            skills_label: 'WHAT I BUILD',
            skills_heading: 'What I build',
            work_label: 'WORK',
            work_heading: 'Selected Work',
            work_subtext: 'Paid client work and systems I built on my own. Some client names are left out because they asked.',
            cta_heading: 'Have something in mind?',
            cta_subtext: 'Send me a few lines about it. I read and answer every message myself, usually the same day.',
            cta_button_text: 'Start a project',
            cta_email: 'hello@analyticsdev.xyz'
        }
    },
    {
        slug: 'about',
        title: 'About',
        content: {
            hero_label: 'About',
            hero_headline: 'One engineer, start to finish.',
            hero_subtext: 'Analytics Dev is me, Gulzar Ahmed. When you hire the studio, I am the one who writes the code, answers your messages and stays on the project after it goes live. Nothing gets passed to someone else.',
            dna_label: 'How I work',
            dna_headline: 'Three things I hold to.',
            dna_subtext: 'These are not slogans. They are the reasons projects here finish on the date I gave you.',
            belief_1_title: 'A price you can plan around',
            belief_1_text: 'You get one number in writing before any work starts, and it does not move unless you change what you asked for. Small businesses cannot run on open-ended hourly bills, so I do not send them.',
            belief_2_title: 'Your data is messy. That is normal.',
            belief_2_text: 'Nobody hands me a clean spreadsheet. Dates in four formats, blank rows, two names for the same customer. I plan for that instead of asking you to fix it first, because that is what the real file always looks like.',
            belief_3_title: 'Built to be handed over',
            belief_3_text: 'The code, the domain and the hosting accounts are in your name from day one. If you hire someone else next year, they should be able to read what I wrote and carry on. That is the test I build to.',
            founder_header: 'Why I started this',
            founder_quote: '\u201cI kept meeting small businesses who had been quoted a number they could not justify, for software they did not need. I wanted to be the person who tells them what they actually need, puts a number against it in writing, and then builds that.\u201d',
            founder_name: 'Gulzar Ahmed',
            founder_cta: 'Tell me what you need'
        }
    },
    {
        slug: 'projects',
        title: 'Projects Header',
        content: {
            label: 'WORK',
            headline: 'Things I have built',
            subtext: 'Paid client work first, then systems I built on my own time. Every one of these is real and I can walk you through it.'
        }
    },
    {
        slug: 'reviews',
        title: 'Reviews Header',
        content: {
            label: 'REVIEWS',
            headline: 'In their words',
            subtext: 'Reviews from people I have worked with, published exactly as they wrote them.',
            link_text: 'See my professional background'
        }
    },
    {
        slug: 'contact',
        title: 'Contact Page',
        content: {
            hero_tagline: 'Get in touch',
            hero_headline: 'Tell me what you \n are stuck on.',
            hero_subtext: 'A few lines is enough. What the problem is, what you have tried, and roughly when you need it done.',
            context_title: 'What happens next',
            context_subtext: 'No forms that go nowhere. Here is exactly what follows:',
            response_time_title: 'A reply within 24 hours',
            response_time_text: 'From me, not an auto-responder. I will have read what you wrote before I answer.',
            discovery_title: 'A 15-minute call, free',
            discovery_text: 'We work out whether I am the right person for this. If I am not, I will say so and point you somewhere better.',
            direct_access_title: 'You talk to me, every time',
            email: 'contact@analyticsdev.xyz'
        }
    }
];

export async function GET() {
    try {
        for (const p of pages) {
            const existing = await findPageBySlug(p.slug);
            if (existing) {
                await updatePage(existing.id, {
                    title: p.title,
                    content: p.content
                });
                console.log(`Updated ${p.slug}`);
            } else {
                await createPage({
                    slug: p.slug,
                    title: p.title,
                    content: p.content,
                    published: true
                });
                console.log(`Created ${p.slug}`);
            }
        }

        return NextResponse.json({ success: true, message: 'Pages seeded successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
