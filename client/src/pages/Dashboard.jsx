import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Github, FolderGit2, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { github as githubApi } from '../lib/api';
import Logo from '../components/Logo';

export default function Dashboard() {
    const { user, logout, fetchUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [connectingGithub, setConnectingGithub] = useState(false);
    const [includePrivate, setIncludePrivate] = useState(true);
    const [toast, setToast] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Handle GitHub callback redirect params
    useEffect(() => {
        const ghStatus = searchParams.get('github');
        if (ghStatus === 'success') {
            setToast({ type: 'success', message: 'GitHub connected successfully!' });
            fetchUser();
            window.history.replaceState({}, '', '/dashboard');
        } else if (ghStatus === 'error') {
            const reason = searchParams.get('reason') || 'unknown error';
            setToast({ type: 'error', message: `GitHub connection failed: ${reason}` });
            window.history.replaceState({}, '', '/dashboard');
        }
    }, [searchParams, fetchUser]);

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleConnectGithub = async () => {
        setConnectingGithub(true);
        try {
            const data = await githubApi.getAuthUrl(includePrivate);
            window.location.href = data.url;
        } catch {
            setToast({ type: 'error', message: 'Failed to start GitHub connection' });
            setConnectingGithub(false);
        }
    };

    const initials = user
        ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
        : '';

    const isGithubConnected = !!user?.githubId;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top bar */}
            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <Logo className="text-lg" />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                                {initials}
                            </div>
                            <span className="hidden sm:block text-sm text-zinc-300">
                                {user?.firstName} {user?.lastName}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 h-9 px-4 rounded-full border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden sm:inline">Sign out</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Toast notification */}
            {toast && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${
                        toast.type === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                        {toast.type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="pt-24 pb-16 px-6">
                <div className="mx-auto max-w-5xl">
                    {/* Welcome */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight mb-1">
                            Welcome, {user?.firstName}
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            Manage your documentation projects from your{' '}
                            <span className="logo text-xs">
                                <span className="font-bold">W</span>HATDOC.XYZ
                            </span>{' '}
                            dashboard.
                        </p>
                    </div>

                    {/* Info cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        {/* Profile card */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                                <User className="size-5 text-emerald-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-200">Profile</h3>
                            <div className="text-sm text-zinc-500 space-y-1">
                                <p>{user?.firstName} {user?.lastName}</p>
                                <p className="text-zinc-600">{user?.email}</p>
                            </div>
                        </div>

                        {/* Projects card */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                                <FolderGit2 className="size-5 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-200">Projects</h3>
                            <p className="text-sm text-zinc-500">
                                {isGithubConnected
                                    ? 'Import a repo to create your first project.'
                                    : 'Connect GitHub to get started.'}
                            </p>
                            {isGithubConnected && (
                                <Link
                                    to="/import"
                                    className="mt-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                                >
                                    Import repository <ArrowRight className="size-3.5" />
                                </Link>
                            )}
                        </div>

                        {/* GitHub card */}
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                                isGithubConnected ? 'bg-emerald-400/10' : 'bg-zinc-800'
                            }`}>
                                <Github className={`size-5 ${isGithubConnected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-200">GitHub</h3>
                            {isGithubConnected ? (
                                <div className="text-sm text-zinc-500">
                                    <p className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                        Connected as <span className="text-zinc-300 font-medium">{user?.githubUsername}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-500">Not connected yet</p>
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
                        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
                        <div className="flex flex-wrap gap-3">
                            {isGithubConnected ? (
                                <Link
                                    to="/import"
                                    className="h-10 px-5 rounded-full bg-emerald-400 text-black text-sm font-semibold flex items-center gap-2 hover:bg-emerald-500 transition-all"
                                >
                                    <FolderGit2 className="size-4" />
                                    Import repository
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={includePrivate}
                                                onChange={(e) => setIncludePrivate(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="h-5 w-9 rounded-full bg-zinc-700 peer-checked:bg-emerald-500 transition-colors" />
                                            <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                                        </div>
                                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                            Include private repositories
                                        </span>
                                    </label>
                                    <button
                                        onClick={handleConnectGithub}
                                        disabled={connectingGithub}
                                        className="h-10 px-5 rounded-full bg-white text-black text-sm font-semibold flex items-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 w-fit"
                                    >
                                        {connectingGithub ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <Github className="size-4" />
                                        )}
                                        Connect GitHub
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
