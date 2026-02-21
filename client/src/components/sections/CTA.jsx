import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../Reveal';

export default function CTA() {
  return (
    <section className="relative border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 text-center z-10">
        <Reveal>
          <h3 className="mx-auto max-w-2xl text-3xl md:text-5xl font-medium leading-tight text-white mb-6">
            Try whatdoc today
          </h3>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto max-w-lg text-lg text-zinc-400 mb-10 leading-relaxed">
            No more boring README files. Generate beautiful, hosted documentation in seconds.
          </p>
        </Reveal>
        <Reveal delay={200} distance={12}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/signup"
            className="group flex items-center gap-2 h-12 px-8 rounded-full bg-emerald-400 text-black text-sm font-semibold hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(52,211,153,0.25)]"
          >
            Get Started Free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 h-12 px-8 rounded-full border border-zinc-700 bg-zinc-900/80 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
          >
            Book a demo
          </a>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
