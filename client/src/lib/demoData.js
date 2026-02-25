export const demoProjects = {
   'whatdoc-demo': {
      repoName: 'whatdoc/core-engine',
      creatorName: 'WhatDoc Team',
      techstack: 'React • Node.js • TailwindCSS • LLM',
      updatedAt: new Date().toISOString(),
      template: 'modern',
      generatedDocs: `
## Welcome to WhatDoc

WhatDoc.xyz is an advanced, automated documentation generator that transforms complex codebases into stunning, fully-interactive documentation hubs.

Built for developers who hate writing docs, WhatDoc leverages Large Language Models to read your GitHub repository, understand its architecture, and instantly bootstrap a complete, beautiful documentation website.

---

## Core Architecture

WhatDoc employs a distributed, cloud-native architecture consisting of four core pillars:

1. **The Ingestion Pipeline:** Connects to GitHub, pulling down repositories and analyzing file trees.
2. **The LLM Engine:** A powerful AI processing layer that reads code, infers purpose, and writes structured Markdown.
3. **The Rendering Layer:** A React-based, dynamically themed frontend that turns Markdown into interactive web pages.
4. **The Hosting Environment:** Automated subdomain routing (\`*.whatdoc.xyz\`) or custom domains.

### System Diagram

\`\`\`txt
[ GitHub Repo ] ──────> [ Ingestion Worker ] ──────> [ AI Parsing Engine ]
                              │                              │
                              ▼                              ▼
                      [ Vector Database ]            [ Markdown Output ]
                                                             │
[ User Browser ] <─── [ Frontend Renderer ] <────────────────┘
\`\`\`

---

## Key Features

### 1. Instant LLM-Powered Generation
Don't write boilerplates. Our engine deeply understands the context of your functions, APIs, and components, generating highly accurate, human-readable documentation.

### 2. 15+ Premium Themes
Instantly switch between aesthetically perfected themes like \`Twilio Style\`, \`Stripe / Fintech\`, \`Hacker Terminal\`, or \`Minimalist\`.

### 3. Native Subdomain Hosting
Deploy documentation instantly to \`your-project.whatdoc.xyz\`. Zero configuration required.

### 4. Custom Domains
Bring your own domain! WhatDoc handles DNS verification, SSL provisioning, and global CDN distribution.

---

## Interactive API Testing

WhatDoc natively supports interactive API Playgrounds embedded directly within the markdown. No Postman needed.

Try interacting with our mock analytics endpoint below:

\`\`\`json-api-playground
{
  "method": "POST",
  "endpoint": "/api/v1/analyze",
  "headers": {
    "Authorization": "Bearer demo_token_123"
  },
  "body": {
    "repo": "whatdoc/core-engine",
    "depth": "full",
    "includePrivate": false
  }
}
\`\`\`

> **Note:** The endpoint above defaults to the base URL configured for the playground. You can change it to point to any real API to test live networks.

---

## Theming & UI Capabilities

WhatDoc's frontend is completely unopinionated underneath, built on dynamically injected **TailwindCSS** tokens. 

When you select a theme like \`Aerolatex\` or \`Deep Space\`, the platform reconstructs the CSS Object Model to reflect:
- Typography (e.g., swapping Inter for Fira Code)
- Border radii (sharp industrial vs. soft consumer)
- Backdrop filters (glassmorphism vs. brutalist opacity)

### Example Output Style Configuration

\`\`\`javascript
const deepSpaceTheme = {
  background: "bg-[#020510]",
  text: "text-cyan-400",
  glow: "shadow-[0_0_40px_rgba(34,211,238,0.2)]",
  prose: "prose-invert prose-headings:text-cyan-300"
};
\`\`\`

---

## Data Workflows

How does code go from GitHub to a beautiful webpage?

1. **OAuth Flow:** User authenticates via GitHub.
2. **Repo Selection:** User picks a repository from their connected account.
3. **Initial Scan:** WhatDoc maps the repository structure, ignoring \`node_modules\`, \`.git\`, etc.
4. **Chunking & Embedding:** Large files are chunked and analyzed by the LLM logic to avoid token limits.
5. **Compilation:** The LLM stitches together comprehensive documentation segments.
6. **Live Preview:** The user previews the docs with the selected \`template\` ID.

---

## Performance & Built-in Optimizations

WhatDoc aims for 100/100 Lighthouse scores on generated documentation.

| Optimization | Method | Impact |
| --- | --- | --- |
| Image Optimization | WebP conversion via CDN | High |
| Code Splitting | React lazy loading per route | High |
| Caching | Redis edge caching for parsed MD | Medium |
| Tree-Shaking | Stripped out unused syntax highlighter bundles | High |

---

## Security Practices

We take your code's security seriously.

- **Ephemeral Access:** We clone repos into isolated, ephemeral Docker containers that are destroyed immediately after generating documentation.
- **Zero Retention:** We **do not** store your source code in our databases. We only store the final generated Markdown.
- **Granular Tokens:** GitHub integration uses fine-grained access tokens.

---

## Get Started

Ready to transform your codebase?

1. Navigate to the **Dashboard**.
2. Click **Import Repository**.
3. Watch WhatDoc do the magic.

\`\`\`bash
# If you want to verify our open-source tools locally
git clone https://github.com/whatdoc/cli
cd whatdoc-cli
npm install
whatdoc init
\`\`\`

`
   }
};