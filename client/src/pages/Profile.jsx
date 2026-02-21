import { useState, useEffect } from 'react';
import { Github, Camera, Shield, Sparkles, ExternalLink, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest, github as githubApi } from '../lib/api';
import Navbar from '../components/layout/Navbar';

export default function Profile() {
    const { user, updateUser, fetchUser } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [proCode, setProCode] = useState('');
    const [saving, setSaving] = useState(false);
    const [redeemingCode, setRedeemingCode] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    function showToast(message, type = 'success') {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }

    // --- Cloudinary upload ---
    function handleUpload() {
        if (!window.cloudinary) {
            showToast('Cloudinary widget not loaded.', 'error');
            return;
        }
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                sources: ['local', 'url', 'camera'],
                multiple: false,
                maxFiles: 1,
                cropping: true,
                croppingAspectRatio: 1,
                resourceType: 'image',
            },
            (error, result) => {
                if (!error && result?.event === 'success') {
                    setAvatarUrl(result.info.secure_url);
                }
            }
        );
        widget.open();
    }

    // --- Save profile ---
    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const data = await apiRequest('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify({ firstName, lastName, avatarUrl }),
            });
            updateUser(data.user);
            showToast('Profile saved!');
        } catch (err) {
            showToast(err.message || 'Failed to save.', 'error');
        } finally {
            setSaving(false);
        }
    }

    // --- Redeem pro code ---
    async function handleRedeem() {
        if (!proCode.trim()) return;
        setRedeemingCode(true);
        try {
            const data = await apiRequest('/auth/redeem-pro', {
                method: 'POST',
                body: JSON.stringify({ code: proCode.trim() }),
            });
            showToast(data.message || 'Pro activated!');
            setProCode('');
            fetchUser();
        } catch (err) {
            showToast(err.message || 'Invalid code.', 'error');
        } finally {
            setRedeemingCode(false);
        }
    }

    // --- Link GitHub ---
    async function handleLinkGithub() {
        try {
            const data = await githubApi.getAuthUrl(false);
            window.location.href = data.url;
        } catch {
            showToast('Failed to start GitHub linking.', 'error');
        }
    }

    const initials =
        ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || '?';

    const isGithubLinked = !!user?.githubUsername;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-xl backdrop-blur-md ${
                        toast.type === 'error'
                            ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}>
                        {toast.message}
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-2xl px-6 pt-24 pb-16">
                <h1 className="text-2xl font-semibold tracking-tight mb-8">Profile Settings</h1>

                {/* ── Avatar Card ── */}
                <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold select-none border-2 border-white/10">
                                    {initials}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleUpload}
                                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                title="Change photo"
                            >
                                <Camera size={20} className="text-white" />
                            </button>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-sm text-zinc-500">{user?.email}</p>
                            <button
                                type="button"
                                onClick={handleUpload}
                                className="mt-2 px-4 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                            >
                                Upload new picture
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Personal Info Card ── */}
                <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-6">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5">Personal Information</h3>
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm text-white/50 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/50 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/50 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                readOnly
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/40 cursor-not-allowed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium cursor-pointer"
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                    </form>
                </section>

                {/* ── GitHub Card ── */}
                <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-6">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5">GitHub Integration</h3>
                    {isGithubLinked ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <Github size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user.githubUsername}</p>
                                    <p className="text-xs text-zinc-500">Connected via GitHub OAuth</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <Check size={12} className="text-emerald-400" />
                                <span className="text-xs text-emerald-400 font-medium">Linked</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                    <Github size={20} className="text-zinc-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">GitHub not linked</p>
                                    <p className="text-xs text-zinc-500">Link your account to import repositories</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLinkGithub}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition cursor-pointer"
                            >
                                <Github size={14} />
                                Link GitHub
                            </button>
                        </div>
                    )}
                </section>

                {/* ── Plan & Pro Code Card ── */}
                <section className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5">Current Plan</h3>

                    <div className="flex items-center gap-3 mb-6">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            user?.isPro
                                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                : 'bg-zinc-800 border border-zinc-700'
                        }`}>
                            {user?.isPro ? <Sparkles size={18} className="text-white" /> : <Shield size={18} className="text-zinc-500" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white">
                                    {user?.isPro ? 'Special User' : 'Free Plan'}
                                </p>
                                {user?.isPro && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500">
                                {user?.isPro
                                    ? 'Unlimited documentation generation'
                                    : '2 docs per day · Upgrade for unlimited'}
                            </p>
                        </div>
                    </div>

                    {!user?.isPro && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                            <p className="text-sm text-zinc-400 mb-3">Have a special access code? Enter it below to unlock unlimited generation.</p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={proCode}
                                    onChange={(e) => setProCode(e.target.value)}
                                    placeholder="Enter your pro code"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition"
                                    onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                                />
                                <button
                                    onClick={handleRedeem}
                                    disabled={redeemingCode || !proCode.trim()}
                                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    {redeemingCode ? 'Verifying…' : 'Redeem'}
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
