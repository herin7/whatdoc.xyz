import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Settings, Globe, History, ChevronRight, Loader2, Save,
    ExternalLink, AlertTriangle, Check, Copy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { project as projectApi } from '../lib/api';
import { APP_DOMAIN } from '../lib/config';
import Navbar from '../components/layout/Navbar';

/* ── Sidebar tab definitions ─ */
const TABS = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'history', label: 'Version History', icon: History },
];

/* ── Mock version history (will be replaced with real data later) ── */
const MOCK_HISTORY = [
    { id: 1, date: '2026-02-22T14:30:00Z', model: 'Gemini 2.5 Flash', status: 'success' },
    { id: 2, date: '2026-02-20T09:15:00Z', model: 'Gemini 2.5 Flash Lite', status: 'success' },
    { id: 3, date: '2026-02-18T16:45:00Z', model: 'Gemini 2.5 Flash', status: 'failed' },
    { id: 4, date: '2026-02-15T11:00:00Z', model: 'Gemini 2.5 Pro', status: 'success' },
];

/* ══════════════════════════════════════════════════════════════════ */
export default function ProjectSettings() {
    const { id: projectId } = useParams();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [toast, setToast] = useState(null);

    // ── General tab state
    const [slug, setSlug] = useState('');
    const [saving, setSaving] = useState(false);

    // ── Domains tab state
    const [subdomain, setSubdomain] = useState('');
    const [savingDomain, setSavingDomain] = useState(false);

    const [customDomain, setCustomDomain] = useState('');
    const [savingCustomDomain, setSavingCustomDomain] = useState(false);

    /* ── Fetch project on mount ─ */
    const fetchProject = useCallback(async () => {
        try {
            const data = await projectApi.getById(projectId);
            setProject(data.project);
            setSlug(data.project.slug || '');
            setSubdomain(data.project.subdomain || '');
            setCustomDomain(data.project.customDomain || '');
        } catch (err) {
            setToast({ type: 'error', message: err.error || 'Failed to load project.' });
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => { fetchProject(); }, [fetchProject]);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    /* ── Save slug ─── */
    const handleSaveGeneral = async () => {
        const sanitized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (sanitized.length < 2) {
            setToast({ type: 'error', message: 'Slug must be at least 2 characters.' });
            return;
        }
        setSaving(true);
        try {
            const data = await projectApi.update(projectId, { slug: sanitized });
            setProject(data.project);
            setSlug(data.project.slug);
            setToast({ type: 'success', message: 'Settings saved.' });
        } catch (err) {
            setToast({ type: 'error', message: err.error || 'Failed to save.' });
        } finally {
            setSaving(false);
        }
    };

    /* ── Save subdomain ─ */
    const handleSaveDomain = async () => {
        const sanitized = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (!sanitized) {
            setToast({ type: 'error', message: 'Enter a valid subdomain.' });
            return;
        }
        setSavingDomain(true);
        try {
            const data = await projectApi.update(projectId, { subdomain: sanitized });
            setProject(data.project);
            setSubdomain(data.project.subdomain);
            setToast({ type: 'success', message: 'Subdomain updated.' });
        } catch (err) {
            setToast({ type: 'error', message: err.error || 'Subdomain is taken.' });
        } finally {
            setSavingDomain(false);
        }
    };

    /* ── Save custom domain ── */
    const handleSaveCustomDomain = async () => {
        const sanitized = customDomain.toLowerCase().replace(/[^a-z0-9.-]/g, '').trim();
        setSavingCustomDomain(true);
        try {
            const data = await projectApi.update(projectId, { customDomain: sanitized || null });
            setProject(data.project);
            setCustomDomain(data.project.customDomain || '');
            setToast({ type: 'success', message: 'Custom domain updated.' });
        } catch (err) {
            setToast({ type: 'error', message: err.error || 'Custom domain update failed. It may be in use.' });
        } finally {
            setSavingCustomDomain(false);
        }
    };

    /* ── Loading / error states ─ */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white">
                <Navbar variant="dashboard" />
                <div className="flex items-center justify-center pt-40">
                    <Loader2 className="size-6 animate-spin text-zinc-600" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#050505] text-white">
                <Navbar variant="dashboard" />
                <div className="flex flex-col items-center justify-center pt-40 gap-4">
                    <AlertTriangle className="size-8 text-zinc-600" />
                    <p className="text-zinc-400">Project not found.</p>
                    <Link to="/dashboard" className="text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const projectName = project.repoName?.split('/').pop() || 'Untitled';
    const isPro = user?.isPro === true;
    const hasSlugChanged = slug !== project.slug;
    const hasSubdomainChanged = subdomain !== (project.subdomain || '');

    const liveUrl = project.subdomain
        ? `https://${project.subdomain}.${APP_DOMAIN}`
        : `https://${APP_DOMAIN}/p/${project.slug}`;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar variant="dashboard" />


            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-[slideIn_0.2s_ease]">
                    <div className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl backdrop-blur-sm ${toast.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}>
                        {toast.message}
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-1.5 text-sm text-zinc-500 mb-8">
                    <Link to="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
                    <ChevronRight size={14} />
                    <span className="text-zinc-600">Projects</span>
                    <ChevronRight size={14} />
                    <span className="text-white font-medium truncate max-w-[200px]">{projectName}</span>
                </nav>

                {/* ── Page header ─ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight mb-1">{projectName}</h1>
                        <p className="text-sm text-zinc-500">Project settings and configuration</p>
                    </div>
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                        <ExternalLink size={14} />
                        View Live
                    </a>
                </div>

                {/* ── Layout: Sidebar + Content ── */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-56 shrink-0">
                        <nav className="flex md:flex-col gap-1">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${active
                                            ? 'bg-zinc-800/80 text-white'
                                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                                            }`}
                                    >
                                        <Icon size={16} className={active ? 'text-white' : 'text-zinc-600'} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>


                    <div className="flex-1 min-w-0">
                        {activeTab === 'general' && (
                            <GeneralTab
                                project={project}
                                user={user}
                                slug={slug}
                                setSlug={setSlug}
                                hasChanged={hasSlugChanged}
                                saving={saving}
                                onSave={handleSaveGeneral}
                            />
                        )}
                        {activeTab === 'domains' && (
                            <DomainsTab
                                project={project}
                                isPro={isPro}
                                subdomain={subdomain}
                                setSubdomain={setSubdomain}
                                hasChanged={hasSubdomainChanged}
                                saving={savingDomain}
                                onSave={handleSaveDomain}
                                customDomain={customDomain}
                                setCustomDomain={setCustomDomain}
                                hasCustomDomainChanged={customDomain !== (project.customDomain || '')}
                                savingCustomDomain={savingCustomDomain}
                                onSaveCustomDomain={handleSaveCustomDomain}
                            />
                        )}
                        {activeTab === 'history' && (
                            <HistoryTab project={project} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   § General Tab
   ═══════════════════════════════════════════════════════════════════ */
function GeneralTab({ project, user, slug, setSlug, hasChanged, saving, onSave }) {
    const projectName = project.repoName?.split('/').pop() || 'Untitled';
    const [copied, setCopied] = useState(false);

    const liveUrl = project.subdomain
        ? `https://${project.subdomain}.${APP_DOMAIN}`
        : `https://${APP_DOMAIN}/p/${project.slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(liveUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="space-y-8">
            {/* Project Info Card */}
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">Project Information</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Basic details about this project</p>
                </div>
                <div className="p-6 space-y-5">
                    {/* Project name — read-only */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Project Name</label>
                        <div className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center text-sm text-zinc-300">
                            {projectName}
                        </div>
                    </div>

                    {/* Repository */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Repository</label>
                        <a
                            href={`https://github.com/${project.repoName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-fit"
                        >
                            <ExternalLink size={13} />
                            {project.repoName}
                        </a>
                    </div>

                    {/* Live URL */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Live URL</label>
                        <div className="flex items-center gap-2">
                            <div className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center text-sm text-zinc-400 flex-1 min-w-0 truncate">
                                {liveUrl}
                            </div>
                            <button
                                onClick={handleCopy}
                                className="h-10 w-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors shrink-0"
                                title="Copy URL"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Template + Tech Stack */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Template</label>
                            <div className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center text-sm text-zinc-300 capitalize">
                                {project.template || 'modern'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Tech Stack</label>
                            <div className="h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center text-sm text-zinc-300">
                                {project.techstack || 'Other'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Slug Editor Card */}
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">URL Slug</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Change the public URL path for this project</p>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-zinc-600 whitespace-nowrap">{APP_DOMAIN}/p/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            className="flex-1 h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 text-sm text-white outline-none transition-colors"
                            placeholder="my-project-slug"
                        />
                    </div>
                    <p className="text-xs text-zinc-600 mb-4">
                        Only lowercase letters, numbers, and hyphens. At least 2 characters.
                    </p>
                </div>
                <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
                    <p className="text-xs text-zinc-600">
                        {hasChanged ? 'You have unsaved changes.' : 'No changes.'}
                    </p>
                    <button
                        onClick={onSave}
                        disabled={!hasChanged || saving}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </section>

            {/* Owner Card */}
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">Project Owner</h2>
                </div>
                <div className="p-6 flex items-center gap-4">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-zinc-700" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-400">
                            {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-white">
                            {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.githubUsername || 'Unknown'}
                        </p>
                        <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   § Domains Tab
   ═══════════════════════════════════════════════════════════════════ */
function DomainsTab({ project, isPro, subdomain, setSubdomain, hasChanged, saving, onSave, customDomain, setCustomDomain, savingCustomDomain, onSaveCustomDomain }) {
    return (
        <div className="space-y-8">
            {/* Subdomain Card */}
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">Custom Subdomain</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Host your docs at <span className="text-zinc-400">your-name.{APP_DOMAIN}</span>
                    </p>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            value={subdomain}
                            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="flex-1 h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 text-sm text-white outline-none transition-colors"
                            placeholder="my-project"
                        />
                        <span className="text-sm text-zinc-600 whitespace-nowrap">.{APP_DOMAIN}</span>
                    </div>

                    {project.subdomain && (
                        <p className="text-xs text-zinc-500 mb-4">
                            Currently live at{' '}
                            <a
                                href={`https://${project.subdomain}.${APP_DOMAIN}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white transition-colors underline underline-offset-2"
                            >
                                {project.subdomain}.{APP_DOMAIN}
                            </a>
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
                    <p className="text-xs text-zinc-600">
                        {hasChanged ? 'You have unsaved changes.' : 'No changes.'}
                    </p>
                    <button
                        onClick={onSave}
                        disabled={!hasChanged || saving}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Subdomain
                    </button>
                </div>
            </section>

            {/* DNS Info Card */}
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">How Subdomains Work</h2>
                </div>
                <div className="p-6 space-y-3 text-sm text-zinc-400">
                    <p>When you set a subdomain, your documentation becomes instantly accessible at <span className="text-zinc-300">your-name.{APP_DOMAIN}</span>.</p>
                    <p>Subdomains must be unique across all WHATDOC projects. Only lowercase letters, numbers, and hyphens are allowed.</p>
                </div>
            </section>

            {/* --- CUSTOM DOMAIN BLOCK --- */}
            <div className="mt-8 border border-zinc-800 bg-zinc-950/50 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">Custom Domain</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            BETA: TESTING MODE
                        </span>
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                        Host your engine on your own infrastructure. Connect a custom domain (e.g., <code className="text-emerald-400">docs.your-startup.com</code>).
                    </p>
                    <div className="flex items-start gap-2 p-3 rounded bg-emerald-500/5 border border-emerald-500/10">
                        <AlertTriangle className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-400/80 leading-relaxed">
                            Note: This feature is currently in a testing phase. Cloudflare SSL provisioning and DNS propagation can occasionally take up to 24 hours to stabilize.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="docs.example.com"
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            className="flex-1 h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                        />
                        <button
                            onClick={onSaveCustomDomain}
                            disabled={savingCustomDomain}
                            className="h-10 px-5 rounded-lg bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                        >
                            {savingCustomDomain ? 'Linking...' : 'Connect'}
                        </button>
                    </div>

                    {/* Terminal Instructions */}
                    {customDomain && (
                        <div className="mt-4 p-4 rounded bg-black border border-zinc-800 font-mono text-xs">
                            <p className="text-zinc-500 mb-2">// ACTION_REQUIRED: Update your DNS records</p>
                            <div className="grid grid-cols-[60px_1fr] gap-2 text-zinc-300">
                                <span className="text-emerald-500">TYPE</span> <span>CNAME</span>
                                <span className="text-emerald-500">NAME</span> <span>{customDomain.split('.')[0] || 'docs'}</span>
                                <span className="text-emerald-500">TARGET</span> <span>cname.whatdoc.xyz</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   § Version History Tab
   ═══════════════════════════════════════════════════════════════════ */
function HistoryTab({ project }) {
    const projectName = project.repoName?.split('/').pop() || 'Untitled';

    return (
        <div className="space-y-8">
            <section className="rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-800">
                    <h2 className="text-base font-semibold">Generation History</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Past documentation generations for {projectName}</p>
                </div>
                <div className="p-6">
                    {/* Vertical timeline */}
                    <div className="relative pl-8">
                        {/* Connector line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-800" />

                        <div className="space-y-6">
                            {MOCK_HISTORY.map((entry, idx) => {
                                const isSuccess = entry.status === 'success';
                                const dateObj = new Date(entry.date);
                                const dateStr = dateObj.toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', year: 'numeric',
                                });
                                const timeStr = dateObj.toLocaleTimeString('en-US', {
                                    hour: '2-digit', minute: '2-digit',
                                });

                                return (
                                    <div key={entry.id} className="relative flex items-start gap-4">
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-8 top-1 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center z-10 ${isSuccess
                                            ? 'border-emerald-500/50 bg-emerald-500/10'
                                            : 'border-red-500/50 bg-red-500/10'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'
                                                }`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pb-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="text-sm font-medium text-white">
                                                    {isSuccess ? 'Documentation generated' : 'Generation failed'}
                                                </p>
                                                {idx === 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500">
                                                {dateStr} at {timeStr} &middot; via {entry.model}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info banner */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4 flex items-start gap-3">
                <History size={16} className="text-zinc-600 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-500 leading-relaxed">
                    Version history tracking is automatic. Each time you regenerate documentation, a new entry is recorded. Rollback to previous versions is coming soon.
                </p>
            </div>
        </div>
    );
}
