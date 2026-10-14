'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    BrainCircuit, Database, Globe, Building2,
    Terminal, BarChart3, Lock, Stethoscope,
    GraduationCap, Rocket, Layers, GitBranch,
    ChevronLeft, ChevronRight
} from 'lucide-react';

const CAPABILITY_COLUMNS = [
    {
        title: "AI agents and automation",
        subtitle: "Jobs that run without you",
        className: "border-l-0",
        icon: BrainCircuit,
        description: "A repeated job handed to software: outreach that writes a different message for each company, a pipeline that turns a finished video into its title, tags and description, an agent that reads documents and gives you an answer you can check against the source.",
        stack: ["Python", "LangChain", "LangGraph", "Llama 3 on Groq", "OpenAI"]
    },
    {
        title: "Websites and web applications",
        subtitle: "2 to 3 weeks · ₹35,000 to ₹45,000, fixed",
        className: "",
        icon: Globe,
        description: "You get a number before any work starts, and that number does not move unless you change the scope yourself. The code, the domain and the hosting accounts are in your name from day one, so you are never locked to me.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"]
    },
    {
        title: "Data work and dashboards",
        subtitle: "One place for your numbers",
        className: "",
        icon: Database,
        description: "Most businesses have the same problem: four spreadsheets, three people, and no agreement on which number is right. I pull that into one place and build a view you can open on a Monday morning and trust.",
        stack: ["PostgreSQL", "SQL", "Python", "Power BI", "Excel"]
    },
    {
        title: "Full platforms",
        subtitle: "Real users, roles and admin",
        className: "border-r-0",
        icon: Building2,
        description: "Multi-role platforms with logins, permissions, payments and an admin panel someone non-technical can actually run. Built to be handed over and kept, not rebuilt in a year by whoever comes next.",
        stack: ["Next.js", "FastAPI", "PostgreSQL", "Supabase", "AWS"]
    }
];

export default function TechnicalGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const ref = useRef(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div ref={ref} className="w-full">
            {/* Mobile Scroll Controls */}
            <div className="flex justify-end gap-2 mb-4 md:hidden">
                <button
                    onClick={() => scroll('left')}
                    className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200 pb-8 md:pb-0 px-6 md:px-0 -mx-6 md:mx-0">
                {CAPABILITY_COLUMNS.map((col, i) => (
                    <motion.div
                        key={col.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`group relative p-5 lg:p-8 flex flex-col justify-between transition-all duration-500 rounded-2xl min-h-[250px] md:min-h-[320px] min-w-[80vw] md:min-w-0 snap-center ${hoveredIndex !== null && hoveredIndex !== i ? 'opacity-50 blur-[1px]' : 'opacity-100'
                            } hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_20px_40px_-12px_rgba(0,0,0,0.04)]`}
                    >
                        {/* Top Content */}
                        <div className="relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="mb-4 inline-flex items-center justify-center p-2 rounded-xl bg-slate-100/50 text-slate-700 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors"
                            >
                                <col.icon className="w-5 h-5" strokeWidth={1.5} />
                            </motion.div>

                            <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
                                {col.title}
                            </h3>

                            <p className="text-sm text-slate-500 mb-4">
                                {col.subtitle}
                            </p>

                            <p className="text-sm text-slate-600 leading-relaxed font-light">
                                {col.description}
                            </p>
                        </div>

                        {/* Bottom Stack */}
                        <div className="relative z-10 pt-6 mt-auto border-t border-slate-100/50 group-hover:border-slate-200/50 transition-colors">
                            <p className="text-xs font-semibold text-slate-400 mb-2">Built with</p>
                            <div className="flex flex-wrap gap-1.5">
                                {col.stack.map((item, idx) => (
                                    <span
                                        key={item}
                                        className="text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 group-hover:border-slate-200 group-hover:text-slate-900 group-hover:bg-slate-100/30 transition-all"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
