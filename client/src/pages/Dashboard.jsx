import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Settings, ExternalLink, Loader2, FolderGit2, Sparkles, Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { project as projectApi } from '../lib/api';
import { APP_DOMAIN } from '../lib/config';
import Navbar from '../components/layout/Navbar';
import CommandPalette from '../components/CommandPalette';
import SettingsModal from '../components/SettingsModal';
import botAvatar from '../assets/bot-avatar.png';

export default function Dashboard() {
    const { fetchUser } = useAuth();
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [feedbackGiven, setFeedbackGiven] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await projectApi.delete(deleteTarget._id);
            setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
            setToast({ type: 'success', message: `"${deleteTarget.repoName?.split('/').pop()}" wiped from the servers.` });
        } catch {
            setToast({ type: 'error', message: 'Failed to delete project.' });
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

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
        const reason = searchParams.get('reason');

        if (ghStatus === 'success') {
            setToast({ type: 'success', message: 'GitHub connection secured! 🚀' });
            fetchUser();
            window.history.replaceState({}, '', '/dashboard');
        } else if (ghStatus === 'error') {
            if (reason === 'already_linked') {
                setToast({ type: 'error', message: 'That GitHub account is already linked to another email.' });
            } else {
                setToast({ type: 'error', message: 'GitHub handshake failed. Try again.' });
            }
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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
            <Navbar variant="dashboard" />

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl backdrop-blur-md ${toast.type === 'success'
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
                            Command Center
                        </h1>
                        <p className="text-sm text-zinc-400">
                            All your parsed repos in one place. Hit <kbd className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 font-mono text-xs text-zinc-300 mx-1 shadow-sm">Ctrl + Space</kbd> to quick-jump.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm"
                            title="Engine Settings"
                        >
                            <Settings size={16} className="text-zinc-400" />
                        </button>
                        <Link
                            to="/import"
                            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Plus size={16} />
                            Deploy Docs
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="size-6 animate-spin text-emerald-500" />
                    </div>
                ) : projects.length === 0 ? (
                    /* Empty State */
                    <div className="relative rounded-2xl border border-dashed border-zinc-800 bg-[#0a0a0a] p-16 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                        <div className="relative">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-6 shadow-inner">
                                <FolderGit2 className="size-7 text-zinc-500" />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">Zero active deployments</h2>
                            <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto leading-relaxed">
                                Drop a GitHub link. We'll read your AST, parse the logic, and generate production-grade documentation while you grab a coffee.
                            </p>
                            <Link
                                to="/import"
                                className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            >
                                <Sparkles size={14} />
                                Initialize Engine
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p) => {
                            const isReady = p.status === 'ready';
                            const url = p.subdomain
                                ? `${p.subdomain}.${APP_DOMAIN}`
                                : `${APP_DOMAIN}/p/${p.slug}`;
                            const liveUrl = p.subdomain
                                ? `https://${p.subdomain}.${APP_DOMAIN}`
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
                                                    <span className="text-[11px] text-emerald-400 font-medium">Online</span>
                                                </div>
                                            )}
                                            {!isReady && p.status !== 'idle' && (
                                                <span className="text-[11px] text-yellow-400 font-medium capitalize animate-pulse">
                                                    Parsing...
                                                </span>
                                            )}
                                        </div>

                                        {/* Middle row: URL + Template */}
                                        <div className="space-y-2">
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors truncate"
                                            >
                                                <ExternalLink size={12} className="shrink-0" />
                                                <span className="truncate font-mono text-xs">{url}</span>
                                            </a>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-[10px] text-zinc-400 uppercase tracking-wider">
                                                    {p.template || 'modern'}
                                                </span>
                                                <span className="text-[10px] text-zinc-600 font-mono">
                                                    {p.techstack || 'Auto-detected'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Bottom row: Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Link
                                                to={`/editor/${p._id}`}
                                                className="flex-1 h-9 rounded-lg bg-zinc-100 text-black text-sm font-medium flex items-center justify-center gap-2 hover:bg-white transition-colors"
                                            >
                                                Edit Docs
                                            </Link>
                                            <Link
                                                to={`/project/${p._id}/beta-edit`}
                                                className="h-9 w-9 rounded-lg border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/15 transition-colors shrink-0"
                                                title="This is Beta"
                                            >
                                                <Sparkles size={16} />
                                            </Link>
                                            <Link
                                                to={`/project/${p._id}/settings`}
                                                className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
                                                title="Config"
                                            >
                                                <Settings size={16} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteTarget(p)}
                                                className="h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors shrink-0"
                                                title="Drop Database"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Vibe Check Feedback Banner (The Flex Zone) */}
                <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] border border-zinc-800 rounded-xl p-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                    {/* Subtle glow behind the banner */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[50px] pointer-events-none" />

                    {/* Left: Bot avatar + Text */}
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                            <img src={botAvatar} alt="Herin Soni" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Dev to Dev ⚡️</h3>
                            <p className="text-sm text-zinc-400 max-w-md">I built <span className="font-logo font-bold text-white">WHATDOC</span> to kill the pain of writing Markdown. How's the engine treating your code?</p>
                        </div>
                    </div>

                    {/* Right: Reactions or Thank-you */}
                    <div className="relative z-10">
                        {feedbackGiven ? (
                            <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse whitespace-nowrap">
                                Heard loud and clear. You're a legend. 👑
                            </p>
                        ) : (
                            <div className="flex items-center gap-3 shrink-0">
                                <a
                                    href="mailto:contactherin@gmail.com?subject=Bug Report — WHATDOC"
                                    onClick={() => setFeedbackGiven(true)}
                                    className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 transition-all text-xs font-medium text-zinc-300 flex items-center gap-2 cursor-pointer"
                                >
                                    🐛 Report a glitch
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/herinsoni/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setFeedbackGiven(true)}
                                    className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-blue-500/50 transition-all text-xs font-medium text-zinc-300 flex items-center gap-2 cursor-pointer"
                                >
                                    👋 Ping Herin
                                </a>
                                <button
                                    onClick={() => setFeedbackGiven(true)}
                                    className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-medium flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                >
                                    🔥 This is fire
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <CommandPalette projects={projects} />

            {/* ── Delete Confirmation Modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-[slideIn_0.2s_ease]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Nuke Deployment?</h3>
                            <button onClick={() => setDeleteTarget(null)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400 mb-2">
                            Are you sure you want to delete <span className="text-white font-medium font-mono bg-zinc-900 px-1 rounded">{deleteTarget.repoName?.split('/').pop()}</span>?
                        </p>
                        <p className="text-xs text-zinc-600 mb-6">
                            This drops the parsed documentation from our database. It cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 h-10 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 h-10 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Wiping servers…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}