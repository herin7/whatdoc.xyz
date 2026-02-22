import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User, Ticket } from 'lucide-react';
import Logo from '../components/Logo';
import { auth } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/config';

export default function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '', inviteCode: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [waitlistActive, setWaitlistActive] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/invites/status`)
            .then((r) => r.json())
            .then((d) => setWaitlistActive(d.waitlistEnabled))
            .catch(() => { });
    }, []);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await auth.signup(form);
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            if (err.errors) {
                setError(err.errors.map((e) => e.message).join(', '));
            } else {
                setError(err.message || 'Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-emerald-500/30 py-12">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none flex justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute top-[-20%] w-[600px] h-[400px] rounded-[100%] bg-emerald-500/10 blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-[fadeSlideUp_0.5s_ease-out]">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="mb-6">
                        <Logo className="text-3xl" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-white">
                        Create Workspace
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Stop writing docs. Start shipping.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">



                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-[fadeIn_0.2s_ease]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5 group">
                                <label htmlFor="fname" className="text-[13px] font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                    First name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        id="fname"
                                        name="fname"
                                        type="text"
                                        required
                                        placeholder="Linus"
                                        value={form.fname}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded-xl border border-white/10 bg-[#111] pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 group">
                                <label htmlFor="lname" className="text-[13px] font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                    Last name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        id="lname"
                                        name="lname"
                                        type="text"
                                        required
                                        placeholder="Torvalds"
                                        value={form.lname}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded-xl border border-white/10 bg-[#111] pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5 group">
                            <label htmlFor="email" className="text-[13px] font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="dev@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="h-10 w-full rounded-xl border border-white/10 bg-[#111] pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5 group">
                            <label htmlFor="password" className="text-[13px] font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="h-10 w-full rounded-xl border border-white/10 bg-[#111] pl-9 pr-10 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                </button>
                            </div>
                        </div>

                        {waitlistActive && (
                            <div className="flex flex-col gap-1.5 group">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="inviteCode" className="text-[13px] font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                        Invite code
                                    </label>
                                    <Link to="/waitlist" className="text-[11px] text-zinc-600 hover:text-emerald-400 transition-colors">
                                        Need a code?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        id="inviteCode"
                                        name="inviteCode"
                                        type="text"
                                        required
                                        placeholder="WD-XXXXXX"
                                        value={form.inviteCode}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded-xl border border-white/10 bg-[#111] pl-9 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 font-mono uppercase tracking-wider"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 h-11 w-full rounded-xl bg-emerald-400 text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-zinc-600 leading-relaxed">
                        By deploying, you agree to our{' '}
                        <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors underline decoration-zinc-700 underline-offset-2">Terms</a>
                        {' '}and{' '}
                        <a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors underline decoration-zinc-700 underline-offset-2">Privacy Policy</a>.
                    </p>
                </div>

                {/* Footer link */}
                <p className="mt-8 text-center text-sm text-zinc-500">
                    Already an agent?{' '}
                    <Link to="/login" className="text-white font-medium hover:text-emerald-400 hover:underline transition-all">
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}