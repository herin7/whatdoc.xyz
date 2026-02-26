import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Workflow from "../components/sections/Workflow";
import Privacy from "../components/sections/Privacy";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

import { useState, useEffect } from "react";
import { X, ServerCrash, Twitter } from "lucide-react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('hide_freetier_notice');
    if (!hasSeenNotice) {
      // Slight delay for dramatic entrance effect
      const timer = setTimeout(() => setShowPopup(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    localStorage.setItem('hide_freetier_notice', 'true');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Privacy />
        <CTA />
      </main>
      <Footer />

      {/* Premium Free Tier Notice Popup */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[calc(100vw-3rem)] sm:w-[420px] animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-forwards">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/90 p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {/* Background glowing gradients */}
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-[50px] pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-[50px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={dismissPopup}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/5 p-1.5 text-zinc-400 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
            >
              <X size={14} />
            </button>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                <ServerCrash className="size-5" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="flex items-center gap-2 text-sm font-bold tracking-tight text-white">
                  Running on Free Tier Engines
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="pr-4 text-[13px] leading-relaxed text-zinc-400">
                  We're currently scaling our infrastructure using free-tier nodes. If you experience any delays or connection dropouts while generating docs, don't sweat it—just hit retry!
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium italic text-zinc-500">Hit a roadblock?</span>
                  <a href="https://twitter.com/herinnsoni" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10">
                    <Twitter className="size-3" fill="currentColor" /> Reach out
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={dismissPopup}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-[13px] font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all md:hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              Got it! Let's explore.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}