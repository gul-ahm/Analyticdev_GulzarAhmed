'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScroll } from './ScrollContext';

import Image from 'next/image';

export default function Navbar({ showBlog = false }: { showBlog?: boolean }) {
    const { lenis } = useScroll();
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [prevScroll, setPrevScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const latest = window.scrollY;
            if (latest > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            if (latest > prevScroll && latest > 150 && !isMenuOpen) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setPrevScroll(latest);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScroll, isMenuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const elem = document.getElementById(targetId);
            if (elem) {
                if (lenis) {
                    lenis.scrollTo(elem);
                } else {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        setIsMenuOpen(false);
    };

    // Blog only appears once something is published, so the nav never points
    // at an empty page.
    const agencyNavigation = [
        { name: 'Services', href: '/services' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Projects', href: '/projects' },
        ...(showBlog ? [{ name: 'Blog', href: '/blog' }] : []),
        { name: 'Reviews', href: '/reviews' },
        { name: 'Team', href: '/team' },
        { name: 'About', href: '/about' },
    ];

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0, opacity: 1 },
                    hidden: { y: -20, opacity: 0, pointerEvents: "none" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none will-change-transform"
            >
                {/* Fixed Brand Logo - Top Left */}
                <div className="absolute left-8 h-full hidden md:flex items-center pointer-events-auto">
                    <Link href="/">
                        <Image
                            src="/brand.svg"
                            alt="Analytics Dev"
                            width={140}
                            height={50}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>
                </div>

                <div
                    className={cn(
                        "pointer-events-auto transition-all duration-500 ease-out",
                        "flex items-center gap-6 rounded-full",
                        "px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]",
                        scrolled ? "py-2.5 bg-white/40" : "py-3.5"
                    )}
                >
                    {/* Brand / Logo */}
                    <Link href="/" className="flex items-baseline gap-1.5 group mr-2">
                        <span className="text-lg font-medium tracking-tight text-slate-900 group-hover:text-slate-900 transition-colors">
                            Analytics<span className="font-light text-slate-500">Dev</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {agencyNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={cn(
                                    "relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300",
                                    "text-slate-600 hover:text-slate-900"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center pl-2 border-l border-slate-200/50 ml-2">
                        <Link
                            href="/contact"
                            className="text-[13px] font-semibold text-slate-900 bg-white/50 hover:bg-white/80 px-4 py-1.5 rounded-full transition-all border border-transparent hover:border-slate-200/50 hover:shadow-sm"
                        >
                            Start a Project
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="transition-colors p-1 text-slate-700 hover:text-slate-900"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay - Structured Technical Redesign */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
                            <span className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                                Menu
                            </span>
                            <button
                                type="button"
                                className="group p-2 -mr-2 text-slate-500 hover:text-slate-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="w-6 h-6" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Structured Links */}
                        <div className="flex-1 overflow-y-auto px-6 py-8">
                            <nav className="flex flex-col">
                                {agencyNavigation.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1 }}
                                        className="group border-b border-slate-100 last:border-0"
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleNavClick(e, item.href)}
                                            className="flex items-baseline py-6 gap-6"
                                        >
                                            <span className="text-xs font-mono text-slate-400 font-medium">
                                                0{i + 1}
                                            </span>
                                            <span className="text-3xl font-medium tracking-tight text-slate-900 group-active:text-slate-600 transition-colors">
                                                {item.name}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100">
                            <Link
                                href="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center w-full py-4 bg-slate-900 text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm active:scale-[0.98] transition-all"
                            >
                                Start a Project
                            </Link>

                            <div className="mt-8 flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                <span>AnalyticsDev © {new Date().getFullYear()}</span>
                                <div className="flex gap-4">
                                    <span>MUMBAI</span>
                                    <span>GCC</span>
                                    <span>BLR</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
