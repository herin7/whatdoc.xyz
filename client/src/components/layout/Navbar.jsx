import { Menu, X, LogOut, Star, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/config';
import UpgradeModal from '../UpgradeModal';

// Custom sleek SVGs
const ProductHuntIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.17 10.41c-1.1.92-2.73.92-3.83 0v1.84c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-.55.45-1 1-1h2.5c2.4 0 3.8 1.57 3.8 3.41 0 1.25-.66 2.14-1.47 2.51zm-1.83-2.01c.79 0 1.3-.47 1.3-1.16 0-.69-.51-1.16-1.3-1.16h-1.5v2.32h1.5z" />
  </svg>
);

const PeerlistIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
    <text x="12" y="16" fontSize="12" fontWeight="bold" fill="#000" textAnchor="middle" fontFamily="sans-serif">P</text>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
  </svg>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);

  const PH_LINK = "https://www.producthunt.com/products/whatdoc-xyz";
  const PEERLIST_LINK = "https://peerlist.io/herinsoni/project/whatdoc";

  useEffect(() => {
    let isMounted = true;
    async function fetchUserCount() {
      try {
        const res = await fetch(`${API_URL}/api/usercount`);
        if (!res.ok) throw new Error('Failed to fetch user count');
        const data = await res.json();
        if (isMounted && typeof data.count === 'number') setUserCount(data.count);
      } catch (err) {
        console.log(err);
      }
    }
    fetchUserCount();
    const interval = setInterval(fetchUserCount, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-4 md:px-6">
      <nav className="mx-auto h-14 max-w-[1400px]">
        {/* Flex layout dynamically handles widths without overlapping */}
        <div className="flex justify-between items-center h-full w-full gap-2 lg:gap-4">

          {/* LEFT: Logo */}
          <div className="flex items-center justify-start shrink-0">
            <Link to="/" className="flex items-center gap-2 relative z-10">
              <span className="font-logo text-lg tracking-tight text-white hover:text-emerald-400 transition-colors">
                <span className='font-bold'>W</span>HATDOC.XYZ
              </span>
            </Link>
          </div>

          {/* CENTER: Links & User Count */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-3 lg:gap-6 mx-2 whitespace-nowrap">
            <div className="flex items-center gap-1">
              <Link to="/" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Home</Link>
              <Link to="/templates" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Templates</Link>
              <Link to="/engine" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Engine</Link>
            </div>

            <div className="group flex items-center gap-2 h-7 px-3 rounded-full bg-[#111] border border-white/5 shadow-inner cursor-default overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/5">
              <div className="relative flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute animate-ping opacity-75" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative z-10" />
              </div>

              <div className="flex flex-col relative h-4 overflow-hidden">
                <span className="text-[10px] font-mono text-zinc-300 tracking-wider font-bold leading-4 group-hover:-translate-y-4 transition-transform duration-300">
                  {userCount.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold leading-4 group-hover:-translate-y-4 transition-transform duration-300">
                  USERS
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Launch Buttons & Auth */}
          <div className="hidden md:flex items-center justify-end gap-1.5 lg:gap-3 shrink-0">

            {/* --- LAUNCH LINKS --- */}
            <div className="flex items-center gap-2 mr-1 lg:mr-2 border-r border-white/10 pr-3 lg:pr-4">

              {/* Product Hunt */}
              <a
                href={PH_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group/ph relative flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#FF6154]/20 bg-[#FF6154]/[0.05] text-xs font-semibold text-[#FF6154] hover:bg-[#FF6154] hover:text-white hover:shadow-[0_0_20px_rgba(255,97,84,0.3)] transition-all duration-300 overflow-hidden"
                title="Support us on Product Hunt"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/ph:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <ProductHuntIcon className="size-3.5 group-hover/ph:scale-110 transition-transform" />
                <span className="hidden xl:inline">Upvote</span>
                <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#FF6154] animate-pulse group-hover/ph:bg-white" />
              </a>

              {/* Peerlist */}
              <a
                href={PEERLIST_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group/peer relative flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#00AA45]/20 bg-[#00AA45]/[0.05] text-xs font-semibold text-[#00AA45] hover:bg-[#00AA45] hover:text-white hover:shadow-[0_0_20px_rgba(0,170,69,0.3)] transition-all duration-300 overflow-hidden"
                title="Support us on Peerlist"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/peer:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <PeerlistIcon className="size-3.5 group-hover/peer:text-white transition-colors" />
                <span className="hidden xl:inline">Support</span>
              </a>
            </div>

            <a
              href="https://github.com/herin7/whatdoc.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="group/star relative flex items-center gap-1.5 h-8 px-4 rounded-full border border-yellow-500/20 bg-yellow-500/[0.06] text-xs font-semibold text-yellow-300 hover:border-yellow-400/40 hover:bg-yellow-500/[0.12] hover:text-yellow-200 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all duration-300 min-w-fit"
            >
              <Star className="size-3.5 fill-yellow-400 text-yellow-400 group-hover/star:scale-125 group-hover/star:rotate-[20deg] transition-transform duration-300" />
              <span className="relative">Star</span>
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-0 group-hover/star:opacity-100 group-hover/star:animate-ping" />
              <span className="absolute -bottom-0.5 left-2 w-1 h-1 rounded-full bg-yellow-400 opacity-0 group-hover/star:opacity-100 group-hover/star:animate-ping" style={{ animationDelay: '0.3s' }} />
            </a>
            {user ? (
              <>
                {!user.isPro && (
                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 h-8 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <Zap className="size-3.5" />
                    Upgrade
                  </button>
                )}
                <Link to="/dashboard" className="hidden lg:flex items-center gap-2 h-8 px-4 rounded-full border border-white/10 bg-[#111] text-xs font-medium hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
                  <span>Dashboard</span>
                </Link>

                <div className="h-4 w-px bg-white/10 mx-1 hidden lg:block" />

                <Link to="/profile" className="shrink-0 hover:scale-105 transition-transform">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                      {initials}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-7 w-7 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Disconnect"
                >
                  <LogOut className="size-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden lg:block text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="flex items-center justify-center h-8 px-4 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
                  Deploy
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex items-center justify-center h-9 w-9 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0a] px-6 py-6 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111] border border-white/5 mb-2 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold">
              {userCount.toLocaleString()} ONLINE
            </span>
          </div>

          <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/templates" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Templates</Link>
          <Link to="/engine" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">The Engine</Link>

          <div className="flex gap-3 mt-1">
            <a
              href={PH_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#FF6154]/10 border border-[#FF6154]/20 hover:bg-[#FF6154]/20 transition-colors"
            >
              <ProductHuntIcon className="size-4 text-[#FF6154]" />
              <span className="text-sm font-semibold text-[#FF6154]">Upvote on PH</span>
            </a>

            <a
              href={PEERLIST_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#00AA45]/10 border border-[#00AA45]/20 hover:bg-[#00AA45]/20 transition-colors"
            >
              <PeerlistIcon className="size-4 text-[#00AA45]" />
              <span className="text-sm font-semibold text-[#00AA45]">Support Us</span>
            </a>
          </div>

          <a
            href="https://github.com/herin7/whatdoc.xyz"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 w-full justify-center text-white hover:bg-zinc-800 transition-colors"
          >
            <GithubIcon className="size-4" />
            <span className="text-sm font-medium">Star on GitHub</span>
            <Star className="size-4 fill-yellow-500 text-yellow-500 ml-1" />
          </a>

          <div className="h-px bg-white/5 my-2" />

          {user ? (
            <div className="flex flex-col gap-3 mt-2">
              {!user.isPro && (
                <button
                  onClick={() => { setIsUpgradeOpen(true); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 h-10 w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <Zap className="size-4" />
                  Upgrade to Pro
                </button>
              )}
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 w-full rounded-xl border border-white/10 bg-[#111] text-sm font-medium text-white hover:bg-white/5 transition-colors">
                Go to Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center h-10 w-full rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                Disconnect Session
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 rounded-xl border border-white/10 bg-[#111] text-sm font-medium text-white">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 rounded-xl bg-white text-black text-sm font-bold">Deploy Now</Link>
            </div>
          )}
        </div>
      )}
      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
    </div>
  );
}