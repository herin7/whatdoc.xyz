import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Sparkles, LayoutTemplate, Zap, BookOpen, Rocket, Layers, Database, Globe, Fingerprint, Shield, Box, Terminal, Cpu, Palette, Blocks, Code2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

import twilioMockup from '../assets/twilio-mockup.png';
import aeroMockup from '../assets/aero-mockup.png';
import modernMockup from '../assets/modern-mockup.png';
import minimalMockup from '../assets/minimal-mockup.png';
import djangoMockup from '../assets/django-mockup.png';
import mdnMockup from '../assets/mdn-mockup.png';

import templatesDataJson from '../config/templatesData.json';

const iconMap = {
    Zap, BookOpen, Rocket, Layers, Database, Globe, Fingerprint, Shield, Box, Terminal, Cpu, LayoutTemplate, Palette, Blocks
};

const imageMap = {
    twilioMockup, aeroMockup, modernMockup, minimalMockup, djangoMockup, mdnMockup
};

const templatesData = templatesDataJson.map(t => ({
    ...t,
    icon: iconMap[t.icon],
    image: t.image ? imageMap[t.image] : undefined
}));

export default function Templates() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-emerald-500/30 font-sans relative overflow-hidden">
            <Navbar />

            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center mt-12">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-[-10%] w-[100vw] h-[500px] bg-emerald-500/5 blur-[120px] rounded-[100%]" />
            </div>

            <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-36 pb-24">
                {/* Hero Section */}
                <section className="text-center mb-24 flex flex-col items-center animate-[fadeIn_0.8s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-md shadow-lg shadow-white/5">
                        <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
                        <span>The Ultimate Template Gallery</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent max-w-4xl">
                        Picture-Perfect Documentation.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
                        Choose an aesthetic that matches your brand. Every template is auto-generated, perfectly responsive, and optimized for world-class developer experience.
                    </p>
                </section>

                {/* Templates Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {templatesData.map((template, index) => {
                        const Icon = template.icon;
                        const delay = (index % 3) * 100;

                        return (
                            <div
                                key={template.id}
                                className={`group relative rounded-[2rem] p-1.5 transition-all duration-500 shadow-2xl hover:-translate-y-1
                                    ${template.colors.isLight ? 'bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]' : 'bg-zinc-900/40'}
                                    border border-transparent ${template.colors.borderHover}
                                `}
                                style={{ animationDelay: `${delay}ms` }}
                            >
                                <div className={`h-full rounded-[1.5rem] p-6 flex flex-col relative overflow-hidden transition-all duration-300
                                    ${template.colors.isLight ? 'bg-white/90 backdrop-blur-md border border-zinc-200/50' : 'bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 group-hover:bg-[#0f0f0f]'}
                                `}>
                                    {/* Ambient Bubble Glow */}
                                    <div className={`absolute -top-10 -right-10 w-48 h-48 blur-[60px] rounded-full pointer-events-none transition-all duration-700 ${template.colors.glow} opacity-30 group-hover:opacity-70 group-hover:scale-150`} />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-xl border ${template.colors.badgeBg} ${template.colors.border} shadow-lg`}>
                                                    <Icon className={`size-5 ${template.colors.text}`} />
                                                </div>
                                                <h2 className={`text-xl font-bold tracking-tight ${template.colors.isLight ? 'text-zinc-900' : 'text-white'}`}>
                                                    {template.name}
                                                </h2>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-md border text-[10px] uppercase font-mono font-bold tracking-wider ${template.colors.badgeBg} ${template.colors.border} ${template.colors.text}`}>
                                                {template.badge}
                                            </span>
                                        </div>

                                        <p className={`mb-8 leading-relaxed text-sm flex-grow ${template.colors.isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                                            {template.desc}
                                        </p>

                                        {/* Graphic/Mockup Area */}
                                        <div className={`mt-auto relative rounded-xl border overflow-hidden transition-all duration-500 ${template.colors.shadow} shadow-2xl
                                            ${template.colors.isLight ? 'border-zinc-200 bg-white ring-1 ring-black/5' : 'border-white/10 bg-[#000] ring-1 ring-white/5'}
                                        `}>
                                            <div className={`h-8 border-b flex items-center px-4 gap-1.5 ${template.colors.isLight ? 'border-zinc-200 bg-zinc-50' : 'border-white/10 bg-[#111]'}`}>
                                                <div className={`size-2.5 rounded-full ${template.colors.isLight ? 'bg-zinc-300' : 'bg-zinc-700'} group-hover:bg-red-500/80 transition-colors`} />
                                                <div className={`size-2.5 rounded-full ${template.colors.isLight ? 'bg-zinc-300' : 'bg-zinc-700'} group-hover:bg-yellow-500/80 transition-colors delay-75`} />
                                                <div className={`size-2.5 rounded-full ${template.colors.isLight ? 'bg-zinc-300' : 'bg-zinc-700'} group-hover:bg-green-500/80 transition-colors delay-150`} />
                                            </div>

                                            <div className="overflow-hidden relative h-[180px] w-full">
                                                {template.image ? (
                                                    <>
                                                        <img
                                                            src={template.image}
                                                            alt={`${template.name}`}
                                                            className="w-full h-full object-cover transform scale-[1.02] group-hover:scale-[1.08] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                                                            draggable={false}
                                                        />
                                                        <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent ${template.colors.isLight ? 'from-white' : 'from-[#000]'}`} />
                                                    </>
                                                ) : (
                                                    <div className="w-full h-full relative flex flex-col pt-6 px-6 bg-black/95">
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-30 group-hover:opacity-40 transition-opacity duration-500`} />

                                                        {/* Abstract UI Elements representing docs */}
                                                        <div className="flex flex-col gap-4 relative z-10 w-full transform group-hover:-translate-y-1 transition-transform duration-500">
                                                            <div className="flex gap-3 items-center">
                                                                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 backdrop-blur-sm">
                                                                    <Code2 className="size-5 text-white/60" />
                                                                </div>
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <div className="w-2/3 h-2.5 rounded-full bg-white/20" />
                                                                    <div className="w-1/3 h-2.5 rounded-full bg-white/10" />
                                                                </div>
                                                            </div>
                                                            <div className="w-full h-px bg-white/10 my-1" />
                                                            <div className="flex flex-col gap-2.5 mt-1">
                                                                <div className="w-full h-2 rounded-full bg-white/10" />
                                                                <div className="w-5/6 h-2 rounded-full bg-white/10 ml-2" />
                                                                <div className="w-4/6 h-2 rounded-full bg-white/10 ml-2" />
                                                                <div className="w-[90%] h-2 rounded-full bg-white/10" />
                                                                <div className="w-1/2 h-2 rounded-full bg-white/10" />
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/80 to-transparent translate-y-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Perfect Preview Action Area */}
                                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                                <Link
                                                    to={template.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`group/btn relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0
                                                        ${template.colors.button} ${template.colors.hoverButton} shadow-[0_0_40px_rgba(0,0,0,0.5)] scale-90 group-hover:scale-100 hover:!scale-105 active:!scale-95
                                                        ring-1 ring-white/20 hover:ring-white/50
                                                    `}
                                                >
                                                    <Sparkles className="size-4 animate-pulse" />
                                                    <span>Live Preview</span>
                                                    <ExternalLink className="size-3.5 ml-1 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}