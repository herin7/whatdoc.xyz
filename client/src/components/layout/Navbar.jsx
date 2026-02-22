import { Globe, ChevronDown, Menu, X, LogOut, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/config';

export default function Navbar({ variant }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);

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
    const interval = setInterval(fetchUserCount, 15000); // Refresh every 15s
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
    <div className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl px-6">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 relative">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <span className="font-logo text-lg tracking-tight text-white hover:text-emerald-400 transition-colors">
            <span className='font-bold'>W</span>HATDOC.XYZ
          </span>
        </Link>

        {/* Center Section: Desktop Links + Telemetry Pill */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">

          {/* The Links */}
          <div className="flex items-center gap-1">
            <Link to="/" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Home</Link>
            <Link to="/templates" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Templates</Link>
            <Link to="/engine" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Engine</Link>
            <Link to="/creator" className="h-8 px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Hire Me</Link>
          </div>

          {/* THE TELEMETRY PILL (The Flex) */}
          <div className="group flex items-center gap-2 h-7 px-3 rounded-full bg-[#111] border border-white/5 shadow-inner cursor-default overflow-hidden transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/5">
            <div className="relative flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute animate-ping opacity-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative z-10" />
            </div>

            {/* Number */}
            <div className="flex flex-col relative h-4 overflow-hidden">
              <span className="text-[10px] font-mono text-zinc-300 tracking-wider font-bold leading-4 group-hover:-translate-y-4 transition-transform duration-300">
                {userCount.toLocaleString()}
              </span>
              {/* Hover State Text */}
              <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold leading-4 group-hover:-translate-y-4 transition-transform duration-300">
                USERS
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-3 relative z-10">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 h-8 px-4 rounded-full border border-white/10 bg-[#111] text-xs font-medium hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
                <span>Dashboard</span>
              </Link>

              <div className="h-4 w-px bg-white/10 mx-1" />

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
              <Link to="/login" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="flex items-center justify-center h-8 px-4 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300">
                Deploy Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex items-center justify-center h-9 w-9 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0a] px-6 py-6 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
          {/* Mobile Telemetry */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111] border border-white/5 mb-2 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold">
              {userCount.toLocaleString()} ONLINE
            </span>
          </div>

          <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/templates" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Templates</Link>
          <Link to="/engine" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">The Engine</Link>
          <Link to="/creator" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Hire Me</Link>

          <div className="h-px bg-white/5 my-2" />

          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-emerald-400">
                Go to Dashboard →
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-400 text-left w-fit">Disconnect Session</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 rounded-xl border border-white/10 bg-[#111] text-sm font-medium text-white">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-10 rounded-xl bg-white text-black text-sm font-bold">Deploy Now</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}