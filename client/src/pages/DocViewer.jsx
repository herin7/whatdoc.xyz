import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import TwilioTemplate from '../templates/TwilioTemplate';
import DjangoTemplate from '../templates/DjangoTemplate';
import MDNTemplate from '../templates/MDNTemplate';
import AeroLatexTemplate from '../templates/AeroLatexTemplate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ── Template map — drop new templates here ──────────────────────────
const TemplateMap = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    twilio: TwilioTemplate,
    django: DjangoTemplate,
    mdn: MDNTemplate,
    aerolatex: AeroLatexTemplate,
    stylish : MDNTemplate
};

export default function DocViewer() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;

        (async () => {
            try {
                const res = await fetch(`${API_URL}/projects/slug/${slug}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || 'Project not found.');
                    return;
                }

                setProject(data);
            } catch {
                setError('Failed to load documentation.');
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    // ── Loading state ───────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-emerald-400" />
            </div>
        );
    }

    // ── Error / 404 state ───────────────────────────────────────────
    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex flex-col items-center justify-center gap-4 px-4">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="size-5" />
                    <span className="text-lg font-medium">{error || 'Project not found.'}</span>
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to home
                </Link>
            </div>
        );
    }

    // ── Dynamic template rendering ──────────────────────────────────
    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;

    return <SelectedTemplate project={project} />;
}