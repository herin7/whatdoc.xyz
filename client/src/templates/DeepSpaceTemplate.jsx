import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, Terminal, GitBranch, TerminalSquare } from 'lucide-react';
import Logo from '../components/Logo';

export default function DeepSpaceTemplate({ project, isPremium = false }) {
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
                    <div className="relative group my-8 bg-[#020510] border border-indigo-900/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.15)] ring-1 ring-white/5 font-mono group-hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-indigo-900/50 bg-[#060a1e]">
                            <div className="flex items-center gap-2">
                                <TerminalSquare className="size-4 text-cyan-400" />
                                <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-500 font-bold">{match[1]}</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-zinc-500 hover:text-cyan-400 transition-colors"
                            >
                                {copiedContent === codeString ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
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
            return <code className={`${className} bg-indigo-950/50 text-cyan-300 border border-indigo-500/30 px-1.5 py-0.5 rounded text-[0.85em] font-mono shadow-[0_0_10px_rgba(34,211,238,0.1)]`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-zinc-300 font-mono relative overflow-hidden flex flex-col md:flex-row">
            {/* Nebula / Stars Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden sticky top-0 z-50 bg-[#060a1e]/80 backdrop-blur-md border-b border-indigo-900/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="size-5 text-cyan-400" />
                    <span className="text-white font-bold tracking-widest uppercase text-sm">{project.repoName.split('/').pop()}</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-cyan-400 hover:text-white">
                    {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Terminal Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#020510]/95 backdrop-blur-xl border-r border-indigo-900/50 transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col pb-4 z-10 relative">
                    <div className="p-6 border-b border-indigo-900/50 hidden md:block">
                        <div className="flex items-center gap-2">
                            <Terminal className="size-5 text-cyan-400" />
                            <span className="text-white font-bold tracking-widest uppercase text-sm truncate">{project.repoName.split('/').pop()}</span>
                        </div>
                    </div>

                    <div className="p-4 border-b border-indigo-900/30 bg-[#060a1e]">
                        <div className="flex items-center gap-2 text-xs text-indigo-400/80 mb-2 font-bold tracking-widest"><GitBranch className="size-3" /> MAIN </div>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-indigo-500" />
                            <input
                                type="text"
                                placeholder="grep -i 'docs'..."
                                className="w-full bg-[#030712] border border-indigo-900/50 rounded-sm pl-9 pr-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono placeholder:text-indigo-800"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
                        <div>
                            <div className="text-indigo-600 mb-2 font-bold tracking-widest">// MODULE_01</div>
                            <ul className="space-y-1 border-l border-indigo-900/50 ml-1.5 pl-3">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-cyan-400 font-medium py-1.5 relative before:absolute before:-left-[13px] before:top-[12px] before:w-2 before:h-px before:bg-cyan-500">
                                        ./init.sh
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-zinc-500 hover:text-cyan-300 transition-colors py-1.5 relative before:absolute before:-left-[13px] before:top-[12px] before:w-2 before:h-px before:bg-indigo-900/50">
                                        ./config.json
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="text-indigo-600 mb-2 font-bold tracking-widest">// MODULE_02</div>
                            <ul className="space-y-1 border-l border-indigo-900/50 ml-1.5 pl-3">
                                <li><a href="#" className="block text-zinc-500 hover:text-cyan-300 transition-colors py-1.5 relative before:absolute before:-left-[13px] before:top-[12px] before:w-2 before:h-px before:bg-indigo-900/50">api/routes.js</a></li>
                                <li><a href="#" className="block text-zinc-500 hover:text-cyan-300 transition-colors py-1.5 relative before:absolute before:-left-[13px] before:top-[12px] before:w-2 before:h-px before:bg-indigo-900/50">db/models.ts</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Window */}
            <main className="flex-1 min-w-0 px-6 py-12 md:px-12 lg:px-24 z-10 relative overflow-y-auto max-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header Path */}
                    <div className="flex items-center gap-2 text-xs text-indigo-400/80 mb-12">
                        <span>root</span> <span className="text-indigo-600">/</span>
                        <span>{project.repoName.split('/')[0]}</span> <span className="text-indigo-600">/</span>
                        <span className="text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]">{project.repoName.split('/').pop()}</span>
                        <span className="animate-pulse w-2 h-4 bg-cyan-400 inline-block ml-1" />
                    </div>

                    <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:text-white prose-h1:mb-8 prose-h1:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-indigo-900/50 prose-h2:pb-4 prose-h2:text-indigo-100 prose-p:text-indigo-200/70 prose-p:leading-relaxed prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-a:transition-colors prose-li:text-indigo-200/70 prose-strong:text-cyan-100">
                        <h1>{project.repoName.split('/').pop()}</h1>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {project.generatedDocs || "_(No documentation generated yet. Awaiting downlink.)_"}
                        </ReactMarkdown>
                    </article>

                    <div className="mt-24 pt-8 border-t border-indigo-900/50 flex flex-col sm:flex-row justify-between gap-4">
                        <button className="flex items-center gap-2 text-indigo-500 hover:text-cyan-400 transition-colors text-xs font-bold tracking-widest uppercase">
                            <ChevronRight className="size-4 rotate-180" /> [ Prev_Sector ]
                        </button>
                        <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-400 transition-colors text-xs font-bold tracking-widest uppercase">
                            [ Next_Sector ] <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            </main>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="px-4 py-2 bg-[#020510] border border-cyan-500/50 rounded-sm text-[10px] font-bold tracking-widest uppercase text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-2">
                        <TerminalSquare className="size-3" /> SYS_GEN: WHATDOC
                    </div>
                </div>
            )}
        </div>
    );
}
