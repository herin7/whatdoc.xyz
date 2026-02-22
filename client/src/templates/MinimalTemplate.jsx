import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiPlayground from '../components/ApiPlayground';
import { makeBlockquote, makeOl } from '../components/MarkdownExtras';
import { ExternalLink, FileText, BookOpen, User, Calendar, Code2 } from 'lucide-react';
import Logo from '../components/Logo';

// ── Shared ReactMarkdown code component ─────────────────────────────
const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');

        if (!inline && match) {
            if (match[1] === 'json-api-playground') {
                try { return <ApiPlayground config={JSON.parse(String(children).replace(/\n$/, ''))} />; }
                catch { return null; }
            }
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
    blockquote: makeBlockquote('dark'),
    ol: makeOl('dark'),
};

export default function MinimalTemplate({ project }) {
    const repoUrl = `https://github.com/${project.repoName}`;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex flex-col">
            {/* ── Slim top bar ──────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <Logo className="text-lg" />
                        <span className="text-zinc-700 select-none">/</span>
                        <div className="flex items-center gap-1.5">
                            <FileText className="size-4 text-zinc-600" />
                            <span className="text-sm font-medium text-zinc-400 truncate max-w-[200px] sm:max-w-none">
                                {project.repoName}
                            </span>
                        </div>
                    </div>

                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        Source
                        <ExternalLink className="size-3.5" />
                    </a>
                </div>
            </header>

            {/* ── Hero / Welcome ────────────────────────────────────── */}
            <div className="mx-auto max-w-3xl w-full px-6 pt-16 pb-12 text-center border-b border-zinc-800/40">
                <BookOpen className="size-10 text-zinc-700 mx-auto mb-4" />
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-3">
                    {project.repoName.split('/').pop()}
                </h1>
                <p className="text-base text-zinc-500 mb-8">
                    Documentation for{' '}
                    <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-500 transition-colors"
                    >
                        {project.repoName}
                    </a>
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500">
                    {project.creatorName && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
                            <User className="size-3" />
                            {project.creatorName}
                        </span>
                    )}
                    {project.techstack && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
                            <Code2 className="size-3" />
                            {project.techstack}
                        </span>
                    )}
                    {project.updatedAt && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1">
                            <Calendar className="size-3" />
                            {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Article body ──────────────────────────────────────── */}
            <main className="flex-1 px-6">
                <article className="prose prose-invert prose-zinc max-w-3xl mx-auto py-16 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-headings:scroll-mt-20 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-200 prose-code:text-emerald-400 prose-code:before:content-[''] prose-code:after:content-[''] prose-h2:mt-16 prose-h2:pt-8 prose-h2:border-t prose-h2:border-zinc-800/60">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {(project.generatedDocs || '').replace(/^##\s+.*\n+\s*_?\(?Not enough data[^\n]*/gim, '') || '_(No documentation generated yet.)_'}
                    </ReactMarkdown>
                </article>
            </main>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-600">
                Generated by{' '}
                <Link to="/" className="text-zinc-500 hover:text-white transition-colors font-logo">
                    <span className="font-bold">W</span>HATDOC.XYZ
                </Link>
                {project.updatedAt && (
                    <> &middot; Last updated {new Date(project.updatedAt).toLocaleDateString()}</>
                )}
            </footer>
        </div>
    );
}
