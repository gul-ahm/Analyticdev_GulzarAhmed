'use client';

// Home hero: the liquid sculpture component, with the site's own copy and
// links in place of its built in ones. The site Navbar sits above it, so the
// component's own nav and theme toggle are off.

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SculptureHero from '@/components/ui/LiquidSculptureHero';

interface HomeHeroProps {
    tagline?: string;
    headline?: string;
    subtext?: string;
    ctaPrimary?: string;
}

// Cropped from Herotest1.jpg to the sculpture's own bounding box, so the
// component's rect matches the subject instead of a frame of empty background.
const SCULPTURE = '/sculpture/hero.webp';

export default function HomeHero({ tagline, headline, subtext, ctaPrimary }: HomeHeroProps) {
    return (
        <section className="relative md:sticky md:top-0 z-0 h-[100dvh] w-full overflow-hidden">
            <SculptureHero
                src={SCULPTURE}
                imageAlt="Abstract sculpture of interwoven filaments and particles"
                imageBackground="#EEEDEB"
                background="#FFFFFF"
                textColor="#0F172A"
                showNav={false}
                themeToggle={false}
                showCredit={false}
                backdropText="ANALYTICSDEV"
                height="100dvh"
                className="home-hero"
                hint="Move across the form"
                hintTouch="Touch the form"
                sculptureScale={1.38}
                sculptureY={4.5}
                topInset={210}
            >
                <div>
                    <p className="sh-eyebrow">{tagline || 'Mumbai, India'}</p>
                    <h1 className="sh-h1">
                        <span className="sh-line">I build the software</span>
                        <span className="sh-line">small teams</span>
                        <span className="sh-line sh-accent">keep putting off.</span>
                    </h1>
                </div>

                <div className="sh-aside">
                    <p className="sh-body">
                        {headline ? `${headline} ` : ''}
                        {subtext ||
                            'Websites, internal tools, data pipelines and AI agents, shipped in weeks and handed over with the code in your name.'}
                    </p>
                    <div className="sh-ctas">
                        <Link className="sh-btn" href="/contact" data-interactive>
                            {ctaPrimary || 'Book a free call'}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link className="sh-txt" href="/pricing" data-interactive>
                            See pricing
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </SculptureHero>
        </section>
    );
}
