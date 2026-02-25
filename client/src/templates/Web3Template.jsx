import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, Hexagon, Zap } from 'lucide-react';
import Logo from '../components/Logo';

export default function Web3Template({ project, isPremium = false }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [copiedContent, setCopiedContent] = useState('');

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(''), 2000);
    };

    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
                const codeString = String(children).replace(/\n$/, '');
                return (
                    <div className="relative group my-8 bg-[#0b0b13] border-2 border-[#1c1c30] hover:border-fuchsia-500/50 shadow-[4px_4px_0px_#1c1c30] group-hover:shadow-[4px_4px_0px_rgba(217,70,239,0.5)] transition-all overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}>
                        <div className="flex items-center justify-between px-4 py-2 bg-[#121221] border-b-2 border-[#1c1c30]">
                            <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-zinc-500 hover:text-white transition-colors p-1"
                            >
                                {copiedContent === codeString ? <Check className="size-4 text-fuchsia-400" /> : <Copy className="size-4" />}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-1.5 py-0.5 text-[0.85em] font-mono`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-[#07070b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-hidden flex flex-col md:flex-row">
            {/* Background grids and glows */}
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(#1c1c30 1px, transparent 1px), linear-gradient(90deg, #1c1c30 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="fixed top-[20%] left-[10%] w-[30vh] h-[30vh] bg-cyan-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="fixed bottom-[20%] right-[10%] w-[40vh] h-[40vh] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            {/* Mobile Nav */}
            <div className="md:hidden sticky top-0 z-50 bg-[#0b0b13]/90 backdrop-blur-md border-b-2 border-[#1c1c30] px-4 py-3 flex items-center justify-between">
                <Logo className="text-white text-lg font-bold" />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cyan-400 hover:text-white">
                    {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Left Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0b0b13]/80 backdrop-blur-xl border-r-2 border-[#1c1c30] transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col relative z-10">
                    <div className="p-6 border-b-2 border-[#1c1c30] hidden md:block">
                        <Logo className="text-white text-xl font-bold tracking-tight inline-block filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                    <div className="p-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fuchsia-500" />
                            <input
                                type="text"
                                placeholder="Search Intel..."
                                className="w-full bg-[#121221] border-2 border-[#1c1c30] pl-9 pr-3 py-2 text-sm text-cyan-100 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all font-mono placeholder:text-[#424263]"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}
                            />
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <h4 className="text-[10px] font-bold text-[#424263] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Hexagon className="size-3 text-cyan-500" /> CORE_DOCS
                            </h4>
                            <ul className="space-y-2 text-sm font-medium">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 px-3 py-2 text-xs uppercase tracking-widest shadow-[inset_2px_0_0_#22d3ee]">
                                        Initialization -&gt;
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:shadow-[inset_2px_0_0_#d946ef] hover:bg-fuchsia-950/20">
                                        Economy System
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 px-6 py-12 md:px-12 lg:px-24 z-10 relative h-screen overflow-y-auto scroll-smooth">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#424263] mb-8 font-mono">
                        <span className="hover:text-cyan-400 cursor-pointer">Project</span> <span>/</span>
                        <span className="text-fuchsia-400">{project.repoName.split('/').pop()}</span>
                    </div>

                    <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h1:uppercase prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-cyan-400 prose-h1:to-fuchsia-500 prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b-2 prose-h2:border-[#1c1c30] prose-h2:pb-4 prose-h2:uppercase prose-h2:text-white prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-cyan-400 hover:prose-a:text-fuchsia-400 prose-a:transition-colors prose-a:font-bold max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-16 border-2 border-cyan-500 bg-cyan-500/10 flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-500">
                                <Zap className="size-8 text-cyan-400 -rotate-45 group-hover:-rotate-90 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            </div>
                            <h1 className="m-0 pl-4">{project.repoName.split('/').pop()}</h1>
                        </div>
                        <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-transparent mb-12 opacity-50" />

                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {project.generatedDocs || "_[NO_DATA_FOUND]_"}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-24 pt-8 border-t-2 border-[#1c1c30] flex flex-col sm:flex-row justify-between gap-4 pb-20">
                        <button className="px-6 py-3 border-2 border-[#1c1c30] hover:border-cyan-500 text-[#424263] hover:text-cyan-400 transition-all text-xs font-bold uppercase tracking-widest text-left" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                            <div className="mb-1 text-[9px] text-[#424263]">PREVIOUS_NODE</div>
                            Install
                        </button>
                        <button className="px-6 py-3 border-2 border-[#1c1c30] hover:border-fuchsia-500 text-[#424263] hover:text-fuchsia-400 transition-all text-xs font-bold uppercase tracking-widest text-right hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] bg-[#121221]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
                            <div className="mb-1 text-[9px] text-fuchsia-500/50">NEXT_NODE</div>
                            Smart Contracts
                        </button>
                    </div>
                </div>
            </main>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="px-4 py-2 bg-[#0b0b13] border-l-4 border-cyan-500 text-[10px] font-bold tracking-widest uppercase text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                        <span className="text-cyan-400 mr-2">⚡️</span> SYSTEM: WHATDOC
                    </div>
                </div>
            )}
        </div>
    );
}
