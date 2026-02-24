import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, Zap } from 'lucide-react';

import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import TwilioTemplate from '../templates/TwilioTemplate';
import DjangoTemplate from '../templates/DjangoTemplate';
import MDNTemplate from '../templates/MDNTemplate';
import AeroLatexTemplate from '../templates/AeroLatexTemplate';

import { API_URL } from '../lib/config';


const TemplateMap = {
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    twilio: TwilioTemplate,
    django: DjangoTemplate,
    mdn: MDNTemplate,
    aerolatex: AeroLatexTemplate,
    stylish: MDNTemplate
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


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-emerald-400" />
            </div>
        );
    }


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


    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;

    return (
        <>
            <SelectedTemplate project={project} />
            {/* Engineered-by badge */}
            <div className="fixed bottom-4 right-4 z-50">
                <Link
                    to="/creator"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-zinc-500 hover:text-white hover:border-white/20 transition-all shadow-lg"
                >
                    <Zap size={10} className="text-amber-400" />
                    Engineered by <span className="font-semibold text-zinc-300">Herin Soni</span>
                </Link>
            </div>
        </>
    );
}