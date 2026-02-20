import { Globe, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600" />
          <span className="font-bold text-lg tracking-tight">whatdoc.xyz</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex grow gap-1 px-7">
          <Link to="/" className="h-9 px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 rounded-full transition-all hover:bg-emerald-400/20">Home</Link>
          <Link to="/pricing" className="h-9 px-4 py-2 text-sm font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Pricing</Link>
          <Link to="/changelog" className="h-9 px-4 py-2 text-sm font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Changelog</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-2">
          <Link to="/login" className="flex items-center justify-center h-9 px-4 rounded-full border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm">
            Sign In
          </Link>
          <div className="flex items-center rounded-full overflow-hidden shadow-sm">
            <Link to="/signup" className="flex items-center justify-center h-9 px-5 bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-500 transition-all">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/5 transition-all">
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-emerald-400">Home</Link>
          <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Pricing</Link>
          <Link to="/changelog" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">Changelog</Link>
          <hr className="border-zinc-800" />
          <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-300">Sign In</Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-black bg-emerald-400 rounded-full h-9 flex items-center justify-center hover:bg-emerald-500 transition-all">Get Started</Link>
        </div>
      )}
    </div>
  );
}