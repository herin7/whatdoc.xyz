import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Loader2, AlertCircle, ArrowLeft, Rocket, Check, X,
    Settings2, FileText, Sparkles, Globe, Image, User, Tag,
    PlaySquare, Eye, Palette, Type, Layout, Sliders, Trash2,
    ChevronDown, Plus, GripVertical, Monitor, Layers,
    RotateCcw, Copy, Paintbrush, Wand2, Keyboard,
    MousePointer2, CornerDownLeft, Zap, Hash, Beaker,
} from 'lucide-react';
import Logo from '../components/Logo';
import { project as projectApi } from '../lib/api';
import ApiPlayground from '../components/ApiPlayground';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    useEditor, EditorContent, NodeViewWrapper,
    mergeAttributes, Node, ReactNodeViewRenderer,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import TwilioTemplate from '../templates/TwilioTemplate';
import DjangoTemplate from '../templates/DjangoTemplate';
import MDNTemplate from '../templates/MDNTemplate';
import AeroLatexTemplate from '../templates/AeroLatexTemplate';
import FintechTemplate from '../templates/FintechTemplate';
import DevToolsTemplate from '../templates/DevToolsTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import OpenSourceTemplate from '../templates/OpenSourceTemplate';
import WikiTemplate from '../templates/WikiTemplate';
import ComponentLibTemplate from '../templates/ComponentLibTemplate';
import ConsumerTechTemplate from '../templates/ConsumerTechTemplate';
import DeepSpaceTemplate from '../templates/DeepSpaceTemplate';
import Web3Template from '../templates/Web3Template';
import EnterpriseTemplate from '../templates/EnterpriseTemplate';

const TemplateMap = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    twilio: TwilioTemplate,
    django: DjangoTemplate,
    mdn: MDNTemplate,
    aerolatex: AeroLatexTemplate,
    fintech: FintechTemplate,
    devtools: DevToolsTemplate,
    minimalist: MinimalistTemplate,
    opensource: OpenSourceTemplate,
    wiki: WikiTemplate,
    componentlib: ComponentLibTemplate,
    consumertech: ConsumerTechTemplate,
    deepspace: DeepSpaceTemplate,
    web3: Web3Template,
    enterprise: EnterpriseTemplate,
};

// ─
// CONSTANTS
// ─

const GOOGLE_FONTS = [
    { label: 'Playfair Display', value: 'Playfair+Display' },
    { label: 'Fraunces', value: 'Fraunces' },
    { label: 'DM Serif Display', value: 'DM+Serif+Display' },
    { label: 'Syne', value: 'Syne' },
    { label: 'Lora', value: 'Lora' },
    { label: 'Libre Baskerville', value: 'Libre+Baskerville' },
    { label: 'Cormorant', value: 'Cormorant' },
    { label: 'Space Mono', value: 'Space+Mono' },
    { label: 'Crimson Pro', value: 'Crimson+Pro' },
    { label: 'Source Serif 4', value: 'Source+Serif+4' },
];

const BODY_FONTS = [
    { label: 'DM Sans', value: 'DM+Sans' },
    { label: 'Nunito', value: 'Nunito' },
    { label: 'Manrope', value: 'Manrope' },
    { label: 'Plus Jakarta Sans', value: 'Plus+Jakarta+Sans' },
    { label: 'Outfit', value: 'Outfit' },
    { label: 'Figtree', value: 'Figtree' },
    { label: 'Work Sans', value: 'Work+Sans' },
    { label: 'Karla', value: 'Karla' },
];

const ALL_FONTS = [...GOOGLE_FONTS, ...BODY_FONTS];

const PRESET_THEMES = [
    { name: 'Emerald Dark', emoji: '🌿', primary: '#10b981', accent: '#065f46', bg: '#050505', surface: '#0f0f0f', text: '#e4e4e7', headingFont: 'Syne', bodyFont: 'Manrope', borderRadius: '12px', mode: 'dark' },
    { name: 'Django Green', emoji: '🌱', primary: '#44b78b', accent: '#0c4b33', bg: '#f8f8f8', surface: '#ffffff', text: '#333333', headingFont: 'Playfair+Display', bodyFont: 'DM+Sans', borderRadius: '8px', mode: 'light' },
    { name: 'Midnight Blue', emoji: '🌙', primary: '#818cf8', accent: '#312e81', bg: '#0d0d1a', surface: '#141428', text: '#e2e8f0', headingFont: 'Fraunces', bodyFont: 'Outfit', borderRadius: '16px', mode: 'dark' },
    { name: 'Warm Paper', emoji: '📜', primary: '#d97706', accent: '#92400e', bg: '#fefce8', surface: '#fffbeb', text: '#1c1917', headingFont: 'Cormorant', bodyFont: 'Karla', borderRadius: '6px', mode: 'light' },
    { name: 'Noir', emoji: '🎭', primary: '#f4f4f5', accent: '#a1a1aa', bg: '#000000', surface: '#0a0a0a', text: '#f4f4f5', headingFont: 'DM+Serif+Display', bodyFont: 'Work+Sans', borderRadius: '4px', mode: 'dark' },
    { name: 'Coral Bloom', emoji: '🌸', primary: '#f43f5e', accent: '#9f1239', bg: '#fff1f2', surface: '#ffe4e6', text: '#1c1917', headingFont: 'Lora', bodyFont: 'Figtree', borderRadius: '12px', mode: 'light' },
];

const BLOCK_TYPES = [
    { type: 'prose', label: 'Prose', icon: '📝', color: '#6366f1', description: 'Regular text & paragraphs', defaultContent: '## New Section\n\nStart writing your docs here. Use **bold**, *italic*, and `inline code`.' },
    { type: 'hero', label: 'Hero', icon: '🚀', color: '#10b981', description: 'Big title introduction', defaultContent: '## Getting Started\n\nWelcome to the documentation. This guide walks you through everything you need to know.' },
    { type: 'callout', label: 'Callout', icon: '💡', color: '#f59e0b', description: 'Tip, note, or warning', defaultContent: '## Important Note\n\n> **Note:** This is an important callout. Use it to highlight critical information for your readers.' },
    { type: 'code', label: 'Code', icon: '💻', color: '#8b5cf6', description: 'Code examples & snippets', defaultContent: '## Code Example\n\n```javascript\nconst response = await fetch(\'/api/v1/users\');\nconst data = await response.json();\nconsole.log(data);\n```' },
    { type: 'api', label: 'API', icon: '⚡', color: '#06b6d4', description: 'Live interactive endpoint', defaultContent: '' },
];

const SPACING_OPTIONS = [
    { label: 'Tight', value: '16px', desc: '16px' },
    { label: 'Normal', value: '24px', desc: '24px' },
    { label: 'Airy', value: '40px', desc: '40px' },
    { label: 'Open', value: '64px', desc: '64px' },
];

const DEFAULT_THEME = {
    primary: '#10b981', accent: '#065f46', bg: '#050505', surface: '#0f0f0f',
    text: '#e4e4e7', headingFont: 'Syne', bodyFont: 'Manrope',
    borderRadius: '12px', sectionSpacing: '40px', mode: 'dark',
};

// ─
// UTILITIES
// ─

function loadGoogleFont(v) {
    if (!v) return;
    const id = `gfont-${v}`;
    if (document.getElementById(id)) return;
    const l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${v}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(l);
}

