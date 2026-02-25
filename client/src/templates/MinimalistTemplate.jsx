import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, ArrowLeft, ArrowRight, Home, Command } from 'lucide-react';
import Logo from '../components/Logo';

export default function MinimalistTemplate({ project, isPremium = false }) {
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
                    <div className="relative group my-8 border-l-2 border-black dark:border-white pl-4">
                        <div className="absolute right-0 top-0">
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors bg-white dark:bg-black px-2 py-1 text-xs border border-zinc-200 dark:border-zinc-800 uppercase tracking-widest font-mono"
                            >
                                {copiedContent === codeString ? 'COPIED' : 'COPY'}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem 0', background: 'transparent', borderRadius: 0 }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white px-1.5 py-0.5 text-[0.85em] font-mono`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-0">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Logo className="text-xl" />
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <a href="#" className="text-zinc-900 dark:text-zinc-100 pb-1.5 border-b-2 border-black dark:border-white">Documentation</a>
                            <a href="#" className="text-zinc-500 hover:text-black dark:hover:text-white pb-1.5 border-b-2 border-transparent transition-colors">API</a>
                            <a href="#" className="text-zinc-500 hover:text-black dark:hover:text-white pb-1.5 border-b-2 border-transparent transition-colors">Guides</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-500 font-mono">
                            <Search className="size-4" />
                            <span>Search...</span>
                            <span className="ml-8 border border-zinc-300 dark:border-zinc-700 px-1 rounded flex items-center"><Command className="size-3 mr-0.5" /> K</span>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto flex">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 mt-14 z-40 w-64 bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-0 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto p-6 space-y-8">
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Framework</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <a href="#" className="block font-medium text-black dark:text-white border-l-2 border-black dark:border-white pl-4 -ml-[2px]">Introduction</a>
                                </li>
                                <li>
                                    <a href="#" className="block text-zinc-500 hover:text-black dark:hover:text-white pl-4">Architecture</a>
                                </li>
                                <li>
                                    <a href="#" className="block text-zinc-500 hover:text-black dark:hover:text-white pl-4">CLI Reference</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Integrations</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="block text-zinc-500 hover:text-black dark:hover:text-white pl-4">Database Providers</a></li>
                                <li><a href="#" className="block text-zinc-500 hover:text-black dark:hover:text-white pl-4">Auth Providers</a></li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 px-6 py-12 md:px-12 lg:px-24">
                    <div className="max-w-3xl">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-12 font-mono uppercase tracking-wider">
                            <Home className="size-4" /> <span>/</span> <span>Docs</span> <span>/</span> <span className="text-black dark:text-white font-semibold">{project.repoName.split('/').pop()}</span>
                        </div>

                        <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-4 prose-p:text-lg prose-p:leading-relaxed prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-zinc-500 transition-colors">
                            <h1>{project.repoName.split('/').pop()}</h1>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {project.generatedDocs || "_(No documentation generated yet.)_"}
                            </ReactMarkdown>
                        </article>

                        {/* Pagination */}
                        <div className="mt-24 py-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                            <button className="flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold">
                                <ArrowLeft className="size-4" /> Previous
                            </button>
                            <button className="flex items-center gap-2 text-black dark:text-white hover:text-zinc-500 transition-colors uppercase tracking-widest text-xs font-semibold">
                                Next Step <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right TOC */}
                <aside className="hidden xl:block w-64 pt-12 pr-6">
                    <div className="sticky top-20">
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">On This Page</h4>
                        <ul className="space-y-3 text-sm text-zinc-500 font-medium">
                            <li><a href="#" className="text-black dark:text-white block">Overview</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors block">Requirements</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors block">Configuration</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors block">Deployment</a></li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest shadow-2xl">
                        ⚡️ Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
