import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Settings, ExternalLink, Loader2, FolderGit2, Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { project as projectApi } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import CommandPalette from '../components/CommandPalette';
import botAvatar from '../assets/bot-avatar.png';

export default function Dashboard() {
    const { fetchUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [feedbackGiven, setFeedbackGiven] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await projectApi.listMine();
                setProjects(data.projects || []);
            } catch {
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    useEffect(() => {
        const ghStatus = searchParams.get('github');
        if (ghStatus === 'success') {
            setToast({ type: 'success', message: 'GitHub connected!' });
            fetchUser();
            window.history.replaceState({}, '', '/dashboard');
        } else if (ghStatus === 'error') {
            setToast({ type: 'error', message: 'GitHub connection failed' });
            window.history.replaceState({}, '', '/dashboard');
        }
    }, [searchParams, fetchUser]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar variant="dashboard" />

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl ${
                        toast.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
                {/* Premium Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight mb-1 text-white">
                            Overview
                        </h1>
                        <p className="text-sm text-zinc-400">
                            Manage your documentation deployments. Press <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 font-mono text-xs text-zinc-300 mx-1 shadow-sm">Ctrl + Space</kbd> to search.
                        </p>
                    </div>
                    <Link
                        to="/import"
                        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors shrink-0 shadow-sm"
                    >
                        <Plus size={16} />
                        Deploy New
                    </Link>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="size-5 animate-spin text-zinc-600" />
                    </div>
                ) : projects.length === 0 ? (
                    /* Empty State */
                    <div className="relative rounded-2xl border border-dashed border-zinc-800 bg-[#0a0a0a] p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                        <div className="relative">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-6 shadow-inner">
                                <FolderGit2 className="size-7 text-zinc-500" />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
                            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                                Import a GitHub repository to generate beautiful, AI-powered documentation in minutes.
                            </p>
                            <Link
                                to="/import"
                                className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                            >
                                <Sparkles size={14} />
                                Import Repository
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p) => {
                            const isReady = p.status === 'ready';
                            const url = p.subdomain
                                ? `${p.subdomain}.whatdoc.xyz`
                                : `whatdoc.xyz/p/${p.slug}`;
                            const liveUrl = p.subdomain
                                ? `https://${p.subdomain}.whatdoc.xyz`
                                : `/p/${p.slug}`;

                            return (
                                <div
                                    key={p._id}
                                    onMouseMove={handleMouseMove}
                                    className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300 rounded-xl p-6 overflow-hidden shadow-sm"
                                >
                                    {/* Dynamic Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.03),transparent_40%)]" />
                                    </div>

                                    <div className="relative space-y-4">
                                        {/* Top row: Name + Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-semibold text-white truncate">
                                                {p.repoName?.split('/').pop() || 'Untitled'}
                                            </h3>
                                            {isReady && (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[11px] text-emerald-400 font-medium">Live</span>
                                                </div>
                                            )}
                                            {!isReady && p.status !== 'idle' && (
                                                <span className="text-[11px] text-yellow-400 font-medium capitalize">
                                                    {p.status}
                                                </span>
                                            )}
                                        </div>

                                        {/* Middle row: URL + Template */}
                                        <div className="space-y-2">
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors truncate"
                                            >
                                                <ExternalLink size={12} className="shrink-0" />
                                                <span className="truncate">{url}</span>
                                            </a>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-[10px] text-zinc-400 uppercase tracking-wider">
                                                    {p.template || 'modern'}
                                                </span>
                                                <span className="text-[10px] text-zinc-600">
                                                    {p.techstack || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom row: Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Link
                                                to={`/editor/${p._id}`}
                                                className="flex-1 h-9 rounded-lg bg-white text-black text-sm font-medium flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-sm"
                                            >
                                                Edit Studio
                                            </Link>
                                            <button
                                                onClick={() => {/* todo: settings modal */}}
                                                className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors shrink-0"
                                                title="Settings"
                                            >
                                                <Settings size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Vibe Check Feedback Banner */}
                <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-zinc-800 rounded-xl p-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: Bot avatar + Text */}
                    <div className="flex items-center gap-4">
                        {/* Bot icon placeholder — replace src with your bot avatar */}
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                             <img src={botAvatar} alt="bot" className="w-full h-full object-cover" />
                            {/* <span className="text-xl">🤖</span>  */}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Vibe Check 🚀</h3>
                            <p className="text-sm text-zinc-400">How's whatdoc working for you? We read every single review.</p>
                        </div>
                    </div>

                    {/* Right: Reactions or Thank-you */}
                    {feedbackGiven ? (
                        <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 animate-pulse whitespace-nowrap">
                            Thanks for the feedback! You're a legend. 👑
                        </p>
                    ) : (
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href="mailto:feedback@whatdoc.xyz?subject=Bug Report"
                                onClick={() => setFeedbackGiven(true)}
                                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
                            >
                                🐛 Found a bug
                            </a>
                            <button
                                onClick={() => setFeedbackGiven(true)}
                                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
                            >
                                🤔 Needs a feature
                            </button>
                            <button
                                onClick={() => setFeedbackGiven(true)}
                                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
                            >
                                🤩 Loving it!
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <CommandPalette projects={projects} />
        </div>
    );
}