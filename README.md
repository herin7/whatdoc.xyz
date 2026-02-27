<div align="center">

<img src="./client/public/logo.png" alt="WhatDoc" width="120" />

# `whatdoc.xyz`

### **Your repo goes in. Docs come out. Magic in the middle.**

*Connect GitHub → pick a theme → get production-ready documentation in under 60 seconds.*  
*No boilerplate. No suffering. No excuses.*

<br/>

[![Live Site](https://img.shields.io/badge/🌐_Live-whatdoc.xyz-6366f1?style=for-the-badge)](https://whatdoc.xyz)
[![Stars](https://img.shields.io/github/stars/herin7/whatdoc.xyz?style=for-the-badge&color=f59e0b)](https://github.com/herin7/whatdoc.xyz/stargazers)
[![Issues](https://img.shields.io/github/issues/herin7/whatdoc.xyz?style=for-the-badge&color=ef4444)](https://github.com/herin7/whatdoc.xyz/issues)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](./LICENSE)

<br/>

```
 ██╗    ██╗██╗  ██╗ █████╗ ████████╗██████╗  ██████╗  ██████╗
 ██║    ██║██║  ██║██╔══██╗╚══██╔══╝██╔══██╗██╔═══██╗██╔════╝
 ██║ █╗ ██║███████║███████║   ██║   ██║  ██║██║   ██║██║
 ██║███╗██║██╔══██║██╔══██║   ██║   ██║  ██║██║   ██║██║
 ╚███╔███╔╝██║  ██║██║  ██║   ██║   ██████╔╝╚██████╔╝╚██████╗
  ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝  ╚═════╝
```

</div>

---

## 💀 The Ugly Truth About Developer Docs

```
Estimated time building the feature:   ████████████████████  40 hrs
Estimated time writing the docs:       ██                     3 hrs
Actual time writing the docs:          ░░░░░░░░░░░░░░░░░░░░  0 hrs
```

You shipped. The README is still `"TODO: add docs"`.  
Your API has zero reference. Users open issues asking what your project *does*.

**WhatDoc ends the cycle.** It reads your repo like a senior engineer who never sleeps, and writes docs that look like Stripe hired a designer.

---

## ⚡ 60-Second Demo

```bash
# What you do:
1. Connect GitHub
2. Pick a repo
3. Pick a template
4. Click Generate

# What WhatDoc does in those 60 seconds:
→ Shallow-clones your entire repo to an ephemeral container
→ Walks every directory, filters out the noise (lockfiles, dist, tests, minified blobs)
→ Regex-minifies source files to squeeze max signal into the LLM context
→ Detects whether you built a REST API, a frontend app, a CLI, or a library
→ Sends a paradigm-aware prompt to Gemini with your full codebase as context
→ Generates a multi-section README + API reference tailored to your stack
→ Renders it in your chosen template with syntax highlighting, sidebar nav, and dark mode
→ Deploys it live at yourproject.whatdoc.xyz

# What remains of your repo on our servers afterward:
→ Nothing. Ephemeral clone nuked. Zero disk persistence.
```

---

## ✨ Features That Slap

| | Feature | The Real Story |
|---|---|---|
| 🧠 | **Smart Code Ingestion** | Doesn't just glob `*.js`. Understands your `.gitignore`, skips `__tests__/`, `dist/`, `.min.js`, source maps, and base64 blobs. Reads your code like a human would. |
| 🎨 | **4 Pro Templates** | Twilio-dark, Django-classic, MDN-reference, AeroLaTeX-academic. Every one is responsive, dark-mode ready, and looks better than 99% of open source READMEs. |
| 🔑 | **BYOK — Bring Your Own Key** | Drop in your Gemini API key. It lives in `localStorage`. Never touches our servers. You get the full context window. Zero rate limits. Zero strings attached. |
| 🌐 | **Instant Subdomains** | Every project gets `yourproject.whatdoc.xyz` — a permanent, shareable URL. Send it to your users before you're done with the PR. |
| ✏️ | **Live Markdown Editor** | The AI draft is the starting line, not the finish line. Edit inline. Changes save instantly. Your voice, AI's structure. |
| 🧪 | **API Playground** | WhatDoc reads your backend routes and generates a live, interactive API tester directly inside the docs. Ship docs with a built-in Postman. |
| 🔪 | **Token Guillotine** | Free tier gets a smart ~200k token cap with file-boundary precision — it never cuts a file mid-parse. BYOK gets the full window. |
| 🔄 | **Round-Robin Key Rotation** | Free-tier requests rotate across multiple Gemini API keys with exponential backoff (`15s → 30s → 60s`). 429s don't exist in our vocabulary. |
| ⌨️ | **Command Palette** | Power-user keyboard navigation built in. Because clicking is for people who don't know the shortcut. |

---

## 🏗️ How The Engine Actually Works

```
╔══════════════════════════════════════════════════════════════════╗
║                    THE WHATDOC PIPELINE                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  YOUR REPO                                                       ║
║     │                                                            ║
║     ▼                                                            ║
║  ① SHALLOW CLONE ──────────────────────────────────────────────  ║
║     simple-git, depth=1, to /tmp                                 ║
║     Ephemeral. No persistence. Gone after step 3.                ║
║     │                                                            ║
║     ▼                                                            ║
║  ② FAT TRIMMER ────────────────────────────────────────────────  ║
║     Blocklist: lockfiles, dist/, __tests__/, *.min.js,           ║
║     sourcemaps, base64 blobs, existing READMEs                   ║
║     .gitignore-aware via the `ignore` package                    ║
║     │                                                            ║
║     ▼                                                            ║
║  ③ REGEX GUILLOTINE ───────────────────────────────────────────  ║
║     Strips block comments, runs of // lines,                     ║
║     long string literals, collapses blank lines                  ║
║     Result: maximum signal, minimum token spend                  ║
║     │                                                            ║
║     ▼                                                            ║
║  ④ PARADIGM DETECTION ─────────────────────────────────────────  ║
║     REST API? Frontend SPA? CLI tool? Library?                   ║
║     System prompt adapts. Doc structure adapts.                  ║
║     │                                                            ║
║     ▼                                                            ║
║  ⑤ GEMINI LLM CALL ────────────────────────────────────────────  ║
║     Full codebase as context.                                     ║
║     Generates: README + API Reference + Usage Guide              ║
║     │                                                            ║
║     ▼                                                            ║
║  ⑥ NUKE + RENDER ──────────────────────────────────────────────  ║
║     Clone deleted. Markdown saved to MongoDB.                    ║
║     Rendered in your React template.                             ║
║     Deployed to yourproject.whatdoc.xyz.                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Templates

<table>
  <tr>
    <td align="center"><b>Twilio</b><br/>API-first · dark · sidebar nav<br/><i>For APIs that mean business</i></td>
    <td align="center"><b>Django</b><br/>Classic · two-column · TOC<br/><i>For frameworks that have opinions</i></td>
  </tr>
  <tr>
    <td align="center"><b>MDN</b><br/>Reference-style · breadcrumbs<br/><i>For docs that teach, not just describe</i></td>
    <td align="center"><b>AeroLaTeX</b><br/>Academic · glassmorphic · paper-white<br/><i>For projects that deserve to look serious</i></td>
  </tr>
</table>

---

## 🚀 Quickstart (Self-Host in 5 Minutes)

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Gemini API Key** → [free at aistudio.google.com](https://aistudio.google.com/apikey)

### Clone
```bash
git clone https://github.com/herin7/whatdoc.xyz.git
cd whatdoc.xyz
```

### Server
```bash
cd server && npm install
```

Create `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/whatdoc
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
PORT=3000
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
APP_DOMAIN=localhost
```

```bash
npm start
```

### Client
```bash
cd ../client && npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_DOMAIN=localhost:5173
```

```bash
npm run dev
# → http://localhost:5173 🎉
```

---

## 🛠 Tech Stack

### Frontend
| Tech | Why |
|---|---|
| React 19 | Latest concurrent features |
| Vite | Sub-second HMR |
| TailwindCSS | Zero-runtime styling |
| React Router | Client-side nav |
| React Markdown + Syntax Highlighter | Beautiful doc rendering |

### Backend
| Tech | Why |
|---|---|
| Express 5 | Async-native HTTP server |
| MongoDB + Mongoose | Flexible doc storage |
| Gemini API | Best-in-class long-context LLM |
| simple-git | Lightweight ephemeral cloning |
| JWT + bcrypt | Auth that doesn't embarrass you |
| Zod | Schema validation with actual error messages |

---

## 📂 Project Structure

```
whatdoc.xyz/
├── client/
│   └── src/
│       ├── app/            ← Landing page
│       ├── components/     ← Reusable UI
│       ├── config/         ← Template registry
│       ├── context/        ← Auth context
│       ├── lib/            ← API client & utils
│       ├── pages/          ← Route pages
│       └── templates/      ← The 4 doc themes
│
└── server/
    ├── controllers/        ← Route handlers
    ├── models/             ← Mongoose schemas
    ├── routes/             ← API definitions
    ├── services/           ← The actual engine
    ├── middlewares/        ← Auth middleware
    └── utils/              ← Key rotation manager
```

---

## 🤝 Contributing

WhatDoc is open source and welcomes contributors. Here's how to get involved:

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feat/something-wild

# 3. Commit with conventional commits
git commit -m 'feat: add something wild'

# 4. Push and open a PR
git push origin feat/something-wild
```

**High-value contribution areas:**
- New documentation templates
- Support for more LLM providers (OpenAI, Claude, Ollama)
- GitHub Actions integration for auto-regenerating docs on push
- Diff-aware regeneration (only re-doc what changed)

---

## 📄 License

MIT — do whatever you want, just don't blame us.

---

<div align="center">

Built with ☕ and mild sleep deprivation by [@herin7](https://github.com/herin7)

**If WhatDoc saved you from writing docs at 2am, give it a ⭐**

*The best documentation is the one that actually gets written.*

</div>
