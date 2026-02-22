import { Link2, Rocket, Terminal, FileText } from 'lucide-react';
import Reveal from '../Reveal';

const steps = [
  {
    num: '01',
    icon: Link2,
    title: 'Drop the URL',
    description: 'Public or private. Just paste your GitHub link and step back.',
  },
  {
    num: '02',
    icon: Terminal,
    title: 'AST Extraction',
    description: 'The engine clones, maps dependencies, and extracts pure routing logic.',
  },
  {
    num: '03',
    icon: FileText,
    title: 'AI Synthesis',
    description: 'The JSON map feeds the LLM. Out comes Twilio-grade Markdown.',
  },
  {
    num: '04',
    icon: Rocket,
    title: 'Live Instantly',
    description: 'Deployed to whatdoc.xyz/p/your-slug. Share it, embed it, flex it.',
  },
];

export default function Workflow() {
  return (
    <section className="border-t border-zinc-800 bg-[#000]">
      <div className="mx-auto max-w-7xl border-x border-zinc-800">
        {/* Ribbon Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6 md:px-8 text-xs font-mono text-emerald-400/60 tracking-widest uppercase">
          <span>[02] Pipeline</span>
          <span>/ T-Minus Zero</span>
        </div>

        {/* Section Title */}
        <Reveal>
          <div className="border-b border-zinc-800 px-6 py-16 md:py-24 text-center">
            <h3 className="mx-auto max-w-3xl text-3xl md:text-4xl leading-tight font-medium text-white tracking-tight">
              From a naked repo to a production-grade portal in{' '}
              <span className="italic text-emerald-400 font-serif">four steps</span>.
            </h3>
          </div>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <div
                className={`relative flex flex-col p-8 md:p-10 border-b border-zinc-800 h-full hover:bg-zinc-900/20 transition-colors ${
                  i < 3 ? 'lg:border-r' : ''
                } ${i < 2 ? 'sm:border-r' : ''} ${i === 2 ? 'sm:border-r-0 lg:border-r' : ''}`}
              >
                {/* Step number */}
                <span className="text-xs font-mono text-emerald-500/40 mb-6 tracking-[0.3em] font-bold">{step.num}</span>

                {/* Icon */}
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 mb-5 shadow-inner">
                  <step.icon className="size-5 text-emerald-400" />
                </div>

                <h5 className="text-lg font-semibold text-white mb-2">{step.title}</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>

                {/* Connecting dot — visible on lg */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-1.5 h-3 w-3 rounded-full bg-[#000] border-2 border-emerald-400/50 z-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}