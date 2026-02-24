import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiPlayground from '../components/ApiPlayground';
import { makeBlockquote, makeOl } from '../components/MarkdownExtras';
import {
    ExternalLink, Menu, X, ArrowUp, BookOpen, Clock, Copy, Check,
} from 'lucide-react';
import Logo from '../components/Logo';

/* ═══════════════════════════════════════════════════════════════════
   § Heading parser — splits generatedDocs on ## boundaries
   ═══════════════════════════════════════════════════════════════════ */
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
            cur = { id: 'preface', title: 'Preface', content: line + '\n' };
        }
    }
    if (cur) sections.push(cur);
    return sections
        .map((s) => ({ ...s, content: s.content.trimEnd() }))
        .filter((s) => s.content && !s.content.match(/^\s*_?\(?Not enough data/i));
}

/* ═══════════════════════════════════════════════════════════════════
   § CopyButton — appears on code blocks
   ═══════════════════════════════════════════════════════════════════ */
function CopyBtn({ text }) {
    const [ok, setOk] = useState(false);
    const copy = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1600); };
    return (
        <button
            onClick={copy}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-200/70 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-300 backdrop-blur transition-all opacity-0 group-hover:opacity-100"
            title="Copy"
        >
            {ok ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   § ReactMarkdown component overrides
   ═══════════════════════════════════════════════════════════════════ */
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
                <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-200 bg-[#F8F9FA] shadow-sm">
                    {/* Language tag header */}
                    <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-100 border-b border-zinc-200">
                        <span className="text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-widest">{match[1]}</span>
                    </div>
                    <CopyBtn text={raw} />
                    <SyntaxHighlighter
                        style={prism}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            padding: '1.25rem 1.5rem',
                            background: 'transparent',
                            fontSize: '0.85rem',
                            lineHeight: 1.6,
                        }}
                        className="not-prose text-sm"
                        {...props}
                    >
                        {raw}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return (
            <code
                className={`${className ?? ''} font-mono text-[0.85em] bg-zinc-100 text-pink-600 px-1.5 py-0.5 rounded-md border border-zinc-200`}
                {...props}
            >
                {children}
            </code>
        );
    },
    blockquote: makeBlockquote('light', 'border-l-[3px] border-zinc-300 pl-5 my-6 italic text-zinc-500'),
    ol: makeOl('light'),
    hr() {
        return <div className="my-12 mx-auto w-16 h-px bg-zinc-300" />;
    },
    table({ children }) {
        return (
            <div className="overflow-x-auto my-6 rounded-lg border border-zinc-200 shadow-sm">
                <table className="min-w-full divide-y divide-zinc-200">{children}</table>
            </div>
        );
    },
    th({ children }) {
        return <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-50">{children}</th>;
    },
    td({ children }) {
        return <td className="px-4 py-2.5 text-sm border-t border-zinc-100 text-zinc-600">{children}</td>;
    },
};

/* ═══════════════════════════════════════════════════════════════════
   § AeroLatexTemplate — main export
   ═══════════════════════════════════════════════════════════════════ */
