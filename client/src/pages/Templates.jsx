import { Link } from 'react-router-dom';
import { LayoutTemplate, Sparkles, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { DOC_TEMPLATES } from '../config/templates';

import twilioMockup from '../assets/twilio-mockup.png';
import aeroMockup from '../assets/aero-mockup.png';
import modernMockup from '../assets/modern-mockup.png';
import minimalMockup from '../assets/minimal-mockup.png';
import djangoMockup from '../assets/django-mockup.png';
import mdnMockup from '../assets/mdn-mockup.png';

const MOCKUP_MAP = {
    modern: modernMockup,
    minimal: minimalMockup,
    twilio: twilioMockup,
    django: djangoMockup,
    mdn: mdnMockup,
    aerolatex: aeroMockup,
};

export default function Templates() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-emerald-500/30 font-sans relative overflow-hidden">
            <Navbar />

            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="absolute top-[-10%] w-[1000px] h-[500px] rounded-[100%] bg-emerald-500/10 blur-[120px]" />
            </div>

            <main className="relative z-10 mx-auto max-w-[1400px] px-6 pt-32 pb-24">

                {/* Hero Section */}
                <section className="text-center mb-16 flex flex-col items-center animate-[fadeIn_0.8s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6 backdrop-blur-md">
                        <Sparkles className="size-3.5 text-emerald-400" />
                        <span>The Template Library</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Discover Your Perfect Docs.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Choose from a wide variety of professionally designed, fully responsive templates tailored for any project aesthetic.
                    </p>
                </section>

                {/* Categories / Filters (Mockup for Canva-like feel) */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-[fadeIn_1s_ease-out]">
                    {['All Designs', 'SaaS', 'API Reference', 'Minimalist', 'Web3', 'Enterprise', 'Academic'].map((cat, i) => (
                        <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-zinc-900/50 text-zinc-400 border border-white/5 hover:bg-zinc-800 hover:text-white'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry / Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-[fadeIn_1.2s_ease-out]">
                    {DOC_TEMPLATES.map((t) => {
                        const imageSrc = MOCKUP_MAP[t.id] || t.previewUrl;

                        return (
                            <div key={t.id} className="group relative flex flex-col rounded-2xl bg-[#0e0e0e] border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-emerald-500/5 h-[380px]">

                                {/* Image Container (Pinterest/Canva Style) */}
                                <div className="h-[220px] w-full overflow-hidden relative bg-[#111]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent z-10 opacity-60 mix-blend-multiply" />
                                    <img
                                        src={imageSrc}
                                        alt={t.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                                        loading="lazy"
                                    />

                                    {/* Hover Action Overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                                        <Link
                                            to={`/p/${t.id}-demo`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl"
                                        >
                                            <LayoutTemplate className="size-4" /> Live Preview
                                        </Link>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                                            {t.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">
                                        {t.description}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Available</span>
                                        </div>
                                        <Link to="/import" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
                                            Use Template <ExternalLink className="size-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 border border-white/10 bg-zinc-900/40 rounded-3xl p-10 text-center relative overflow-hidden flex flex-col items-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10" />
                    <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Don't see what you need?</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto mb-8 relative z-10">
                        Our engine is capable of parsing thousands of custom combinations. You can easily plug in custom CSS logic through your Project Dashboard.
                    </p>
                    <Link to="/import" className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors relative z-10">
                        Start Building Now
                    </Link>
                </div>
            </main>
        </div>
    );
}