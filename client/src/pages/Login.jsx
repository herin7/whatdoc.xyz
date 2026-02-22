import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, Github, Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';
import { auth } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await auth.signin(form);
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGithubLogin = () => {
        // Redirect to your Express backend GitHub route
        window.location.href = 'https://whatdoc-xyz.onrender.com/api/auth/github';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-emerald-500/30">
            
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
                        Welcome back
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Authenticate to access the engine.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-[1.5rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    
                    {/* Primary Developer Action: GitHub */}
                    <button 
                        onClick={handleGithubLogin}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-[#111] border border-white/10 text-white font-medium hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
                    >
                        <Github className="size-4" />
                        Continue with GitHub
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6 text-zinc-600">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-xs font-mono uppercase tracking-widest">Or email</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-[fadeIn_0.2s_ease]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-1.5 group">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="dev@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-xl border border-white/10 bg-[#111] pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5 group">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-zinc-400 group-focus-within:text-emerald-400 transition-colors">
                                    Password
                                </label>
                                <button type="button" className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                                    Reset
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPw ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="h-11 w-full rounded-xl border border-white/10 bg-[#111] pl-10 pr-11 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:bg-[#151515] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 h-11 w-full rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                            {loading ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    Initialize Session
                                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="mt-8 text-center text-sm text-zinc-500">
                    Don't have access?{' '}
                    <Link to="/signup" className="text-white font-medium hover:text-emerald-400 hover:underline transition-all">
                        Request access
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