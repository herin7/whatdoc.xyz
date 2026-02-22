import { Link } from 'react-router-dom';
import { ExternalLink, Sparkles, LayoutTemplate } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import twilioMockup from '../assets/twilio-mockup.png';
import aeroMockup from '../assets/aero-mockup.png';
import modernMockup from '../assets/modern-mockup.png';
import minimalMockup from '../assets/minimal-mockup.png';
import djangoMockup from '../assets/django-mockup.png';
import mdnMockup from '../assets/mdn-mockup.png';

export default function Templates() {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-emerald-500/30 font-sans relative overflow-hidden">
            <Navbar />
            
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                {/* Top glow */}
                <div className="absolute top-[-10%] w-[1000px] h-[500px] rounded-[100%] bg-emerald-500/10 blur-[120px]" />
            </div>

            <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24">
                
                {/* Hero Section */}
                <section className="text-center mb-20 flex flex-col items-center animate-[fadeIn_0.8s_ease-out]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-6 backdrop-blur-md">
                        <Sparkles className="size-3.5 text-emerald-400" />
                        <span>The Template Gallery</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Picture-Perfect Documentation.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Choose an aesthetic that matches your brand. Every template is auto-generated, perfectly responsive, and optimized for world-class developer experience.
                    </p>
                </section>

                {/* Template Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Twilio API Card */}
                    <div className="group relative rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-2 transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/60 shadow-2xl">
                        {/* Inner Container */}
                        <div className="h-full rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 p-8 flex flex-col relative overflow-hidden">
                            {/* Ambient Pink Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-pink-500/20 transition-colors duration-700" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                                        The API Gateway
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-mono font-medium tracking-wide">
                                        Twilio Style
                                    </span>
                                </div>
                                <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                                    Deep, split-pane architecture optimized for REST endpoints, webhooks, and cURL request blocks.
                                </p>
                                
                                {/* macOS Mockup Window */}
                                <div className="mt-auto relative rounded-xl border border-white/10 bg-[#000] overflow-hidden shadow-2xl group-hover:shadow-pink-500/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={twilioMockup}
                                            alt="Twilio Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            draggable={false}
                                        />
                                        {/* Overlay to fade out the bottom of the image beautifully */}
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#000] to-transparent" />
                                    </div>
                                    
                                    {/* Action Button */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/twilio-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        >
                                            <LayoutTemplate className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aero LaTeX Card */}
                    <div className="group relative rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-2 transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/60 shadow-2xl">
                        {/* Inner Container */}
                        <div className="h-full rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 p-8 flex flex-col relative overflow-hidden">
                            {/* Ambient Blue/White Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-400/20 transition-colors duration-700" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                                        Aero Academic
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium tracking-wide">
                                        LaTeX Style
                                    </span>
                                </div>
                                <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                                    Clean, linear typography designed for open-source SDKs, libraries, and mathematical packages.
                                </p>
                                
                                {/* macOS Mockup Window */}
                                <div className="mt-auto relative rounded-xl border border-white/10 bg-[#000] overflow-hidden shadow-2xl group-hover:shadow-blue-500/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={aeroMockup}
                                            alt="Aero Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 to-transparent mix-blend-screen" />
                                    </div>

                                    {/* Action Button */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/aero-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] border border-white/20 text-white text-sm font-semibold hover:bg-zinc-900 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                        >
                                            <ExternalLink className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modern Card */}
                    <div className="group relative rounded-[2rem] bg-gradient-to-br from-[#18181b] to-[#23232a] border border-white/10 p-2 transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/60 shadow-2xl">
                        <div className="h-full rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-700" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                                        Modern DX
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium tracking-wide">
                                        Modern
                                    </span>
                                </div>
                                <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                                    Sleek, multi-theme layout for SaaS, startups, and modern web apps. Switch between dark, light, and system themes.
                                </p>
                                <div className="mt-auto relative rounded-xl border border-white/10 bg-[#000] overflow-hidden shadow-2xl group-hover:shadow-emerald-500/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={modernMockup}
                                            alt="Modern Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#000] to-transparent" />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/modern-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        >
                                            <LayoutTemplate className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Minimal Card */}
                    <div className="group relative rounded-[2rem] bg-gradient-to-br from-[#18181b] to-[#23232a] border border-white/10 p-2 transition-all duration-500 hover:border-white/20 hover:bg-zinc-900/60 shadow-2xl">
                        <div className="h-full rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-400/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-zinc-400/20 transition-colors duration-700" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                                        Minimalist
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-zinc-400/10 border border-zinc-400/20 text-zinc-300 text-xs font-mono font-medium tracking-wide">
                                        Minimal
                                    </span>
                                </div>
                                <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                                    Ultra-clean, distraction-free docs for focused reading. Perfect for libraries and APIs.
                                </p>
                                <div className="mt-auto relative rounded-xl border border-white/10 bg-[#000] overflow-hidden shadow-2xl group-hover:shadow-zinc-400/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-white/10 bg-[#111] flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={minimalMockup}
                                            alt="Minimal Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#000] to-transparent" />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/minimal-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-300 text-black text-sm font-semibold hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,212,212,0.3)]"
                                        >
                                            <LayoutTemplate className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Django Card */}
                    <div className="group relative rounded-[2rem] bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] border border-zinc-200 p-2 transition-all duration-500 hover:border-blue-300/40 hover:bg-blue-50/60 shadow-2xl">
                        <div className="h-full rounded-[1.5rem] bg-white border border-zinc-100 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-400/20 transition-colors duration-700" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
                                        Django Docs
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-blue-400/10 border border-blue-400/20 text-blue-500 text-xs font-mono font-medium tracking-wide">
                                        Django
                                    </span>
                                </div>
                                <p className="text-zinc-500 mb-8 leading-relaxed text-sm">
                                    Elegant, table-rich style for Python, Django, and backend frameworks. Great for API docs and admin panels.
                                </p>
                                <div className="mt-auto relative rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xl group-hover:shadow-blue-400/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-zinc-200 bg-zinc-50 flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-red-400/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-yellow-400/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-green-400/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={djangoMockup}
                                            alt="Django Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/django-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                        >
                                            <LayoutTemplate className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MDN Card */}
                    <div className="group relative rounded-[2rem] bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] border border-zinc-200 p-2 transition-all duration-500 hover:border-violet-400/40 hover:bg-violet-50/60 shadow-2xl">
                        <div className="h-full rounded-[1.5rem] bg-white border border-zinc-100 p-8 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-violet-400/20 transition-colors duration-700" />
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
                                        MDN Style
                                    </h2>
                                    <span className="px-2.5 py-1 rounded-md bg-violet-400/10 border border-violet-400/20 text-violet-500 text-xs font-mono font-medium tracking-wide">
                                        MDN
                                    </span>
                                </div>
                                <p className="text-zinc-500 mb-8 leading-relaxed text-sm">
                                    Inspired by Mozilla MDN. Accessible, table-driven, and perfect for reference docs and browser APIs.
                                </p>
                                <div className="mt-auto relative rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xl group-hover:shadow-violet-400/10 transition-shadow duration-500">
                                    <div className="h-8 border-b border-zinc-200 bg-zinc-50 flex items-center px-4 gap-2">
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-red-400/80 transition-colors" />
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-yellow-400/80 transition-colors delay-75" />
                                        <div className="size-2.5 rounded-full bg-zinc-300 group-hover:bg-green-400/80 transition-colors delay-150" />
                                    </div>
                                    <div className="overflow-hidden relative">
                                        <img
                                            src={mdnMockup}
                                            alt="MDN Template Mockup"
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            to="/p/mdn-demo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500 text-white text-sm font-semibold hover:bg-violet-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                        >
                                            <LayoutTemplate className="size-4" /> View Live Demo
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}