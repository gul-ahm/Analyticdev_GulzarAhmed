import Link from 'next/link';
import * as projectRepo from '@/lib/repositories/project.repository';
import * as pageRepo from '@/lib/repositories/page.repository';
import * as reviewRepo from '@/lib/repositories/review.repository';
import ProcessTimeline from '@/components/public/ProcessTimeline';
import ScrollReveal from '@/components/public/ScrollReveal';
import ScrollRevealText from '@/components/ui/ScrollRevealText';
import MagneticText from '@/components/ui/MagneticText';
import TechnicalGrid from '@/components/public/TechnicalGrid';
import StatsGrid from '@/components/public/StatsGrid';
import ProjectCarousel from '@/components/public/ProjectCarousel';
import HomeHero from '@/components/public/HomeHero';
import SiteLoader from '@/components/public/SiteLoader';
import { isCrawler } from '@/lib/is-bot';
import ReviewCarousel from '@/components/public/ReviewCarousel';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  const [projects, page, reviews] = await Promise.all([
    projectRepo.findAllProjects().catch(() => []),
    pageRepo.findPageBySlug('home').catch(() => null),
    reviewRepo.findAllReviews(true).catch(() => [])
  ]);

  return {
    featuredProjects: projects.filter(p => p.featured),
    content: page?.content || {},
    reviews: reviews || []
  };
}

// Helper to render text with line breaks
const renderText = (text: string) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split('\n').length - 1 && <br />}
    </span>
  ));
};

