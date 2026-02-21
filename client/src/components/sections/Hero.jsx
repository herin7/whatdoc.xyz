import { useState } from 'react';
import { Play, Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal';

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    console.log('Ingesting Repo:', repoUrl);
  };

  return (
    <section className="relative px-4 md:px-8 pt-28 pb-10 md:pb-20 overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl text-center z-10">
        {/* Badge */}
        <Reveal delay={0} distance={16}>
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400">
            <Github className="size-4 text-emerald-400" />
            <span>Paste a repo. Get instant docs.</span>
          </div>
        </Reveal>

        {/* Heading */}
        <Reveal delay={100} distance={20}>
          <h1 className="mx-auto mb-6 max-w-4xl text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.08] text-white">
            Docs that don't{' '}
            <span className=" font-sans bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              look boring.
            </span>
          </h1>
        </Reveal>

        {/* Sub-heading */}
        <Reveal delay={200} distance={16}>
          <p className="mx-auto mb-10 max-w-xl text-lg md:text-xl text-zinc-400 leading-relaxed">
            Paste a GitHub link. We analyze your codebase, extract the pure logic, and generate beautiful documentation instantly.
          </p>
        </Reveal>

        {/* CTA Row — Caret style: two side-by-side buttons */}
        <Reveal delay={300} distance={12}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            to="/signup"
            className="group flex items-center gap-2 h-12 px-7 rounded-full bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(52,211,153,0.25)]"
          >
            Get Started Free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 h-12 px-7 rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            See how it works
          </a>
          </div>
        </Reveal>

        {/* Inline URL Input — secondary action */}
        <Reveal delay={400} distance={12}>
        <form onSubmit={handleGenerate} className="flex items-center justify-center gap-2 max-w-lg mx-auto mt-4">
          <input
            type="url"
            placeholder="https://github.com/your-username/repo"
            required
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full h-11 px-5 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="shrink-0 h-11 px-5 rounded-full bg-white/5 border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
          >
            Generate
          </button>
        </form>
        </Reveal>

        {/* Product Mockup Window — Caret-style OS window */}
        <Reveal delay={500} distance={30} duration={800}>
        <div className="relative h-[400px] md:h-[520px] w-full max-w-5xl mx-auto mt-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-emerald-500/5 group">
          {/* Mac Menubar */}
          <div className="absolute top-0 left-0 flex h-10 w-full items-center px-4 bg-black/50 backdrop-blur-md border-b border-white/5 z-10 text-xs font-medium text-zinc-400">
            <div className="flex gap-1.5 mr-4">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-zinc-200">whatdoc</span>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-zinc-500">
              <span className="text-emerald-400 text-[10px] font-semibold tracking-widest uppercase">Live</span>
            </div>
          </div>

          <div className="absolute inset-0 pt-10 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-blue-500/10 flex items-center justify-center">
            <div className="hidden md:block absolute top-10 left-0 w-56 h-full border-r border-white/5 bg-black/30 p-4">
              <div className="text-[11px] font-mono text-zinc-500 mb-3 uppercase tracking-wider">Explorer</div>
              <div className="space-y-2">
                {['src/', '├─ routes/', '│  └─ user.js', '├─ controllers/', '│  └─ authController.js', '├─ models/', '│  └─ User.js', '└─ server.js'].map((line, i) => (
                  <div key={i} className={`text-xs font-mono ${i === 2 || i === 4 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center shadow-inner">
                <span className="text-black font-bold text-sm">WD</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white leading-tight">Analyzing Routes...</span>
                <span className="text-xs text-zinc-400">Extracting AST via ts-morph</span>
              </div>
              <div className="flex items-center gap-1 ml-3">
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <div className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
                <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              </div>
            </div>

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20">
              <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}