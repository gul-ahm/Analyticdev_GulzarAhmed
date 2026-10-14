'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import WheelCarousel, { type WheelCarouselItem } from '@/components/ui/WheelCarousel';

type Project = {
    id: number | string;
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    tags?: string[];
    client?: string | null;
    liveUrl?: string | null;
};

export default function ProjectWheel({ projects }: { projects: Project[] }) {
    const shown = React.useMemo(() => projects.filter((p) => p.images?.length), [projects]);
    const [active, setActive] = React.useState(0);

    const items: WheelCarouselItem[] = React.useMemo(
        () => shown.map((p) => ({ label: p.title, image: p.images![0], imageAlt: p.title })),
        [shown]
    );

    const onActiveChange = React.useCallback((_item: WheelCarouselItem, index: number) => {
        setActive(index);
    }, []);

    if (!shown.length) return null;
    const current = shown[active] ?? shown[0];

    return (
        <div>
            <WheelCarousel
                items={items}
                onActiveChange={onActiveChange}
                // Custom mode keeps the component's own palette logic but with
                // this site's ink, since the built-in light theme marker is blue.
                mode="custom"
                background="#ffffff"
                panelColor="#f1f5f9"
                textColor="rgba(15, 23, 42, 0.28)"
                selectedColor="#0f172a"
                markerColor="#0f172a"
                contentWidth={1040}
                photoWidth={26}
                // A definite height, not a min-height: the label track is h-full with
                // absolutely positioned children, so a percentage height against an
                // auto-height parent collapses it to zero and the mask clips every name.
                className="h-[620px]"
            />

            <div className="mx-auto mt-10 max-w-2xl px-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {current.client ? current.client : 'Built in house'}
                </p>
                {current.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{current.description}</p>
                ) : null}

                {current.tags?.length ? (
                    <ul className="mt-4 flex flex-wrap justify-center gap-2">
                        {current.tags.slice(0, 4).map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-slate-200 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-600"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={`/projects/${current.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        Read the write-up
                        <ArrowRight className="size-3.5" />
                    </Link>
                    {current.liveUrl ? (
                        <a
                            href={current.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Visit it live <ExternalLink className="size-3.5" />
                        </a>
                    ) : null}
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    Scroll or drag the wheel, or use the arrow keys
                </p>
            </div>

            {/* The wheel is a dial, not a sitemap. Every project stays one click away. */}
            <nav aria-label="All projects" className="mt-10 border-t border-slate-100 pt-6">
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {projects.map((project) => (
                        <li key={project.id}>
                            <Link
                                href={`/projects/${project.slug}`}
                                className="text-xs text-slate-500 underline decoration-slate-200 underline-offset-4 transition-colors hover:text-slate-900"
                            >
                                {project.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
