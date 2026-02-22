import React from 'react';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

/* ── Callout type config ─────────────────────────────────────────── */
const CALLOUT_TYPES = {
    NOTE: {
        icon: Info,
        label: 'Note',
        dark: {
            border: 'border-blue-500/40',
            bg: 'bg-blue-500/[0.06]',
            iconColor: 'text-blue-400',
            labelColor: 'text-blue-400',
        },
        light: {
            border: 'border-blue-500/30',
            bg: 'bg-blue-50/80',
            iconColor: 'text-blue-600',
            labelColor: 'text-blue-600',
        },
    },
    TIP: {
        icon: Lightbulb,
        label: 'Tip',
        dark: {
            border: 'border-emerald-500/40',
            bg: 'bg-emerald-500/[0.06]',
            iconColor: 'text-emerald-400',
            labelColor: 'text-emerald-400',
        },
        light: {
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-50/80',
            iconColor: 'text-emerald-600',
            labelColor: 'text-emerald-600',
        },
    },
    WARNING: {
        icon: AlertTriangle,
        label: 'Warning',
        dark: {
            border: 'border-amber-500/40',
            bg: 'bg-amber-500/[0.06]',
            iconColor: 'text-amber-400',
            labelColor: 'text-amber-400',
        },
        light: {
            border: 'border-amber-500/30',
            bg: 'bg-amber-50/80',
            iconColor: 'text-amber-600',
            labelColor: 'text-amber-600',
        },
    },
};

/**
 * Detect GitHub-flavored alert type from blockquote children.
 * Returns { type, cleanChildren } or null if not a callout.
 */
function detectCallout(children) {
    const flat = React.Children.toArray(children);
    for (let i = 0; i < flat.length; i++) {
        const child = flat[i];
        if (!React.isValidElement(child)) continue;

        // react-markdown wraps blockquote content in <p> elements
        const inner = React.Children.toArray(child.props?.children || []);
        for (let j = 0; j < inner.length; j++) {
            const txt = inner[j];
            if (typeof txt !== 'string') continue;
            const m = txt.match(/^\[!(NOTE|TIP|WARNING)\]\s*/);
            if (!m) continue;

            // Found a callout tag — strip it from the text
            const remainder = txt.slice(m[0].length);
            const newInner = [...inner];
            if (remainder.trim()) {
                newInner[j] = remainder;
            } else {
                newInner.splice(j, 1);
            }
            // Rebuild children array with cleaned first <p>
            const cleaned = [...flat];
            if (newInner.length > 0) {
                cleaned[i] = React.cloneElement(child, {}, ...newInner);
            } else {
                cleaned.splice(i, 1);
            }
            return { type: m[1], cleanChildren: cleaned };
        }
    }
    return null;
}

/* ── Callout blockquote handler ──────────────────────────────────── */
export function makeBlockquote(variant = 'dark', fallbackClasses = '') {
    return function Blockquote({ children }) {
        const callout = detectCallout(children);

        if (!callout) {
            // Normal blockquote fallback
            const fb = fallbackClasses || (variant === 'dark'
                ? 'border-l-[3px] border-zinc-600 pl-5 my-6 italic text-zinc-400'
                : 'border-l-[3px] border-zinc-300 pl-5 my-6 italic text-zinc-500');
            return <blockquote className={fb}>{children}</blockquote>;
        }

        const cfg = CALLOUT_TYPES[callout.type];
        const Icon = cfg.icon;
        const colors = cfg[variant];

        return (
            <div className={`my-5 rounded-lg border ${colors.border} ${colors.bg} backdrop-blur-sm px-4 py-3`}>
                <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={16} className={colors.iconColor} />
                    <span className={`text-sm font-semibold uppercase tracking-wide ${colors.labelColor}`}>
                        {cfg.label}
                    </span>
                </div>
                <div className="text-sm leading-relaxed [&>p]:m-0">
                    {callout.cleanChildren}
                </div>
            </div>
        );
    };
}

/* ── Steps ordered-list handler ──────────────────────────────────── */
export function makeOl(variant = 'dark') {
    const lineColor = variant === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300';
    const circleBase = variant === 'dark'
        ? 'bg-zinc-900 border-zinc-600 text-zinc-300'
        : 'bg-white border-zinc-300 text-zinc-600';

    return function Ol({ children }) {
        const items = React.Children.toArray(children).filter(React.isValidElement);
        return (
            <div className="relative my-6 pl-10">
                {/* Vertical connector line */}
                <div className={`absolute left-[15px] top-3 bottom-3 w-px ${lineColor}`} />
                {items.map((child, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 mb-5 last:mb-0">
                        {/* Numbered circle */}
                        <span className={`absolute -left-10 top-0.5 flex items-center justify-center w-[30px] h-[30px] rounded-full border text-xs font-bold ${circleBase} z-10`}>
                            {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">{child.props?.children}</div>
                    </div>
                ))}
            </div>
        );
    };
}
