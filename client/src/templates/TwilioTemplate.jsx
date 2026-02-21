import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    ExternalLink, FileText, Menu, X, ChevronRight, Search,
    Terminal, Zap, BookOpen, Copy, Check,
} from 'lucide-react';
import Logo from '../components/Logo';

/* ── Parse markdown into sections by ## headings ───────────────────── */
function parseSections(markdown) {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    const sections = [];
    let cur = null;

    for (const line of lines) {
        const m = line.match(/^## (.+)/);
        if (m) {
            if (cur) sections.push(cur);
            const title = m[1].trim();
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            cur = { id, title, content: '' };
        } else if (cur) {
            cur.content += line + '\n';
        } else if (!sections.length && !cur) {
            cur = { id: 'introduction', title: 'Introduction', content: line + '\n' };
        }
    }
    if (cur) sections.push(cur);
    return sections
        .map((s) => ({ ...s, content: s.content.trimEnd() }))
        .filter((s) => s.content && !s.content.match(/^\s*_?\(?Not enough data/i));
}

/* ── Copy button for code blocks ───────────────────────────────────── */
function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    return (
        <button
            onClick={copy}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-600 backdrop-blur transition-all"
            title="Copy code"
        >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
    );
}

/* ── Markdown component overrides ──────────────────────────────────── */
const mdComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const raw = String(children).replace(/\n$/, '');
        if (!inline && match) {
            return (
                <div className="relative group">
                    <CopyBtn text={raw} />
                    <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            borderRadius: '0.75rem',
                            fontSize: '0.84rem',
                            border: '1px solid rgba(100,116,139,0.2)',
                        }}
                        {...props}
                    >
                        {raw}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return <code className={`${className ?? ''} bg-slate-800/80 px-1.5 py-0.5 rounded text-blue-300 text-[0.85em]`} {...props}>{children}</code>;
    },
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function TwilioTemplate({ project }) {
    const repoUrl = `https://github.com/${project.repoName}`;
    const sections = parseSections(project.generatedDocs);

    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef(null);

    /* ── Intersection observer for scroll-spy ──────────────────────── */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) { setActiveId(e.target.id); break; }
                }
            },
            { root, rootMargin: '-10% 0px -75% 0px', threshold: 0 },
        );
        sections.forEach((s) => {
            const el = root.querySelector(`#${CSS.escape(s.id)}`);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [sections]);

    /* ── Sidebar search filter ─────────────────────────────────────── */
    const filtered = searchTerm
        ? sections.filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : sections;

    const scrollTo = (id) => {
        const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        setMobileOpen(false);
    };

    /* ── Stagger animation helper ──────────────────────────────────── */
    const fadeClass = (i) =>
        `animate-[fadeSlideUp_0.45s_ease_both] [animation-delay:${i * 60}ms]`;

    return (
        <div className="h-screen flex flex-col bg-[#0d122b] text-slate-300 overflow-hidden">

            {/* ── Top bar ──────────────────────────────────────────── */}
            <header className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-slate-700/40 bg-[#0d122b]/90 backdrop-blur-lg z-50">
                <div className="flex items-center gap-3">
                    {/* mobile hamburger */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400 hover:text-white">
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                    <Logo className="text-lg" />
                    <span className="text-slate-700 select-none">/</span>
                    <div className="flex items-center gap-1.5">
                        <Terminal className="size-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-400 truncate max-w-[190px] sm:max-w-none">
                            {project.repoName}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
                    >
                        View on GitHub <ExternalLink className="size-3" />
                    </a>
                    <div className="h-5 w-px bg-slate-700/50 hidden sm:block" />
                    <Link to="/" className="text-xs text-slate-500 hover:text-white transition-colors">
                        whatdoc.xyz
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">

                {/* ── Sidebar ──────────────────────────────────────── */}
                <aside
                    className={`
                        absolute md:static inset-y-0 left-0 z-40 w-[260px] flex flex-col
                        bg-[#1a2249] border-r border-slate-700/30
                        transition-transform duration-300 ease-out
                        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    {/* Search */}
                    <div className="p-3 border-b border-slate-700/30">
                        <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-800/60 border border-slate-700/40 focus-within:border-blue-500/50 transition-colors">
                            <Search className="size-3.5 text-slate-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Filter sections…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none"
                            />
                        </div>
                    </div>

                    {/* Nav links */}
                    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <p className="px-3 mb-2 text-[10px] font-bold tracking-widest uppercase text-slate-600">
                            Sections
                        </p>
                        {filtered.map((s, i) => {
                            const active = s.id === activeId;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className={`
                                        w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg transition-all duration-200
                                        ${fadeClass(i)}
                                        ${active
                                            ? 'bg-blue-500/10 text-blue-300 border-l-2 border-blue-400 pl-[10px] font-medium shadow-[inset_0_0_12px_rgba(96,165,250,0.06)]'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30 border-l-2 border-transparent pl-[10px]'
                                        }
                                    `}
                                >
                                    <ChevronRight className={`size-3 shrink-0 transition-transform ${active ? 'rotate-90 text-blue-400' : ''}`} />
                                    <span className="truncate">{s.title}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-3 border-t border-slate-700/30 text-center">
                        <span className="text-[10px] text-slate-600">
                            Built with{' '}
                            <Link to="/" className="text-blue-400/70 hover:text-blue-400">whatdoc.xyz</Link>
                        </span>
                    </div>
                </aside>

                {/* ── Mobile overlay ───────────────────────────────── */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
                )}

                {/* ── Main content ─────────────────────────────────── */}
                <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">

                        {/* Hero banner with shimmer */}
                        <div className="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent border border-slate-700/30 p-8">
                            {/* animated shimmer line */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] animate-[spin_8s_linear_infinite] opacity-[0.04]"
                                     style={{ background: 'conic-gradient(from 0deg, transparent, rgba(96,165,250,0.8), transparent 30%)' }} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Zap className="size-5 text-blue-400 animate-pulse" />
                                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-400/80">API Documentation</span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                                    {project.repoName.split('/').pop()}
                                </h1>
                                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                                    Auto-generated reference for <span className="text-slate-300 font-medium">{project.repoName}</span>.
                                    Browse sections in the sidebar or scroll through everything below.
                                </p>
                                {/* Quick pills */}
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {project.techstack && (
                                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                            <BookOpen className="size-3" /> {project.techstack}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-700/40 text-slate-400 border border-slate-700/30">
                                        {sections.length} sections
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        {sections.length === 0 ? (
                            <p className="text-slate-500 italic">No documentation generated yet.</p>
                        ) : (
                            sections.map((s, i) => (
                                <section
                                    key={s.id}
                                    id={s.id}
                                    className={`mb-16 scroll-mt-24 ${fadeClass(i)}`}
                                >
                                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2 group">
                                        <span className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity select-none">#</span>
                                        {s.title}
                                    </h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-blue-500 to-transparent mb-6 rounded-full" />
                                    <article className="prose prose-invert prose-blue max-w-none prose-headings:font-semibold prose-a:text-blue-400 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-headings:scroll-mt-24 prose-code:before:content-[''] prose-code:after:content-['']">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                            {s.content}
                                        </ReactMarkdown>
                                    </article>
                                </section>
                            ))
                        )}

                        {/* Back to top */}
                        <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
                            <button
                                onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-xs text-slate-600 hover:text-blue-400 transition-colors"
                            >
                                ↑ Back to top
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Keyframe injection ───────────────────────────────── */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
