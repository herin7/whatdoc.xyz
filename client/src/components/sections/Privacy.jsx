import { ShieldCheck, EyeOff, Lock, ServerOff } from 'lucide-react';
import Reveal from '../Reveal';

const cards = [
  {
    icon: EyeOff,
    title: 'No Code Leaks',
    description: 'We never dump your proprietary secrets into an LLM. We extract structure, not secrets.',
  },
  {
    icon: ServerOff,
    title: 'Ephemeral Clones',
    description: 'Repos are cloned to /tmp memory. The exact second docs generate, the container is nuked.',
  },
  {
    icon: Lock,
    title: 'AES-256 Encrypted',
    description: 'Your generated documentation and OAuth tokens are locked down with banking-grade encryption.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero AI Training',
    description: 'Your architecture stays yours. We strictly opt out of data-sharing API endpoints.',
  },
];

export default function Privacy() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl border-x border-zinc-800">
        {/* Section Title */}
        <Reveal>
          <div className="px-6 py-16 md:py-24 text-center border-b border-zinc-800 relative overflow-hidden">
            {/* Subtle security glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
            
            <h3 className="relative z-10 mx-auto max-w-2xl text-3xl md:text-4xl leading-tight font-bold text-white tracking-tight">
              Paranoid? Good. <br/>
              <span className="text-zinc-500 font-medium">So are we.</span>
            </h3>
            <p className="relative z-10 mx-auto mt-5 max-w-xl text-zinc-400 text-lg leading-relaxed">
              We use an LLM, but your secrets don't become part of its brain.            </p>
          </div>
        </Reveal>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div
                className={`flex flex-col items-center text-center p-8 md:p-10 border-b border-zinc-800 h-full hover:bg-zinc-900/50 transition-colors ${
                  i < 3 ? 'lg:border-r' : ''
                } ${i % 2 === 0 ? 'sm:border-r' : ''} ${i === 2 ? 'sm:border-r-0 lg:border-r' : ''}`}
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#111] border border-zinc-700 mb-5 shadow-lg">
                  <card.icon className="size-6 text-emerald-400" />
                </div>
                <h5 className="text-base font-semibold text-white mb-2">{card.title}</h5>
                <p className="text-sm text-zinc-500 leading-relaxed">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}