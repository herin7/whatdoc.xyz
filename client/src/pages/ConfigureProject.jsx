import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';
import { project } from '../lib/api';

export default function ConfigureProject() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const repoName = searchParams.get('repo') || '';

    // Default slug = last segment of repoName, lowercased, sanitised
    const defaultSlug = repoName
        .split('/')
        .pop()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const [slug, setSlug] = useState(defaultSlug);
    const [techstack, setTechstack] = useState('MERN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSlugChange = (e) => {
        // Only allow lowercase alphanumeric + hyphens
        const value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-');
        setSlug(value);
    };

    const handleDeploy = async (e) => {
        e.preventDefault();
        setError('');

        if (!slug.trim()) {
            setError('Slug cannot be empty.');
            return;
        }

        setLoading(true);
        try {
            await project.create({ repoName, slug: slug.trim(), techstack });
            navigate('/dashboard?project=created');
        } catch (err) {
            setError(err.error || err.message || 'Failed to create project.');
        } finally {
            setLoading(false);
        }
    };

    // No repo selected — redirect back
    if (!repoName) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
                <p className="text-zinc-400 mb-4">No repository selected.</p>
                <Link to="/import" className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
                    <ArrowLeft className="size-4" /> Back to import
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Top bar */}
            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <Logo className="text-lg" />
                    <Link
                        to="/import"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </div>
            </header>

            {/* Centered card */}
            <main className="flex-1 flex items-center justify-center px-4 pt-14">
                <div className="w-full max-w-lg">
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                            <Rocket className="size-5 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Configure project</h1>
                        <p className="text-sm text-zinc-500">Set up your documentation before deploying.</p>
                    </div>

                    {/* Card */}
                    <form
                        onSubmit={handleDeploy}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-6"
                    >
                        {/* Repo name — read only */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Repository
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={repoName}
                                className="w-full h-11 px-4 rounded-lg bg-zinc-900/60 border border-zinc-700/40 text-zinc-400 text-sm cursor-default focus:outline-none select-all"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                URL slug
                            </label>
                            <div className="flex items-center h-11 rounded-lg bg-zinc-900/60 border border-zinc-700/40 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400/50 focus-within:border-transparent transition-all">
                                <span className="shrink-0 pl-4 text-sm text-zinc-500 select-none">
                                    whatdoc.xyz/p/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={handleSlugChange}
                                    placeholder="my-project"
                                    className="flex-1 h-full bg-transparent text-white text-sm px-1 focus:outline-none placeholder-zinc-600"
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-zinc-600">
                                Lowercase letters, numbers, and hyphens only.
                            </p>
                        </div>

                        {/* Techstack */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Tech stack
                            </label>
                            <div className="relative">
                                <select
                                    value={techstack}
                                    onChange={(e) => setTechstack(e.target.value)}
                                    className="appearance-none w-full h-11 px-4 rounded-lg bg-zinc-900/60 border border-zinc-700/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="MERN">MERN</option>
                                    <option value="Next.js">Next.js</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !slug.trim()}
                            className="w-full h-11 rounded-lg bg-emerald-400 text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deploying…
                                </>
                            ) : (
                                <>
                                    <Rocket className="size-4" />
                                    Deploy Documentation
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
