import { GitBranch, FileCode, Scissors, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const steps = [
    {
        step: '01',
        icon: GitBranch,
        title: 'High-Speed Shallow Cloning',
        subtitle: 'Ingestion',
        description:
            'Bypasses GitHub API rate limits by using simple-git to execute a depth-1 secure clone directly to the server\'s /tmp disk.',
        details: [
            'Depth-1 clone eliminates full history overhead',
            'Direct disk I/O — no in-memory buffering',
            'Automatic cleanup after pipeline completion',
        ],
        accent: 'from-emerald-500/20 to-emerald-500/0',
        border: 'hover:border-emerald-500/30',
        iconColor: 'text-emerald-400',
        dotColor: 'bg-emerald-500',
    },
    {
        step: '02',
        icon: FileCode,
        title: 'AST Extraction via ts-morph',
        subtitle: 'The Code Surgeon',
        description:
            'Instead of relying on FAISS vector embeddings or regex, the engine maps the exact dependency graph and extracts only critical schema, routes, and exports.',
        details: [
            'Full TypeScript & JavaScript AST parsing',
            'Deterministic extraction — no hallucinated code paths',
            'Dependency graph traversal for accurate module mapping',
        ],
        accent: 'from-blue-500/20 to-blue-500/0',
        border: 'hover:border-blue-500/30',
        iconColor: 'text-blue-400',
        dotColor: 'bg-blue-500',
    },
    {
        step: '03',
        icon: Scissors,
        title: 'Heuristic Token Budgeting',
        subtitle: 'The Token Guillotine',
        description:
            'A custom algorithm that ranks codebase files by importance (Models > Routes > UI) and strictly truncates the JSON payload to stay under a 25,000 token limit, preventing 429 errors.',
        details: [
            'Priority-weighted file ranking system',
            'Strict 25K token ceiling per prompt',
            'Zero rate-limit violations in production',
        ],
        accent: 'from-amber-500/20 to-amber-500/0',
        border: 'hover:border-amber-500/30',
        iconColor: 'text-amber-400',
        dotColor: 'bg-amber-500',
    },
    {
        step: '04',
        icon: Brain,
        title: 'Single-Pass LLM Orchestration',
        subtitle: 'Batch Generation',
        description:
            'Sends the highly compressed architectural map to the AI model in a single batch prompt to ensure maximum context retention and speed.',
        details: [
            'Single request — no chained completions',
            'Full architectural context in one pass',
            'Deterministic Markdown output with zero drift',
        ],
        accent: 'from-purple-500/20 to-purple-500/0',
        border: 'hover:border-purple-500/30',
        iconColor: 'text-purple-400',
        dotColor: 'bg-purple-500',
    },
];

export default function Engine() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300">
            <Navbar />

            {/* ── Hero ── */}
            <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                {/* Radial glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />
                </div>

                <div className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-500 font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Architecture
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        The{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 font-logo">
                            <span className="font-bold">W</span>HATDOC.XYZ
                        </span>{' '}
                        Engine
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        A custom AST-parsing pipeline built to bypass LLM rate limits and generate deterministic documentation.
                    </p>
                </div>
            </header>

            {/* ── Timeline ── */}
            <section className="relative max-w-4xl mx-auto px-6 pb-32">
                {/* Vertical line */}
                <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none -translate-x-1/2 hidden sm:block" />

                <div className="space-y-16 sm:space-y-24">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const isLeft = i % 2 === 0;

                        return (
                            <div key={s.step} className="relative">
                                {/* Timeline dot — desktop */}
                                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-8 z-10">
                                    <div className={`w-3 h-3 rounded-full ${s.dotColor} ring-4 ring-[#050505] shadow-[0_0_12px] shadow-current`} style={{ color: s.dotColor.replace('bg-', '').split('-')[0] === 'emerald' ? '#10b981' : s.dotColor.replace('bg-', '').split('-')[0] === 'blue' ? '#3b82f6' : s.dotColor.replace('bg-', '').split('-')[0] === 'amber' ? '#f59e0b' : '#a855f7' }} />
                                </div>

                                {/* Card */}
                                <div className={`sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:mr-auto sm:pr-0' : 'sm:ml-auto sm:pl-0'}`}>
                                    <div className={`group relative bg-[#0a0a0a] border border-white/5 ${s.border} rounded-2xl p-8 transition-all duration-500 overflow-hidden`}>
                                        {/* Hover glow */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${s.accent}`} />

                                        <div className="relative">
                                            {/* Step number + Icon */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className={`h-12 w-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${s.iconColor} group-hover:bg-white/[0.06] transition-colors`}>
                                                    <Icon size={22} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Step {s.step}</span>
                                                    <p className="text-xs text-zinc-500 font-medium">{s.subtitle}</p>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                                                {s.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                                                {s.description}
                                            </p>

                                            {/* Detail bullets */}
                                            <ul className="space-y-2">
                                                {s.details.map((d, j) => (
                                                    <li key={j} className="flex items-start gap-2 text-xs text-zinc-500">
                                                        <span className={`mt-1.5 w-1 h-1 rounded-full ${s.dotColor} shrink-0`} />
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-24">
                    <p className="text-sm text-zinc-600 mb-4">That's the full pipeline — from git clone to live docs.</p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                    >
                        Try it yourself →
                    </Link>
                </div>
            </section>
        </div>
    );
}
