import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, Share, Bookmark } from 'lucide-react';
import Logo from '../components/Logo';

export default function ConsumerTechTemplate({ project, isPremium = false }) {
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
                    <div className="relative group my-10 rounded-3xl overflow-hidden bg-black/90 shadow-2xl backdrop-blur-3xl ring-1 ring-white/10 sm:max-w-[700px] mx-auto">
                        <div className="flex items-center justify-between px-6 py-4 bg-white/10 border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="size-3 rounded-full bg-red-400" />
                                <div className="size-3 rounded-full bg-amber-400" />
                                <div className="size-3 rounded-full bg-green-400" />
                            </div>
                            <span className="text-sm font-medium text-white/50">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                {copiedContent === codeString ? <Check className="size-5 text-green-400" /> : <Copy className="size-5" />}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '2rem 1.5rem', background: 'transparent', fontSize: '15px', lineHeight: '1.6' }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-gray-100/80 text-gray-900 px-2 py-1 rounded-lg text-[0.9em] font-medium tracking-tight`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f] font-sans selection:bg-blue-200 scroll-smooth">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-black/[0.08] transition-all">
                <div className="max-w-[1000px] mx-auto h-[44px] flex items-center justify-between px-4 sm:px-6">
                    <Logo className="text-lg font-semibold tracking-tight h-[20px] mb-1" />

                    <nav className="hidden md:flex items-center gap-8 text-[12px] font-medium tracking-tight">
                        <a href="#" className="text-black/80 hover:text-black transition-colors">Overview</a>
                        <a href="#" className="text-black/50 hover:text-black transition-colors">Architecture</a>
                        <a href="#" className="text-black/50 hover:text-black transition-colors">API Reference</a>
                        <a href="#" className="text-black/50 hover:text-black transition-colors">Support</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="text-black/50 hover:text-black transition-colors">
                            <Search className="size-4" />
                        </button>
                        <button className="md:hidden text-black/80">
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Sub Nav */}
            <div className="fixed top-[44px] inset-x-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-black/[0.04]">
                <div className="max-w-[1000px] mx-auto h-[52px] flex items-center justify-between px-4 sm:px-6">
                    <span className="text-[21px] font-semibold tracking-tight">{project.repoName.split('/').pop()}</span>
                    <div className="flex items-center gap-3">
                        <button className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-black px-3 py-1.5 rounded-full transition-colors hidden sm:block">
                            <Share className="size-3.5 inline mr-1 -mt-0.5" /> Share
                        </button>
                        <button className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-full shadow-md transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

            <main className="w-full pt-[96px] pb-32 px-4 sm:px-6">
                <div className="max-w-[800px] mx-auto mt-20 text-center mb-24">
                    <h1 className="text-[56px] leading-[1.05] sm:text-[80px] font-semibold tracking-[-0.04em] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-600">
                        Pro docs.<br />Designed for {project.techstack || 'you'}.
                    </h1>
                    <p className="text-[21px] leading-[1.4] sm:text-[28px] font-medium tracking-tight text-gray-500 max-w-[600px] mx-auto">
                        Experience the most advanced documentation for {project.repoName.split('/').pop()}, crafted with meticulous attention to detail.
                    </p>
                </div>

                <div className="max-w-[700px] mx-auto bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]">
                    <article className="prose prose-lg max-w-none prose-p:text-[19px] prose-p:leading-[1.5] prose-p:font-medium prose-p:text-gray-600 prose-p:tracking-tight prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-black prose-h2:text-[40px] prose-h2:leading-[1.1] prose-h2:mt-24 prose-h2:mb-8 prose-h3:text-[28px] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:text-[19px] prose-li:font-medium prose-li:text-gray-600">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {project.generatedDocs || "_(No documentation generated yet.)_"}
                        </ReactMarkdown>
                    </article>
                </div>

                <div className="max-w-[700px] mx-auto mt-16 flex justify-between items-center text-[17px] font-medium tracking-tight border-t border-gray-200 pt-8">
                    <button className="text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                        <ChevronRight className="size-4 rotate-180" /> Installation
                    </button>
                    <button className="text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-2">
                        Configuration <ChevronRight className="size-4" />
                    </button>
                </div>
            </main>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-2xl border border-black/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-full flex items-center gap-2 text-[13px] font-medium tracking-tight text-gray-600">
                        <span className="text-blue-500">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
