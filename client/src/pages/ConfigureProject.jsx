import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Rocket, Loader2, ArrowLeft, AlertCircle, CheckCircle2, LayoutTemplate, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { project } from '../lib/api';
import { DOC_TEMPLATES } from '../config/templates';
import UpgradeModal from '../components/UpgradeModal';
import ModelSelector, { models } from '../components/ModelSelector';
import { useAuth } from '../context/AuthContext';

export default function ConfigureProject() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // To access user properties

    const repoName = searchParams.get('repo') || '';

    // Default slug = last segment of repoName, lowercased, sanitised
    const defaultSlug = repoName
        .split('/')
        .pop()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const [slug, setSlug] = useState(defaultSlug);
    const [techstack, setTechstack] = useState('MERN');
    const [selectedTemplateId, setSelectedTemplateId] = useState('twilio');
    const [customModel, setCustomModel] = useState(() => localStorage.getItem('wtd_custom_model') || 'gemini-2.5-flash-lite');
    const [customKey, setCustomKey] = useState(() => localStorage.getItem('wtd_custom_key') || '');

    // We compute the active provider on the fly based on the chosen customModel
    const activeModelObj = models.find(m => m.id === customModel) || models[0];
    const llmProvider = activeModelObj.provider;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    const handleSlugChange = (e) => {
        // Only allow lowercase alphanumeric + hyphens
        const value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-')
            .replace(/-+/g, '-');
        setSlug(value);
    };

    const handleDeploy = async (e) => {
        e.preventDefault();
        setError('');

        if (!slug.trim()) {
            setError('Slug cannot be empty.');
            return;
        }

        if (!customKey.trim() || customKey.trim().length <= 20) {
            setError('API key is required. Provide your own API key to generate documentation.');
            return;
        }

        setLoading(true);
        try {
            // Persist BYOK settings to localStorage so api.js sends them as headers
            localStorage.setItem('wtd_custom_model', customModel);
            localStorage.setItem('wtd_custom_key', customKey);

            const res = await project.create({ repoName, slug: slug.trim(), techstack, template: selectedTemplateId, llmProvider });

            // Stash slug and job identifier for the deploy page
            sessionStorage.setItem('deploy_slug', slug.trim());

            if (res.cached) {
                // If it was a cache hit, skip the deploy waiting room!
                navigate(`/p/${slug.trim()}`);
            } else {
                if (res.jobId) sessionStorage.setItem('deploy_jobId', res.jobId);
                navigate(`/deploy/${res.project._id}`);
            }

        } catch (err) {
            if (err.code === 'UPGRADE_REQUIRED' || err.code === 'DAILY_LIMIT') {
                setIsUpgradeOpen(true);
            }
            setError(err.error || err.message || 'Failed to create project.');
        } finally {
            setLoading(false);
        }
    };

    // No repo selected — redirect back
    if (!repoName) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
                <p className="text-zinc-400 mb-4">No repository selected.</p>
                <Link to="/import" className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
                    <ArrowLeft className="size-4" /> Back to import
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <Logo className="text-lg" />
                    <Link
                        to="/import"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </Link>
                </div>
            </header>


            <main className="flex-1 flex items-center justify-center px-4 pt-14">
                <div className="w-full max-w-3xl">
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                            <Rocket className="size-5 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Configure project</h1>
                        <p className="text-sm text-zinc-500">Set up your documentation before deploying.</p>
                    </div>

                    {/* Card */}
                    <form
                        onSubmit={handleDeploy}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-6"
                    >
                        {/* Repo name — read only */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Repository
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={repoName}
                                className="w-full h-11 px-4 rounded-lg bg-zinc-900/60 border border-zinc-700/40 text-zinc-400 text-sm cursor-default focus:outline-none select-all"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                URL slug
                            </label>
                            <div className="flex items-center h-11 rounded-lg bg-zinc-900/60 border border-zinc-700/40 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400/50 focus-within:border-transparent transition-all">
                                <span className="shrink-0 pl-4 text-sm text-zinc-500 select-none font-logo">
                                    <span className="font-bold">W</span>HATDOC.XYZ/p/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={handleSlugChange}
                                    placeholder="my-project"
                                    className="flex-1 h-full bg-transparent text-white text-sm px-1 focus:outline-none placeholder-zinc-600"
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-zinc-600">
                                Lowercase letters, numbers, and hyphens only.
                            </p>
                        </div>

                        {/* Techstack */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Tech stack
                            </label>
                            <div className="relative">
                                <select
                                    value={techstack}
                                    onChange={(e) => setTechstack(e.target.value)}
                                    className="appearance-none w-full h-11 px-4 rounded-lg bg-zinc-900/60 border border-zinc-700/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all cursor-pointer"
                                >
                                    <option value="MERN">MERN</option>
                                    <option value="Next.js">Next.js</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* ── Choose your Design  */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-3">
                                <span className="flex items-center gap-1.5">
                                    <LayoutTemplate className="size-4" />
                                    Choose your Design
                                </span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {DOC_TEMPLATES.map((t) => {
                                    const isActive = selectedTemplateId === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setSelectedTemplateId(t.id)}
                                            className={`group relative rounded-xl border text-left transition-all duration-200 overflow-hidden ${isActive
                                                ? 'border-blue-500 ring-2 ring-blue-500 scale-105 shadow-[0_0_24px_rgba(59,130,246,0.25)]'
                                                : 'border-zinc-700/40 bg-zinc-900/60 hover:border-zinc-500 hover:scale-[1.02]'
                                                }`}
                                        >
                                            {/* Preview image */}
                                            <img
                                                src={t.previewUrl}
                                                alt={`${t.name} preview`}
                                                className="w-full h-32 object-cover"
                                            />

                                            {/* Info */}
                                            <div className="p-3">
                                                <span className="block text-sm font-semibold text-white">
                                                    {t.name}
                                                </span>
                                                <span className="block text-xs text-zinc-500 mt-0.5 line-clamp-2">
                                                    {t.description}
                                                </span>
                                            </div>

                                            {/* Active badge */}
                                            {isActive && (
                                                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-0.5">
                                                    <CheckCircle2 className="size-4 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>



                        {/* ── BYOK: Model & API Key  */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
                            <label className="block text-sm font-medium text-zinc-300">
                                Model &amp; API Key <span className="text-red-400 font-normal">(required — Bring Your Own Key)</span>
                            </label>

                            {/* Model select */}
                            <div className="relative">
                                {/* Using the new ModelSelector component */}
                                <ModelSelector
                                    hasCustomKey={customKey.trim().length > 20}
                                    selectedModel={customModel}
                                    setSelectedModel={setCustomModel}
                                    onRequestKey={(model) => {
                                        setError(`You must provide your own API key to use ${model?.name || 'advanced models'}!`);
                                        // Scroll to error
                                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                    }}
                                />
                            </div>

                            {/* API Key input */}
                            <div>
                                <input
                                    type="password"
                                    value={customKey}
                                    onChange={(e) => setCustomKey(e.target.value)}
                                    placeholder={
                                        llmProvider === 'openai' ? 'sk-proj-... (API Key required)' :
                                            llmProvider === 'anthropic' ? 'sk-ant-... (API Key required)' :
                                                'AIzaSy... (API Key required)'
                                    }
                                    className="w-full h-11 px-4 rounded-lg bg-[#111] border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all placeholder:text-zinc-600"
                                />
                                {llmProvider === 'openai' ? (
                                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                                        Get your API key from OpenAI Platform ↗
                                    </a>
                                ) : llmProvider === 'anthropic' ? (
                                    <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                                        Get your API key from Anthropic Console ↗
                                    </a>
                                ) : (
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                                        Get a free key from Google AI Studio ↗
                                    </a>
                                )}
                            </div>

                            {/* Trust badge */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-start gap-2 text-xs">
                                <ShieldCheck className="size-4 mt-0.5 shrink-0" />
                                <span>Your API key is required to generate docs. It stays in your browser, is relayed to {llmProvider.charAt(0).toUpperCase() + llmProvider.slice(1)}, and is never stored in our database.</span>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                                <AlertCircle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !slug.trim()}
                            className="w-full h-11 rounded-lg bg-emerald-400 text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deploying…
                                </>
                            ) : (
                                <>
                                    <Rocket className="size-4" />
                                    Deploy Documentation
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
            <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
        </div>
    );
}
