import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Lock, Globe, ArrowLeft, Github, Loader2, ChevronDown, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { github } from '../lib/api';
import Logo from '../components/Logo';

// ──────────────────────────────────────────────
// Helper: relative time string like "14h ago", "Jan 30" etc.
// ──────────────────────────────────────────────
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    // Older than a week — show "Jan 30" style
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ──────────────────────────────────────────────
// Small circle with language color
// ──────────────────────────────────────────────
const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Dart: '#00B4AB',
};

function LangDot({ language }) {
    if (!language) return null;
    const color = LANG_COLORS[language] || '#8b8b8b';
    return (
        <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
            title={language}
        />
    );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export default function ImportRepo() {
    const { user, fetchUser } = useAuth();
    const navigate = useNavigate();

    const [repos, setRepos] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | public | private
    const [filterOpen, setFilterOpen] = useState(false);
    const [includePrivate, setIncludePrivate] = useState(true);

    const isGithubConnected = !!user?.githubId;

    // ── Fetch repos on mount ──
    useEffect(() => {
        if (!isGithubConnected) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const data = await github.getRepos();
                if (cancelled) return;
                setRepos(data.repos);
                setUsername(data.username);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load repos');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [isGithubConnected]);

    // ── Connect GitHub ──
    const handleConnectGithub = async (withPrivate = true) => {
        try {
            const data = await github.getAuthUrl(withPrivate);
            // Redirect the browser to GitHub OAuth page
            window.location.href = data.url;
        } catch (err) {
            setError(err.message || 'Failed to start GitHub auth');
        }
    };

    // ── After returning from GitHub callback, refresh user ──
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ghStatus = params.get('github');

        if (ghStatus === 'success') {
            // Clean up URL
            window.history.replaceState({}, '', '/import');
            fetchUser();
        } else if (ghStatus === 'error') {
            const reason = params.get('reason') || 'unknown';
            setError(`GitHub connection failed: ${reason}`);
            window.history.replaceState({}, '', '/import');
        }
    }, [fetchUser]);

    // ── Filtered + searched repos ──
    const filteredRepos = useMemo(() => {
        let list = repos;

        // Visibility filter
        if (filter === 'public') list = list.filter((r) => !r.private);
        if (filter === 'private') list = list.filter((r) => r.private);

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((r) => r.name.toLowerCase().includes(q));
        }

        return list;
    }, [repos, filter, search]);

    const handleImport = (repo) => {
        navigate(`/configure?repo=${encodeURIComponent(repo.fullName)}`);
    };

    // ── Not connected state ──
    if (!isGithubConnected && !loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <main className="pt-24 pb-16 px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <Github className="size-8 text-zinc-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Connect GitHub</h1>
                        <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto">
                            Connect your GitHub account to import repositories and generate documentation with{' '}
                            <span className="logo text-xs"><span className="font-bold">W</span>HATDOC.XYZ</span>
                        </p>
                        {error && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 mb-6 inline-flex items-center gap-2">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Private repo toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group justify-center mb-6">
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
                            onClick={() => handleConnectGithub(includePrivate)}
                            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all"
                        >
                            <Github className="size-4" />
                            Connect GitHub
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-24 pb-16 px-6">
                <div className="mx-auto max-w-6xl">

                    {/* Page title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="size-5" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight">Import Git Repository</h1>
                    </div>
                    <p className="text-zinc-500 text-sm mb-8 ml-8">
                        Select a repo to generate documentation for
                    </p>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 mb-6 flex items-center gap-2">
                            <AlertCircle className="size-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Search bar + filter */}
                    <div className="flex items-center gap-3 mb-6">
                        {/* GitHub user badge */}
                        <div className="flex items-center gap-2 h-11 px-4 rounded-lg border border-zinc-800 bg-zinc-950 text-sm shrink-0">
                            <Github className="size-4 text-zinc-400" />
                            <span className="text-zinc-300 font-medium">{username}</span>
                            <ChevronDown className="size-3.5 text-zinc-600" />
                        </div>

                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-zinc-600"
                            />
                        </div>

                        {/* Filter dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 h-11 px-4 rounded-lg border border-zinc-800 bg-zinc-950 text-sm text-zinc-300 hover:border-zinc-600 transition-all"
                            >
                                Filter
                                <ChevronDown className="size-3.5 text-zinc-500" />
                            </button>
                            {filterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                                    <div className="absolute right-0 top-12 z-20 w-40 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
                                        {[
                                            { key: 'all', label: 'All repos' },
                                            { key: 'public', label: 'Public' },
                                            { key: 'private', label: 'Private' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.key}
                                                onClick={() => { setFilter(opt.key); setFilterOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filter === opt.key
                                                    ? 'bg-zinc-800 text-white'
                                                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Repo list */}
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="size-6 animate-spin text-zinc-500" />
                            </div>
                        ) : filteredRepos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-sm">
                                <Search className="size-8 mb-3 text-zinc-700" />
                                {search ? 'No repos match your search' : 'No repositories found'}
                            </div>
                        ) : (
                            <ul className="divide-y divide-zinc-800/60">
                                {filteredRepos.map((repo) => (
                                    <RepoRow key={repo.id} repo={repo} onImport={handleImport} />
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Stats footer */}
                    {!loading && repos.length > 0 && (
                        <p className="mt-4 text-xs text-zinc-600 text-right">
                            Showing {filteredRepos.length} of {repos.length} repos
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

// ──────────────────────────────────────────────
// Single repo row
// ──────────────────────────────────────────────
function RepoRow({ repo, onImport }) {
    return (
        <li className="flex items-center justify-between px-5 py-4 hover:bg-zinc-900/50 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
                {/* Icon: shows lock for private, globe for public */}
                <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    {repo.private
                        ? <Lock className="size-4 text-zinc-500" />
                        : <Globe className="size-4 text-zinc-500" />
                    }
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">{repo.name}</span>
                        {repo.private && (
                            <Lock className="size-3 text-zinc-600 shrink-0" />
                        )}
                        <span className="text-xs text-zinc-600">· {timeAgo(repo.updatedAt)}</span>
                    </div>
                    {/* Language + description */}
                    <div className="flex items-center gap-2 mt-0.5">
                        {repo.language && (
                            <div className="flex items-center gap-1">
                                <LangDot language={repo.language} />
                                <span className="text-xs text-zinc-600">{repo.language}</span>
                            </div>
                        )}
                        {repo.description && (
                            <span className="text-xs text-zinc-600 truncate max-w-[300px]">
                                {repo.language ? '· ' : ''}{repo.description}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
                <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-md flex items-center justify-center text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                    title="Open on GitHub"
                >
                    <ExternalLink className="size-3.5" />
                </a>
                <button
                    onClick={() => onImport(repo)}
                    className="h-8 px-4 rounded-md bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
                >
                    Import
                </button>
            </div>
        </li>
    );
}

// ──────────────────────────────────────────────
// Shared header
// ──────────────────────────────────────────────
function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user
        ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
        : '';

    return (
        <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                <Logo className="text-lg" />
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        Dashboard
                    </Link>
                    <div className="h-8 w-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}
