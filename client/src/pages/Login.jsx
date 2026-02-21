import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <div className="mb-8">
                <Logo className="text-2xl" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Welcome back
            </h1>
            <p className="text-zinc-500 text-sm mb-8">
                Sign in to your account to continue
            </p>

            {/* Card */}
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Error */}
                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="john.doe@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <button type="button" className="text-sm text-zinc-500 hover:text-white transition-colors">
                                Forgot?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPw ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                            >
                                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-lg bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="size-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Footer link */}
            <p className="mt-8 text-sm text-zinc-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-white font-medium hover:text-emerald-400 transition-colors">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
