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
  {
    id: 'fintech',
    name: 'Fintech',
    description: 'Split-pane design inspired by Stripe. White background on the left for prose, dark slate on the right for sticky code snippets.',
    previewUrl: 'https://placehold.co/600x400/fff/333?text=Fintech',
  },
  {
    id: 'devtools',
    name: 'DevTools',
    description: 'Ultra-dark mode, minimalist borders, and glowing accents. Inspired by Linear.',
    previewUrl: 'https://placehold.co/600x400/000/fff?text=DevTools',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Brutalist black and white, zero gradients, and heavy typography. Inspired by Vercel.',
    previewUrl: 'https://placehold.co/600x400/000/fff?text=Minimalist',
  },
  {
    id: 'opensource',
    name: 'Open Source',
    description: 'Emerald greens, sleek typography, circular buttons. Inspired by Supabase.',
    previewUrl: 'https://placehold.co/600x400/111/10b981?text=Open+Source',
  },
  {
    id: 'wiki',
    name: 'Wiki',
    description: 'Fluid width, elegant font pairings, and document-focused layout. Inspired by Notion.',
    previewUrl: 'https://placehold.co/600x400/fff/333?text=Wiki',
  },
  {
    id: 'componentlib',
    name: 'Component Lib',
    description: 'Dense left sidebar, sticky nav, interactive preview boxes. Inspired by Tailwind.',
    previewUrl: 'https://placehold.co/600x400/f8fafc/333?text=Component+Lib',
  },
  {
    id: 'consumertech',
    name: 'Consumer Tech',
    description: 'Frosted glass, large heavy typography, and soft rounded corners. Inspired by Apple.',
    previewUrl: 'https://placehold.co/600x400/fafafa/333?text=Consumer+Tech',
  },
  {
    id: 'deepspace',
    name: 'Deep Space',
    description: 'Dark navy backgrounds with starlight accents and glowing borders.',
    previewUrl: 'https://placehold.co/600x400/020510/22d3ee?text=Deep+Space',
  },
  {
    id: 'web3',
    name: 'Web3 / Gaming',
    description: 'Neon cyan/magenta accents, angled borders, futuristic layout.',
    previewUrl: 'https://placehold.co/600x400/07070b/d946ef?text=Web3',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Highly structured, version dropdowns, callout blocks. Inspired by AWS/IBM.',
    previewUrl: 'https://placehold.co/600x400/fff/0f62fe?text=Enterprise',
  },
];
