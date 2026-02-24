import { useState, useEffect } from 'react';
import { Github, ArrowRight, Paintbrush } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal';

// The preview templates for the rotating showcase
const PREVIEW_TEMPLATES = [
  {
    id: 'twilio',
    name: 'Twilio API',
    bg: 'bg-[#0d122b]',
    headerBg: 'bg-[#1a2249]',
    text: 'text-slate-400',
    heading: 'text-white font-sans font-bold',
    accentText: 'text-blue-400',
    codeBg: 'bg-[#111] border-slate-700/50',
    border: 'border-slate-700/40',
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  },
  {
    id: 'aerolatex',
    name: 'Aero LaTeX',
    bg: 'bg-[#FAFAFA]',
    headerBg: 'bg-white shadow-sm',
    text: 'text-zinc-600',
    heading: 'text-zinc-900 font-serif font-normal',
    accentText: 'text-emerald-600 font-semibold',
    codeBg: 'bg-[#111] border-zinc-800',
    border: 'border-zinc-200',
    badge: 'bg-zinc-100 text-zinc-500 border border-zinc-200 shadow-sm'
  }
];

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState('');
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);

  // Cycle through templates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplateIdx((prev) => (prev + 1) % PREVIEW_TEMPLATES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    console.log('Ingesting Repo:', repoUrl);
  };

  const t = PREVIEW_TEMPLATES[activeTemplateIdx];

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
            <span>Import a repo. Get instant docs.</span>
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
            Connect your GitHub. We analyze your codebase, extract the pure logic, and generate beautiful documentation instantly.
          </p>
        </Reveal>

        {/* CTA Row */}
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

        {/* Product Mockup Window */}
        <Reveal delay={500} distance={30} duration={800}>
          <div className="relative h-[400px] md:h-[520px] w-full max-w-5xl mx-auto mt-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-emerald-500/5 group">

            {/* Mac Menubar */}
            <div className="absolute top-0 left-0 flex h-10 w-full items-center px-4 bg-black/50 backdrop-blur-md border-b border-white/5 z-20 text-xs font-medium text-zinc-400">
              <div className="flex gap-1.5 mr-4 shrink-0">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex gap-4 items-center">
                {/* Your original inline Logo setup */}
                <span className="font-logo font-bold text-zinc-200 uppercase text-[11px]"><span className="font-bold">W</span>HATDOC</span>
                <span className="hidden md:inline">File</span>
                <span className="hidden md:inline">Edit</span>
                <span className="hidden md:inline">View</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-zinc-500 shrink-0">
                <span className="text-emerald-400 text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Preview
                </span>
              </div>
            </div>

            <div className="absolute inset-0 pt-10 bg-[#0a0a0a] flex flex-col md:flex-row">


              <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-white/10 flex flex-col relative overflow-hidden">
                <div className="h-8 bg-[#111] flex items-center px-4 border-b border-white/5 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <span className="text-blue-400">TS</span> api/users/route.ts
                  </span>
                </div>
                <div className="p-4 md:p-5 font-mono text-[10px] md:text-xs leading-relaxed text-zinc-300 overflow-hidden">
                  <p><span className="text-pink-400">import</span> {`{ NextResponse }`} <span className="text-pink-400">from</span> <span className="text-emerald-300">'next/server'</span>;</p>
                  <br />
                  <p><span className="text-zinc-500">{"// Fetches user profile and active subscriptions"}</span></p>
                  <p><span className="text-pink-400">export async function</span> <span className="text-blue-400">GET</span>(req: <span className="text-teal-300">Request</span>) {`{`}</p>
                  <p className="pl-4"><span className="text-pink-400">const</span> userId = req.headers.<span className="text-blue-300">get</span>(<span className="text-emerald-300">'x-user-id'</span>);</p>
                  <p className="pl-4"><span className="text-pink-400">if</span> (!userId) <span className="text-pink-400">return</span> NextResponse.<span className="text-blue-300">json</span>({`{ error: 'Unauthorized' }`}, {`{ status: 401 }`});</p>
                  <br className="hidden md:block" />
                  <p className="pl-4"><span className="text-pink-400">const</span> user = <span className="text-pink-400">await</span> db.users.<span className="text-blue-300">findOne</span>({`{ id: userId }`});</p>
                  <p className="pl-4"><span className="text-pink-400">return</span> NextResponse.<span className="text-blue-300">json</span>(user);</p>
                  <p>{`}`}</p>
                </div>
                {/* AST Scanning Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-[150%] animate-[scan_3s_ease-in-out_infinite]" />
              </div>


              <div className={`w-full md:w-1/2 h-1/2 md:h-full flex flex-col relative transition-colors duration-700 ${t.bg}`}>

                {/* Dynamic Header Tab */}
                <div className={`h-8 flex items-center px-4 border-b justify-between shrink-0 transition-colors duration-700 ${t.headerBg} ${t.border}`}>
                  <span className={`text-[10px] font-mono flex items-center gap-2 ${t.text}`}>
                    <Paintbrush className="size-3" />
                    Preview: <span className="font-bold">{t.name}</span>
                  </span>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full transition-colors duration-700 ${t.badge}`}>
                    Auto-Generated
                  </span>
                </div>

                {/* Dynamic Markdown Content */}
                <div className="p-4 md:p-6 space-y-3 md:space-y-4 overflow-hidden relative z-10">
                  <h1 className={`text-base md:text-xl tracking-tight border-b pb-2 transition-colors duration-700 ${t.heading} ${t.border}`}>
                    Get User Profile
                  </h1>
                  <p className={`text-[11px] md:text-xs leading-relaxed transition-colors duration-700 ${t.text}`}>
                    Retrieves the profile and active subscriptions for the authenticated user.
                  </p>

                  <div className="space-y-1.5 md:space-y-2">
                    <h3 className={`text-[10px] md:text-[11px] font-mono uppercase tracking-widest transition-colors duration-700 ${t.text} opacity-70`}>HTTP Request</h3>
                    <div className={`border rounded-md p-2 flex items-center gap-3 transition-colors duration-700 ${t.codeBg}`}>
                      <span className={`text-[11px] md:text-xs transition-colors duration-700 ${t.accentText}`}>GET</span>
                      <span className="text-[11px] md:text-xs font-mono text-zinc-300">/api/users</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2">
                    <h3 className={`text-[10px] md:text-[11px] font-mono uppercase tracking-widest transition-colors duration-700 ${t.text} opacity-70`}>Headers</h3>
                    <div className={`border rounded-md overflow-hidden transition-colors duration-700 ${t.codeBg}`}>
                      <div className={`grid grid-cols-2 p-2 border-b text-[10px] md:text-xs transition-colors duration-700 ${t.border}`}>
                        <span className="font-mono text-pink-400">x-user-id</span>
                        <span className={`transition-colors duration-700 ${t.text}`}>Required. UUID of user.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-30">
                <div className="h-10 w-10 rounded-xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center border border-zinc-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}