function injectThemeCss(t) {
    let el = document.getElementById('wd-theme');
    if (!el) { el = document.createElement('style'); el.id = 'wd-theme'; document.head.appendChild(el); }
    const h = ALL_FONTS.find(f => f.value === t.headingFont)?.label || t.headingFont;
    const b = ALL_FONTS.find(f => f.value === t.bodyFont)?.label || t.bodyFont;
    el.textContent = `:root{--wd-primary:${t.primary};--wd-accent:${t.accent};--wd-bg:${t.bg};--wd-surface:${t.surface};--wd-text:${t.text};--wd-radius:${t.borderRadius};--wd-spacing:${t.sectionSpacing || '40px'};--wd-hfont:'${h}',serif;--wd-bfont:'${b}',sans-serif;}`;
}

function parseSections(md) {
    if (!md) return [];
    const lines = md.split('\n');
    const secs = []; let cur = null;
    for (const line of lines) {
        const m = line.match(/^## (.+)/);
        if (m) { if (cur) secs.push(cur); cur = { id: `s-${Date.now()}-${Math.random()}`, title: m[1].trim(), content: '' }; }
        else if (cur) cur.content += line + '\n';
        else if (!secs.length && !cur) cur = { id: `intro-${Date.now()}`, title: 'Introduction', content: line + '\n' };
    }
    if (cur) secs.push(cur);
    return secs.map(s => ({ ...s, content: s.content.trimEnd() })).filter(s => s.content);
}

// ─
// MICRO-COMPONENTS
// ─

// Keyboard badge
function Kbd({ children }) {
    return <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/8 border border-white/15 text-[9px] font-mono text-zinc-400 leading-none">{children}</kbd>;
}

// Tooltip wrapper
function Tip({ label, shortcut, children, side = 'bottom' }) {
    const [show, setShow] = useState(false);
    const posClass = side === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : side === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : side === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : 'left-full ml-2 top-1/2 -translate-y-1/2';
    return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className={`absolute ${posClass} z-[600] pointer-events-none animate-[tipIn_0.15s_ease]`}>
                    <div className="flex items-center gap-2 bg-zinc-800/95 backdrop-blur-xl border border-zinc-700/60 rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap">
                        <span className="text-xs text-zinc-200 font-medium">{label}</span>
                        {shortcut && <Kbd>{shortcut}</Kbd>}
                    </div>
                </div>
            )}
        </div>
    );
}

// Auto-dismiss toast
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    const [prog, setProg] = useState(100);
    useEffect(() => {
        const start = Date.now();
        const raf = () => { setProg(Math.max(0, 100 - ((Date.now() - start) / 4000) * 100)); requestAnimationFrame(raf); };
        const id = requestAnimationFrame(raf);
        return () => cancelAnimationFrame(id);
    }, []);
    return (
        <div className={`fixed top-5 right-5 z-[700] rounded-2xl shadow-2xl overflow-hidden animate-[toastSlide_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both] ${type === 'success' ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-900 border border-red-500/30'}`} style={{ minWidth: 280 }}>
            <div className="flex items-center gap-3 px-4 py-3.5">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/25' : 'bg-red-500/15 border border-red-500/25'}`}>
                    {type === 'success' ? <Check className="size-3.5 text-emerald-400" /> : <X className="size-3.5 text-red-400" />}
                </div>
                <span className="text-sm font-semibold text-zinc-100">{message}</span>
                <button onClick={onClose} className="ml-auto text-zinc-600 hover:text-zinc-300 transition-colors"><X className="size-3.5" /></button>
            </div>
            <div className="h-0.5 bg-zinc-800">
                <div className={`h-full transition-none ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${prog}%` }} />
            </div>
        </div>
    );
}

