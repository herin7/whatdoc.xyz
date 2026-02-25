import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, ArrowLeft, ArrowRight, Github, BookOpen, MessageCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function OpenSourceTemplate({ project, isPremium = false }) {
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
                    <div className="relative group rounded-2xl overflow-hidden my-6 bg-[#1a1a1a] shadow-lg border border-[#2a2a2a] ring-1 ring-emerald-500/10">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#222]">
                            <span className="text-xs font-mono text-emerald-400 font-medium">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333] hover:bg-[#444] text-[#a0a0a0] hover:text-white transition-all"
                            >
                                {copiedContent === codeString ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
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
            return <code className={`${className} bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md text-sm`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] text-[#dedede] font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#111111]/80 backdrop-blur-md border-b border-[#222]">
                <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Logo className="text-xl text-emerald-400" />
                        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                            <a href="#" className="px-3 py-1.5 rounded-full text-white bg-[#222] hover:bg-[#333] transition-colors">Documentation</a>
                            <a href="#" className="px-3 py-1.5 rounded-full text-[#a0a0a0] hover:text-white hover:bg-[#222] transition-colors">Reference</a>
                            <a href="#" className="px-3 py-1.5 rounded-full text-[#a0a0a0] hover:text-white hover:bg-[#222] transition-colors">Guides</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] border border-[#333] hover:border-[#444] px-3 py-1.5 rounded-full text-sm text-[#888] transition-colors cursor-text group">
                            <Search className="size-4 group-hover:text-emerald-400 transition-colors" />
                            <span>Search the docs...</span>
                        </div>
                        <button className="hidden md:flex w-8 h-8 rounded-full items-center justify-center bg-[#222] hover:bg-[#333] text-[#a0a0a0] hover:text-white transition-colors">
                            <Github className="size-4" />
                        </button>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-[#a0a0a0]">
                            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto flex">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 mt-16 z-40 w-64 bg-[#111] border-r border-[#222] transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-6">
                        <div>
                            <h4 className="text-xs font-semibold text-[#888] mb-3 px-3 uppercase tracking-wider">Overview</h4>
                            <ul className="space-y-1 text-sm">
                                <li>
                                    <a href="#" className="flex items-center gap-2 font-medium text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg">
                                        <BookOpen className="size-4" /> Introduction
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-[#a0a0a0] hover:text-[#dedede] hover:bg-[#222] px-3 py-2 rounded-lg transition-colors">
                                        <MessageCircle className="size-4" /> Getting Help
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-[#888] mb-3 px-3 uppercase tracking-wider">Features</h4>
                            <ul className="space-y-1 text-sm">
                                <li><a href="#" className="block text-[#a0a0a0] hover:text-[#dedede] hover:bg-[#222] px-3 py-2 rounded-lg transition-colors">Authentication</a></li>
                                <li><a href="#" className="block text-[#a0a0a0] hover:text-[#dedede] hover:bg-[#222] px-3 py-2 rounded-lg transition-colors">Database</a></li>
                                <li><a href="#" className="block text-[#a0a0a0] hover:text-[#dedede] hover:bg-[#222] px-3 py-2 rounded-lg transition-colors">Storage</a></li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 px-6 py-12 md:px-12 lg:px-24">
                    <div className="max-w-3xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-[#888] mb-8">
                            <span>{project.repoName.split('/')[0]}</span> <ChevronRight className="size-4 text-[#444]" />
                            <span className="text-emerald-400">{project.repoName.split('/').pop()}</span>
                        </div>

                        <article className="prose prose-invert prose-emerald max-w-none prose-headings:font-medium prose-h1:text-4xl prose-h1:text-white prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-[#222] prose-h2:pb-4 prose-p:text-[#a0a0a0] prose-p:leading-relaxed prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-a:transition-colors">
                            <h1>{project.repoName.split('/').pop()} Documentation</h1>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {project.generatedDocs || "_(No documentation generated yet.)_"}
                            </ReactMarkdown>
                        </article>

                        {/* Pagination */}
                        <div className="mt-20 py-8 border-t border-[#222] flex flex-col sm:flex-row justify-between gap-4">
                            <button className="w-full sm:w-auto flex flex-col items-start px-4 py-3 rounded-2xl border border-[#333] hover:border-[#555] bg-[#1a1a1a] hover:bg-[#222] transition-colors group">
                                <div className="flex items-center gap-1 text-[#888] text-xs font-semibold mb-1 group-hover:text-[#a0a0a0]">
                                    <ArrowLeft className="size-3" /> Previous
                                </div>
                                <div className="text-white font-medium text-sm">Getting Started</div>
                            </button>
                            <button className="w-full sm:w-auto flex flex-col items-end px-4 py-3 rounded-2xl border border-[#333] hover:border-emerald-500/50 bg-[#1a1a1a] hover:bg-emerald-500/5 transition-all shadow-[0_0_0_transparent] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] group text-right">
                                <div className="flex items-center gap-1 text-[#888] text-xs font-semibold mb-1 group-hover:text-emerald-400">
                                    Next <ArrowRight className="size-3" />
                                </div>
                                <div className="text-white font-medium text-sm">Authentication Reference</div>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right TOC */}
                <aside className="hidden xl:block w-64 pt-12 pr-6">
                    <div className="sticky top-20">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">On this page</h4>
                        <ul className="space-y-3 text-sm text-[#888] relative before:content-[''] before:absolute before:left-[-1px] before:top-0 before:bottom-0 before:w-[2px] before:bg-[#222] pl-4">
                            <div className="absolute left-[-1px] top-4 w-[2px] h-4 bg-emerald-500 rounded-full" />
                            <li><a href="#" className="text-emerald-400 block font-medium">Overview</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Requirements</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Installation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors block">Configuration</a></li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500 border border-emerald-400 text-black text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <span>⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
