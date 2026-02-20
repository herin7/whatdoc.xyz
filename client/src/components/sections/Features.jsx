import { GitBranch, Cpu, FileCode2, Brain, ArrowRight, ArrowLeft } from 'lucide-react';

const features = [
  {
    title: 'The Ingestion',
    description: 'Shallow-clones your repo with simple-git. No bloat, just the code that matters.',
    icon: GitBranch,
    visual: 'ingestion',
  },
  {
    title: 'The Graph',
    description: 'Maps how files connect — routes → controllers → models — using dependency-cruiser.',
    icon: Cpu,
    visual: 'graph',
  },
  {
    title: 'The Extractor',
    description: 'AST parsing via ts-morph extracts function signatures, endpoints, and pure logic.',
    icon: FileCode2,
    visual: 'extractor',
  },
  {
    title: 'The Brain',
    description: 'A tiny, structured JSON map goes to the LLM — forcing hallucination-free Markdown.',
    icon: Brain,
    visual: 'brain',
  },
];

function IngestionVisual() {
  return (
    <div className="flex flex-col gap-2 text-xs font-mono text-zinc-500">
      <span className="text-emerald-400">$ git clone --depth 1</span>
      <span>Cloning into '/tmp/repo-a1b2c3'...</span>
      <span>remote: Enumerating objects: 142</span>
      <span className="text-emerald-400">✓ Done in 0.8s</span>
    </div>
  );
}

function GraphVisual() {
  return (
    <div className="flex flex-col gap-1 text-xs font-mono">
      <span className="text-zinc-400">server.js</span>
      <span className="text-zinc-500 pl-4">└─ routes/auth.js</span>
      <span className="text-emerald-400 pl-8">└─ controllers/authController.js</span>
      <span className="text-zinc-500 pl-12">└─ models/User.js</span>
      <span className="text-blue-400 pl-8">└─ middlewares/authmware.js</span>
    </div>
  );
}

function ExtractorVisual() {
  return (
    <div className="flex flex-col gap-1 text-xs font-mono">
      <span className="text-zinc-500">{'{'}</span>
      <span className="text-emerald-400 pl-4">"signup":</span>
      <span className="text-zinc-400 pl-6">{'{ method: "POST", path: "/auth/signup" }'}</span>
      <span className="text-emerald-400 pl-4">"signin":</span>
      <span className="text-zinc-400 pl-6">{'{ method: "POST", path: "/auth/signin" }'}</span>
      <span className="text-zinc-500">{'}'}</span>
    </div>
  );
}

function BrainVisual() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute" />
        <div className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <span className="text-sm text-white font-medium">Generating structured Markdown...</span>
    </div>
  );
}

const visuals = { ingestion: IngestionVisual, graph: GraphVisual, extractor: ExtractorVisual, brain: BrainVisual };

export default function Features() {
  return (
    <section id="how-it-works" className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        {/* Ribbon Header — Caret style */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6 md:px-8 text-sm font-mono text-emerald-400/60 tracking-wider">
          <span>[01] AST ENGINE</span>
          <span>/ HOW IT WORKS</span>
        </div>

        {/* Section Title */}
        <div className="border-b border-zinc-800 px-6 py-16 md:py-24 text-center">
          <h3 className="mx-auto max-w-3xl text-3xl md:text-4xl leading-tight font-medium text-white">
            whatdoc.xyz strips away the noise and extracts the{' '}
            <span className="italic text-emerald-400">pure DNA</span>{' '}
            of your codebase.
          </h3>
        </div>

        {/* 2×2 Features Grid — Caret-style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feat, i) => {
            const Visual = visuals[feat.visual];
            return (
              <div
                key={feat.title}
                className={`flex flex-col border-b border-zinc-800 ${
                  i % 2 === 0 ? 'md:border-r' : ''
                }`}
              >
                {/* Text */}
                <div className="p-8 md:p-10 grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                      <feat.icon className="size-4 text-emerald-400" />
                    </div>
                    <h5 className="text-xl font-medium text-white">{feat.title}</h5>
                  </div>
                  <p className="text-zinc-400 text-[15px] leading-relaxed">{feat.description}</p>
                </div>

                {/* Visual Mockup */}
                <div className="relative h-48 border-t border-zinc-800/60 bg-gradient-to-b from-black to-zinc-950 flex items-center justify-center px-8">
                  <Visual />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}