import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ExternalLink, FileText, Menu, X, Paintbrush, BookOpen, User, Calendar, Code2, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

// ── Theme definitions ───────────────────────────────────────────────
const THEMES = {
    default: {
        label: 'Default (Dark)',
        page: 'bg-[#0a0a0a] text-zinc-200',
        header: 'border-white/5 bg-[#0a0a0a]/80',
        sidebar: 'border-white/5 bg-[#0a0a0a]',
        sidebarLabel: 'text-zinc-600',
        sidebarActive: 'text-white bg-zinc-800/80 border-blue-500 font-medium',
        sidebarInactive: 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800/40',
        sidebarFooter: 'border-white/5 text-zinc-700',
        contentHeading: 'text-zinc-100 border-zinc-800/60',
        prose: "prose prose-invert prose-zinc max-w-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-headings:scroll-mt-20 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-200 prose-code:text-emerald-400 prose-code:before:content-[''] prose-code:after:content-['']",
        navBorder: 'border-zinc-800/60',
        navText: 'text-zinc-500 hover:text-white',
        emptyText: 'text-zinc-500',
    },
    minimal: {
        label: 'Minimal (Light)',
        page: 'bg-white text-gray-900',
        header: 'border-gray-200 bg-white/80',
        sidebar: 'border-gray-200 bg-gray-50',
        sidebarLabel: 'text-gray-400',
        sidebarActive: 'text-gray-900 bg-white border-blue-500 font-medium shadow-sm',
        sidebarInactive: 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-100',
        sidebarFooter: 'border-gray-200 text-gray-400',
        contentHeading: 'text-gray-900 border-gray-200',
        prose: "prose prose-gray max-w-none prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-headings:scroll-mt-20 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:before:content-[''] prose-code:after:content-['']",
        navBorder: 'border-gray-200',
        navText: 'text-gray-400 hover:text-gray-900',
        emptyText: 'text-gray-400',
    },
    hacker: {
        label: 'Hacker (Terminal)',
        page: 'bg-black text-green-500 font-mono',
        header: 'border-green-900/40 bg-black/90',
        sidebar: 'border-green-900/40 bg-black',
        sidebarLabel: 'text-green-800',
        sidebarActive: 'text-green-400 bg-green-950/60 border-green-500 font-medium',
        sidebarInactive: 'text-green-700 border-transparent hover:text-green-400 hover:bg-green-950/30',
        sidebarFooter: 'border-green-900/40 text-green-800',
        contentHeading: 'text-green-400 border-green-900/40',
        prose: "prose prose-invert max-w-none prose-headings:text-green-400 prose-p:text-green-500 prose-strong:text-green-300 prose-a:text-green-300 prose-a:no-underline hover:prose-a:underline prose-code:text-green-300 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-green-950/30 prose-pre:border prose-pre:border-green-900/40 prose-li:text-green-500 prose-headings:scroll-mt-20",
        navBorder: 'border-green-900/40',
        navText: 'text-green-700 hover:text-green-400',
        emptyText: 'text-green-700',
    },
};

// ── Parse markdown into sections by ## headings ─────────────────────
function parseMarkdownSections(markdown) {
    if (!markdown) return [];

    const lines = markdown.split('\n');
    const sections = [];
    let current = null;

    for (const line of lines) {
        const match = line.match(/^## (.+)/);
        if (match) {
            if (current) sections.push(current);
            const title = match[1].trim();
            const id = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            current = { id, title, content: '' };
        } else if (current) {
            current.content += line + '\n';
        } else {
            if (!sections.length && !current) {
                current = { id: 'overview', title: 'Overview', content: line + '\n' };
            }
        }
    }

    if (current) sections.push(current);
    return sections
        .map((s) => ({ ...s, content: s.content.trimEnd() }))
        .filter((s) => s.content && !s.content.match(/^\s*_?\(?Not enough data/i));
}

// ── Shared ReactMarkdown code component ─────────────────────────────
const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');

        if (!inline && match) {
            return (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                    }}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            );
        }

        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};

