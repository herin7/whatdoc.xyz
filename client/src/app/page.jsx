import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Workflow from "../components/sections/Workflow";
import Privacy from "../components/sections/Privacy";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

import { useState } from "react";

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {showPopup && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-emerald-600 text-white px-3 py-2 rounded-md shadow-lg flex items-center gap-2 animate-fade-in-down text-xs sm:text-sm max-w-[90vw] sm:max-w-md w-fit">
          <span className="font-semibold">All issues resolved.</span>
          <span className="hidden xs:inline">Sorry for the inconvenience!</span>
          <button
            className="ml-2 px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-[10px] sm:text-xs font-medium transition-colors"
            onClick={() => setShowPopup(false)}
            aria-label="Close notification"
          >
            Close
          </button>
        </div>
      )}
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Privacy />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}