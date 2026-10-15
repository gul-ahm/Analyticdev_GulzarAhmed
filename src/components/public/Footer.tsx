import Link from 'next/link';
import { Github, Linkedin, Twitter, Globe, Link as LinkIcon, Facebook, Instagram } from 'lucide-react';
import * as socialRepo from '@/lib/repositories/social.repository';

// Map icon strings to components
const iconMap: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    globe: Globe,
    other: LinkIcon
};

export default async function Footer() {
    const socialLinks = await socialRepo.findAllSocialLinks(true).catch(() => []);

    return (
        <footer className="relative z-70 bg-white pt-12 pb-8 overflow-hidden rounded-t-[2.5rem] shadow-[0_-50px_100px_-20px_rgba(0,0,0,0.05)] -mt-10">
            {/* 1. AMBIENT TRANSITION ZONE - Soft fade from content - Compacted */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-slate-50/80 pointer-events-none" />

            {/* Background Texture - Grounded Luxury */}
            <div className="absolute inset-0 bg-slate-50/80 -z-10" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay -z-10" />


            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* 2. PHILOSOPHY STATEMENT - Dominant & Static - Compacted */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-end">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4 opacity-60 mix-blend-multiply">
                            <span className="text-xs font-mono text-slate-400">END</span>
                            <div className="h-px w-8 bg-slate-300" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-slate-900 leading-tight">
                            Built to hand over, <br /> <span className="text-slate-400 font-normal italic">not to hold you.</span>
                        </h2>
                    </div>

                    {/* 3. NAVIGATION - De-emphasized & Compact */}
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 lg:justify-end">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 mb-3">Contact</h3>
                            <ul role="list" className="space-y-2">
                                <li>
                                    <a href="mailto:hello@analyticsdev.xyz" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors block">
                                        <span className="block text-[10px] text-slate-400 mb-0.5">Direct & Inquiries</span>
                                        hello@analyticsdev.xyz
                                    </a>
                                </li>
                                <li className="text-xs text-slate-500 pt-1">
                                    <span className="block text-[10px] text-slate-400 mb-0.5">Location</span>
                                    Mumbai, Maharashtra, India
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 mb-3">Explore</h3>
                            <ul role="list" className="space-y-1">
                                {[
                                    { label: 'Work', href: '/projects' },
                                    { label: 'Services', href: '/services' },
                                    { label: 'Pricing', href: '/pricing' },
                                    { label: 'About', href: '/about' },
                                    { label: 'Contact', href: '/contact' }
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 mb-3">Socials</h3>
                            <ul role="list" className="space-y-1">
                                {socialLinks.length > 0 ? (
                                    socialLinks.map((link) => {
                                        const IconComponent = iconMap[link.icon] || LinkIcon;
                                        return (
                                            <li key={link.id}>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                                                >
                                                    <IconComponent size={14} />
                                                    {link.platform}
                                                </a>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="text-sm text-slate-400 italic">No links</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. SIGNATURE - Final Close - Compacted */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t border-slate-200/60 pt-6 mt-6">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xs text-slate-400 block mb-1">
                            Engineered by
                        </span>
                        <div className="text-sm font-bold tracking-wide text-slate-800">
                            ANALYTICS DEV · MUMBAI, INDIA
                        </div>
                    </div>

                    <div className="flex gap-8 items-center">
                        <p className="text-xs text-slate-400 font-light">
                            © {new Date().getFullYear()} Analytics Dev. All rights reserved.
                        </p>
                        <div className="h-px w-8 bg-slate-300 hidden md:block" />
                        <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
