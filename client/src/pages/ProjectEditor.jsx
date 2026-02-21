import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Loader2, AlertCircle, ArrowLeft, Save, Eye, PanelLeftClose,
    PanelLeft, Globe, Image, User, Tag, Rocket, Check, X,
    Settings2, FileText,
} from 'lucide-react';
import Logo from '../components/Logo';
import { project as projectApi } from '../lib/api';

// ── Template map (same as DocViewer) — used for live preview ────────
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import TwilioTemplate from '../templates/TwilioTemplate';
import DjangoTemplate from '../templates/DjangoTemplate';
import MDNTemplate from '../templates/MDNTemplate';
import AeroLatexTemplate from '../templates/AeroLatexTemplate';

const TemplateMap = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    twilio: TwilioTemplate,
    django: DjangoTemplate,
    mdn: MDNTemplate,
    aerolatex: AeroLatexTemplate,
};

// ── Toast notification ──────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            className={`
                fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-xl
                shadow-lg border text-sm font-medium
                animate-[slideIn_0.3s_ease]
                ${type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }
            `}
        >
            {type === 'success' ? <Check className="size-4" /> : <X className="size-4" />}
            {message}
        </div>
    );
}

// ── Field wrapper ───────────────────────────────────────────────────
function Field({ icon: Icon, label, children }) {
    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                {Icon && <Icon className="size-3" />}
                {label}
            </label>
            {children}
        </div>
    );
}

const inputClass =
    'w-full h-9 px-3 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all';

// ═════════════════════════════════════════════════════════════════════
export default function ProjectEditor() {
    const { projectId } = useParams();

    // ── Data state ──────────────────────────────────────────────────
    const [proj, setProj] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Editable fields ─────────────────────────────────────────────
    const [subdomain, setSubdomain] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [currentVersion, setCurrentVersion] = useState('1.0.0');
    const [upcomingVersion, setUpcomingVersion] = useState('');
    const [docs, setDocs] = useState('');

    // ── UI state ────────────────────────────────────────────────────
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(true);
    const [previewVisible, setPreviewVisible] = useState(true);
    const textareaRef = useRef(null);

    // ── Fetch project on mount ──────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const data = await projectApi.getById(projectId);
                const p = data.project;
                setProj(p);
                setSubdomain(p.subdomain || '');
                setLogoUrl(p.customization?.logoUrl || '');
                setOwnerName(p.customization?.ownerName || '');
                setCurrentVersion(p.customization?.currentVersion || '1.0.0');
                setUpcomingVersion(p.customization?.upcomingVersion || '');
                setDocs(p.generatedDocs || '');
            } catch (err) {
                setError(err.error || 'Failed to load project.');
            } finally {
                setLoading(false);
            }
        })();
    }, [projectId]);

    // ── Save handler ────────────────────────────────────────────────
    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            await projectApi.update(projectId, {
                subdomain,
                generatedDocs: docs,
                customization: { logoUrl, ownerName, currentVersion, upcomingVersion },
            });
            setToast({ message: 'Saved & deployed successfully!', type: 'success' });
        } catch (err) {
            setToast({ message: err.error || 'Save failed.', type: 'error' });
        } finally {
            setSaving(false);
        }
    }, [projectId, subdomain, docs, logoUrl, ownerName, currentVersion, upcomingVersion]);

    // ── Ctrl+S shortcut ─────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleSave]);

    // ── Build a synthetic project object for live preview ───────────
    const previewProject = proj
        ? {
              ...proj,
              subdomain,
              generatedDocs: docs,
              customization: { logoUrl, ownerName, currentVersion, upcomingVersion },
          }
        : null;

    // ── Loading ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-screen bg-[#0a0a0a] text-zinc-200 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-emerald-400" />
            </div>
        );
    }

    // ── Error ───────────────────────────────────────────────────────
    if (error || !proj) {
        return (
            <div className="h-screen bg-[#0a0a0a] text-zinc-200 flex flex-col items-center justify-center gap-4 px-4">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="size-5" />
                    <span className="text-lg font-medium">{error || 'Project not found.'}</span>
                </div>
                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="size-4" /> Back to dashboard
                </Link>
            </div>
        );
    }

    const PreviewTemplate = TemplateMap[proj.template] || TemplateMap.modern;

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-zinc-200 overflow-hidden">
            {/* ── Toast ──────────────────────────────────────────── */}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* ── Header bar ─────────────────────────────────────── */}
            <header className="shrink-0 h-12 flex items-center justify-between px-4 border-b border-zinc-800/60 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="size-4" />
                    </Link>
                    <Logo className="text-sm" />
                    <span className="text-zinc-700 select-none">/</span>
                    <span className="text-sm text-zinc-400 truncate max-w-[200px]">{proj.repoName}</span>
                    <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-mono uppercase tracking-wider">
                        Editor
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Toggle settings */}
                    <button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`p-2 rounded-lg transition-colors ${settingsOpen ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                        title="Toggle settings panel"
                    >
                        <Settings2 className="size-4" />
                    </button>

                    {/* Toggle preview */}
                    <button
                        onClick={() => setPreviewVisible(!previewVisible)}
                        className={`p-2 rounded-lg transition-colors ${previewVisible ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                        title="Toggle live preview"
                    >
                        <Eye className="size-4" />
                    </button>

                    <div className="h-5 w-px bg-zinc-800 mx-1" />

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 h-8 px-4 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Rocket className="size-3.5" />
                        )}
                        Save & Deploy
                    </button>
                </div>
            </header>

            {/* ── Split layout ───────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── LEFT PANEL ─────────────────────────────────── */}
                <div
                    className={`flex flex-col border-r border-zinc-800/60 transition-all duration-300 ${
                        previewVisible ? 'w-1/2' : 'w-full'
                    }`}
                >
                    {/* Settings drawer */}
                    {settingsOpen && (
                        <div className="shrink-0 border-b border-zinc-800/60 p-4 space-y-3 bg-zinc-950/50 animate-[slideDown_0.2s_ease]">
                            <div className="grid grid-cols-2 gap-3">
                                <Field icon={Globe} label="Subdomain">
                                    <div className="flex items-center rounded-lg bg-zinc-900/80 border border-zinc-700/50 overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                                        <input
                                            type="text"
                                            value={subdomain}
                                            onChange={(e) =>
                                                setSubdomain(
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9-]/g, '')
                                                        .replace(/-+/g, '-')
                                                )
                                            }
                                            placeholder="my-org"
                                            className="flex-1 h-9 px-3 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
                                        />
                                        <span className="pr-3 text-xs text-zinc-600 select-none">.whatdoc.xyz</span>
                                    </div>
                                </Field>

                                <Field icon={Image} label="Logo URL">
                                    <input
                                        type="text"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="https://…/logo.svg"
                                        className={inputClass}
                                    />
                                </Field>

                                <Field icon={User} label="Owner name">
                                    <input
                                        type="text"
                                        value={ownerName}
                                        onChange={(e) => setOwnerName(e.target.value)}
                                        placeholder="Acme Inc."
                                        className={inputClass}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-3">
                                    <Field icon={Tag} label="Version">
                                        <input
                                            type="text"
                                            value={currentVersion}
                                            onChange={(e) => setCurrentVersion(e.target.value)}
                                            placeholder="1.0.0"
                                            className={inputClass}
                                        />
                                    </Field>
                                    <Field icon={Rocket} label="Upcoming">
                                        <input
                                            type="text"
                                            value={upcomingVersion}
                                            onChange={(e) => setUpcomingVersion(e.target.value)}
                                            placeholder="2.0.0"
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Editor label */}
                    <div className="shrink-0 flex items-center gap-2 px-4 h-8 bg-zinc-950/60 border-b border-zinc-800/40 text-[10px] font-semibold tracking-widest uppercase text-zinc-600">
                        <FileText className="size-3" />
                        Markdown Editor
                        <span className="ml-auto text-zinc-700 font-mono normal-case tracking-normal">
                            {docs.length.toLocaleString()} chars
                        </span>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={docs}
                        onChange={(e) => setDocs(e.target.value)}
                        spellCheck={false}
                        className="flex-1 w-full resize-none bg-[#111] text-zinc-300 text-sm font-mono leading-relaxed p-5 outline-none placeholder-zinc-700 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
                        placeholder="# Your documentation markdown here…"
                    />
                </div>

                {/* ── RIGHT PANEL (Live Preview) ─────────────────── */}
                {previewVisible && (
                    <div className="w-1/2 overflow-hidden bg-zinc-950 flex flex-col">
                        {/* Preview label */}
                        <div className="shrink-0 flex items-center gap-2 px-4 h-8 bg-zinc-950/80 border-b border-zinc-800/40 text-[10px] font-semibold tracking-widest uppercase text-zinc-600">
                            <Eye className="size-3" />
                            Live Preview
                        </div>

                        {/* Rendered template */}
                        <div className="flex-1 overflow-auto">
                            <PreviewTemplate project={previewProject} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Keyframes ──────────────────────────────────────── */}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
