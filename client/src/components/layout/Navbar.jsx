import { Globe, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-logo text-lg tracking-tight"> <span className='font-bold'>W</span>HATDOC.XYZ</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex grow gap-1 px-7">
          <Link to="/" className="h-9 px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 rounded-full transition-all hover:bg-emerald-400/20">Home</Link>
          <Link to="/engine" className="h-9 px-4 py-2 text-sm font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Engine</Link>
          <Link to="/creator" className="h-9 px-4 py-2 text-sm font-medium text-zinc-400 rounded-full transition-all hover:bg-white/5 hover:text-white">Hire Me</Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 h-9 px-4 rounded-full border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 transition-all">
                <Link to="/profile" className="shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      {initials}
                    </div>
                  )}
                </Link>
                <span className="text-zinc-300">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center justify-center h-9 px-4 rounded-full border border-zinc-700 bg-zinc-900 text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm">
                Sign In
              </Link>
              <div className="flex items-center rounded-full overflow-hidden shadow-sm">
                <Link to="/signup" className="flex items-center justify-center h-9 px-5 bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-500 transition-all">
                  Get Started
                </Link>
              </div>
            </>
          )}
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
          <Link to="/engine" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">How it Works</Link>
          <Link to="/creator" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-400 hover:text-white">The Builder</Link>
          <hr className="border-zinc-800" />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                      {initials}
                    </div>
                  )}
                </Link>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-400 text-left">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-300">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-black bg-emerald-400 rounded-full h-9 flex items-center justify-center hover:bg-emerald-500 transition-all">Get Started</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}