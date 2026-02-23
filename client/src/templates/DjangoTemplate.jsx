import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiPlayground from '../components/ApiPlayground';
import { makeBlockquote, makeOl } from '../components/MarkdownExtras';
import {
    ExternalLink, BookOpen, Menu, X, ChevronDown, ChevronRight,
    Search, ArrowUp, FileText,
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

/* ── Markdown component overrides ──────────────────────────────────── */
const mdComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const raw = String(children).replace(/\n$/, '');
        if (!inline && match) {
            if (match[1] === 'json-api-playground') {
                try { return <ApiPlayground config={JSON.parse(raw)} />; }
                catch { return null; }
            }
            return (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 my-4">
                    <div className="flex items-center justify-between px-4 py-1.5 bg-gray-100 border-b border-gray-200">
                        <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wide">{match[1]}</span>
                    </div>
                    <SyntaxHighlighter
                        style={oneLight}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.84rem', background: '#fdfdfd' }}
                        {...props}
                    >
                        {raw}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return <code className={`${className ?? ''} bg-emerald-50 text-[#0c4b33] px-1.5 py-0.5 rounded text-[0.85em] font-semibold`} {...props}>{children}</code>;
    },
    blockquote: makeBlockquote('light', 'border-l-[3px] border-emerald-300 pl-5 my-6 italic text-gray-500'),
    ol: makeOl('light'),
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function DjangoTemplate({ project }) {
    const repoUrl = `https://github.com/${project.repoName}`;
    const sections = parseSections(project.generatedDocs);
    const repoShort = project.repoName.split('/').pop();

    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showTop, setShowTop] = useState(false);
    const contentRef = useRef(null);

    /* ── Scroll-spy ────────────────────────────────────────────────── */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const ob = new IntersectionObserver(
            (entries) => { for (const e of entries) if (e.isIntersecting) { setActiveId(e.target.id); break; } },
            { root, rootMargin: '-5% 0px -80% 0px', threshold: 0 },
        );
        sections.forEach((s) => { const el = root.querySelector(`#${CSS.escape(s.id)}`); if (el) ob.observe(el); });
        return () => ob.disconnect();
    }, [sections]);

    /* ── Back-to-top visibility ────────────────────────────────────── */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const handler = () => setShowTop(root.scrollTop > 500);
        root.addEventListener('scroll', handler, { passive: true });
        return () => root.removeEventListener('scroll', handler);
    }, []);

    const filtered = searchTerm
        ? sections.filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
        : sections;

    const scrollTo = (id) => {
        const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        setMobileOpen(false);
    };

    const toggleGroup = (id) => setExpandedGroups((p) => ({ ...p, [id]: !p[id] }));

    return (
        <div className="h-screen flex flex-col bg-[#f8f8f8] text-[#333] overflow-hidden">

            {/* ── Header band ──────────────────────────────────────── */}
            <header className="shrink-0 bg-[#0c4b33] text-white z-50">
                {/* Top row */}
                <div className="flex items-center justify-between h-14 px-5 max-w-[1440px] mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-green-200 hover:text-white">
                            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                        <Logo className="text-lg" />
                        <span className="text-green-600 select-none">/</span>
                        <span className="text-sm font-medium text-green-100/80 truncate max-w-[200px] sm:max-w-none">
                            {project.repoName}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={repoUrl} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1 text-xs text-green-200/70 hover:text-white transition-colors">
                            Source <ExternalLink className="size-3" />
                        </a>
                    </div>
                </div>

                {/* Sub-bar — breadcrumbs + version pill */}
                <div className="border-t border-green-700/40 bg-[#0a3f2b]">
                    <div className="flex items-center gap-2 h-9 px-5 max-w-[1440px] mx-auto text-xs text-green-300/70">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="size-3" />
                        <span className="text-green-200/90 font-medium">{repoShort} Documentation</span>
                        {project.techstack && (
                            <span className="ml-auto px-2 py-0.5 rounded-full bg-green-800/40 text-green-300/80 border border-green-700/30 text-[10px] font-semibold uppercase tracking-wider">
                                {project.techstack}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">

                {/* ── Sidebar ──────────────────────────────────────── */}
                <aside
                    className={`
                            absolute md:static inset-y-0 left-0 z-40 w-[260px] flex flex-col
                            bg-white border-r border-gray-200 shadow-sm
                            transition-transform duration-300 ease-out
                            ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        `}
                >
                    {/* Search */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 focus-within:border-[#44b78b] focus-within:ring-1 focus-within:ring-[#44b78b]/30 transition-all">
                            <Search className="size-3.5 text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search sections…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                            />
                        </div>
                    </div>
                    {/* Links */}
                    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                        <p className="px-3 mb-2 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                            Table of Contents
                        </p>
                        {filtered.map((s, i) => {
                            const active = s.id === activeId;
                            return (
                                <button
                                    key={`${s.id}-${i}`}
                                    onClick={() => scrollTo(s.id)}
                                    className={`
                                        w-full text-left text-sm px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                                        ${active
                                            ? 'bg-[#0c4b33]/[0.07] text-[#0c4b33] font-semibold border-l-[3px] border-[#44b78b] pl-[9px]'
                                            : 'text-gray-600 hover:text-[#0c4b33] hover:bg-gray-100 border-l-[3px] border-transparent pl-[9px]'}
                                    `}
                                >
                                    <FileText className="size-3.5 shrink-0 opacity-60" />
                                    <span className="truncate">{s.title}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400">
                            Generated with{' '}
                            <Link to="/" className="text-[#44b78b] hover:underline font-logo"><span className="font-bold">W</span>HATDOC.XYZ</Link>
                        </span>
                    </div>
                </aside>

                {/* ── Mobile overlay ───────────────────────────────── */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
                )}

                {/* ── Main reading area ────────────────────────────── */}
                <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth bg-[#f8f8f8]">
                    <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">

                        {/* Title block */}
                        <div className="mb-10 animate-[fadeDown_0.5s_ease_both]">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="size-5 text-[#0c4b33]" />
                                <span className="text-xs font-bold tracking-widest uppercase text-[#0c4b33]/60">Documentation</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0c4b33] tracking-tight leading-tight">
                                {repoShort}
                            </h1>
                            <p className="mt-2 text-gray-500 text-sm leading-relaxed max-w-xl">
                                Complete reference for <span className="font-medium text-gray-700">{project.repoName}</span>.
                                Navigate the table of contents or scroll through each topic.
                            </p>
                            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#0c4b33] via-[#44b78b] to-transparent" />
                        </div>

                        {/* Sections */}
                        {sections.length === 0 ? (
                            <p className="text-gray-400 italic">No documentation generated yet.</p>
                        ) : (
                            sections.map((s, i) => (
                                <section
                                    key={`${s.id}-${i}`}
                                    id={s.id}
                                    className="mb-14 scroll-mt-28 animate-[fadeDown_0.4s_ease_both]"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <h2 className="text-xl font-serif font-bold text-[#0c4b33] mb-4 pb-2 border-b-2 border-[#44b78b]/30 flex items-center gap-2 group">
                                        <span className="text-[#44b78b] opacity-0 group-hover:opacity-100 transition-opacity select-none">§</span>
                                        {s.title}
                                    </h2>
                                    <article className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-[#0c4b33] prose-a:text-[#44b78b] prose-a:decoration-[#44b78b]/30 hover:prose-a:decoration-[#44b78b] prose-headings:scroll-mt-28 prose-pre:bg-white prose-pre:border prose-pre:border-gray-200 prose-img:rounded-xl prose-code:before:content-[''] prose-code:after:content-['']">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                            {s.content}
                                        </ReactMarkdown>
                                    </article>
                                </section>
                            ))
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                            <span>Last updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                            <button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#0c4b33] transition-colors">
                                ↑ Back to top
                            </button>
                        </div>
                    </div>

                    {/* Floating back-to-top */}
                    <button
                        onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={`
                                fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#0c4b33] text-white shadow-lg
                                transition-all duration-300
                                ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                            `}
                    >
                        <ArrowUp className="size-4" />
                    </button>
                </main>
            </div >

            {/* ── Keyframes ────────────────────────────────────────── */}
            < style > {`
                    @keyframes fadeDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style >
        </div >
    );
}
