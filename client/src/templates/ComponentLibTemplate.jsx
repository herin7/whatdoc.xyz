import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, Box, Layers, MonitorPlay } from 'lucide-react';
import Logo from '../components/Logo';

export default function ComponentLibTemplate({ project, isPremium = false }) {
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
                    <div className="my-8">
                        {/* Preview Box Container */}
                        <div className="relative group rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <Box className="size-4 text-slate-400" />
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Example</span>
                            </div>
                            <div className="p-8 flex items-center justify-center bg-slate-50/50 min-h-[160px] border-b border-dashed border-slate-300 relative group-hover:bg-slate-50/80 transition-colors">
                                <span className="text-sm text-slate-400 font-medium">Interactive Preview Unavailable</span>
                                <MonitorPlay className="absolute right-4 bottom-4 size-5 text-slate-300" />
                            </div>

                            {/* Code Area */}
                            <div className="relative bg-slate-900 border-t border-slate-800">
                                <div className="absolute right-4 top-4 z-10">
                                    <button
                                        onClick={() => copyToClipboard(codeString)}
                                        className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg"
                                    >
                                        {copiedContent === codeString ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
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
                        </div>
                    </div>
                );
            }
            return <code className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 flex flex-col md:flex-row">
            {/* Header / Top Nav */}
            <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 w-full lg:w-64 shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-slate-500 hover:text-slate-900">
                        {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                    </button>
                    <Logo className="text-xl" />
                </div>

                <div className="hidden lg:flex items-center justify-between flex-1 pl-8">
                    <div className="flex items-center gap-8 text-sm font-medium">
                        <a href="#" className="text-slate-900">Components</a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Templates</a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md text-sm text-slate-500 font-mono transition-colors cursor-pointer w-64">
                            <Search className="size-4" />
                            <span>Quick search...</span>
                            <span className="ml-auto text-xs bg-white px-1.5 py-0.5 rounded shadow-sm">⌘K</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Left Sidebar */}
            <aside className={`fixed inset-y-0 left-0 pt-16 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="h-full overflow-y-auto p-4 space-y-8">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 px-3">Getting Started</h4>
                        <ul className="space-y-1 text-sm border-l border-slate-200 ml-4 pl-3 relative">
                            <div className="absolute left-[-1px] top-1 bottom-1 w-[2px] bg-slate-300 hidden" />
                            <li><a href="#" className="block py-1.5 text-slate-600 hover:text-slate-900 transition-colors">Installation</a></li>
                            <li><a href="#" className="block py-1.5 text-blue-600 font-medium relative before:absolute before:left-[-13px] before:top-1.5 before:w-[2px] before:h-5 before:bg-blue-600">Theming</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-3 px-3 flex items-center gap-2">
                            <Layers className="size-4 text-blue-500" /> UI Elements
                        </h4>
                        <ul className="space-y-1 text-sm border-l border-slate-200 ml-4 pl-3">
                            <li><a href="#" className="block py-1.5 text-slate-600 hover:text-slate-900 transition-colors">Buttons</a></li>
                            <li><a href="#" className="block py-1.5 text-slate-600 hover:text-slate-900 transition-colors">Cards</a></li>
                            <li><a href="#" className="block py-1.5 text-slate-600 hover:text-slate-900 transition-colors">Forms</a></li>
                            <li><a href="#" className="block py-1.5 text-slate-600 hover:text-slate-900 transition-colors">Navigation</a></li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full min-w-0 pt-16 px-4 sm:px-6 lg:px-12 xl:px-24">
                <div className="max-w-4xl py-12">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
                        <span className="hover:text-slate-900 cursor-pointer">Docs</span> <ChevronRight className="size-4" />
                        <span className="text-slate-900">{project.repoName.split('/').pop()}</span>
                    </div>

                    <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-medium hover:prose-a:underline prose-li:text-slate-600">
                        <h1 className="flex items-center gap-3">
                            {project.repoName.split('/').pop()}
                        </h1>
                        <p className="text-xl text-slate-500 mb-12">Learn how to build, customize, and deploy your new component library using the power of {project.techstack || 'React'}.</p>

                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {project.generatedDocs || "_(No documentation generated yet.)_"}
                        </ReactMarkdown>
                    </article>

                    {/* Footer Nav */}
                    <div className="mt-24 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
                        <button className="flex flex-col items-start p-4 w-full sm:w-1/2 group">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ChevronRight className="size-4 rotate-180" /> Previous
                            </span>
                            <span className="text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Installation Guide</span>
                        </button>
                        <button className="flex flex-col items-end p-4 w-full sm:w-1/2 group text-right">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                Next <ChevronRight className="size-4" />
                            </span>
                            <span className="text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors">UI Components Overview</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-lg text-xs font-medium text-slate-600">
                        <span className="text-blue-500">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
