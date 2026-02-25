import React from 'react';
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

export default function RepoDetailView({ project, isPublicView }) {
    if (!project) return null;

    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;
    return <SelectedTemplate project={project} isPublicView={isPublicView} />;
}