export default async function Home() {
  const { featuredProjects, content, reviews } = await getHomeData();
  // A crawler never waits out an eight second animation, and an overlay across
  // the page is the sort of thing a search engine reads as hidden content.
  const crawler = await isCrawler();

  return (
    <div className="bg-transparent selection:bg-slate-200 selection:text-slate-900">
      {crawler ? null : <SiteLoader />}
      {/* GLOBAL GRAIN & VIGNETTE ARE HANDLED IN LAYOUT/BACKGROUND COMPONENT */}

      {/* 
        PHASE 2 & 3: HERO SECTION
        - Min-height: 100vh for weight.
        - Text scrolls normally.
        - CTA Bar is sticky to create resistance/pause.
      */}
      <HomeHero
        tagline={content.hero_tagline}
        headline={content.hero_headline}
        subtext={content.hero_subtext}
        ctaPrimary={content.hero_cta_primary}
      />

      {/* 2. TRUST SIGNAL STRIP - Sticky Card 1 */}
      <section className="relative md:sticky md:top-0 z-10 bg-white py-12 md:py-20 min-h-auto md:min-h-[100dvh] w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem] -mt-10 md:-mt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 w-full flex flex-col items-center">
          <div className="w-full mb-10 md:mb-16">
            <ScrollRevealText
              text={content.trust_headline || 'What I have actually built.'}
              className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight text-balance"
              variant="word"
              delay={0.1}
            />
          </div>

          <ScrollReveal width="100%">
            <StatsGrid />
          </ScrollReveal>

          {/* Reviews Carousel - Added */}
          <div className="w-full mt-16 md:mt-24">
            <ScrollReveal variant="simple" delay={0.4} width="100%">
              <ReviewCarousel reviews={reviews} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER PHILOSOPHY BLOCK - Sticky Card 2 */}
      <section className="relative md:sticky md:top-0 z-20 bg-slate-50 py-6 md:py-20 min-h-auto md:min-h-screen w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10 w-full">
          <ScrollReveal variant="simple" delay={0.1} width="100%">
            <blockquote className="max-w-2xl text-2xl md:text-3xl font-normal leading-snug text-slate-900 text-balance">
              {content.philosophy_quote || '“If a simpler thing works, I build the simpler thing.”'}
            </blockquote>
            <p className="mt-5 text-sm text-slate-500">
              {content.philosophy_author || 'Gulzar Ahmed'}, {content.philosophy_role || 'Founder & Engineer'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. PROCESS TIMELINE - Sticky Card 3 */}
      <section className="relative md:sticky md:top-0 z-30 bg-white min-h-auto md:min-h-screen w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem] py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          {/* Added Header for Process Timeline */}
          <div className="flex flex-col items-start text-left mb-8 md:mb-16">
            {/* UPDATED: Staggered Process Header */}
            <ScrollRevealText
              text={content.process_heading || 'How a project runs'}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance"
              variant="word"
              delay={0.2}
            />

            <ScrollReveal variant="simple" delay={0.3}>
              <p className="mt-4 text-base text-slate-500 max-w-xl leading-relaxed">
                {content.process_subtext || 'Four steps. The price is fixed before we start, and you can see the work at every stage.'}
              </p>
            </ScrollReveal>
          </div>

          <ProcessTimeline />
        </div>
      </section>

      {/* 5. TECHNICAL PRECISION GRID - Sticky Card 4 */}
      <section className="relative md:sticky md:top-0 z-40 bg-slate-50 py-12 md:py-16 min-h-auto md:min-h-screen w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="mb-10 flex flex-col items-start text-left">
            {/* UPDATED: Staggered Skills Header */}
            <ScrollRevealText
              text={content.skills_heading || 'What I build'}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance"
              variant="word"
              delay={0.2}
            />
          </div>

          <ScrollReveal width="100%">
            <TechnicalGrid />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. SELECTION OF WORK - Sticky Card 5 */}
      <section className="relative md:sticky md:top-0 z-50 bg-white py-12 md:py-14 min-h-auto md:min-h-screen w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Text Content */}
            <div className="flex flex-col items-start text-left mb-8 lg:mb-0 order-1">
              <div>
                {/* Staggered Work Header */}
                <div className="mb-4">
                  <ScrollRevealText
                    text={content.work_heading || 'Selected Work'}
                    className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance"
                    variant="word"
                    delay={0.2}
                  />
                </div>

                <ScrollReveal variant="simple" delay={0.3}>
                  <p className="text-base text-slate-500 max-w-md leading-relaxed mb-8">
                    {content.work_subtext || 'Paid client work and systems I built on my own. Some client names are left out because they asked.'}
                  </p>
                </ScrollReveal>
              </div>
              {/* Left Aligned Button Link */}
              <ScrollReveal variant="scale" delay={0.4}>
                <MagneticText strength={0.3}>
                  <Link href="/projects" className="text-sm font-semibold text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors">
                    See all 13 projects
                  </Link>
                </MagneticText>
              </ScrollReveal>
            </div>

            {/* Right Column: Carousel */}
            <div className="w-full order-2 lg:h-[600px] flex items-center justify-center">
              <ProjectCarousel projects={featuredProjects} />
            </div>
          </div>
        </div>
      </section>
      {/* 7. READY TO BUILD - Sticky Card 6 (Final) */}
      <section className="relative md:sticky md:top-0 z-60 bg-slate-50 py-12 md:py-20 min-h-auto md:min-h-[90dvh] w-full flex flex-col justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_-50px_100px_-20px_rgba(0,0,0,0.05)] rounded-t-[3.5rem]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 w-full text-center relative z-10 flex flex-col items-center">
          <ScrollReveal variant="blur" delay={0.2} width="100%">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6 text-balance mx-auto">
              {renderText(content.cta_heading) || 'Have something in mind?'}
            </h2>
            <p className="text-base md:text-lg text-slate-500 max-w-lg leading-relaxed mb-10 mx-auto">
              {content.cta_subtext || 'Send me a few lines about it. I read and answer every message myself, usually the same day.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className="rounded-full bg-slate-900 px-10 py-5 text-base font-bold text-white hover:bg-slate-800 transaction-colors shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] transition-all"
              >
                {content.cta_button_text || 'Start a project'}
              </Link>
              <Link
                href={`mailto:${content.cta_email || 'hello@analyticsdev.xyz'}`}
                className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-300 pb-1"
              >
                {content.cta_email || 'hello@analyticsdev.xyz'}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div >
  );
}
