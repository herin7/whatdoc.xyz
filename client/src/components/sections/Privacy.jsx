import { ShieldCheck, EyeOff, Lock, ServerOff } from 'lucide-react';

const cards = [
  {
    icon: EyeOff,
    title: 'No raw code to the LLM',
    description: 'We extract a structured JSON map. Your actual source code never leaves the container.',
  },
  {
    icon: ServerOff,
    title: 'Temp files auto-deleted',
    description: 'Cloned repos live in /tmp and are wiped the moment docs are generated.',
  },
  {
    icon: Lock,
    title: 'Encrypted at rest',
    description: 'Generated docs and OAuth tokens are encrypted with AES-256 before storage.',
  },
  {
    icon: ShieldCheck,
    title: 'Never used to train AI',
    description: 'Your code architecture stays yours. We don\'t train models on your data.',
  },
];

export default function Privacy() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="px-6 py-16 md:py-24 text-center border-b border-zinc-800">
          <h3 className="mx-auto max-w-2xl text-3xl md:text-4xl leading-tight font-medium text-white">
            Private by design.
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400 text-lg leading-relaxed">
            Your source code never touches the LLM. Your data stays encrypted and never leaves your control.
          </p>
        </div>

        {/* 4-Card Grid — Caret security section style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className={`flex flex-col items-center text-center p-8 md:p-10 border-b border-zinc-800 ${
                i < 3 ? 'lg:border-r' : ''
              } ${i % 2 === 0 ? 'sm:border-r' : ''} ${i === 2 ? 'sm:border-r-0 lg:border-r' : ''}`}
            >
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white/5 border border-white/10 mb-5">
                <card.icon className="size-6 text-emerald-400" />
              </div>
              <h5 className="text-base font-medium text-white mb-2">{card.title}</h5>
              <p className="text-sm text-zinc-500 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
