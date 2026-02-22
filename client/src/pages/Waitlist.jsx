import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../lib/config';

const LOADING_MESSAGES = [
    'SCANNING_LOCAL_REPOS...',
    'STABILIZING_ENGINE...',
    'LOGGING_REQUEST...',
];

export default function Waitlist() {
    const [email, setEmail] = useState('');
    const [phase, setPhase] = useState('input');
    const [error, setError] = useState('');
    const [loadingIdx, setLoadingIdx] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);

    useEffect(() => {
        const blink = setInterval(() => setCursorVisible((v) => !v), 530);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        if (phase !== 'loading') return;
        const iv = setInterval(() => {
            setLoadingIdx((i) => {
                if (i >= LOADING_MESSAGES.length - 1) {
                    clearInterval(iv);
                    return i;
                }
                return i + 1;
            });
        }, 900);
        return () => clearInterval(iv);
    }, [phase]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('INVALID_EMAIL_FORMAT');
            return;
        }

        setPhase('loading');
        setLoadingIdx(0);

        try {
            const res = await fetch(`${API_URL}/api/invites/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'REQUEST_FAILED');
                setPhase('input');
                return;
            }

            setTimeout(() => setPhase('success'), 1200);
        } catch {
            setError('NETWORK_ERROR — try again');
            setPhase('input');
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 flex flex-col">
            <header className="border-b border-zinc-800/60 px-6">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between">
                    <Link to="/" className="font-logo text-sm tracking-wider">
                        <span className="font-bold text-white">W</span>
                        <span className="text-zinc-400">HATDOC</span>
                    </Link>
                    <Link
                        to="/login"
                        className="text-xs text-zinc-500 hover:text-white transition-colors font-mono"
                    >
                        have an invite? →
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-2xl">

                    {phase === 'input' && (
                        <div className="animate-[fadeIn_0.3s_ease-out]">

                            <div className="font-mono text-[11px] text-zinc-700 mb-8 leading-loose border-l-2 border-zinc-800 pl-4">
                                <p className="text-zinc-500">/**</p>
                                <p>&nbsp;* WHATDOC — Early Access Program</p>
                                <p>&nbsp;* Status: INVITE_ONLY</p>
                                <p>&nbsp;* Build: v0.1.0-beta</p>
                                <p className="text-zinc-500">&nbsp;*/</p>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                                We're not open yet.
                            </h1>

                            <p className="text-base text-zinc-400 mb-4 leading-relaxed max-w-lg"
                                style={{ fontFamily: "'Caveat', cursive", fontSize: '20px' }}>
                                WhatDoc is in early access. Drop your email below and
                                we'll let you in when your slot opens up —
                                no spam, pinky promise.
                            </p>

                            <p className="text-xs font-mono text-zinc-600 mb-8">
                                Currently building something cool. You'll want to be early.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        placeholder="you@email.com"
                                        className="flex-1 h-12 px-4 bg-[#111] border border-zinc-800 text-white text-sm font-mono placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors rounded-none"
                                    />
                                    <button
                                        type="submit"
                                        className="h-12 px-6 bg-white text-black text-sm font-bold font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors rounded-none shrink-0"
                                    >
                                        Request Access
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-xs font-mono text-red-400 mt-1">
                                        ⚠ {error}
                                    </p>
                                )}
                            </form>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="border border-zinc-800/60 bg-[#111] p-4 rounded-none">
                                    <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">What</p>
                                    <p className="text-sm text-zinc-400">AI docs from your GitHub repos. Not the boring kind.</p>
                                </div>
                                <div className="border border-zinc-800/60 bg-[#111] p-4 rounded-none">
                                    <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">How</p>
                                    <p className="text-sm text-zinc-400">We clone, parse, and generate. You pick a template. Done.</p>
                                </div>
                                <div className="border border-zinc-800/60 bg-[#111] p-4 rounded-none">
                                    <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest mb-2">When</p>
                                    <p className="text-sm text-zinc-400">Soon™. Join the list. We'll email you an invite code.</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-zinc-800/40 font-mono text-[11px] text-zinc-700 space-y-1.5">
                                <p>
                                    <span className="text-emerald-600">herin@whatdoc</span>
                                    <span className="text-zinc-600">:</span>
                                    <span className="text-blue-500">~</span>
                                    <span className="text-zinc-600">$ </span>
                                    <span className="text-zinc-500">node server.js</span>
                                </p>
                                <p className="text-zinc-600">
                                    ▸ listening on port 3000
                                </p>
                                <p className="text-zinc-600">
                                    ▸ waitlist: accepting requests
                                </p>
                                <p className="text-zinc-600">
                                    ▸ engine: standby
                                </p>
                                <p>
                                    <span className="text-emerald-600">herin@whatdoc</span>
                                    <span className="text-zinc-600">:</span>
                                    <span className="text-blue-500">~</span>
                                    <span className="text-zinc-600">$ </span>
                                    <span className={`inline-block w-2 h-3.5 bg-zinc-500 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                                </p>
                            </div>
                        </div>
                    )}

                    {phase === 'loading' && (
                        <div className="animate-[fadeIn_0.3s_ease-out] py-20">
                            <div className="font-mono text-sm space-y-4">
                                {LOADING_MESSAGES.map((msg, i) => (
                                    <p
                                        key={msg}
                                        className={`transition-all duration-500 ${i <= loadingIdx
                                                ? 'text-zinc-300 opacity-100 translate-y-0'
                                                : 'text-zinc-700 opacity-0 translate-y-3'
                                            }`}
                                    >
                                        <span className="text-zinc-600 mr-3">{'>'}</span>
                                        {msg}
                                        {i === loadingIdx && (
                                            <span className="inline-block w-2 h-4 bg-zinc-400 ml-1 animate-pulse" />
                                        )}
                                        {i < loadingIdx && (
                                            <span className="text-emerald-500 ml-3">done</span>
                                        )}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {phase === 'success' && (
                        <div className="animate-[fadeIn_0.4s_ease-out]">
                            <div className="font-mono text-[11px] text-zinc-700 mb-6 leading-loose border-l-2 border-emerald-800 pl-4">
                                <p className="text-emerald-500">// REQUEST_LOGGED</p>
                                <p className="text-zinc-600">// timestamp: {new Date().toISOString()}</p>
                            </div>

                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                                You're on the list.
                            </h1>

                            <p className="text-base text-zinc-400 mb-8 leading-relaxed max-w-md"
                                style={{ fontFamily: "'Caveat', cursive", fontSize: '20px' }}>
                                We'll send you an invite code once your slot opens up.
                                Keep an eye on your inbox — it'll be worth the wait.
                            </p>

                            <div className="border border-zinc-800 bg-[#111] p-6 rounded-none mb-6">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                                        Invite Status
                                    </span>
                                    <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest border border-amber-400/20 px-2.5 py-1">
                                        PENDING_APPROVAL
                                    </span>
                                </div>

                                <div className="space-y-3 font-mono text-xs">
                                    <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                                        <span className="text-zinc-600">email</span>
                                        <span className="text-zinc-300">{email}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                                        <span className="text-zinc-600">position</span>
                                        <span className="text-zinc-300">queued</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600">eta</span>
                                        <span className="text-zinc-300">soon™</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-zinc-800/40 bg-[#0d0d0d] p-4 rounded-none mb-8">
                                <p className="font-mono text-[11px] text-zinc-600 mb-2">What happens next:</p>
                                <div className="font-mono text-[11px] text-zinc-500 space-y-1.5">
                                    <p>1. We review your request</p>
                                    <p>2. You get an email with your <span className="text-white">WD-XXXXXX</span> invite code</p>
                                    <p>3. Sign up with the code, connect GitHub, generate docs</p>
                                </div>
                            </div>

                            <Link
                                to="/"
                                className="inline-block text-xs font-mono text-zinc-600 hover:text-white transition-colors"
                            >
                                ← back to home
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&display=swap');
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
