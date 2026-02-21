import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import botAvatar from '../../assets/bot-avatar.png';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050505] overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">

        {/* ── Top: Three-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Col 1: Brand + tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={botAvatar} alt="whatdoc bot" className="w-full h-full object-cover" />
              </div>
              <span className="font-logo text-xl text-white">
                <span className="font-bold">W</span>HATDOC.XYZ
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              AI-powered docs that don't look boring.<br />
              Paste a repo. Get instant docs. That's it.
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-400/80 font-mono tracking-wider uppercase">All systems operational</span>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h6 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">Product</h6>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Dashboard', to: '/dashboard' },
                  { label: 'Engine', to: '/engine' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">More</h6>
              <ul className="space-y-2.5">
                {[
                  { label: 'The Builder', to: '/creator' },
                  { label: 'GitHub', href: 'https://github.com/herin7' },
                  { label: 'Contact', href: 'mailto:herinsoni3737@gmail.com' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 3: Builder card */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-black">
                H
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Herin Soni</p>
                <p className="text-[11px] text-zinc-500">Full-Stack Engineer</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Built this entire thing — AST parser, LLM pipeline, every pixel. Currently shipping code and looking for opportunities.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/herin7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all"
                aria-label="GitHub"
              >
                <Github size={14} className="text-zinc-400" />
              </a>
              <a
                href="https://linkedin.com/in/herin-soni"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} className="text-zinc-400" />
              </a>
              <a
                href="mailto:herinsoni3737@gmail.com"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all"
                aria-label="Email"
              >
                <Mail size={14} className="text-zinc-400" />
              </a>
              <Link
                to="/creator"
                className="ml-auto text-[11px] text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
              >
                full portfolio <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-12 pt-6 border-t border-white/[0.04]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-700 font-mono">
              © {new Date().getFullYear()}{' '}
              <span className="font-logo"><span className="font-bold">W</span>HATDOC.XYZ</span>
              {' '}· shipped from 🇮🇳
            </p>
            <p className="text-[11px] text-zinc-700 font-mono">
              built different. documented better.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
