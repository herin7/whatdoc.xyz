import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react';
import Logo from '../components/Logo';
import { auth, apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/firebase';

export default function Signup() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '' });
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

    const handleGoogle = async () => {
        try {
            setError('');
            // Optional: setLoading(true) but Firebase popup already shows loading context
            const googleUser = await signInWithGoogle();
            const payload = {
                email: googleUser.email,
                displayName: googleUser.displayName,
                photoURL: googleUser.photoURL,
                uid: googleUser.uid
            };

            const data = await auth.google(payload);
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };



    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-emerald-500/30 py-12">


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

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs font-semibold tracking-wider">OR</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            onClick={handleGoogle}
                            className="h-11 w-full rounded-xl bg-transparent border border-white/20 text-white text-sm font-semibold flex items-center justify-center gap-3 hover:bg-white/5 transition-all duration-300"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                    </form>

                    {/* Terms */}
                    <p className="mt-6 text-center text-xs text-zinc-600 leading-relaxed">
                        By deploying, you agree to our{' '}
                        <a href="/terms" className="text-zinc-400 hover:text-emerald-400 transition-colors underline decoration-zinc-700 underline-offset-2">Terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-zinc-400 hover:text-emerald-400 transition-colors underline decoration-zinc-700 underline-offset-2">Privacy Policy</a>.
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