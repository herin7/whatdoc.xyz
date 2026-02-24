import { ExternalLink, Github, Linkedin, Twitter, Globe, Mail, Zap, Trophy, Database, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import TerminalEasterEgg from '../components/TerminalEasterEgg';

export default function Creator() {
    return (
        <div className="bg-[#050505] text-white min-h-screen p-4 sm:p-8 relative">
            <TerminalEasterEgg />
            <Navbar />

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-4 max-w-5xl mx-auto mt-24">


                <div className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 sm:p-10 hover:border-white/20 transition-colors relative overflow-hidden group flex flex-col justify-between">
                    {/* Background glow */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/[0.04] blur-[100px] pointer-events-none group-hover:bg-emerald-500/[0.08] transition-all duration-700" />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/[0.03] text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Open to Internships
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                            Herin Soni
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-400 font-medium mb-4">
                            Performance-Obsessed Full-Stack Engineer
                        </p>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg">
                            Mastering MERN, Next.js, and Backend infrastructure. I build high-performance systems and scale AI tools for thousands of developers.
                        </p>
                    </div>

                    <div className="relative mt-8">
                        <a
                            href="mailto:herinsoni3737@gmail.com"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                        >
                            <Mail size={14} />
                            Hire Me
                        </a>
                    </div>
                </div>


                <div className="md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors relative overflow-hidden group">
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-amber-500/[0.04] blur-[80px] pointer-events-none group-hover:bg-amber-500/[0.08] transition-all duration-700" />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Trophy size={18} className="text-amber-400" />
                            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Algorithmic Muscle</h3>
                        </div>

                        <div className="space-y-6">
                            {/* LeetCode */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-bold text-white tracking-tight">1881</span>
                                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Knight</span>
                                </div>
                                <p className="text-sm text-zinc-500">LeetCode Rating</p>
                                <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
                                    <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                                </div>
                            </div>

                            {/* Codeforces */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-bold text-white tracking-tight">1403</span>
                                    <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Specialist</span>
                                </div>
                                <p className="text-sm text-zinc-500">Codeforces Rating</p>
                                <div className="mt-2 h-1 rounded-full bg-zinc-800 overflow-hidden">
                                    <div className="h-full w-[56%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-xs text-zinc-600 leading-relaxed">
                                Top-tier competitive programmer. Consistently solving hard graph, DP, and segment tree problems under timed constraints.
                            </p>
                        </div>
                    </div>
                </div>


                <div className="md:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors relative overflow-hidden group">
                    <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-purple-500/[0.04] blur-[80px] pointer-events-none group-hover:bg-purple-500/[0.08] transition-all duration-700" />

                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <Users size={18} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">GitForMe</h3>
                                    <p className="text-xs text-zinc-500">AI Codebase Intelligence</p>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                                Scaled an AI codebase intelligence platform to 60k+ page views. Built high-throughput vector search using FAISS and Redis.
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">20,000+</span>
                            <p className="text-xs text-zinc-500 mt-1">Developers Reached</p>
                        </div>
                    </div>
                </div>


                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors relative overflow-hidden group">
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-blue-500/[0.04] blur-[80px] pointer-events-none group-hover:bg-blue-500/[0.08] transition-all duration-700" />

                    <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                            <Database size={18} className="text-blue-400" />
                            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Low Level</h3>
                        </div>

                        <h4 className="text-xl font-semibold text-white mb-2">MiniDB Engine</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Built a custom in-memory database engine and memory allocator from scratch in C++17.
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">C++17</span>
                            <span className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono">Systems</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="https://x.com/herinnsoni"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
                        >
                            <Twitter size={15} />
                            X / Twitter
                            <ExternalLink size={11} className="text-zinc-600" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/herinsoni/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
                        >
                            <Linkedin size={15} />
                            LinkedIn
                            <ExternalLink size={11} className="text-zinc-600" />
                        </a>
                        <a
                            href="https://github.com/herin7"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
                        >
                            <Github size={15} />
                            GitHub
                            <ExternalLink size={11} className="text-zinc-600" />
                        </a>
                        <a
                            href="https://herin.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
                        >
                            <Globe size={15} />
                            Portfolio
                            <ExternalLink size={11} className="text-zinc-600" />
                        </a>
                    </div>
                </div>

            </div>

            {/* The Keycap Command Hint — centered below the grid */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-1.5">
                    {['H', 'I', 'R', 'E', 'M', 'E'].map((letter, i) => (
                        <kbd
                            key={i}
                            className="w-8 h-8 flex items-center justify-center text-xs font-mono font-semibold text-zinc-400 bg-[#111] border border-b-2 border-zinc-800 rounded-md shadow-[0_2px_0_rgb(39,39,42)]"
                        >
                            {letter}
                        </kbd>
                    ))}
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                    Execute for root access
                </p>
            </div>

            {/* Subtle footer */}
            <p className="text-center text-[11px] text-zinc-700 mt-12 pb-8">
                Built with obsession · <span className="font-logo"><span className="font-bold">W</span>HATDOC.XYZ</span>
            </p>
        </div>
    );
}
