import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Trash2, RefreshCw, Shield } from 'lucide-react';
import { API_URL } from '../lib/config';

const STATUS_COLORS = {
    pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    used: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
};

export default function Admin() {
    const [adminKey, setAdminKey] = useState(() => localStorage.getItem('wd_admin_key') || '');
    const [authed, setAuthed] = useState(false);
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState('');
    const [error, setError] = useState('');

    async function fetchInvites(key) {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/invites/list`, {
                headers: { 'x-admin-key': key || adminKey },
            });
            if (res.status === 401) {
                setAuthed(false);
                setError('Invalid admin key.');
                return;
            }
            const data = await res.json();
            setInvites(data.invites);
            setAuthed(true);
        } catch {
            setError('Failed to connect.');
        } finally {
            setLoading(false);
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        localStorage.setItem('wd_admin_key', adminKey);
        fetchInvites(adminKey);
    }

    async function handleApprove(email) {
        setActionLoading(email);
        try {
            await fetch(`${API_URL}/api/invites/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                body: JSON.stringify({ email }),
            });
            fetchInvites();
        } catch {
            setError('Approve failed.');
        } finally {
            setActionLoading('');
        }
    }

    async function handleDelete(email) {
        if (!confirm(`Delete invite for ${email}?`)) return;
        setActionLoading(email);
        try {
            await fetch(`${API_URL}/api/invites/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                body: JSON.stringify({ email }),
            });
            fetchInvites();
        } catch {
            setError('Delete failed.');
        } finally {
            setActionLoading('');
        }
    }

    const counts = {
        pending: invites.filter((i) => i.status === 'pending').length,
        approved: invites.filter((i) => i.status === 'approved').length,
        used: invites.filter((i) => i.status === 'used').length,
    };

    if (!authed) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="size-6 text-zinc-500" />
                        <h1 className="text-xl font-bold text-white">Admin Access</h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            placeholder="Enter ADMIN_SECRET"
                            className="w-full h-11 px-4 bg-[#111] border border-zinc-800 text-white text-sm font-mono placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors rounded-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-white text-black text-sm font-bold font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-none flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Authenticate'}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-xs font-mono text-red-400">⚠ {error}</p>}

                    <Link to="/" className="block mt-6 text-xs font-mono text-zinc-600 hover:text-white transition-colors">
                        ← back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
            <header className="border-b border-zinc-800/60 px-6">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="font-logo text-sm tracking-wider">
                            <span className="font-bold text-white">W</span>
                            <span className="text-zinc-400">HATDOC</span>
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-600 border border-zinc-800 px-2 py-0.5 uppercase tracking-widest">
                            Admin
                        </span>
                    </div>
                    <button
                        onClick={() => fetchInvites()}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8">
                {error && (
                    <div className="mb-6 text-xs font-mono text-red-400 border border-red-500/20 bg-red-500/5 px-4 py-3 rounded-none">
                        ⚠ {error}
                    </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="border border-zinc-800 bg-[#111] p-4 rounded-none">
                        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Pending</p>
                        <p className="text-2xl font-bold text-amber-400">{counts.pending}</p>
                    </div>
                    <div className="border border-zinc-800 bg-[#111] p-4 rounded-none">
                        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Approved</p>
                        <p className="text-2xl font-bold text-emerald-400">{counts.approved}</p>
                    </div>
                    <div className="border border-zinc-800 bg-[#111] p-4 rounded-none">
                        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Used</p>
                        <p className="text-2xl font-bold text-zinc-400">{counts.used}</p>
                    </div>
                </div>

                <div className="border border-zinc-800 bg-[#111] rounded-none overflow-hidden">
                    <div className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-5 py-3 border-b border-zinc-800 font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                        <span>Email</span>
                        <span>Code</span>
                        <span>Status</span>
                        <span className="text-right">Actions</span>
                    </div>

                    {loading && invites.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-5 animate-spin text-zinc-600" />
                        </div>
                    ) : invites.length === 0 ? (
                        <div className="text-center py-16 text-sm text-zinc-600 font-mono">
                            No invite requests yet.
                        </div>
                    ) : (
                        invites.map((inv) => (
                            <div
                                key={inv._id}
                                className="grid grid-cols-[1fr_120px_120px_100px] gap-4 px-5 py-3 border-b border-zinc-800/40 items-center hover:bg-zinc-900/30 transition-colors group"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm text-white truncate">{inv.email}</p>
                                    <p className="text-[10px] font-mono text-zinc-600 mt-0.5">
                                        {new Date(inv.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                </div>

                                <span className="font-mono text-xs text-zinc-400">{inv.inviteCode}</span>

                                <span className={`inline-flex items-center text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border w-fit ${STATUS_COLORS[inv.status]}`}>
                                    {inv.status}
                                </span>

                                <div className="flex items-center justify-end gap-1">
                                    {actionLoading === inv.email ? (
                                        <Loader2 className="size-4 animate-spin text-zinc-500" />
                                    ) : (
                                        <>
                                            {inv.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(inv.email)}
                                                    className="p-1.5 text-zinc-600 hover:text-emerald-400 transition-colors"
                                                    title="Approve & send email"
                                                >
                                                    <CheckCircle className="size-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(inv.email)}
                                                className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
