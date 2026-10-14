import ScrollReveal from '@/components/public/ScrollReveal';
import { LayoutDashboard, Terminal } from 'lucide-react';
import * as projectRepo from '@/lib/repositories/project.repository';
import * as pageRepo from '@/lib/repositories/page.repository';
import WorldMap from '@/components/ui/WorldMap';
import ArcGallery from '@/components/ui/ArcGallery';
import ProjectWheel from '@/components/public/ProjectWheel';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Work | Analytics Dev',
    description: 'Thirteen systems built and shipped across construction, healthcare supply, retail, real estate and education. Client work and projects built in-house.',
    alternates: {
        canonical: 'https://analyticsdev.xyz/projects',
    },
    openGraph: {
        title: 'Work | Analytics Dev',
        description: 'Thirteen systems built and shipped. Client work first, then the ones I built on my own.',
        url: 'https://analyticsdev.xyz/projects',
        type: 'website',
    },
};

const projectsSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "CollectionPage",
            "@id": "https://analyticsdev.xyz/projects#webpage",
            "url": "https://analyticsdev.xyz/projects",
            "name": "Featured Projects by Analytics Dev",
            "description": "Portfolio of production web applications, decision systems, and AI workflows delivered across Mumbai, India, and the GCC.",
            "mainEntity": {
                "@id": "https://analyticsdev.xyz/#organization"
            }
        }
    ]
};

export const dynamic = 'force-dynamic';

// Decorative routes for the hero map. These are not client locations and are
// never labelled as such; they exist to give the graphic a shape that reaches
// out of India. Nothing on the page claims work in these places.
const IN = { lat: 19.076, lng: 72.8777 };
const ROUTES = [
    { start: IN, end: { lat: 25.2048, lng: 55.2708 } },
    { start: { lat: 25.2048, lng: 55.2708 }, end: { lat: 51.5074, lng: -0.1278 } },
    { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 40.7128, lng: -74.006 } },
    { start: IN, end: { lat: 1.3521, lng: 103.8198 } },
    { start: { lat: 1.3521, lng: 103.8198 }, end: { lat: 35.6762, lng: 139.6503 } },
    { start: IN, end: { lat: -1.2921, lng: 36.8219 } }
];

async function getProjectsData() {
    const [projects, page] = await Promise.all([
        projectRepo.findAllProjects().catch(() => []),
        pageRepo.findPageBySlug('projects').catch(() => null)
    ]);
    return { projects, content: page?.content || {} };
}

export default async function ProjectsPage() {
    const { projects, content } = await getProjectsData();

    // Only real screenshots go in the arc. Below three it reads as a mistake
    // rather than a gallery, so the whole band stays off until they exist.
    const arcItems = projects
        .filter((project) => project.images?.length)
        .map((project) => ({
            src: project.images[0],
            title: project.title,
            href: `/projects/${project.slug}`
        }));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200/50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
            />
            {/* Hero: the map sits behind the words */}
            <div className="relative isolate overflow-hidden bg-white border-b border-slate-100 relative md:sticky md:top-0 z-0 md:min-h-[100dvh] flex flex-col justify-center">
                <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full pt-28 pb-16">
                    <div className="relative">
                        {/* ScrollReveal's own wrapper is position:relative, so the
                            overlay has to sit outside it or it anchors to nothing. */}
                        <div className="relative z-10 md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center">
                            <ScrollReveal variant="blur" width="100%" className="w-full">
                                <div className="text-center">
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-mono border border-slate-200">
                                        <Terminal size={12} />
                                        <span>{content.label || 'WORK'}</span>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500 bg-white/80 border border-slate-200 px-3 py-1 rounded-full backdrop-blur-sm">
                                        13 shipped
                                    </span>
                                </div>

                                    <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.08]">
                                    {content.headline || 'Thirteen builds, start to finish'}
                                </h1>

                                    <p className="mt-4 max-w-md mx-auto text-base md:text-lg text-slate-600 leading-relaxed">
                                    {content.subtext || 'Client work first, then what I built for myself. Ask about any one and I will show you the code.'}
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>

                        <WorldMap className="mt-8 md:mt-0" arcs={ROUTES} />
                    </div>
                </div>
            </div>

            {arcItems.length >= 3 && (
                <div className="relative overflow-hidden bg-white pt-16 pb-24 border-b border-slate-100 relative md:sticky md:top-0 z-[5] md:min-h-[100dvh] flex flex-col justify-center">
                    <ArcGallery items={arcItems}>
                        <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                            Every screen here is from something running
                        </h2>
                        <p className="mt-4 text-base text-slate-600 leading-relaxed">
                            No mockups and no concept art. Pick any one and it opens the write-up
                            for that build.
                        </p>
                    </ArcGallery>
                </div>
            )}

            {/* Content Grid */}
            <div className="relative w-full bg-white rounded-t-[3.5rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] border-t border-slate-100 -mt-10 md:-mt-20 z-10" style={{ minHeight: '100vh' }}>
                <div className="max-w-7xl mx-auto px-6 py-6 md:py-10">
                    {projects.length > 0 ? (
                        <ProjectWheel projects={projects} />
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
                                <LayoutDashboard className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Nothing here yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                The write-ups are being added. Check back in a few days.
                            </p>
                        </div>
                    )
                    }
                </div>
            </div >
        </div >
    );
}
