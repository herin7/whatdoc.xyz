import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, MoreHorizontal, Clock, Star } from 'lucide-react';

export default function WikiTemplate({ project, isPremium = false }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
                    <div className="relative group my-6 bg-[#f7f6f3] rounded-md overflow-hidden border border-[#e1e0db]">
                        <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-[#37352f] hover:bg-[#e1e0db] bg-white border border-[#e1e0db] shadow-sm p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                                {copiedContent === codeString ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vs}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1.25rem', background: 'transparent', fontSize: '0.9rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-[#ececec] text-[#eb5757] px-1.5 py-0.5 rounded text-[0.85em] font-mono mx-0.5`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#37352f] font-sans selection:bg-[#c1e0ff] flex">

            {/* Left Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-[#fbfbfa] border-r border-[#ececec] transition-all duration-300 md:relative ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0 hover:w-2 group'}`}>
                {sidebarOpen && (
                    <div className="h-full flex flex-col relative w-64 overflow-hidden">
                        <div className="p-4 flex items-center justify-between pb-6">
                            <div className="flex items-center gap-2 font-medium text-[15px] truncate cursor-pointer hover:bg-[#efefed] px-2 py-1 -ml-2 rounded w-full">
                                <span className="bg-[#fbefe3] text-[#de8d42] shadow-sm rounded p-0.5 text-xs">W</span>
                                <span className="truncate">{project.repoName.split('/').pop()}</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-[#a4a49f] hover:bg-[#efefed] hover:text-[#37352f] p-1 rounded transition-colors hidden md:block">
                                <ChevronRight className="size-4 rotate-180" />
                            </button>
                        </div>

                        <div className="px-3 pb-4">
                            <div className="flex items-center gap-2 text-[#a4a49f] hover:bg-[#efefed] px-2 py-1.5 rounded cursor-pointer transition-colors text-sm font-medium">
                                <Search className="size-4" /> <span>Search</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a4a49f] hover:bg-[#efefed] px-2 py-1.5 rounded cursor-pointer transition-colors text-sm font-medium">
                                <Clock className="size-4" /> <span>Updates</span>
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 mt-4">
                            <div className="text-xs font-semibold text-[#a4a49f] px-2 pb-1 hover:text-[#37352f] cursor-pointer group-hover:block transition-colors">WORKSPACE</div>
                            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efefed] rounded cursor-pointer text-sm font-medium bg-[#efefed]">
                                <span>📄</span> <span>{project.repoName.split('/').pop()} docs</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efefed] rounded cursor-pointer text-sm text-[#73726c] font-medium">
                                <span>📝</span> <span>Draft notes</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#efefed] rounded cursor-pointer text-sm text-[#73726c] font-medium">
                                <span>⚙️</span> <span>Setup</span>
                            </div>
                        </nav>
                    </div>
                )}
            </aside>

            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="fixed left-0 top-0 h-full w-2 hover:bg-[#efefed] z-50 hover:w-4 transition-all"
                    title="Open Sidebar"
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
                <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-[2px] h-12 flex items-center justify-between px-4 sm:px-6 lg:px-12">
                    <div className="flex items-center gap-1.5 text-sm text-[#73726c]">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-2">
                                <Menu className="size-5" />
                            </button>
                        )}
                        <span>{project.repoName.split('/')[0]}</span>
                        <ChevronRight className="size-3.5" />
                        <span className="font-medium text-[#37352f]">{project.repoName.split('/').pop()} docs</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-[#a4a49f] hover:text-[#37352f] transition-colors"><Star className="size-4" /></button>
                        <button className="text-[#a4a49f] hover:text-[#37352f] transition-colors"><MoreHorizontal className="size-4" /></button>
                    </div>
                </header>

                <div className="w-full">
                    {/* Cover Image */}
                    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-[#e3e2dd] via-[#efefed] to-[#e3e2dd] object-cover" />

                    <div className="max-w-[900px] mx-auto px-6 lg:px-24 pb-32">
                        {/* Page Icon */}
                        <div className="text-[78px] leading-[80px] -mt-12 mb-6 block drop-shadow-sm select-none">📄</div>

                        <article className="prose prose-p:text-[#37352f] prose-p:font-sans prose-p:-tracking-[0.01em] prose-headings:font-serif prose-headings:text-[#37352f] prose-h1:text-[40px] prose-h1:font-bold prose-h1:mb-12 prose-h2:text-[28px] prose-h2:font-semibold prose-h2:mt-12 prose-h2:border-b prose-h2:border-[#ececec] prose-h2:pb-2 prose-h3:text-[22px] prose-h3:font-semibold prose-a:text-[#37352f] prose-a:underline prose-a:decoration-[#d3d2ce] hover:prose-a:decoration-[#37352f] prose-a:underline-offset-4 prose-li:text-[#37352f] max-w-none">
                            <h1>{project.repoName.split('/').pop()} Documentation</h1>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {project.generatedDocs || "_(No documentation generated yet.)_"}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>
            </main>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-6 right-8 z-50">
                    <div className="px-3 py-1.5 bg-white border border-[#ececec] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-md text-xs font-semibold text-[#73726c] flex items-center gap-1.5">
                        <span className="text-yellow-500 text-[10px]">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
