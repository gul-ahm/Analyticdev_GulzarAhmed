import Link from 'next/link';
import * as teamRepo from '@/lib/repositories/team.repository';
import EmptyState from '@/components/shared/EmptyState';
import { Linkedin, Twitter, Github, Users, TrendingUp, Award, ArrowRight, CheckCircle2, Bot, Code2, LineChart, Layout } from 'lucide-react';
import PhilosophySection from '@/components/public/PhilosophySection';
import MurmurationWordmark from '@/components/ui/MurmurationWordmark';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Who you work with | Analytics Dev',
    description: 'Analytics Dev is one engineer: Gulzar Ahmed, in Mumbai. Here is who you will actually be working with.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/team',
    },
    openGraph: {
        title: 'Who you work with | Analytics Dev',
        description: 'Analytics Dev is one engineer: Gulzar Ahmed, in Mumbai.',
        url: 'https://analyticsdev.xyz/team',
        type: 'website',
    },
};

const teamSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": "https://analyticsdev.xyz/team#founder",
            "name": "Gulzar Ahmed",
            "jobTitle": "Founder & Principal Engineer",
            "worksFor": { "@id": "https://analyticsdev.xyz/#organization" },
            "sameAs": [
                "https://linkedin.com/in/gul-ahm",
                "https://github.com/gul-ahm"
            ],
            "description": "Founder and systems architect leading web development, AI workflow automation, and data platforms."
        }
    ]
};



import { ITeamMember } from '@/models/TeamMember';

const DEFAULT_MEMBERS: ITeamMember[] = [
    {
        id: 1,
        name: 'Gulzar Ahmed',
        slug: 'gulzar-ahmed',
        position: 'Founder & Principal Engineer',
        headline: 'The whole studio',
        bio: 'I write the code, answer the emails and stay on the project after it goes live. Background in data science and full-stack work: a diploma in computer engineering, then a BTech in computer science with an AI specialisation, and production work since 2024. Before starting this studio I worked on retail data systems and owned the AI side of a construction-tech product end to end.',
        quote: 'If a simpler thing works, I build the simpler thing.',
        image: '',
        displayOrder: 0,
        socialLinks: {
            linkedin: 'https://linkedin.com/in/gul-ahm',
            github: 'https://github.com/gul-ahm'
        }
    }
];

/** Quotes typed into the admin with their own quote marks get them stripped,
 *  so the page never renders a doubled pair. */
