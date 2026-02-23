import React from 'react';
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

export default function RepoDetailView({ project, isPublicView }) {
    if (!project) return null;

    const SelectedTemplate = TemplateMap[project.template] || TemplateMap.modern;
    return <SelectedTemplate project={project} isPublicView={isPublicView} />;
}
