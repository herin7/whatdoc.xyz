import { Link2, Rocket, Terminal, FileText } from 'lucide-react';
import Reveal from '../Reveal';

const steps = [
  {
    num: '01',
    icon: Link2,
    title: 'Paste a GitHub URL',
    description: 'Public or private — just drop the link. We handle the rest.',
  },
  {
    num: '02',
    icon: Terminal,
    title: 'We analyze your code',
    description: 'AST parsing, dependency mapping, and route extraction in seconds.',
  },
  {
    num: '03',
    icon: FileText,
    title: 'AI generates the docs',
    description: 'Structured JSON goes to the LLM. Out comes clean, beautiful Markdown.',
  },
  {
    num: '04',
    icon: Rocket,
    title: 'Deployed instantly',
    description: 'Live at whatdoc.xyz/p/your-slug. Share it, embed it, own it.',
  },
];

export default function Workflow() {
  return (
    <section className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl border-x border-zinc-800">
        {/* Ribbon Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6 md:px-8 text-sm font-mono text-emerald-400/60 tracking-wider">
          <span>[02] WORKFLOW</span>
          <span>/ PASTE → DEPLOY</span>
        </div>

        {/* Section Title */}
        <Reveal>
          <div className="border-b border-zinc-800 px-6 py-16 md:py-24 text-center">
            <h3 className="mx-auto max-w-3xl text-3xl md:text-4xl leading-tight font-medium text-white">
              From GitHub link to live docs in{' '}
              <span className="italic text-emerald-400">four steps</span>.
            </h3>
          </div>
        </Reveal>

        {/* Steps — 4-column on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <div
                className={`relative flex flex-col p-8 md:p-10 border-b border-zinc-800 h-full ${
                  i < 3 ? 'lg:border-r' : ''
                } ${i < 2 ? 'sm:border-r' : ''} ${i === 2 ? 'sm:border-r-0 lg:border-r' : ''}`}
              >
                {/* Step number */}
                <span className="text-xs font-mono text-emerald-400/40 mb-6 tracking-widest">{step.num}</span>

                {/* Icon */}
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 mb-5">
                  <step.icon className="size-5 text-emerald-400" />
                </div>

                <h5 className="text-lg font-medium text-white mb-2">{step.title}</h5>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>

                {/* Connecting dot — visible on lg */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-1.5 h-3 w-3 rounded-full bg-zinc-800 border-2 border-emerald-400/30" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