function stripQuotes(text: string) {
    return text.trim().replace(/^["\u201C\u201D']+|["\u201C\u201D']+$/g, '').trim();
}

export default async function TeamPage() {
    let allMembers: ITeamMember[] = await teamRepo.findAllTeamMembers().catch((err) => {
        // Without this the page quietly shows the fallback member and the real
        // database error never reaches the terminal.
        console.error('[team] database read failed:', err?.code || err?.message);
        return [] as ITeamMember[];
    });
    if (!allMembers || allMembers.length === 0) {
        allMembers = DEFAULT_MEMBERS;
    }

    return (
        <div className="bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }}
            />

            {/* 1. HERO - the flock spells the studio name */}
            <MurmurationWordmark
                word="ANALYTICSDEV"
                height="100svh"
                palette={{ skyTop: '#f8fafc', skyLow: '#e2e8f0', sun: '#ffffff', ink: '#0f172a' }}
            >
                <div className="flex h-full flex-col justify-between px-6 pb-28 pt-28 lg:px-8">
                    <div className="flex justify-center">
                        <span className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-900 ring-1 ring-inset ring-slate-900/10 backdrop-blur-sm">
                            Who you work with
                        </span>
                    </div>

                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-2xl font-black leading-tight tracking-tighter text-slate-900 sm:text-4xl">
                            One engineer, not an agency.
                        </h1>
                        <p className="mt-4 text-base font-light leading-relaxed text-slate-700 sm:text-lg">
                            There is no team page to pad out here. When you hire Analytics Dev you get
                            me, and that is the point: nothing is handed to a junior and nothing is lost
                            between people.
                        </p>
                    </div>
                </div>
            </MurmurationWordmark>

            {/* 2. TEAM MEMBERS - STACKED PREMIUM SECTIONS */}
            {allMembers.map((member, index) => {
                const isEven = index % 2 === 0;

                return (
                    <div
                        key={member.id}
                        className={`relative md:sticky md:top-0 md:min-h-[100dvh] flex flex-col justify-center pt-12 pb-28 md:pt-16 md:pb-32 bg-white rounded-t-[3.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] border-t border-slate-100 ${index === 0 ? 'md:-mt-20' : ''}`}
                        style={{ zIndex: 10 + index }}
                    >
                        {/* Abstract Background Elements - Vary positions slightly based on odd/even to mix it up */}
                        <div className={`absolute top-1/2 ${isEven ? 'left-0' : 'right-0'} -translate-y-1/2 w-1/2 h-full bg-gradient-to-r from-gray-50 to-transparent -z-10`} />
                        <div className={`absolute top-1/4 ${isEven ? 'right-0' : 'left-0'} w-[500px] h-[500px] bg-slate-700/5 rounded-full blur-3xl -z-10`} />

                        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">

                                {/* IMAGE CANVAS */}
                                <div className={`lg:col-span-5 relative group perspective-1000 mb-3 md:mb-8 lg:mb-0 ${isEven ? 'lg:order-first' : 'lg:order-last'}`}>
                                    <div className="relative aspect-[4/5] md:max-h-[58dvh] overflow-hidden bg-slate-100 shadow-2xl transition-all duration-700 ease-out transform group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                        {/* Frame/Matte */}
                                        <div className="absolute inset-4 border border-white/20 z-20 pointer-events-none" />

                                        {/* Image Placeholder or Real Image */}
                                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
                                            {member.image ? (
                                                member.image.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={member.image}
                                                        className="w-full h-full object-cover"
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                )
                                            ) : (
                                                <Users className="h-32 w-32 opacity-20" />
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-white font-mono text-sm tracking-widest uppercase">{member.position}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* TEXT EXHIBIT */}
                                <div className={`lg:col-span-7 relative z-10 ${isEven ? 'lg:-ml-12' : 'lg:-mr-12 lg:order-first'}`}>
                                    <div className="bg-white/80 backdrop-blur-xl p-4 pt-5 md:p-12 shadow-xl border-l-4 border-slate-900">
                                        <h2 className="text-[10px] md:text-sm font-bold tracking-[0.2em] text-slate-900 uppercase mb-2 md:mb-4">
                                            {member.headline || (member.displayOrder === 0 ? "Vision & Leadership" : (member.position || "Team Member"))}
                                        </h2>
                                        <h3 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 md:mb-6">
                                            {member.name}
                                        </h3>

                                        {/* Render quote if available */}
                                        {member.quote && (
                                            <blockquote className="text-sm md:text-xl italic text-gray-600 border-l border-gray-300 pl-3 md:pl-4 mb-2 md:mb-8 font-serif leading-relaxed">
                                                {`\u201C${stripQuotes(member.quote)}\u201D`}
                                            </blockquote>
                                        )}

                                        <div className="space-y-3 md:space-y-6 text-sm md:text-lg text-gray-600 leading-snug md:leading-relaxed mb-4 md:mb-8">
                                            <p className="whitespace-pre-line">
                                                {member.bio}
                                            </p>
                                        </div>

                                        <div className="flex gap-6">
                                            {member.socialLinks?.linkedin && (
                                                <a href={member.socialLinks.linkedin} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-none text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider">
                                                    <Linkedin className="w-4 h-4" /> Connect
                                                </a>
                                            )}
                                            {member.socialLinks?.github && (
                                                <a href={member.socialLinks.github} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-none text-sm font-medium hover:bg-gray-200 transition-colors uppercase tracking-wider">
                                                    <Github className="w-4 h-4" /> Work
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* 3. PHILOSOPHY - INTERACTIVE COMPONENT */}
            {/* Added extra z-index to ensure it sits on top of the stack */}
            <div className="relative md:sticky md:top-0 bg-white rounded-t-[3.5rem] min-h-screen flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] md:-mt-24" style={{ zIndex: 10 + allMembers.length + 1 }}>
                <PhilosophySection />
            </div>

        </div>
    );
}