export default function AeroLatexTemplate({ project }) {
    const repoUrl = `https://github.com/${project.repoName}`;
    const repoShort = project.repoName.split('/').pop();
    const sections = useMemo(() => parseSections(project.generatedDocs), [project.generatedDocs]);

    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [readPct, setReadPct] = useState(0);
    const [headerSolid, setHeaderSolid] = useState(false);
    const contentRef = useRef(null);

    /* ── Intersection-based scroll spy ──── */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const obs = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) { setActiveId(e.target.id); break; }
                }
            },
            { root, rootMargin: '-10% 0px -75% 0px', threshold: 0 },
        );
        sections.forEach((s) => {
            const el = root.querySelector(`#${CSS.escape(s.id)}`);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [sections]);

    /* ── Scroll metrics (progress bar + back-to-top + header solidify) */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const handler = () => {
            setShowTop(root.scrollTop > 500);
            setHeaderSolid(root.scrollTop > 20);
            const total = root.scrollHeight - root.clientHeight;
            setReadPct(total > 0 ? (root.scrollTop / total) * 100 : 0);
        };
        root.addEventListener('scroll', handler, { passive: true });
        return () => root.removeEventListener('scroll', handler);
    }, []);

    const scrollTo = (id) => {
        const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        setMobileOpen(false);
    };

    /* ── Section index for numbering ─ */
    const sectionIdx = (id) => {
        const i = sections.findIndex((s) => s.id === id);
        return i >= 0 ? i + 1 : '';
    };

    return (
        <div className="h-screen flex flex-col bg-[#FAFAFA] text-zinc-800 font-sans relative overflow-hidden">

            {/* ── Very faint background texture ─── */}
            <div className="pointer-events-none absolute inset-0 z-0">
                {/* Radial wash — warm center */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,0,0,0.02),transparent)]" />
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #999 0.5px, transparent 0.5px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            {/* ── Reading progress bar ──── */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
                <div
                    className="h-full bg-zinc-400/60 transition-[width] duration-200 ease-out"
                    style={{ width: `${readPct}%` }}
                />
            </div>

            {/* ── Floating glassmorphic header (pill)  */}
            <header
                className={`
                    fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50
                    flex items-center justify-between
                    rounded-full px-8 py-3
                    border border-zinc-200/50
                    backdrop-blur-2xl transition-all duration-500
                    ${headerSolid
                        ? 'bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
                        : 'bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
                    }
                `}
            >
                <div className="flex items-center gap-4">
                    {/* Mobile toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-zinc-400 hover:text-zinc-800 transition-colors">
                        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                    <Logo className="text-lg" />
                    <span className="hidden sm:inline text-zinc-300 select-none">/</span>
                    <span className="hidden sm:inline font-serif font-medium tracking-tight text-lg text-zinc-700 truncate max-w-[200px]">
                        {repoShort}
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    {/* Active section pill — contextual breadcrumb */}
                    {activeId && (
                        <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-100/70 rounded-full px-3 py-1 font-mono tracking-wide">
                            § {sectionIdx(activeId)}
                        </span>
                    )}
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-800 transition-colors"
                    >
                        Source <ExternalLink className="size-3" />
                    </a>
                    <Link to="/" className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors font-logo">
                        <span className="font-bold">W</span>HATDOC.XYZ
                    </Link>
                </div>
            </header>

            {/* ── Body (sidebar + content)  */}
            <div className="flex flex-1 overflow-hidden relative z-10 pt-28">

                {/* ── Sidebar — borderless, floating text links ─ */}
                <aside
                    className={`
                        absolute md:static inset-y-0 left-0 z-40 w-[250px] flex flex-col shrink-0
                        bg-[#FAFAFA]/90 backdrop-blur-md md:bg-transparent md:backdrop-blur-none
                        transition-transform duration-300 ease-out
                        ${mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    {/* Scrollable nav */}
                    <nav className="flex-1 overflow-y-auto py-6 pl-8 pr-4 space-y-1">
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-4 select-none">
                            Contents
                        </p>
                        {sections.map((s, i) => {
                            const active = s.id === activeId;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className={`
                                        w-full text-left text-sm py-1.5 transition-all duration-200 flex items-baseline gap-2
                                        animate-[fadeIn_0.35s_ease_both]
                                        ${active
                                            ? 'text-zinc-900 font-medium'
                                            : 'text-zinc-400 hover:text-zinc-800'
                                        }
                                    `}
                                    style={{ animationDelay: `${i * 35}ms` }}
                                >
                                    <span className={`font-mono text-[11px] tabular-nums ${active ? 'text-zinc-500' : 'text-zinc-300'}`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="truncate">{s.title}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="px-8 py-4">
                        <span className="text-[10px] text-zinc-300 select-none">
                            Generated with{' '}
                            <Link to="/" className="text-zinc-400 hover:text-zinc-700 transition-colors underline decoration-zinc-300 underline-offset-2 font-logo">
                                <span className="font-bold">W</span>HATDOC.XYZ
                            </Link>
                        </span>
                    </div>
                </aside>

                {/* ── Mobile overlay ─ */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-30 bg-black/10 md:hidden" onClick={() => setMobileOpen(false)} />
                )}

                {/* ── Main scrollable content  */}
                <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-3xl px-8 md:px-12 pb-24">

                        {/* ── Title block — academic cover ─── */}
                        <div className="mb-16 animate-[riseIn_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="size-4 text-zinc-400" />
                                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400">
                                    Documentation
                                </span>
                            </div>
                            <h1 className="font-serif font-normal tracking-tight text-4xl sm:text-5xl text-zinc-900 leading-[1.1] mb-4">
                                {repoShort}
                            </h1>
                            <p className="text-zinc-500 text-[1.05rem] leading-relaxed max-w-xl">
                                A complete reference for{' '}
                                <a href={repoUrl} target="_blank" rel="noreferrer" className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-700 transition-colors">
                                    {project.repoName}
                                </a>
                                .
                            </p>

                            {/* Meta line */}
                            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-zinc-400">
                                {project.techstack && (
                                    <span className="inline-flex items-center gap-1 font-mono bg-zinc-100/80 px-2.5 py-1 rounded-md">
                                        {project.techstack}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="font-mono">{sections.length} §</span>
                            </div>

                            {/* Elegant rule */}
                            <div className="mt-8 h-px w-full bg-gradient-to-r from-zinc-300 via-zinc-200 to-transparent" />
                        </div>

                        {/* ── Rendered sections ─── */}
                        {sections.length === 0 ? (
                            <p className="text-zinc-400 italic font-serif">No documentation has been generated yet.</p>
                        ) : (
                            sections.map((s, i) => (
                                <section
                                    key={s.id}
                                    id={s.id}
                                    className="mb-20 scroll-mt-36 animate-[riseIn_0.6s_cubic-bezier(0.22,1,0.36,1)_both]"
                                    style={{ animationDelay: `${80 + i * 60}ms` }}
                                >
                                    {/* Section heading — academic style with numbering */}
                                    <div className="flex items-baseline gap-3 mb-1 group">
                                        <span className="font-mono text-sm text-zinc-300 select-none tabular-nums">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <h2 className="font-serif font-normal tracking-tight text-2xl text-zinc-900 group-hover:text-black transition-colors">
                                            {s.title}
                                        </h2>
                                    </div>
                                    <div className="h-px bg-zinc-200/80 mb-8" />

                                    {/* Prose body */}
                                    <article
                                        className={[
                                            'prose prose-zinc max-w-none',
                                            // Headings
                                            'prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight',
                                            'prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-zinc-100 prose-h2:pb-4',
                                            'prose-h3:text-lg prose-h3:text-zinc-700',
                                            // Body text
                                            'prose-p:text-[1.05rem] prose-p:leading-relaxed prose-p:text-zinc-600',
                                            // Links
                                            'prose-a:underline prose-a:decoration-zinc-300 prose-a:underline-offset-4 hover:prose-a:decoration-zinc-900 prose-a:transition-colors',
                                            // Code
                                            "prose-code:font-mono prose-code:text-[0.85em] prose-code:bg-zinc-100/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']",
                                            // Pre blocks
                                            'prose-pre:bg-[#111] prose-pre:shadow-xl prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl',
                                            // Lists
                                            'prose-li:text-zinc-600 prose-li:marker:text-zinc-400',
                                            // Strong
                                            'prose-strong:text-zinc-800 prose-strong:font-semibold',
                                            // Scroll
                                            'prose-headings:scroll-mt-36',
                                            // Images
                                            'prose-img:rounded-xl prose-img:shadow-md',
                                        ].join(' ')}
                                    >
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                            {s.content}
                                        </ReactMarkdown>
                                    </article>
                                </section>
                            ))
                        )}

                        {/* ── Colophon ──── */}
                        <footer className="mt-12 pt-8 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-400">
                            <span>
                                Typeset by{' '}
                                <Link to="/" className="underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600 transition-colors font-logo">
                                    <span className="font-bold">W</span>HATDOC.XYZ
                                </Link>
                            </span>
                            <button
                                onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="hover:text-zinc-700 transition-colors"
                            >
                                ↑ Back to top
                            </button>
                        </footer>
                    </div>
                </main>
            </div>

            {/* ── Floating back-to-top ──── */}
            <button
                onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`
                    fixed bottom-8 right-8 z-50 p-3 rounded-full
                    bg-zinc-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]
                    transition-all duration-400
                    ${showTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}
                `}
            >
                <ArrowUp className="size-4" />
            </button>

            {/* ── Keyframes ──── */}
            <style>{`
                @keyframes riseIn {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