// Color picker with swatch history
function ColorPickerPopover({ color, onChange, label }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [history, setHistory] = useState(['#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#fff', '#000']);
    useEffect(() => {
        const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    const safe = color?.startsWith('#') ? color : '#000000';
    const handleChange = (c) => { onChange(c); setHistory(prev => [c, ...prev.filter(x => x !== c)].slice(0, 8)); };
    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2.5 w-full h-9 px-3 rounded-xl bg-[#141414] border border-zinc-800 hover:border-zinc-600 transition-all group">
                <div className="w-5 h-5 rounded-lg flex-shrink-0 ring-2 ring-white/8 shadow-inner" style={{ background: safe }} />
                <span className="text-xs text-zinc-400 font-mono flex-1 text-left group-hover:text-zinc-200 transition-colors">{safe}</span>
                <ChevronDown className={`size-3 text-zinc-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-11 left-0 z-[500] bg-[#0f0f0f] border border-zinc-800 rounded-2xl shadow-2xl p-4 w-60 animate-[fadeUp_0.18s_cubic-bezier(0.34,1.56,0.64,1)]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">{label}</p>
                    <div style={{ borderRadius: 12, overflow: 'hidden' }}>
                        <HexColorPicker color={safe} onChange={handleChange} style={{ width: '100%', height: 180 }} />
                    </div>
                    <div className="flex items-center gap-2 mt-3 bg-[#1a1a1a] rounded-xl px-3 h-9 border border-zinc-800 focus-within:border-zinc-600 transition-all">
                        <Hash className="size-3 text-zinc-600 flex-shrink-0" />
                        <HexColorInput color={safe} onChange={handleChange} className="flex-1 bg-transparent text-sm text-zinc-200 outline-none font-mono" prefixed={false} />
                    </div>
                    <div className="mt-3">
                        <p className="text-[9px] text-zinc-700 uppercase tracking-widest mb-2">Recent</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {history.map((c, i) => (
                                <button key={i} onClick={() => handleChange(c)} className="w-6 h-6 rounded-lg ring-2 ring-transparent hover:ring-white/20 transition-all hover:scale-110 flex-shrink-0" style={{ background: c, border: '1px solid rgba(255,255,255,0.08)' }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─
// INSPECTOR PRIMITIVES
// ─

function Field({ icon: Icon, label, children, hint }) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {Icon && <Icon className="size-3" />}{label}
                </label>
                {hint && <span className="text-[9px] text-zinc-700">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

const inputClass = 'w-full h-9 px-3 rounded-xl bg-[#141414] border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-700 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-white/5 transition-all';
const selectClass = 'w-full h-9 px-3 rounded-xl bg-[#141414] border border-zinc-800 text-sm text-zinc-100 outline-none focus:border-zinc-600 transition-all appearance-none cursor-pointer';

function InspSection({ title, icon: Icon, children, accent = '#10b981', defaultOpen = true }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-zinc-900/80 last:border-0">
            <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-3 group hover:bg-white/2 transition-colors">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {Icon && <Icon className="size-3" style={{ color: open ? accent : undefined }} />}{title}
                </span>
                <ChevronDown className={`size-3 text-zinc-700 transition-all duration-200 ${open ? '' : '-rotate-90'}`} />
            </button>
            {open && <div className="px-4 pb-5 space-y-3 animate-[sectionFade_0.15s_ease]">{children}</div>}
        </div>
    );
}

function FontSelector({ value, onChange, options }) {
    return (
        <div className="relative">
            <select value={value} onChange={e => { onChange(e.target.value); loadGoogleFont(e.target.value); }} className={selectClass}>
                {options.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3 text-zinc-600 pointer-events-none" />
        </div>
    );
}

// ─
// FLOATING BLOCK TOOLBAR — appears above selected block (Figma-style)
// ─

function FloatingToolbar({ block, onDuplicate, onDelete, onTypeChange }) {
    return (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 animate-[toolbarPop_0.2s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <div className="flex items-center gap-0.5 bg-[#111]/96 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/60">
                {/* Type switcher icons */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-zinc-800">
                    {BLOCK_TYPES.map(bt => (
                        <Tip key={bt.type} label={bt.label} side="top">
                            <button
                                onClick={() => onTypeChange(bt.type)}
                                className={`w-8 h-7 rounded-xl text-base flex items-center justify-center transition-all duration-150 ${block.type === bt.type ? 'bg-zinc-800 shadow-inner' : 'hover:bg-zinc-800/60 opacity-40 hover:opacity-100'}`}
                            >
                                {bt.icon}
                            </button>
                        </Tip>
                    ))}
                </div>
                {/* Actions */}
                <Tip label="Duplicate" shortcut="D" side="top">
                    <button onClick={onDuplicate} className="w-8 h-7 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all ml-0.5">
                        <Copy className="size-3.5" />
                    </button>
                </Tip>
                <Tip label="Delete" shortcut="⌫" side="top">
                    <button onClick={onDelete} className="w-8 h-7 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all">
                        <Trash2 className="size-3.5" />
                    </button>
                </Tip>
            </div>
        </div>
    );
}

// ─
// TIPTAP NODE — API PLAYGROUND
// ─

const ApiPlaygroundComponent = props => {
    let config = {};
    try { config = JSON.parse(props.node.attrs.configJson); } catch (_) { }
    return (
        <NodeViewWrapper className={`my-6 border rounded-2xl overflow-hidden transition-all ${props.selected ? 'border-cyan-500/40 shadow-[0_0_24px_rgba(6,182,212,0.12)]' : 'border-zinc-800/60'}`} contentEditable={false}>
            <div className="bg-zinc-900/60 px-4 py-2.5 border-b border-zinc-800/60 flex items-center gap-2.5">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-green-500/50" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/8 px-2 py-0.5 rounded-full border border-cyan-500/20">⚡ API Block</span>
                <div className="ml-auto cursor-grab active:cursor-grabbing" data-drag-handle><GripVertical className="size-3.5 text-zinc-700" /></div>
            </div>
            <div className="pointer-events-none bg-[#060606]"><ApiPlayground config={config} /></div>
        </NodeViewWrapper>
    );
};

const ApiPlaygroundNode = Node.create({
    name: 'apiPlayground', group: 'block', atom: true, selectable: true, draggable: true,
    addAttributes() { return { configJson: { default: JSON.stringify({ method: 'GET', endpoint: '/v1/users', description: 'Fetch users', headers: [{ key: 'Authorization', value: 'Bearer token', required: true }], params: [{ key: 'limit', value: '10', required: false }], body: '', responseSchema: '{\n  "users": []\n}' }), parseHTML: el => el.getAttribute('data-config'), renderHTML: a => ({ 'data-config': a.configJson }) } }; },
    parseHTML() { return [{ tag: 'api-playground' }]; },
    renderHTML({ HTMLAttributes }) { return ['api-playground', mergeAttributes(HTMLAttributes)]; },
    addNodeView() { return ReactNodeViewRenderer(ApiPlaygroundComponent); },
});

// ─
// SORTABLE BLOCK CARD
// ─

function SortableBlockCard({ block, isSelected, onSelect, onDelete, onDuplicate, onUpdate, onTypeChange, theme }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const style = { transform: CSS.Transform.toString(transform), transition: isDragging ? 'none' : transition, opacity: isDragging ? 0 : 1 };
    const blockDef = BLOCK_TYPES.find(b => b.type === block.type);

    const editor = useEditor({
        extensions: [StarterKit, Markdown.configure({ html: true, transformPastedText: true })],
        content: block.content,
        editorProps: { attributes: { class: 'outline-none min-h-[56px] focus:outline-none' } },
        onUpdate: ({ editor }) => { onUpdate(block.id, { content: editor.storage.markdown.getMarkdown() }); },
    });

    const blockStyle = {
        backgroundColor: block.bgColor || 'transparent',
        borderRadius: block.borderRadius || theme.borderRadius || '12px',
        padding: block.padding || '24px',
        borderLeft: block.type === 'callout' ? `3px solid ${blockDef?.color || theme.primary}` : undefined,
        background: block.type === 'hero' && !block.bgColor
            ? `radial-gradient(ellipse at 50% 0%, ${theme.primary}08 0%, transparent 70%)`
            : block.bgColor || 'transparent',
    };

    return (
        <div ref={setNodeRef} style={style} className="group/card relative mb-4 select-none">
            {/* Floating toolbar above selected block */}
            {isSelected && (
                <FloatingToolbar
                    block={block}
                    onDuplicate={() => onDuplicate(block.id)}
                    onDelete={() => onDelete(block.id)}
                    onTypeChange={t => onTypeChange(block.id, t)}
                />
            )}

            {/* Drag handle — left gutter */}
            <div className={`absolute -left-9 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all duration-150 ${isSelected || 'opacity-0 group-hover/card:opacity-60'}`}>
                <Tip label="Drag to reorder" side="left">
                    <button {...listeners} {...attributes} className="p-1.5 rounded-xl bg-[#111] border border-zinc-800 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                        <GripVertical className="size-3.5" />
                    </button>
                </Tip>
            </div>

            {/* Card surface */}
            <div
                onClick={() => onSelect(block.id)}
                className={`relative cursor-pointer rounded-[13px] transition-all duration-200 ${isSelected
                    ? 'ring-2 ring-emerald-500/35 ring-offset-4 ring-offset-[#0c0c0c]'
                    : 'hover:ring-1 hover:ring-zinc-700/50 hover:ring-offset-2 hover:ring-offset-[#0c0c0c]'
                    }`}
            >
                {/* Accent line top when selected */}
                {isSelected && (
                    <div className="absolute top-0 left-4 right-4 h-px rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${blockDef?.color || theme.primary}, transparent)` }} />
                )}

                {/* Block type chip */}
                <div className={`absolute top-3 right-3 transition-all duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-70'}`}>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border" style={{ background: `${blockDef?.color || '#10b981'}10`, borderColor: `${blockDef?.color || '#10b981'}25`, color: blockDef?.color || '#10b981' }}>
                        <span>{blockDef?.icon}</span> {blockDef?.label}
                    </div>
                </div>

                <div style={blockStyle} className={block.type === 'hero' ? 'text-center' : ''}>
                    {block.type === 'api' ? (
                        <div className="text-center py-10 rounded-xl border border-dashed border-zinc-800/60 bg-zinc-950/30">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/8 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                                <Zap className="size-5 text-cyan-400" />
                            </div>
                            <p className="text-sm font-semibold text-zinc-300">API Playground</p>
                            <p className="text-xs text-zinc-600 mt-1">Select → configure in Inspector</p>
                        </div>
                    ) : (
                        <div className="tiptap-block-editor" style={{ fontFamily: 'var(--wd-bfont)', color: 'var(--wd-text)' }}>
                            <EditorContent editor={editor} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─
// DRAG GHOST
// ─

function DragGhost({ block }) {
    const def = BLOCK_TYPES.find(b => b.type === block?.type);
    const title = block?.content?.match(/^#+\s+(.+)/m)?.[1] || def?.label || 'Block';
    return (
        <div className="flex items-center gap-3 bg-[#111]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-500/10 w-56 rotate-2 scale-105 animate-none">
            <span className="text-2xl">{def?.icon || '📄'}</span>
            <div><p className="text-sm font-bold text-white truncate">{title}</p><p className="text-xs mt-0.5" style={{ color: def?.color || '#10b981' }}>{def?.label}</p></div>
        </div>
    );
}

// ─
// ADD BLOCK PANEL — Canva-style, beautiful
// ─

function AddBlockPanel({ onAdd, onClose }) {
    const [hovered, setHovered] = useState(null);
    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-lg animate-[fadeIn_0.2s_ease]" />
            <div
                className="relative bg-[#0d0d0d] border border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg mx-4 animate-[panelUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-zinc-900">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-base font-bold text-white tracking-tight">Add a block</h2>
                            <p className="text-xs text-zinc-600 mt-0.5">Choose a content type to add to your docs</p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                            <X className="size-4" />
                        </button>
                    </div>
                </div>

                {/* Block grid */}
                <div className="p-4 grid grid-cols-1 gap-1.5">
                    {BLOCK_TYPES.map((bt, i) => (
                        <button
                            key={bt.type}
                            onMouseEnter={() => setHovered(bt.type)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => { onAdd(bt); onClose(); }}
                            className="flex items-center gap-4 p-3.5 rounded-2xl border text-left group transition-all duration-200 animate-[itemFade_0.3s_ease_both]"
                            style={{
                                animationDelay: `${i * 45}ms`,
                                borderColor: hovered === bt.type ? `${bt.color}35` : 'rgba(255,255,255,0.04)',
                                background: hovered === bt.type ? `${bt.color}08` : 'transparent',
                            }}
                        >
                            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200 group-hover:scale-110" style={{ background: `${bt.color}12`, border: `1px solid ${bt.color}22` }}>
                                {bt.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{bt.label}</p>
                                <p className="text-xs text-zinc-600 mt-0.5">{bt.description}</p>
                            </div>
                            <div className={`transition-all duration-200 ${hovered === bt.type ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                                <CornerDownLeft className="size-4" style={{ color: bt.color }} />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="px-6 pb-5 pt-1 flex items-center justify-center gap-2">
                    <span className="text-[10px] text-zinc-700">Press</span>
                    <Kbd>Esc</Kbd>
                    <span className="text-[10px] text-zinc-700">to close</span>
                </div>
            </div>
        </div>
    );
}

// ─
// KEYBOARD SHORTCUTS MODAL
// ─

function ShortcutsModal({ onClose }) {
    const groups = [
        { label: 'Global', items: [['⌘ S', 'Save & Deploy'], ['?', 'Show shortcuts'], ['Esc', 'Deselect / Close']] },
        { label: 'Block', items: [['D', 'Duplicate block'], ['⌫', 'Delete block'], ['↑ ↓', 'Navigate blocks']] },
    ];
    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease]" />
            <div className="relative bg-[#0d0d0d] border border-zinc-800 rounded-3xl p-6 w-80 shadow-2xl animate-[panelUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Keyboard className="size-4 text-emerald-400" /> Keyboard shortcuts</h3>
                    <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors"><X className="size-4" /></button>
                </div>
                {groups.map(g => (
                    <div key={g.label} className="mb-5 last:mb-0">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 mb-3">{g.label}</p>
                        <div className="space-y-2.5">
                            {g.items.map(([key, desc]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-zinc-400">{desc}</span>
                                    <Kbd>{key}</Kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─
// LIVE PREVIEW
// ─

function LivePreview({ blocks, theme, proj, subdomain, logoUrl, ownerName, currentVersion, upcomingVersion }) {
    const generatedDocs = blocks.map(b => b.content).join('\n\n');
    const previewProject = { ...proj, subdomain, generatedDocs, customization: { ...(proj.customization || {}), logoUrl, ownerName, currentVersion, upcomingVersion, theme } };
    const PreviewTemplate = TemplateMap[proj.template] || TemplateMap.modern;
    return (
        <div className="h-full overflow-auto relative" style={{ transform: 'scale(1)' }}>
            <PreviewTemplate project={previewProject} />
        </div>
    );
}

// ─
// AUTO-SAVE INDICATOR
// ─

function SaveIndicator({ saving, lastSaved }) {
    if (saving) return (
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Loader2 className="size-3 animate-spin" />Saving…
        </div>
    );
    if (lastSaved) return (
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 animate-[fadeIn_0.3s_ease]">
            <Check className="size-3 text-emerald-500" />Saved {lastSaved}
        </div>
    );
    return null;
}

// ─
// MAIN COMPONENT
// ─

export default function BetaProjectEditor() {
    const { projectId } = useParams();

    const [proj, setProj] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [subdomain, setSubdomain] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [currentVersion, setCurrentVersion] = useState('1.0.0');
    const [upcomingVersion, setUpcomingVersion] = useState('');

    const [theme, setTheme] = useState(DEFAULT_THEME);
    const [blocks, setBlocks] = useState([]);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [toast, setToast] = useState(null);
    const [inspectorOpen, setInspectorOpen] = useState(true);
    const [viewMode, setViewMode] = useState('split');
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [inspectorTab, setInspectorTab] = useState('block');
    const [showShortcuts, setShowShortcuts] = useState(false);
    // Theme preset hover preview
    const [hoveredPreset, setHoveredPreset] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const selectedBlock = useMemo(() => blocks.find(b => b.id === selectedBlockId) || null, [blocks, selectedBlockId]);
    const activeBlock = useMemo(() => blocks.find(b => b.id === activeId) || null, [blocks, activeId]);

    useEffect(() => { loadGoogleFont(theme.headingFont); loadGoogleFont(theme.bodyFont); injectThemeCss(theme); }, [theme]);

    const updateTheme = useCallback(p => setTheme(prev => ({ ...prev, ...p })), []);
    const updateBlock = useCallback((id, p) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...p } : b)), []);

    const duplicateBlock = useCallback((id) => {
        const copy = { ...blocks.find(b => b.id === id), id: `block-${Date.now()}` };
        const idx = blocks.findIndex(b => b.id === id);
        setBlocks(prev => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
        setSelectedBlockId(copy.id);
    }, [blocks]);

    const deleteBlock = useCallback((id) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
        setSelectedBlockId(s => s === id ? null : s);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const h = e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); return; }
            if (e.key === 'Escape') { setSelectedBlockId(null); setShowAddBlock(false); setShowShortcuts(false); return; }
            if (e.key === '?') { setShowShortcuts(v => !v); return; }
            if (!selectedBlockId || e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
            if (e.key === 'd') duplicateBlock(selectedBlockId);
            if (e.key === 'Delete' || e.key === 'Backspace') deleteBlock(selectedBlockId);
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [selectedBlockId, duplicateBlock, deleteBlock]);

    useEffect(() => {
        if (!projectId) { setError('Invalid project ID.'); setLoading(false); return; }
        (async () => {
            try {
                const { project: p } = await projectApi.getById(projectId);
                setProj(p);
                setSubdomain(p.subdomain || '');
                setLogoUrl(p.customization?.logoUrl || '');
                setOwnerName(p.customization?.ownerName || '');
                setCurrentVersion(p.customization?.currentVersion || '1.0.0');
                setUpcomingVersion(p.customization?.upcomingVersion || '');
                if (p.customization?.theme) { const s = { ...DEFAULT_THEME, ...p.customization.theme }; setTheme(s); loadGoogleFont(s.headingFont); loadGoogleFont(s.bodyFont); }
                const md = p.generatedDocs || '# Documentation\n\nWelcome to your docs.';
                const parsed = parseSections(md);
                setBlocks(parsed.length > 0
                    ? parsed.map(s => ({ id: `block-${Date.now()}-${Math.random()}`, type: 'prose', content: `## ${s.title}\n\n${s.content}`, bgColor: '', padding: '24px', borderRadius: DEFAULT_THEME.borderRadius }))
                    : [{ id: `block-${Date.now()}`, type: 'prose', content: md, bgColor: '', padding: '24px', borderRadius: DEFAULT_THEME.borderRadius }]
                );
            } catch (err) { setError(err.error || 'Failed to load project.'); }
            finally { setLoading(false); }
        })();
    }, [projectId]);

    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            await projectApi.update(projectId, { subdomain, generatedDocs: blocks.map(b => b.content).join('\n\n'), customization: { logoUrl, ownerName, currentVersion, upcomingVersion, theme } });
            setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setToast({ message: 'Saved & deployed successfully!', type: 'success' });
        } catch (err) { setToast({ message: err.error || 'Save failed.', type: 'error' }); }
        finally { setSaving(false); }
    }, [projectId, subdomain, logoUrl, ownerName, currentVersion, upcomingVersion, theme, blocks]);

    const handleAddBlock = bt => {
        const nb = { id: `block-${Date.now()}`, type: bt.type, content: bt.defaultContent, bgColor: '', padding: '24px', borderRadius: theme.borderRadius };
        setBlocks(prev => [...prev, nb]);
        setSelectedBlockId(nb.id);
        setInspectorTab('block');
    };

    // ── Loading / Error states
    if (loading) return (
        <div className="h-screen bg-[#080808] flex items-center justify-center">
            <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="size-7 animate-spin text-emerald-400" /></div>
                </div>
                <p className="text-sm font-semibold text-zinc-300">Opening editor</p>
                <p className="text-xs text-zinc-700 mt-1">Preparing your workspace…</p>
            </div>
        </div>
    );

    if (error || !proj) return (
        <div className="h-screen bg-[#080808] flex flex-col items-center justify-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/8 border border-red-500/20 flex items-center justify-center"><AlertCircle className="size-6 text-red-400" /></div>
            <div className="text-center"><p className="font-semibold text-red-400">{error || 'Project not found'}</p><p className="text-xs text-zinc-700 mt-1">Check the URL or go back to dashboard</p></div>
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800"><ArrowLeft className="size-4" /> Dashboard</Link>
        </div>
    );

    // 
    // INSPECTOR PANELS
    // 

    const BlockInspector = () => {
        if (!selectedBlock) return (
            <div className="flex flex-col items-center justify-center min-h-[220px] p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-zinc-900 flex items-center justify-center mx-auto mb-4">
                    <MousePointer2 className="size-6 text-zinc-700" />
                </div>
                <p className="text-sm font-semibold text-zinc-400">Nothing selected</p>
                <p className="text-xs text-zinc-700 mt-1.5 leading-relaxed max-w-[180px]">Click any block on the canvas to edit its properties</p>
                <button onClick={() => setShowShortcuts(true)} className="mt-5 flex items-center gap-1.5 text-[10px] text-zinc-700 hover:text-zinc-400 transition-colors">
                    <Keyboard className="size-3" /> View shortcuts
                </button>
            </div>
        );

        const def = BLOCK_TYPES.find(b => b.type === selectedBlock.type);
        return (
            <div>
                {/* Block header */}
                <div className="px-4 py-3.5 border-b border-zinc-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${def?.color}12`, border: `1px solid ${def?.color}22` }}>
                        {def?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white capitalize">{selectedBlock.type} block</p>
                        <p className="text-[10px] text-zinc-700 font-mono mt-0.5">id:{selectedBlock.id.slice(-6)}</p>
                    </div>
                    <Tip label="Delete block" shortcut="⌫" side="left">
                        <button onClick={() => deleteBlock(selectedBlockId)} className="p-1.5 rounded-xl text-zinc-700 hover:text-red-400 hover:bg-red-500/8 transition-all">
                            <Trash2 className="size-3.5" />
                        </button>
                    </Tip>
                </div>

                <InspSection title="Appearance" icon={Paintbrush} accent="#10b981">
                    <Field label="Background color" hint="transparent = inherit page bg">
                        <ColorPickerPopover color={selectedBlock.bgColor || '#000000'} onChange={c => updateBlock(selectedBlockId, { bgColor: c })} label="Block background" />
                    </Field>
                    <button onClick={() => updateBlock(selectedBlockId, { bgColor: '' })} className="text-[11px] text-zinc-700 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <RotateCcw className="size-3" /> Reset to transparent
                    </button>
                </InspSection>

                <InspSection title="Block type" icon={Layers}>
                    <div className="grid grid-cols-5 gap-1.5">
                        {BLOCK_TYPES.map(bt => (
                            <Tip key={bt.type} label={bt.label} side="top">
                                <button
                                    onClick={() => updateBlock(selectedBlockId, { type: bt.type })}
                                    className={`h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-150 hover:scale-110 ${selectedBlock.type === bt.type ? 'ring-2 scale-110' : 'bg-[#141414] hover:bg-zinc-800'}`}
                                    style={selectedBlock.type === bt.type ? { background: `${bt.color}12`, ringColor: bt.color } : {}}
                                >
                                    {bt.icon}
                                </button>
                            </Tip>
                        ))}
                    </div>
                </InspSection>

                <InspSection title="Spacing" icon={Sliders}>
                    <Field label="Padding" hint="inner spacing">
                        <div className="grid grid-cols-3 gap-1.5">
                            {['0px', '12px', '24px', '40px', '56px', '80px'].map(p => (
                                <button key={p} onClick={() => updateBlock(selectedBlockId, { padding: p })} className={`h-8 text-xs rounded-xl border font-mono transition-all ${selectedBlock.padding === p ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-[#141414] border-zinc-800 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700'}`}>
                                    {p.replace('px', '') || '0'}
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Corner radius">
                        <div className="grid grid-cols-4 gap-1.5">
                            {[['□', '0px'], ['▢', '8px'], ['▣', '14px'], ['●', '22px']].map(([l, v]) => (
                                <button key={v} onClick={() => updateBlock(selectedBlockId, { borderRadius: v })} className={`h-8 text-sm rounded-xl border transition-all ${selectedBlock.borderRadius === v ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-[#141414] border-zinc-800 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </Field>
                </InspSection>

                <div className="px-4 pb-5 pt-3">
                    <Tip label="Duplicate this block" shortcut="D" side="top">
                        <button onClick={() => duplicateBlock(selectedBlockId)} className="w-full h-9 rounded-xl border border-zinc-800 text-zinc-500 text-xs font-semibold hover:text-white hover:border-zinc-700 hover:bg-white/3 transition-all flex items-center justify-center gap-2">
                            <Copy className="size-3.5" /> Duplicate Block
                        </button>
                    </Tip>
                </div>
            </div>
        );
    };

    const ThemeInspector = () => {
        const previewTheme = hoveredPreset ? { ...DEFAULT_THEME, ...hoveredPreset } : null;
        return (
            <div>
                <InspSection title="Style presets" icon={Wand2} accent="#8b5cf6">
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_THEMES.map((preset, i) => (
                            <button
                                key={preset.name}
                                onMouseEnter={() => setHoveredPreset(preset)}
                                onMouseLeave={() => setHoveredPreset(null)}
                                onClick={() => {
                                    const { name, emoji, ...d } = preset;
                                    const t = { ...DEFAULT_THEME, ...d, sectionSpacing: theme.sectionSpacing };
                                    setTheme(t); loadGoogleFont(t.headingFont); loadGoogleFont(t.bodyFont);
                                }}
                                className="relative overflow-hidden rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-98 animate-[itemFade_0.3s_ease_both]"
                                style={{ background: preset.bg, borderColor: `${preset.primary}28`, animationDelay: `${i * 35}ms` }}
                            >
                                <div className="p-3">
                                    <div className="text-xl mb-2">{preset.emoji}</div>
                                    <p className="text-[11px] font-bold truncate" style={{ color: preset.primary }}>{preset.name}</p>
                                    <div className="flex gap-1.5 mt-2">
                                        <div className="w-3 h-3 rounded-full ring-1 ring-white/8" style={{ background: preset.primary }} />
                                        <div className="w-3 h-3 rounded-full ring-1 ring-white/8" style={{ background: preset.accent }} />
                                        <div className="w-3 h-3 rounded-full ring-1 ring-white/8" style={{ background: preset.surface }} />
                                    </div>
                                </div>
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(ellipse at 50% 0%, ${preset.primary}15, transparent 70%)` }} />
                            </button>
                        ))}
                    </div>
                    {hoveredPreset && (
                        <div className="mt-3 px-3 py-2.5 rounded-xl border text-xs font-medium animate-[fadeIn_0.1s_ease]" style={{ background: `${hoveredPreset.primary}08`, borderColor: `${hoveredPreset.primary}20`, color: hoveredPreset.primary }}>
                            Click to apply "{hoveredPreset.name}" →
                        </div>
                    )}
                </InspSection>

                <InspSection title="Colors" icon={Palette} accent="#f43f5e">
                    {[['primary', 'Primary / Brand'], ['accent', 'Accent'], ['bg', 'Page Background'], ['surface', 'Card / Surface'], ['text', 'Body Text']].map(([k, l]) => (
                        <Field key={k} label={l}><ColorPickerPopover color={theme[k]} onChange={c => updateTheme({ [k]: c })} label={l} /></Field>
                    ))}
                </InspSection>

                <InspSection title="Typography" icon={Type} accent="#6366f1">
                    <Field label="Heading font">
                        <FontSelector value={theme.headingFont} onChange={v => updateTheme({ headingFont: v })} options={GOOGLE_FONTS} />
                        <div className="mt-2 px-3 py-2 rounded-xl bg-[#141414] border border-zinc-900 text-sm truncate" style={{ fontFamily: `'${ALL_FONTS.find(f => f.value === theme.headingFont)?.label || theme.headingFont}', serif`, color: theme.primary }}>
                            The quick brown fox
                        </div>
                    </Field>
                    <Field label="Body font">
                        <FontSelector value={theme.bodyFont} onChange={v => updateTheme({ bodyFont: v })} options={BODY_FONTS} />
                        <div className="mt-2 px-3 py-2.5 rounded-xl bg-[#141414] border border-zinc-900 text-xs leading-relaxed text-zinc-400" style={{ fontFamily: `'${ALL_FONTS.find(f => f.value === theme.bodyFont)?.label || theme.bodyFont}', sans-serif` }}>
                            Documentation that's easy to read and navigate
                        </div>
                    </Field>
                </InspSection>

                <InspSection title="Spacing & shape" icon={Sliders}>
                    <Field label="Section spacing">
                        <div className="grid grid-cols-2 gap-1.5">
                            {SPACING_OPTIONS.map(o => (
                                <button key={o.value} onClick={() => updateTheme({ sectionSpacing: o.value })} className={`h-9 text-xs rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${theme.sectionSpacing === o.value ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-[#141414] border-zinc-800 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700'}`}>
                                    <span className="font-semibold">{o.label}</span>
                                    <span className="text-[9px] opacity-50 font-mono">{o.desc}</span>
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Corner radius">
                        <div className="grid grid-cols-4 gap-1.5">
                            {[['□', '0px'], ['▢', '8px'], ['▣', '14px'], ['●', '22px']].map(([l, v]) => (
                                <button key={v} onClick={() => updateTheme({ borderRadius: v })} className={`h-9 text-sm rounded-xl border transition-all ${theme.borderRadius === v ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-[#141414] border-zinc-800 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700'}`}>{l}</button>
                            ))}
                        </div>
                    </Field>
                </InspSection>
            </div>
        );
    };

    const MetaInspector = () => (
        <div className="p-4">
            <div className="mb-5">
                <p className="text-xs font-bold text-zinc-200">Project Settings</p>
                <p className="text-[10px] text-zinc-700 mt-0.5">Saved on next deploy</p>
            </div>
            <div className="space-y-1">
                <Field icon={Globe} label="Subdomain">
                    <div className="flex items-center rounded-xl bg-[#141414] border border-zinc-800 overflow-hidden focus-within:border-zinc-600 transition-all">
                        <input type="text" value={subdomain} onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'))} placeholder="my-org" className="flex-1 h-9 px-3 bg-transparent text-sm text-zinc-100 placeholder-zinc-700 outline-none" />
                        <span className="pr-3 text-[10px] text-zinc-700 font-mono select-none">.whatdoc.xyz</span>
                    </div>
                </Field>
                <Field icon={Image} label="Logo URL">
                    <input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://…/logo.png" className={inputClass} />
                    {logoUrl && (
                        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141414] border border-zinc-900">
                            <img src={logoUrl} className="h-5 object-contain" alt="" onError={e => e.target.style.display = 'none'} />
                            <span className="text-[10px] text-zinc-600 truncate">{logoUrl}</span>
                        </div>
                    )}
                </Field>
                <Field icon={User} label="Owner / Company">
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Acme Inc." className={inputClass} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field icon={Tag} label="Version"><input type="text" value={currentVersion} onChange={e => setCurrentVersion(e.target.value)} className={inputClass} /></Field>
                    <Field icon={Rocket} label="Upcoming"><input type="text" value={upcomingVersion} onChange={e => setUpcomingVersion(e.target.value)} className={inputClass} /></Field>
                </div>
                <div className="mt-5 p-3.5 rounded-2xl bg-[#141414] border border-zinc-900">
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Template: <span className="text-zinc-300 font-semibold capitalize">{proj.template || 'modern'}</span><br />
                        Template changes are made from the Deploy page.
                    </p>
                </div>
            </div>
        </div>
    );

    // 
    // RENDER
    // 

    return (
        <div className="h-screen flex flex-col bg-[#0c0c0c] text-zinc-200 overflow-hidden" style={{ fontFamily: "'Figtree', 'DM Sans', system-ui, sans-serif" }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            {showAddBlock && <AddBlockPanel onAdd={handleAddBlock} onClose={() => setShowAddBlock(false)} />}
            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

            {/* ── HEADER ── */}
            <header className="shrink-0 h-[52px] flex items-center justify-between px-4 border-b border-zinc-900 bg-[#0a0a0a] z-50 relative">
                {/* Gradient accent line */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />


                <div className="flex items-center gap-3">
                    <Tip label="Dashboard" side="bottom">
                        <Link to="/dashboard" className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                            <ArrowLeft className="size-3.5" />
                        </Link>
                    </Tip>
                    <div className="w-px h-4 bg-zinc-900" />
                    <div className="flex items-center gap-2">
                        <Logo className="text-xs" />
                        <span className="text-zinc-800">/</span>
                        <span className="text-xs font-bold text-zinc-300 max-w-[120px] truncate">{proj.repoName?.split('/').pop()}</span>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-500/8 border border-emerald-500/18 text-emerald-400">
                            <Sparkles className="size-2.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Beta</span>
                        </div>
                    </div>
                </div>


                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 gap-0.5">
                        {[
                            { key: 'edit', icon: FileText, label: 'Edit', tip: 'Edit canvas' },
                            { key: 'split', icon: Layout, label: 'Split', tip: 'Side-by-side' },
                            { key: 'preview', icon: Eye, label: 'Preview', tip: 'Full preview' },
                        ].map(({ key, icon: Icon, label, tip }) => (
                            <Tip key={key} label={tip} side="bottom">
                                <button
                                    onClick={() => setViewMode(key)}
                                    className={`flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-bold transition-all duration-200 ${viewMode === key ? 'bg-zinc-700/80 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-300'}`}
                                >
                                    <Icon className="size-3" />{label}
                                </button>
                            </Tip>
                        ))}
                    </div>
                </div>


                <div className="flex items-center gap-2.5">
                    <SaveIndicator saving={saving} lastSaved={lastSaved} />

                    <Tip label="Keyboard shortcuts" shortcut="?" side="bottom">
                        <button onClick={() => setShowShortcuts(true)} className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                            <Keyboard className="size-3.5" />
                        </button>
                    </Tip>

                    <div className="w-px h-4 bg-zinc-900" />

                    <Tip label={inspectorOpen ? 'Hide inspector' : 'Show inspector'} side="bottom">
                        <button
                            onClick={() => setInspectorOpen(v => !v)}
                            className={`flex items-center gap-1.5 px-3 h-7 rounded-lg text-[11px] font-bold border transition-all ${inspectorOpen ? 'bg-zinc-800/80 border-zinc-700 text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
                        >
                            <Settings2 className="size-3" /> Inspector
                        </button>
                    </Tip>

                    <Tip label="Save and deploy" shortcut="⌘S" side="bottom">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 h-7 px-4 rounded-lg text-[11px] font-bold text-black transition-all disabled:opacity-60 relative overflow-hidden group"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 20px rgba(16,185,129,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }} />
                            <span className="relative flex items-center gap-1.5">
                                {saving ? <Loader2 className="size-3 animate-spin" /> : <Rocket className="size-3" />}
                                {saving ? 'Saving…' : 'Save & Deploy'}
                            </span>
                        </button>
                    </Tip>
                </div>
            </header>

            {/* ── BODY ──── */}
            <div className="flex flex-1 overflow-hidden">


                <aside className="w-[196px] shrink-0 border-r border-zinc-900 bg-[#0a0a0a] flex flex-col">
                    {/* Section list */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="px-3 pt-4 pb-2 flex items-center justify-between">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Sections</p>
                            <span className="text-[9px] text-zinc-800 font-mono">{blocks.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ scrollbarWidth: 'none' }}>
                            {blocks.map((b, i) => {
                                const titleMatch = b.content?.match(/^#+\s+(.+)/m);
                                const title = titleMatch?.[1] || `Section ${i + 1}`;
                                const def = BLOCK_TYPES.find(bt => bt.type === b.type);
                                const isSel = selectedBlockId === b.id;
                                return (
                                    <button
                                        key={b.id}
                                        onClick={() => { setSelectedBlockId(b.id); setInspectorTab('block'); }}
                                        className={`w-full text-left text-xs px-2.5 py-2 rounded-xl truncate transition-all flex items-center gap-2 mb-0.5 group/nav ${isSel ? 'bg-emerald-500/8 text-emerald-300 border border-emerald-500/18' : 'text-zinc-600 hover:text-zinc-200 hover:bg-white/3 border border-transparent'}`}
                                    >
                                        <span className="flex-shrink-0 opacity-60">{def?.icon || '📄'}</span>
                                        <span className="truncate flex-1 font-medium">{title}</span>
                                        {isSel && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Add block CTA */}
                    <div className="px-2 pb-3">
                        <Tip label="Add a new block" shortcut="+" side="right">
                            <button
                                onClick={() => setShowAddBlock(true)}
                                className="w-full h-9 rounded-xl border border-dashed border-zinc-800 text-zinc-700 hover:text-emerald-400 hover:border-emerald-500/35 hover:bg-emerald-500/4 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all group"
                            >
                                <Plus className="size-3.5 group-hover:rotate-90 transition-transform duration-300" />
                                Add Section
                            </button>
                        </Tip>
                    </div>

                    {/* Status footer */}
                    <div className="px-3 pb-3 pt-2 border-t border-zinc-900">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                                {blocks.length} section{blocks.length !== 1 ? 's' : ''} · Live
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-800">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.primary }} />
                                <span className="capitalize">{proj.template || 'modern'} template</span>
                            </div>
                        </div>
                    </div>
                </aside>


                <main className="flex-1 overflow-hidden flex min-w-0">

                    {/* Edit canvas */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                        <div className={`flex flex-col bg-[#0c0c0c] ${viewMode === 'split' ? 'w-1/2 border-r border-zinc-900' : 'flex-1'}`}>
                            {/* Canvas toolbar */}
                            <div className="shrink-0 flex items-center justify-between px-5 h-10 bg-[#0a0a0a]/80 border-b border-zinc-900">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-800">Canvas</span>
                                <button onClick={() => setShowAddBlock(true)} className="flex items-center gap-1.5 h-6 px-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-emerald-400 hover:border-emerald-500/30 text-[10px] font-bold transition-all">
                                    <Plus className="size-3" /> Add block
                                </button>
                            </div>

                            {/* Blocks */}
                            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}>
                                <div className="px-12 pt-10 pb-28 max-w-2xl mx-auto">
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={({ active }) => setActiveId(active.id)} onDragEnd={({ active, over }) => { setActiveId(null); if (active.id !== over?.id) setBlocks(items => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id))); }}>
                                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                            {blocks.map(block => (
                                                <SortableBlockCard
                                                    key={block.id}
                                                    block={block}
                                                    isSelected={selectedBlockId === block.id}
                                                    onSelect={id => { setSelectedBlockId(id); setInspectorTab('block'); }}
                                                    onDelete={deleteBlock}
                                                    onDuplicate={duplicateBlock}
                                                    onUpdate={updateBlock}
                                                    onTypeChange={(id, t) => updateBlock(id, { type: t })}
                                                    theme={theme}
                                                />
                                            ))}
                                        </SortableContext>
                                        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
                                            {activeBlock && <DragGhost block={activeBlock} />}
                                        </DragOverlay>
                                    </DndContext>


                                    {blocks.length === 0 && (
                                        <div className="text-center py-32 animate-[fadeUp_0.5s_ease_both]">
                                            <div className="text-5xl mb-5 animate-[float_4s_ease-in-out_infinite]">✦</div>
                                            <p className="text-zinc-300 font-bold text-base mb-2">Your canvas is empty</p>
                                            <p className="text-zinc-600 text-sm mb-8 max-w-[220px] mx-auto leading-relaxed">Add your first block to start building beautiful documentation</p>
                                            <button onClick={() => setShowAddBlock(true)} className="h-10 px-6 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 mx-auto group" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#000', boxShadow: '0 4px 24px rgba(16,185,129,0.3)' }}>
                                                <Plus className="size-4 group-hover:rotate-90 transition-transform duration-300" /> Add first block
                                            </button>
                                        </div>
                                    )}


                                    {blocks.length > 0 && (
                                        <button onClick={() => setShowAddBlock(true)} className="w-full mt-3 h-11 rounded-2xl border border-dashed border-zinc-900 text-zinc-800 hover:text-emerald-400 hover:border-emerald-500/25 hover:bg-emerald-500/3 text-xs font-semibold flex items-center justify-center gap-2 transition-all group">
                                            <Plus className="size-3.5 group-hover:rotate-90 transition-transform duration-300" /> Add block below
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Live preview */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                        <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'flex-1'}`}>
                            {/* Preview bar */}
                            <div className="shrink-0 flex items-center justify-between px-4 h-10 bg-[#0a0a0a]/80 border-b border-zinc-900">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-800 flex items-center gap-1.5">
                                    <Monitor className="size-3" /> Live Preview
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-800">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.primary }} />
                                        <span className="capitalize">{proj.template}</span>
                                    </div>
                                    {/* fake browser chrome dots */}
                                    <div className="flex gap-1 ml-1 opacity-40">
                                        <div className="w-2 h-2 rounded-full bg-red-400" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <LivePreview blocks={blocks} theme={theme} proj={proj} subdomain={subdomain} logoUrl={logoUrl} ownerName={ownerName} currentVersion={currentVersion} upcomingVersion={upcomingVersion} />
                            </div>
                        </div>
                    )}
                </main>


                {inspectorOpen && (
                    <aside className="w-[264px] shrink-0 border-l border-zinc-900 bg-[#0a0a0a] flex flex-col animate-[slideIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                        {/* Tab bar */}
                        <div className="flex border-b border-zinc-900 shrink-0">
                            {[
                                { key: 'block', icon: Layers, label: 'Block' },
                                { key: 'theme', icon: Palette, label: 'Theme' },
                                { key: 'meta', icon: Settings2, label: 'Meta' },
                            ].map(({ key, icon: Icon, label }) => (
                                <button key={key} onClick={() => setInspectorTab(key)} className={`flex-1 flex items-center justify-center gap-1.5 h-10 text-[9px] font-bold uppercase tracking-wider border-b-2 transition-all ${inspectorTab === key ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-700 hover:text-zinc-400'}`}>
                                    <Icon className="size-3" />{label}
                                    {key === 'block' && selectedBlock && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BLOCK_TYPES.find(b => b.type === selectedBlock.type)?.color || '#10b981' }} />}
                                </button>
                            ))}
                        </div>

                        {/* Panel */}
                        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1a1a1a transparent' }}>
                            {inspectorTab === 'block' && <BlockInspector />}
                            {inspectorTab === 'theme' && <ThemeInspector />}
                            {inspectorTab === 'meta' && <MetaInspector />}
                        </div>

                        {/* Inspector footer */}
                        <div className="shrink-0 px-4 py-3 border-t border-zinc-900 flex items-center justify-between">
                            <button onClick={() => setShowShortcuts(true)} className="flex items-center gap-1.5 text-[9px] text-zinc-800 hover:text-zinc-500 transition-colors font-medium">
                                <Keyboard className="size-3" /> Shortcuts
                            </button>
                            <span className="text-[9px] text-zinc-900 font-mono">whatdoc.xyz</span>
                        </div>
                    </aside>
                )}
            </div>

            {/* ── STYLES ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes fadeUp  { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
                @keyframes tipIn   { from { opacity: 0; transform: scale(0.88) translateY(3px) } to { opacity: 1; transform: none } }
                @keyframes toolbarPop { from { opacity:0; transform: translateX(-50%) scale(0.85) translateY(4px) } to { opacity:1; transform: translateX(-50%) scale(1) translateY(0) } }
                @keyframes panelUp { from { opacity:0; transform: scale(0.94) translateY(16px) } to { opacity:1; transform: none } }
                @keyframes toastSlide { from { opacity:0; transform: translateX(20px) scale(0.94) } to { opacity:1; transform: none } }
                @keyframes itemFade { from { opacity:0; transform: translateY(8px) } to { opacity:1; transform: none } }
                @keyframes sectionFade { from { opacity:0; transform: translateY(-4px) } to { opacity:1; transform: none } }
                @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }

                /* TipTap block editor */
                .tiptap-block-editor .ProseMirror { outline: none !important; }
                .tiptap-block-editor .ProseMirror h1, h2, h3 { font-family: var(--wd-hfont); color: var(--wd-primary); font-weight: 700; }
                .tiptap-block-editor .ProseMirror h1 { font-size: 2rem; margin-bottom: 0.75rem; letter-spacing: -0.025em; line-height: 1.2; }
                .tiptap-block-editor .ProseMirror h2 { font-size: 1.4rem; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--wd-primary) 15%, transparent); }
                .tiptap-block-editor .ProseMirror h3 { font-size: 1.08rem; margin-bottom: 0.4rem; }
                .tiptap-block-editor .ProseMirror p  { line-height: 1.8; margin-bottom: 0.9rem; opacity: 0.88; font-size: 0.95rem; }
                .tiptap-block-editor .ProseMirror ul, ol { padding-left: 1.5rem; margin-bottom: 0.9rem; }
                .tiptap-block-editor .ProseMirror li { margin-bottom: 0.3rem; }
                .tiptap-block-editor .ProseMirror code { background: color-mix(in srgb, var(--wd-primary) 14%, transparent); color: var(--wd-primary); padding: 2px 7px; border-radius: 6px; font-size: 0.83em; font-family: 'Space Mono', 'Fira Code', monospace; }
                .tiptap-block-editor .ProseMirror pre { background: #080808; border: 1px solid #1a1a1a; border-radius: var(--wd-radius, 12px); padding: 1rem 1.25rem; overflow-x: auto; margin: 1.25rem 0; }
                .tiptap-block-editor .ProseMirror pre code { background: none; color: #10b981; padding: 0; font-size: 0.85rem; }
                .tiptap-block-editor .ProseMirror blockquote { border-left: 3px solid var(--wd-primary); padding-left: 1.1rem; font-style: italic; opacity: 0.72; margin: 1.25rem 0; }
                .tiptap-block-editor .ProseMirror a { color: var(--wd-primary); text-decoration: underline; text-underline-offset: 3px; }
                .tiptap-block-editor .ProseMirror strong { font-weight: 700; }
                .tiptap-block-editor .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #2a2a2a; pointer-events: none; float: left; height: 0; }

                .react-colorful { width: 100% !important; }
                .react-colorful__saturation { border-radius: 10px 10px 0 0 !important; }
                .react-colorful__hue { height: 14px !important; border-radius: 0 0 10px 10px !important; }
                .react-colorful__pointer { width: 18px !important; height: 18px !important; border-width: 2px !important; }
            `}</style>
        </div>
    );
}
