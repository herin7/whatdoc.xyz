import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, ArrowLeft, ArrowRight, Book, Code } from 'lucide-react';
import Logo from '../components/Logo';

export default function DevToolsTemplate({ project, isPremium = false }) {
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
                    <div className="relative group rounded-xl overflow-hidden my-6 bg-[#0a0a0a] border border-white/10 ring-1 ring-white/5 transition-all hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#111]">
                            <span className="text-xs font-mono text-zinc-400">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                {copiedContent === codeString ? <Check className="size-4 text-indigo-400" /> : <Copy className="size-4" />}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-white/5 text-indigo-200 px-1.5 py-0.5 rounded-md text-sm border border-white/10`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Gradients */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Mobile Header */}
            <header className="md:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <Logo className="text-white text-lg" />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-white">
                    {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </header>

            <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto relative z-10">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/50 backdrop-blur-md border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full flex flex-col pt-4">
                        <div className="px-6 mb-6 hidden md:block">
                            <Logo className="text-white text-xl tracking-tight font-medium" />
                        </div>
                        <div className="px-4 mb-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search (Cmd+K)"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                                />
                            </div>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-4 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-semibold text-zinc-600 tracking-[0.2em] uppercase mb-3 px-2">Getting Started</h3>
                                <ul className="space-y-1">
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-sm font-medium text-white bg-white/5 px-2 py-1.5 rounded-md border border-white/5">
                                            <Book className="size-4 text-indigo-400" /> Introduction
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-md transition-all">
                                            <Code className="size-4" /> Quickstart
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 px-6 py-10 md:py-16 md:px-12 lg:px-24">
                    <div className="max-w-3xl mx-auto">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
                            <span>Project</span> <ChevronRight className="size-3 text-zinc-700" />
                            <span className="text-indigo-400">{project.repoName.split('/').pop()}</span>
                        </div>

                        {/* Article container with brutalist/linear typography */}
                        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:decoration-indigo-500/30 hover:prose-a:decoration-indigo-400 prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
                            <h1>{project.repoName.split('/').pop()}</h1>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {project.generatedDocs || "_(No documentation generated yet.)_"}
                            </ReactMarkdown>
                        </article>

                        {/* Next/Prev */}
                        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4">
                            <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/5 bg-[#111] hover:bg-white/5 hover:border-white/10 transition-all group text-left">
                                <ArrowLeft className="size-4 text-zinc-500 group-hover:text-white transition-colors" />
                                <div>
                                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-0.5">Previous</div>
                                    <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Setup Guide</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/5 bg-[#111] hover:bg-white/5 hover:border-white/10 transition-all group text-right justify-end">
                                <div>
                                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-0.5">Next</div>
                                    <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">API Reference</div>
                                </div>
                                <ArrowRight className="size-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right TOC (Sticky) */}
                <aside className="hidden xl:block w-64 pl-8 py-16 pr-8">
                    <div className="sticky top-16">
                        <h4 className="text-[10px] font-semibold text-zinc-600 tracking-[0.2em] uppercase mb-4">On This Page</h4>
                        <ul className="space-y-3 text-sm text-zinc-500 border-l border-white/5 pl-4 relative">
                            <div className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)] h-1/3 rounded-full" />
                            <li><a href="#" className="text-zinc-300 font-medium block">Overview</a></li>
                            <li><a href="#" className="hover:text-zinc-300 transition-colors block">Architecture</a></li>
                            <li><a href="#" className="hover:text-zinc-300 transition-colors block">Deployment</a></li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 text-xs text-zinc-400 shadow-[0_0_20px_rgba(0,0,0,0.5)] ring-1 ring-white/5 font-mono">
                        <span className="text-indigo-500">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