export default function ModernTemplate({ project }) {
    const [activeSection, setActiveSection] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState('default');

    const t = THEMES[theme];

    const sections = [
        { id: 'welcome', title: 'Welcome', content: '' },
        ...parseMarkdownSections(project.generatedDocs),
    ];

    useEffect(() => {
        if (sections.length && !activeSection) {
            setActiveSection(sections[0].id);
        }
    }, [sections.length]);

    const currentSection = sections.find((s) => s.id === activeSection);
    const repoUrl = `https://github.com/${project.repoName}`;

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${t.page}`}>
            {/* ── Sticky navbar ─────────────────────────────────────── */}
            <header className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${t.header}`}>
                <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
                        >
                            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>

                        <Logo className="text-lg" />
                        <span className="opacity-30 select-none">/</span>
                        <div className="flex items-center gap-1.5">
                            <FileText className="size-4 opacity-50" />
                            <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-none">
                                {project.repoName}
                            </span>
                        </div>
                        {project.techstack && (
                            <span className="hidden sm:inline-flex items-center rounded-full bg-current/5 border border-current/10 px-2 py-0.5 text-[11px] font-medium opacity-60">
                                {project.techstack}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme switcher */}
                        <div className="hidden sm:flex items-center gap-1.5">
                            <Paintbrush className="size-3.5 opacity-40" />
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="text-xs bg-transparent border border-current/10 rounded-md px-2 py-1 outline-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                            >
                                {Object.entries(THEMES).map(([key, val]) => (
                                    <option key={key} value={key} className="bg-zinc-900 text-zinc-200">
                                        {val.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-current/10 px-3 py-1.5 text-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                            View Source
                            <ExternalLink className="size-3.5" />
                        </a>
                    </div>
                </div>
            </header>

            {/* ── Body: Sidebar + Content ───────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">
                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`
                        fixed top-14 bottom-0 z-40 w-64 border-r
                        overflow-y-auto overscroll-contain
                        transition-all duration-300 ease-in-out
                        lg:sticky lg:top-14 lg:z-0 lg:translate-x-0 lg:block
                        ${t.sidebar}
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <nav className="py-4 px-3 flex flex-col gap-0.5">
                        <p className={`px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest ${t.sidebarLabel}`}>
                            On this page
                        </p>
                        {sections.map((s) => {
                            const isActive = s.id === activeSection;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setActiveSection(s.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150
                                        border-l-2
                                        ${isActive ? t.sidebarActive : t.sidebarInactive}
                                    `}
                                >
                                    {s.title}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Mobile theme switcher */}
                    <div className="sm:hidden px-4 py-3">
                        <div className="flex items-center gap-1.5">
                            <Paintbrush className="size-3.5 opacity-40" />
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="text-xs bg-transparent border border-current/10 rounded-md px-2 py-1 outline-none cursor-pointer opacity-70 w-full"
                            >
                                {Object.entries(THEMES).map(([key, val]) => (
                                    <option key={key} value={key} className="bg-zinc-900 text-zinc-200">
                                        {val.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sidebar footer */}
                    <div className={`mt-auto border-t px-4 py-4 ${t.sidebarFooter}`}>
                        <p className="text-[10px]">
                            Generated by{' '}
                            <Link to="/" className="opacity-70 hover:opacity-100 transition-opacity">
                                whatdoc.xyz
                            </Link>
                        </p>
                        {project.updatedAt && (
                            <p className="text-[10px] mt-1">
                                Updated {new Date(project.updatedAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </aside>

                {/* ── Content area ──────────────────────────────────── */}
                <main className="flex-1 overflow-y-auto min-w-0">
                    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
                        {activeSection === 'welcome' ? (
                            <div className="flex flex-col items-center text-center py-8 sm:py-16">
                                <div className="mb-8">
                                    <BookOpen className="size-12 opacity-20 mx-auto mb-4" />
                                    <h1 className={`text-3xl sm:text-4xl font-bold mb-3 transition-colors duration-300 ${t.contentHeading}`}>
                                        {project.repoName.split('/').pop()}
                                    </h1>
                                    <p className="text-lg opacity-60">
                                        Documentation for{' '}
                                        <a
                                            href={repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline underline-offset-4 decoration-current/30 hover:decoration-current/60 transition-all"
                                        >
                                            {project.repoName}
                                        </a>
                                    </p>
                                </div>

                                {/* Info cards */}
                                <div className="grid gap-4 sm:grid-cols-3 w-full max-w-xl mb-12">
                                    {project.creatorName && (
                                        <div className={`rounded-xl border p-4 transition-colors duration-300 ${t.navBorder}`}>
                                            <User className="size-4 opacity-40 mx-auto mb-2" />
                                            <p className="text-[11px] uppercase tracking-wider opacity-40 mb-1">Created by</p>
                                            <p className="text-sm font-medium">{project.creatorName}</p>
                                        </div>
                                    )}
                                    {project.techstack && (
                                        <div className={`rounded-xl border p-4 transition-colors duration-300 ${t.navBorder}`}>
                                            <Code2 className="size-4 opacity-40 mx-auto mb-2" />
                                            <p className="text-[11px] uppercase tracking-wider opacity-40 mb-1">Tech Stack</p>
                                            <p className="text-sm font-medium">{project.techstack}</p>
                                        </div>
                                    )}
                                    {project.updatedAt && (
                                        <div className={`rounded-xl border p-4 transition-colors duration-300 ${t.navBorder}`}>
                                            <Calendar className="size-4 opacity-40 mx-auto mb-2" />
                                            <p className="text-[11px] uppercase tracking-wider opacity-40 mb-1">Last Updated</p>
                                            <p className="text-sm font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Sections quick-jump */}
                                {sections.length > 1 && (
                                    <div className="w-full max-w-xl text-left">
                                        <p className="text-[11px] uppercase tracking-wider opacity-40 mb-3">In this documentation</p>
                                        <div className="grid gap-2">
                                            {sections.filter(s => s.id !== 'welcome').map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setActiveSection(s.id)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm flex items-center justify-between group transition-all duration-150 ${t.navBorder} hover:opacity-80`}
                                                >
                                                    <span>{s.title}</span>
                                                    <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-16 pt-8">
                                    <p className="text-xs opacity-30">
                                        This documentation was auto-generated with{' '}
                                        <Link to="/" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                                            whatdoc.xyz
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        ) : currentSection ? (
                            <>
                                <h1 className={`text-2xl font-bold mb-8 pb-4 border-b transition-colors duration-300 ${t.contentHeading}`}>
                                    {currentSection.title}
                                </h1>
                                <div className={`transition-colors duration-300 ${t.prose}`}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {currentSection.content}
                                    </ReactMarkdown>
                                </div>
                            </>
                        ) : (
                            <p className={`italic ${t.emptyText}`}>No documentation generated yet.</p>
                        )}

                        {/* Prev / Next navigation */}
                        {sections.length > 1 && currentSection && (
                            <div className={`flex items-center justify-between mt-16 pt-6 border-t transition-colors duration-300 ${t.navBorder}`}>
                                {(() => {
                                    const idx = sections.findIndex((s) => s.id === activeSection);
                                    const prev = idx > 0 ? sections[idx - 1] : null;
                                    const next = idx < sections.length - 1 ? sections[idx + 1] : null;

                                    return (
                                        <>
                                            {prev ? (
                                                <button
                                                    onClick={() => setActiveSection(prev.id)}
                                                    className={`text-sm transition-colors ${t.navText}`}
                                                >
                                                    ← {prev.title}
                                                </button>
                                            ) : <span />}
                                            {next ? (
                                                <button
                                                    onClick={() => setActiveSection(next.id)}
                                                    className={`text-sm transition-colors ml-auto ${t.navText}`}
                                                >
                                                    {next.title} →
                                                </button>
                                            ) : <span />}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
