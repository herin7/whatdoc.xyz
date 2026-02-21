import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    ExternalLink, ChevronRight, Search, Hash, ArrowUp,
    Clock, Layers, Menu, X,
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
            cur = { id: 'overview', title: 'Overview', content: line + '\n' };
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
            return (
                <div className="relative my-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#f5f5f5] border-b border-gray-200 text-[11px] font-mono text-gray-500">
                        <Layers className="size-3" />
                        {match[1]}
                    </div>
                    <SyntaxHighlighter
                        style={vs}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.84rem', background: '#fff' }}
                        {...props}
                    >
                        {raw}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return (
            <code className={`${className ?? ''} bg-gray-100 text-[#d63384] px-1.5 py-0.5 rounded text-[0.85em] font-mono`} {...props}>
                {children}
            </code>
        );
    },
    table({ children }) {
        return (
            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">{children}</table>
            </div>
        );
    },
    th({ children }) {
        return <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-50">{children}</th>;
    },
    td({ children }) {
        return <td className="px-4 py-2.5 text-sm border-t border-gray-100">{children}</td>;
    },
};

/* ═══════════════════════════════════════════════════════════════════ */
export default function MDNTemplate({ project }) {
    const repoUrl = `https://github.com/${project.repoName}`;
    const sections = parseSections(project.generatedDocs);
    const repoShort = project.repoName.split('/').pop();

    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [tocOpen, setTocOpen] = useState(true);
    const [mobileNav, setMobileNav] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [progress, setProgress] = useState(0);
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

    /* ── Scroll progress + back-to-top ─────────────────────────────── */
    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;
        const handler = () => {
            setShowTop(root.scrollTop > 400);
            const pct = root.scrollHeight - root.clientHeight;
            setProgress(pct > 0 ? (root.scrollTop / pct) * 100 : 0);
        };
        root.addEventListener('scroll', handler, { passive: true });
        return () => root.removeEventListener('scroll', handler);
    }, []);

    const scrollTo = (id) => {
        const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        setMobileNav(false);
    };

    return (
        <div className="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">

            {/* ── Reading progress bar ─────────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gray-100">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* ── Header ───────────────────────────────────────────── */}
            <header className="shrink-0 z-50 border-b-[3px] border-gray-900 bg-white">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 px-5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden text-gray-500 hover:text-gray-900">
                            {mobileNav ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                        <Logo className="text-lg" />
                    </div>

                    <div className="flex items-center gap-4">
                        <a href={repoUrl} target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                            GitHub <ExternalLink className="size-3" />
                        </a>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="border-t border-gray-200 bg-gray-50/80">
                    <div className="max-w-[1200px] mx-auto flex items-center gap-1.5 h-9 px-5 text-xs text-gray-500">
                        <Link to="/" className="hover:text-blue-600 transition-colors">References</Link>
                        <ChevronRight className="size-3 text-gray-400" />
                        <span className="text-gray-500">Web</span>
                        <ChevronRight className="size-3 text-gray-400" />
                        <span className="font-semibold text-gray-800">{repoShort}</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative max-w-[1200px] mx-auto w-full">

                {/* ── Sidebar / On-this-page ───────────────────────── */}
                <aside
                    className={`
                        absolute md:static inset-y-0 left-0 z-40 w-[250px] flex flex-col
                        bg-white border-r border-gray-200 shrink-0
                        transition-transform duration-300 ease-out
                        ${mobileNav ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    <div className="p-4 border-b border-gray-100">
                        <button
                            onClick={() => setTocOpen(!tocOpen)}
                            className="flex items-center justify-between w-full text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            On this page
                            <ChevronRight className={`size-3.5 transition-transform ${tocOpen ? 'rotate-90' : ''}`} />
                        </button>
                    </div>

                    {tocOpen && (
                        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-px">
                            {sections.map((s, i) => {
                                const active = s.id === activeId;
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        className={`
                                            w-full text-left text-[13px] px-3 py-1.5 rounded transition-all duration-200
                                            animate-[fadeLeft_0.3s_ease_both]
                                            flex items-center gap-2
                                            ${active
                                                ? 'text-blue-600 font-semibold bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }
                                        `}
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        <Hash className={`size-3 shrink-0 ${active ? 'text-blue-500' : 'text-gray-400'}`} />
                                        <span className="truncate">{s.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    )}

                    <div className="p-3 border-t border-gray-100 text-center">
                        <span className="text-[10px] text-gray-400">
                            Powered by{' '}
                            <Link to="/" className="text-blue-600 hover:underline font-logo"><span className="font-bold">W</span>HATDOC.XYZ</Link>
                        </span>
                    </div>
                </aside>

                {/* ── Mobile overlay ───────────────────────────────── */}
                {mobileNav && (
                    <div className="fixed inset-0 z-30 bg-black/20 md:hidden" onClick={() => setMobileNav(false)} />
                )}

                {/* ── Main reading area ────────────────────────────── */}
                <main ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">

                        {/* Title block */}
                        <div className="mb-10 animate-[fadeUp_0.5s_ease_both]">
                            <h1 className="text-3xl sm:text-[2.5rem] font-extrabold text-gray-900 tracking-tight leading-tight">
                                {repoShort}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                {project.techstack && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                        <Layers className="size-3" /> {project.techstack}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3" /> Updated {new Date(project.updatedAt).toLocaleDateString()}
                                </span>
                                <span>{sections.length} sections</span>
                            </div>
                            <div className="mt-5 h-[3px] w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        </div>

                        {/* Quick-jump chips */}
                        {sections.length > 3 && (
                            <div className="mb-10 flex flex-wrap gap-2 animate-[fadeUp_0.5s_ease_0.1s_both]">
                                {sections.slice(0, 8).map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => scrollTo(s.id)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        {s.title}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Sections */}
                        {sections.length === 0 ? (
                            <p className="text-gray-400 italic">No documentation generated yet.</p>
                        ) : (
                            sections.map((s, i) => (
                                <section
                                    key={s.id}
                                    id={s.id}
                                    className="mb-14 scroll-mt-28 animate-[fadeUp_0.4s_ease_both]"
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    <h2 className="text-xl font-bold text-gray-900 pb-2.5 mb-5 border-b border-gray-300 flex items-center gap-2 group">
                                        <a
                                            href={`#${s.id}`}
                                            onClick={(e) => { e.preventDefault(); scrollTo(s.id); }}
                                            className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity no-underline"
                                        >
                                            #
                                        </a>
                                        {s.title}
                                    </h2>
                                    <article className="prose max-w-none prose-headings:border-b prose-headings:border-gray-300 prose-headings:pb-2 prose-a:text-blue-600 prose-a:underline prose-a:decoration-blue-300 hover:prose-a:decoration-blue-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-headings:scroll-mt-28 prose-img:rounded-lg prose-img:shadow-sm">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                            {s.content}
                                        </ReactMarkdown>
                                    </article>
                                </section>
                            ))
                        )}

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
                            <span>
                                Documentation for <a href={repoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{project.repoName}</a>
                            </span>
                            <button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gray-800 transition-colors">
                                ↑ Top
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Floating back-to-top ─────────────────────────────── */}
            <button
                onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`
                    fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-900 text-white shadow-lg
                    transition-all duration-300
                    ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                `}
            >
                <ArrowUp className="size-4" />
            </button>

            {/* ── Keyframes ────────────────────────────────────────── */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeLeft {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
