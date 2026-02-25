import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { project as projectApi } from '../lib/api';
import { demoProjects } from '../lib/demoData';
// Import your templates
import TwilioTemplate from '../templates/TwilioTemplate';
import MDNTemplate from '../templates/MDNTemplate';
import AeroLatexTemplate from '../templates/AeroLatexTemplate';
import DjangoTemplate from '../templates/DjangoTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ModernTemplate from '../templates/ModernTemplate';
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

import { Loader2 } from 'lucide-react';

export default function PublicProjectView() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (demoProjects[slug]) {
            // It's a demo! Load fake data immediately
            setProject(demoProjects[slug]);
            setLoading(false);
        } else {
            // It's a real project! Fetch from DB
            projectApi.getBySlug(slug).then(res => {
                setProject(res.project);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return (
        <div className="h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" />
        </div>
    );

    if (!project) return <div>Project not found.</div>;

    // Route to the correct template (fix: use slug for demo mapping)
    if (demoProjects[slug]) {
        // Map demo slugs to correct template component
        switch (slug) {
            case 'twilio-demo':
                return <TwilioTemplate project={demoProjects[slug]} />;
            case 'aerolatex-demo':
                return <AeroLatexTemplate project={demoProjects[slug]} />;
            case 'django-demo':
                return <DjangoTemplate project={demoProjects[slug]} />;
            case 'minimal-demo':
                return <MinimalTemplate project={demoProjects[slug]} />;
            case 'modern-demo':
                return <ModernTemplate project={demoProjects[slug]} />;
            case 'mdn-demo':
                return <MDNTemplate project={demoProjects[slug]} />;
            default:
                return <MDNTemplate project={demoProjects[slug]} />;
        }
    }
    // For real projects, use template field
    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;
    return <SelectedTemplate project={project} />;
}