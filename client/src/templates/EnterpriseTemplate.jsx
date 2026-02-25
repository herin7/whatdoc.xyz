import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, ChevronRight, Copy, Check, Menu, X, Info, AlertTriangle, Cloud, Shield } from 'lucide-react';
import Logo from '../components/Logo';

export default function EnterpriseTemplate({ project, isPremium = false }) {
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
                    <div className="my-6 border border-[#e0e0e0] rounded-sm overflow-hidden bg-[#161616]">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#f4f4f4] border-b border-[#e0e0e0]">
                            <span className="text-xs font-semibold text-[#525252] uppercase tracking-wide">{match[1]}</span>
                            <button
                                onClick={() => copyToClipboard(codeString)}
                                className="text-xs font-semibold text-[#0f62fe] hover:text-[#0043ce] transition-colors flex items-center gap-1"
                            >
                                {copiedContent === codeString ? <><Check className="size-3" /> Copied</> : <><Copy className="size-3" /> Copy</>}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '13px' }}
                            {...props}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div>
                );
            }
            return <code className={`${className} bg-[#f4f4f4] text-[#da1e28] px-1 py-0.5 rounded-sm text-[13px] font-mono mx-0.5`} {...props}>{children}</code>;
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#161616] font-sans">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 inset-x-0 z-50 h-[48px] bg-[#161616] text-[#f4f4f4] flex items-center justify-between px-4">
                <div className="flex items-center gap-6 h-full">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-[#f4f4f4]">
                        {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Cloud className="size-5 text-[#0f62fe]" />
                        <span className="font-semibold text-[14px] tracking-tight">Enterprise Cloud</span>
                    </div>

                    <nav className="hidden md:flex h-full">
                        <a href="#" className="h-full flex items-center px-4 text-[14px] border-b-2 border-[#0f62fe] font-semibold bg-[#262626]">Documentation</a>
                        <a href="#" className="h-full flex items-center px-4 text-[14px] hover:bg-[#393939] transition-colors">API Reference</a>
                        <a href="#" className="h-full flex items-center px-4 text-[14px] hover:bg-[#393939] transition-colors">Support</a>
                    </nav>
                </div>

                <div className="flex items-center gap-4 h-full">
                    <div className="relative hidden sm:block">
                        <select className="appearance-none bg-[#393939] border border-[#525252] text-[13px] px-3 py-1 pr-8 rounded-sm hover:bg-[#4d4d4d] focus:outline-none focus:border-[#0f62fe]">
                            <option>Version 1.0 (Latest)</option>
                            <option>Version 0.9 (Legacy)</option>
                        </select>
                        <ChevronRight className="size-3 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[#a8a8a8]" />
                    </div>

                    <div className="hidden sm:flex items-center gap-2 bg-[#e0e0e0] text-[#161616] px-3 py-1 rounded-sm text-[13px]">
                        <Search className="size-3.5" />
                        <input type="text" placeholder="Search..." className="bg-transparent border-none placeholder-[#8d8d8d] focus:outline-none w-48" />
                    </div>
                </div>
            </header>

            {/* Sub-header Breadcrumb */}
            <div className="fixed top-[48px] inset-x-0 z-40 h-[40px] bg-white border-b border-[#e0e0e0] flex items-center px-6">
                <div className="flex items-center gap-2 text-[12px] text-[#525252]">
                    <a href="#" className="hover:text-[#0f62fe] transition-colors">Docs</a>
                    <ChevronRight className="size-3 text-[#c6c6c6]" />
                    <span className="font-semibold text-[#161616]">{project.repoName.split('/').pop()}</span>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto flex pt-[88px]">
                {/* Left Sidebar */}
                <aside className={`fixed inset-y-0 left-0 pt-[88px] z-30 w-[256px] bg-[#f4f4f4] border-r border-[#e0e0e0] transform transition-transform duration-200 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="h-[calc(100vh-88px)] overflow-y-auto w-[256px]">
                        <div className="py-4">
                            <h4 className="px-4 text-[14px] font-semibold mb-2">Getting started</h4>
                            <ul className="text-[14px]">
                                <li>
                                    <a href="#" className="flex items-center px-4 py-2 bg-[#e0e0e0] border-l-4 border-[#0f62fe] font-semibold">
                                        Overview
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-2 hover:bg-[#e8e8e8] border-l-4 border-transparent transition-colors">
                                        Release notes
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="py-2 border-t border-[#e0e0e0]">
                            <h4 className="px-4 text-[14px] font-semibold mb-2 mt-2 flex items-center justify-between">
                                Security <ChevronRight className="size-3 transition-transform" />
                            </h4>
                            <ul className="text-[14px]">
                                <li><a href="#" className="block px-8 py-1.5 hover:text-[#0f62fe] text-[#525252]">IAM Policies</a></li>
                                <li><a href="#" className="block px-8 py-1.5 hover:text-[#0f62fe] text-[#525252]">Compliance</a></li>
                            </ul>
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col xl:flex-row px-4 sm:px-8 py-8 h-[calc(100vh-88px)] overflow-y-auto">
                    <div className="max-w-[800px] w-full mx-auto xl:mx-0 xl:mr-8 pb-32 pt-4">
                        <div className="mb-8">
                            <h1 className="text-[32px] sm:text-[42px] font-light tracking-tight mb-2 leading-tight">
                                {project.repoName.split('/').pop()} Documentation
                            </h1>
                            <p className="text-[16px] text-[#525252]">
                                Comprehensive guide and reference documentation.
                            </p>
                        </div>

                        {/* Callout */}
                        <div className="flex border-l-4 border-[#0f62fe] bg-[#edf5ff] p-4 mb-8 text-[14px]">
                            <Info className="size-5 text-[#0f62fe] shrink-0 mr-3" />
                            <div className="text-[#161616]">
                                <strong>Note:</strong> This documentation is dynamically generated from the repository's source code and configuration.
                            </div>
                        </div>

                        <article className="prose prose-zinc max-w-none prose-headings:font-normal prose-h2:text-[28px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#e0e0e0] prose-h2:pb-2 prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[16px] prose-p:leading-[1.6] prose-p:text-[#161616] prose-a:text-[#0f62fe] prose-a:no-underline hover:prose-a:underline prose-li:text-[16px] prose-li:leading-[1.6]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {project.generatedDocs || "_(No documentation generated yet.)_"}
                            </ReactMarkdown>
                        </article>
                    </div>

                    {/* Right TOC Box */}
                    <div className="hidden xl:block w-[280px] shrink-0">
                        <div className="sticky top-8 border-l border-[#e0e0e0] pl-6 py-2">
                            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#525252] mb-3">Contents</h4>
                            <ul className="space-y-2 text-[13px]">
                                <li><a href="#" className="font-semibold text-[#161616] border-l-2 border-[#0f62fe] -ml-[25px] pl-[23px] py-1 block">Overview</a></li>
                                <li><a href="#" className="hover:text-[#0f62fe] text-[#525252] block transition-colors">Prerequisites</a></li>
                                <li><a href="#" className="hover:text-[#0f62fe] text-[#525252] block transition-colors">Installation</a></li>
                                <li><a href="#" className="hover:text-[#0f62fe] text-[#525252] block transition-colors">Configuration</a></li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>

            {/* Premium Watermark */}
            {!isPremium && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="bg-[#161616] text-[#f4f4f4] px-3 py-2 flex items-center gap-2 text-[12px] shadow-md border border-[#393939]">
                        <span className="text-yellow-400 font-bold">⚡️</span> Generated by WhatDoc
                    </div>
                </div>
            )}
        </div>
    );
}
