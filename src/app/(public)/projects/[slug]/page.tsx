import { notFound } from 'next/navigation';
import * as projectRepo from '@/lib/repositories/project.repository';
import SvgCarousel from '@/components/public/SvgCarousel';
import ReactMarkdown from 'react-markdown';

import type { Metadata } from 'next';

interface ProjectDetailProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: ProjectDetailProps): Promise<Metadata> {
    const params = await props.params;
    const project = await getProjectBySlug(params.slug);
    if (!project) return { title: 'Project Not Found | Analytics Dev' };

    return {
        title: `${project.title} | Case Study | Analytics Dev`,
        description: project.description ? project.description.slice(0, 160) : 'Case study by Analytics Dev.',
        alternates: {
            canonical: `https://analyticsdev.xyz/projects/${params.slug}`,
        },
        openGraph: {
            title: `${project.title} | Analytics Dev`,
            description: project.description || 'Production system delivered by Analytics Dev.',
            url: `https://analyticsdev.xyz/projects/${params.slug}`,
            type: 'article',
        },
    };
}

async function getProjectBySlug(slug: string) {
    console.log(`[ProjectDetail] Searching for slug: "${slug}"`);
    try {
        const project = await projectRepo.findProjectBySlug(slug);
        if (project) {
            console.log(`[ProjectDetail] Found project ID: ${project.id}`);
        } else {
            console.log(`[ProjectDetail] Project not found for slug: "${slug}"`);
        }
        return project;
    } catch (error) {
        console.error(`[ProjectDetail] Error fetching project:`, error);
        return null;
    }
}

export default async function ProjectDetail(props: ProjectDetailProps) {
    const params = await props.params;
    const project = await getProjectBySlug(params.slug);

    if (!project) {
        notFound();
    }

    const projectSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `https://analyticsdev.xyz/projects/${params.slug}#case-study`,
                "name": project.title,
                "description": project.description,
                "url": `https://analyticsdev.xyz/projects/${params.slug}`,
                "author": {
                    "@id": "https://analyticsdev.xyz/#organization"
                },
                "provider": {
                    "@id": "https://analyticsdev.xyz/#organization"
                }
            }
        ]
    };

    return (
        <div className="bg-transparent">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
            />
            {/* Hero Section */}
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-slate-900/90 backdrop-blur-md py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                {project.title}
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                {project.description}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {project.tags.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center rounded-md bg-slate-400/10 px-3 py-1.5 text-sm font-medium text-slate-400 ring-1 ring-inset ring-slate-400/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* SVG Icon Display (Right Side) */}
                        {/* SVG Icon Carousel (Right Side) */}
                        {project.svg_icons && project.svg_icons.length > 0 && (
                            <div className="hidden lg:block w-full">
                                <SvgCarousel svgs={project.svg_icons} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Images */}
            {/* Project Images */}
            {project.images && project.images.length > 0 && (
                <div className="py-12 bg-slate-50">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {project.images.length === 1 ? (
                            // Single Image - Centered & Large
                            // Single Image - Responsive Display
                            // Mobile: Full Width | Desktop: Height Constrained & Centered
                            <div className="flex justify-center w-full">
                                <img
                                    src={project.images[0]}
                                    alt={project.title}
                                    className="w-full md:w-auto h-auto md:max-h-[75vh] object-contain rounded-xl shadow-2xl"
                                />
                            </div>
                        ) : (
                            // Multiple Images - Masonry/Grid feel
                            // Multiple Images - Masonry-like stacking (Natural Height)
                            // Cinematic Horizontal Scroll (Fixed Height, Uncropped)
                            <div className="relative w-full overflow-hidden">
                                {/* Scroll Container */}
                                <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
                                    {project.images.map((image: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="relative flex-none h-[160px] md:h-[220px] lg:h-[280px] w-auto snap-center rounded-xl overflow-hidden shadow-md bg-white/5 border border-white/10"
                                        >
                                            <img
                                                src={image}
                                                alt={`${project.title} screenshot ${idx + 1}`}
                                                className="h-full w-auto object-contain max-w-[90vw] md:max-w-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* Optional: Hint overlay or custom scrollbar could go here */}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Project Details */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        {project.content && (
                            <article className="prose prose-lg prose-slate max-w-none">
                                <ReactMarkdown>
                                    {project.content}
                                </ReactMarkdown>
                            </article>
                        )}

                        {/* Project Metadata */}
                        <dl className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {project.client && (
                                <div>
                                    <dt className="text-sm font-semibold leading-6 text-gray-900">Client</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-600">{project.client}</dd>
                                </div>
                            )}
                            {project.liveUrl && (
                                <div>
                                    <dt className="text-sm font-semibold leading-6 text-gray-900">Live URL</dt>
                                    <dd className="mt-1 text-sm leading-6">
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-slate-700">
                                            Visit the site
                                        </a>
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
