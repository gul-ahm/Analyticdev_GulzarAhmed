'use client';

import { motion } from 'framer-motion';
import { Terminal, Database, Server, Briefcase, Code2, BrainCircuit, Activity, Building2, ShoppingBag, Home, GraduationCap } from 'lucide-react';

export default function StatsGrid() {
    return (
        <div className="flex flex-col md:grid md:grid-cols-3 gap-12 md:gap-8 text-left items-start justify-start max-w-6xl mx-auto w-full">

            {/* Col 1: EXPERIENCE JOURNEY */}
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-1">
                    <span className="text-5xl md:text-6xl font-light text-slate-900 tracking-tighter leading-none">
                        2024
                    </span>
                    <span className="text-sm text-slate-500">
                        Shipping production code since
                    </span>
                </div>

                <div className="relative flex flex-col gap-5 w-full pl-2 mt-2">
                    <div className="absolute left-[11px] top-2 bottom-4 w-px bg-slate-200" />
                    {[
                        { icon: Terminal, label: "Diploma, then BTech in CS", sub: "AI specialisation, finished 2025" },
                        { icon: Database, label: "First data science job", sub: "Retail inventory and sales data" },
                        { icon: Server, label: "Full product ownership", sub: "Built the AI side of a QS product" },
                        { icon: Briefcase, label: "Own studio since 2026", sub: "Client builds end to end" }
                    ].map((step, i) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative flex items-center gap-4 group"
                        >
                            <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 border border-slate-200 group-hover:border-slate-200 group-hover:bg-slate-100 transition-colors">
                                <step.icon className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-700">{step.label}</span>
                                <span className="text-[10px] text-slate-500 font-light leading-tight">{step.sub}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Col 2: PROJECT DELIVERY DASHBOARD */}
            <div className="flex flex-col gap-6 pt-4 md:pt-4 md:px-8 decoration-slate-200 md:border-x border-slate-100/80 w-full relative">
                {/* Top faint gradient line for mobile separation */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent md:hidden block" />

                <div className="flex flex-col gap-1">
                    <span className="text-5xl md:text-6xl font-light text-slate-900 tracking-tighter leading-none">
                        13
                    </span>
                    <span className="text-sm text-slate-500">
                        Systems built and shipped
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left mt-2">
                    {[
                        { icon: Code2, label: "Web platforms", count: 5, color: "bg-slate-700" },
                        { icon: BrainCircuit, label: "AI & automation", count: 5, color: "bg-slate-700" },
                        { icon: Database, label: "Data & analytics", count: 3, color: "bg-slate-700" },
                    ].map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_20px_40px_-12px_rgba(0,0,0,0.04)] hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] transition-all"
                        >
                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <cat.icon className="w-3 h-3 opacity-70" />
                                    <span className="text-[11px]">{cat.label}</span>
                                </div>
                                <span className="text-slate-900 text-[11px]">{cat.count}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(cat.count / 6) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={`h-full rounded-full opacity-60 ${cat.color}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Col 3: INDUSTRY IMPACT */}
            <div className="flex flex-col gap-6 w-full relative pt-4 md:pt-0">
                {/* Top faint gradient line for mobile separation */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent md:hidden block" />

                <div className="flex flex-col gap-1">
                    <span className="text-5xl md:text-6xl font-light text-slate-900 tracking-tighter leading-none">
                        5
                    </span>
                    <span className="text-sm text-slate-500">
                        Sectors worked in
                    </span>
                </div>

                <div className="flex flex-col gap-2.5 w-full items-start mt-2">
                    {[
                        { icon: Building2, label: "Construction" },
                        { icon: Activity, label: "Healthcare & medical supply" },
                        { icon: ShoppingBag, label: "Retail & ecommerce" },
                        { icon: Home, label: "Real estate" },
                        { icon: GraduationCap, label: "Education" },
                    ].map((industry, i) => (
                        <motion.div
                            key={industry.label}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            whileHover={{ x: -2, backgroundColor: "#F8FAFC" }}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),0_10px_20px_-5px_rgba(0,0,0,0.04)] w-max transition-all"
                        >
                            <div className="p-1 rounded-full bg-slate-50">
                                <industry.icon className="w-3 h-3 text-slate-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{industry.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
