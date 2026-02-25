import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, FileText, Menu, X, Check, SearchCode } from 'lucide-react';
import Logo from '../components/Logo';

export default function FintechTemplate({ project, isPremium = false }) {
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
                    <div className="relative group rounded-lg overflow-hidden my-6 bg-slate-900 shadow-xl border border-slate-800">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                            <span className="text-xs font-mono text-slate-400">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded"
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
            return <code className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col md:flex-row">
            {/* Top Navbar for Mobile */}
            <div className="md:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <Logo className="text-slate-900 text-lg" />
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <X className="size-6 text-slate-600" /> : <Menu className="size-6 text-slate-600" />}
                </button>
            </div>

            {/* Left Sidebar - Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="hidden md:flex p-5 border-b border-slate-200">
                        <Logo className="text-slate-900 text-xl" />
                    </div>
                    <div className="p-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search docs... (Cmd+K)"
                                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm group-hover:border-slate-300"
                            />
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Project</h3>
                            <ul className="space-y-1.5">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                                        <FileText className="size-4" /> Overview
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-md transition-colors">
                                        <ChevronRight className="size-4" /> Quickstart
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Split layout: Content (Left) + Code/TOC (Right) */}
            <main className="flex-1 flex flex-col lg:flex-row relative max-w-7xl mx-auto w-full">
                {/* Left Content Area (Prose) */}
                <div className="flex-1 px-6 py-10 lg:pl-12 lg:pr-8 overflow-y-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                        <span>Docs</span> <ChevronRight className="size-3" />
                        <span className="text-slate-900 font-medium">{project.repoName.split('/').pop()}</span>
                    </div>

                    <article className="prose prose-slate max-w-3xl prose-headings:font-bold prose-h1:text-4xl prose-h1:tracking-tight prose-h2:text-2xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
                        <h1 className="mb-4">{project.repoName.split('/').pop()} Documentation</h1>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {project.generatedDocs || "_(No documentation generated yet.)_"}
                        </ReactMarkdown>
                    </article>

                    {/* Pagination */}
                    <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center">
                        <button className="text-sm font-medium text-slate-500 hover:text-slate-900">Prev</button>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            Next Step <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Right Area (Sticky Code & TOC) */}
                <aside className="hidden lg:block w-[400px] xl:w-[480px] bg-slate-900 border-l border-slate-800 text-slate-400 p-8">
                    <div className="sticky top-8">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">On This Page</h4>
                        <ul className="space-y-2 text-sm mb-12">
                            <li><a href="#" className="hover:text-white transition-colors">Introduction</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Installation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                        </ul>

                        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-4 text-white font-medium">
                                <SearchCode className="size-5 text-blue-400" /> Example Request
                            </div>
                            <div className="flex border-b border-slate-700 mb-4">
                                <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-blue-500">cURL</button>
                                <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-300">Node.js</button>
                                <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-300">Python</button>
                            </div>
                            <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                                {`curl -X POST https://api.example.com/v1/charges \\
  -u sk_test_123: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_mastercard`}
                            </pre>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Watermark Logic */}
            {!isPremium && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-500 shadow-xl font-medium">
                        <span className="text-amber-500">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
