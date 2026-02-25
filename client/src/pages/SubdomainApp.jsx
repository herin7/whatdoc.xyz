import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

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

import { API_URL } from '../lib/config';

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

/**
 * Standalone doc site rendered when a subdomain is detected.
 * Fetches via GET /projects/subdomain/:subdomain and renders the
 * matching template — the main app routes are never mounted.
 */
export default function SubdomainApp({ subdomain }) {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!subdomain) return;

        (async () => {
            try {
                const res = await fetch(`${API_URL}/projects/subdomain/${subdomain}`);
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
    }, [subdomain]);

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
                <p className="text-sm text-zinc-500">
                    The subdomain <span className="font-mono text-zinc-400">{subdomain}</span> doesn't match any project.
                </p>
            </div>
        );
    }

    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;
    return <SelectedTemplate project={project} />;
}
