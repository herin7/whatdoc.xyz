<p align="center">
  <img src="client/public/logo.png" alt="WhatDoc Logo" width="80" height="80" />
</p>

<h1 align="center">WhatDoc</h1>

<p align="center">
  <strong>Connect your GitHub. Get beautiful, AI-generated documentation instantly.</strong>
  <br />
  <em>Docs that don't look boring.</em>
</p>

<p align="center">
  <a href="https://whatdoc.xyz">Website</a> •
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-the-engine">How It Works</a> •
  <a href="#-quickstart">Quickstart</a> •
  <a href="#-templates">Templates</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

<p align="center">
  <a href="https://github.com/herin7/whatdoc.xyz/stargazers"><img src="https://img.shields.io/github/stars/herin7/whatdoc.xyz?style=for-the-badge&logo=github&color=f4c430&labelColor=0d0d0d" alt="Stars" /></a>
  <a href="https://github.com/herin7/whatdoc.xyz/network/members"><img src="https://img.shields.io/github/forks/herin7/whatdoc.xyz?style=for-the-badge&logo=github&color=34d399&labelColor=0d0d0d" alt="Forks" /></a>
  <a href="https://github.com/herin7/whatdoc.xyz/issues"><img src="https://img.shields.io/github/issues/herin7/whatdoc.xyz?style=for-the-badge&logo=github&color=ef4444&labelColor=0d0d0d" alt="Issues" /></a>
  <a href="https://github.com/herin7/whatdoc.xyz/blob/main/LICENSE"><img src="https://img.shields.io/github/license/herin7/whatdoc.xyz?style=for-the-badge&labelColor=0d0d0d&color=a78bfa" alt="License" /></a>
</p>

<br />

---

## The Problem

Every developer knows the pain: you build something great, but writing the docs feels like a second full-time job. So you don't. Your README stays a one-liner, your API has no reference, and your users bounce.

**WhatDoc fixes this.** Connect your GitHub, import a repo, pick a template, and get production-ready documentation in under 60 seconds.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🧠 | **Smart Code Ingestion** | Shallow-clones your repo, walks the directory tree, filters noise (lockfiles, dist, tests), and compresses source via a regex-based minifier before sending to the LLM. |
| 🎨 | **4 Pro Templates** | Choose from Twilio, Django, MDN, or AeroLaTeX-inspired themes. Every template is responsive, dark-mode ready, and gorgeous. |
| 🌐 | **Custom Subdomains** | Every project gets its own `yourproject.whatdoc.xyz` subdomain — instant shareable docs. |
| 🔑 | **BYOK (Bring Your Own Key)** | Plug in your Gemini API key for unthrottled, limit-free generation. Stored in local storage, never touches our servers. |
| 🔗 | **GitHub OAuth** | Connect your GitHub, import repos (public or private), and generate docs in one flow. |
| ✏️ | **Live Editor** | Edit your generated documentation in a rich markdown editor. Changes save instantly. |
| 🚀 | **One-Click Deploy** | Generate → customize → deploy. Your docs go live at a permanent URL in seconds. |
| 🧪 | **API Playground** | Test API endpoints directly from your documentation page — auto-generated from backend routes. |
| ✂️ | **Token Guillotine** | Caps free-tier payloads at ~200k tokens with a smart file-boundary cutoff. BYOK users get the full context window. |
| ⌨️ | **Command Palette** | Power-user keyboard shortcuts for fast navigation. |

---

## ⚙️ The Engine

WhatDoc uses a multi-stage pipeline to go from raw repo → polished docs:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ① Shallow Clone        ② Code Ingestion      ③ LLM Call   │
│   ──────────────────     ──────────────────     ──────────   │
│   simple-git depth-1     Walk dir tree,         Gemini       │
│   to /tmp, ephemeral     filter noise files,    generates    │
│                          regex-minify each,     README +     │
│                          concatenate all         API ref     │
│                                                              │
│   ④ Cleanup & Render                                         │
│   ──────────────────                                         │
│   Nuke cloned files,                                         │
│   save markdown to DB,                                       │
│   render with chosen                                         │
│   React template                                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **Ephemeral clones** — Repos are cloned to `/tmp`, parsed, and deleted. Nothing persists on disk.
- **Regex Guillotine** — Strips block comments, consecutive `//` runs, base64 blobs, long string literals, and collapses blank lines before sending to the LLM. Keeps token count lean.
- **Paradigm-aware prompting** — The system prompt instructs Gemini to detect the repo type (REST API vs frontend vs CLI) and adapt the doc structure accordingly.
- **Fat-Trimmer blocklist** — Lockfiles, `dist/`, `__tests__/`, `.min.js`, source maps, and existing READMEs are all excluded automatically.
- **Round-robin key rotation** — Free-tier requests rotate across multiple Gemini API keys to avoid 429s. BYOK bypasses this entirely.
- **Retry with exponential backoff** — Rate-limited requests retry up to 3 times with 15s → 30s → 60s delays.

---

## 🎨 Templates

<table>
  <tr>
    <td align="center" width="25%"><strong>Twilio</strong><br/><sub>API-first dark layout with sidebar nav</sub></td>
    <td align="center" width="25%"><strong>Django</strong><br/><sub>Classic two-column docs with TOC</sub></td>
    <td align="center" width="25%"><strong>MDN</strong><br/><sub>Reference-style with breadcrumbs</sub></td>
    <td align="center" width="25%"><strong>AeroLaTeX</strong><br/><sub>Academic glassmorphic on paper-white</sub></td>
  </tr>
</table>

---

## 🚀 Quickstart

### Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Gemini API Key** — [Get one free](https://aistudio.google.com/apikey)

### 1. Clone

```bash
git clone https://github.com/herin7/whatdoc.xyz.git
cd whatdoc.xyz
```

### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/whatdoc
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
PORT=3000
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
APP_DOMAIN=localhost
```

Start the server:

```bash
npm start
```

### 3. Setup Client

```bash
cd ../client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_DOMAIN=localhost:5173
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're live. 🎉

---

## 🛠 Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| TailwindCSS | Utility-first styling |
| React Router | Client-side routing |
| Lucide Icons | Icon system |
| React Markdown | Markdown rendering |
| React Syntax Highlighter | Code blocks |

### Backend
| Tech | Purpose |
|------|---------|
| Express 5 | HTTP server |
| MongoDB + Mongoose | Database & ODM |
| Gemini API | AI-powered doc generation |
| simple-git | Ephemeral repo cloning |
| ignore | `.gitignore`-aware file filtering |
| JWT + bcrypt | Authentication |
| Zod | Schema validation |

---

## 📂 Project Structure

```
whatdoc.xyz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/            # Landing page
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # Template registry
│   │   ├── context/        # Auth context provider
│   │   ├── lib/            # API client & utilities
│   │   ├── pages/          # Route pages
│   │   └── templates/      # Doc display templates
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # Engine & LLM logic
│   ├── middlewares/        # Auth middleware
│   └── utils/              # Key rotation manager
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">
  <sub>Built by <a href="https://github.com/herin7">@herin7</a></sub>
  <br />
  <sub>If WhatDoc helped you, consider giving it a ⭐</sub>
</p>
