/**
 * Design Marketplace — Documentation Template Registry
 *
 * To add a new template:
 *   1. Add an entry here
 *   2. Create the component in  src/templates/
 *   3. Register it in the TemplateMap inside DocViewer.jsx
 *   4. Add the id to the Mongoose enum in  server/models/Project.js
 */

export const DOC_TEMPLATES = [
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'API-first layout inspired by Twilio\'s clean developer docs. Sidebar nav with syntax-highlighted code blocks.',
    previewUrl: 'https://placehold.co/600x400/111/fff?text=Twilio+Style',
  },
  {
    id: 'django',
    name: 'Django',
    description: 'Classic documentation theme modelled after Django\'s official docs. Two-column layout with a table of contents.',
    previewUrl: 'https://placehold.co/600x400/0C4B33/fff?text=Django+Style',
  },
  {
    id: 'mdn',
    name: 'MDN',
    description: 'Reference-style template inspired by MDN Web Docs. Generous whitespace with breadcrumb navigation.',
    previewUrl: 'https://placehold.co/600x400/1B1B1B/83D0F2?text=MDN+Style',
  },
  {
    id: 'aerolatex',
    name: 'AeroLaTeX',
    description: 'Ultra-premium academic template. Floating glassmorphic header, serif–sans font pairing, and dark IDE code blocks on paper-white.',
    previewUrl: 'https://placehold.co/600x400/FAFAFA/222?text=AeroLaTeX',
  },
];
