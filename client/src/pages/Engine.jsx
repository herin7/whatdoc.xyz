import { GitBranch, Fingerprint, Network, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const steps = [
    {
        step: '01',
        icon: GitBranch,
        title: 'Ephemeral Shallow Cloning',
        subtitle: 'Ingestion Layer',
        description:
            'Bypasses strict GitHub API rate limits using depth-1 secure clones. The repository is mounted to a temporary disk, parsed, and immediately nuked. Zero footprint.',
        details: [
            'Direct disk I/O — zero in-memory bloating',
            'Depth-1 clones eliminate historical overhead',
            'Cryptographic cleanup after pipeline execution',
        ],
        accent: 'from-emerald-500/20 to-emerald-500/0',
        border: 'hover:border-emerald-500/30',
        iconColor: 'text-emerald-400',
        dotColor: 'bg-emerald-500',
    },
    {
        step: '02',
        icon: Fingerprint,
        title: 'AST & Paradigm Detection',
        subtitle: 'The Code Surgeon',
        description:
            'Drops lazy regex for full Abstract Syntax Tree (AST) extraction. The engine reads your code and dynamically detects your architecture (REST API, React Frontend, or CLI) to adapt the documentation structure instantly.',
        details: [
            'Full TypeScript & JavaScript AST parsing',
            'Dynamic paradigm routing (API vs. UI vs. SDK)',
            'Deterministic extraction of routes, schemas, and props',
        ],
        accent: 'from-blue-500/20 to-blue-500/0',
        border: 'hover:border-blue-500/30',
        iconColor: 'text-blue-400',
        dotColor: 'bg-blue-500',
    },
    {
        step: '03',
        icon: Network,
        title: 'API Gateway & BYOK',
        subtitle: 'Traffic Control',
        description:
            'Never hit a 429 Too Many Requests error. Traffic is routed through an intelligent round-robin key manager, or bypasses our limits entirely using your own securely encrypted Gemini API key.',
        details: [
            'Round-robin API key rotation for free tiers',
            'BYOK (Bring Your Own Key) for unthrottled Pro models',
            'Heuristic token guillotine caps payloads at 200k tokens',
        ],
        accent: 'from-amber-500/20 to-amber-500/0',
        border: 'hover:border-amber-500/30',
        iconColor: 'text-amber-400',
        dotColor: 'bg-amber-500',
    },
    {
        step: '04',
        icon: Layers,
        title: 'Vercel-Tier MDX Synthesis',
        subtitle: 'The Renderer',
        description:
            'The LLM is handcuffed to a strict prompt architecture, forcing it to output structured, GitHub-flavored Markdown. Our React frontend intercepts these tags to render beautiful, glassmorphic UI components.',
        details: [
            'Single-pass LLM orchestration (zero drift)',
            'Extracts real variables, not generic foo/bar examples',
            'Custom React interceptors for dynamic callout UI',
        ],
        accent: 'from-purple-500/20 to-purple-500/0',
        border: 'hover:border-purple-500/30',
        iconColor: 'text-purple-400',
        dotColor: 'bg-purple-500',
    },
];

export default function Engine() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-emerald-500/30">
            <Navbar />

            {/* ── Hero ── */}
            <header className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                {/* Radial glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />
                </div>

                <div className="relative max-w-3xl mx-auto animate-[fadeSlideUp_0.6s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/[0.03] text-xs text-zinc-400 font-mono tracking-wider uppercase backdrop-blur-md shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        System Architecture
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        The{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 font-logo">
                            <span className="font-bold">W</span>HATDOC
                        </span>{' '}
                        Engine
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        A highly customized, multi-stage AST parsing pipeline built to bypass LLM rate limits and force deterministic, hallucination-free documentation.
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
                            <div key={s.step} className="relative animate-[fadeSlideUp_0.8s_ease-out]" style={{ animationDelay: `${i * 150}ms` }}>
                                {/* Timeline dot — desktop */}
                                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-8 z-10">
                                    <div className={`w-3 h-3 rounded-full ${s.dotColor} ring-4 ring-[#050505] shadow-[0_0_15px] shadow-current`} style={{ color: s.dotColor.replace('bg-', '').split('-')[0] === 'emerald' ? '#10b981' : s.dotColor.replace('bg-', '').split('-')[0] === 'blue' ? '#3b82f6' : s.dotColor.replace('bg-', '').split('-')[0] === 'amber' ? '#f59e0b' : '#a855f7' }} />
                                </div>

                                {/* Card */}
                                <div className={`sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:mr-auto sm:pr-0' : 'sm:ml-auto sm:pl-0'}`}>
                                    <div className={`group relative bg-[#0a0a0a] border border-white/5 ${s.border} rounded-3xl p-8 transition-all duration-500 overflow-hidden shadow-xl`}>
                                        {/* Hover glow */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${s.accent}`} />

                                        <div className="relative z-10">
                                            {/* Step number + Icon */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`h-12 w-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center ${s.iconColor} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                                    <Icon size={22} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] font-bold">Step {s.step}</span>
                                                    <p className="text-xs text-zinc-400 font-medium tracking-wide mt-0.5">{s.subtitle}</p>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                                                {s.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                                                {s.description}
                                            </p>

                                            {/* Detail bullets */}
                                            <ul className="space-y-2.5 bg-black/40 p-4 rounded-xl border border-white/5">
                                                {s.details.map((d, j) => (
                                                    <li key={j} className="flex items-start gap-2.5 text-xs text-zinc-400 font-mono">
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
                <div className="text-center mt-32 relative z-10 animate-[fadeSlideUp_1s_ease-out]">
                    <p className="text-sm text-zinc-500 mb-5 font-mono uppercase tracking-widest">Pipeline Complete.</p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    >
                        Initialize Your Engine →
                    </Link>
                </div>
            </section>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}