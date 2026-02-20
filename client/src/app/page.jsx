import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Workflow from "../components/sections/Workflow";
import Privacy from "../components/sections/Privacy";
import CTA from "../components/sections/CTA";
import Footer from "../components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
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