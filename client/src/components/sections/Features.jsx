import { GitBranch, Cpu, FileCode2, Brain } from 'lucide-react';
import Reveal from '../Reveal';

const features = [
  {
    title: 'AST over assumptions.',
    description: "We don't just dump your repo into a blind LLM. The engine parses your Abstract Syntax Tree to extract the absolute truth of your routes, controllers, and schemas.",
    icon: GitBranch,
    visual: 'ingestion',
  },
  {
    title: 'Aesthetic by default.',
    description: 'Stop wrestling with markdown tables. Toggle instantly between a sleek, dark-mode API Gateway or a clean, academic LaTeX style for your SDKs.',
    icon: Cpu,
    visual: 'graph',
  },
  {
    title: 'Bring Your Own Key (BYOK).',
    description: "Got a massive monorepo? Plug in your Gemini API key for unthrottled, limit-free parsing. It stays encrypted in local storage. We never touch it.",
    icon: FileCode2,
    visual: 'extractor',
  },
  {
    title: 'Zero Hallucinations.',
    description: 'Because we extract a rigid JSON map before generation, the AI is handcuffed to reality. It cannot invent fake endpoints. It only documents what compiles.',
    icon: Brain,
    visual: 'brain',
  },
];

function IngestionVisual() {
  return (
    <div className="flex flex-col gap-2 text-[11px] md:text-xs font-mono text-zinc-500 w-full">
      <span className="text-emerald-400">$ git clone --depth 1</span>
      <span>Cloning into '/tmp/repo-x7f9a2'...</span>
      <span>Extracting AST via ts-morph...</span>
      <span className="text-emerald-400">✓ DNA Extracted in 0.8s</span>
    </div>
  );
}

function GraphVisual() {
  return (
    <div className="flex flex-col gap-1 text-[11px] md:text-xs font-mono w-full">
      <span className="text-zinc-400">server.js</span>
      <span className="text-zinc-500 pl-4">└─ routes/api.ts</span>
      <span className="text-emerald-400 pl-8">└─ controllers/auth.ts</span>
      <span className="text-zinc-500 pl-12">└─ schemas/User.ts</span>
      <span className="text-blue-400 pl-8">└─ middleware/jwt.ts</span>
    </div>
  );
}

function ExtractorVisual() {
  return (
    <div className="flex flex-col gap-1 text-[11px] md:text-xs font-mono w-full">
      <span className="text-zinc-500">{'{'}</span>
      <span className="text-emerald-400 pl-4">"POST_signup":</span>
      <span className="text-zinc-400 pl-6">{'{ body: "UserSchema", auth: false }'}</span>
      <span className="text-emerald-400 pl-4">"GET_profile":</span>
      <span className="text-zinc-400 pl-6">{'{ auth: "Bearer", throws: 401 }'}</span>
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
      <span className="text-[11px] md:text-sm text-zinc-300 font-mono tracking-wide">Synthesizing Markdown...</span>
    </div>
  );
}

const visuals = { ingestion: IngestionVisual, graph: GraphVisual, extractor: ExtractorVisual, brain: BrainVisual };

export default function Features() {
  return (
    <section id="how-it-works" className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl border-x border-zinc-800">
        {/* Ribbon Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800 px-6 md:px-8 text-xs font-mono text-emerald-400/60 tracking-widest uppercase">
          <span>[01] The Engine</span>
          <span>/ Architecture</span>
        </div>

        {/* Section Title */}
        <Reveal>
          <div className="border-b border-zinc-800 px-6 py-16 md:py-24 text-center">
            <h3 className="mx-auto max-w-3xl text-3xl md:text-4xl leading-tight font-medium text-white">
              We bypass the boilerplate and parse the{' '}
              <span className="italic text-emerald-400 font-serif">pure logic</span>{' '}
              of your codebase.
            </h3>
          </div>
        </Reveal>

        {/* 2×2 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((feat, i) => {
            const Visual = visuals[feat.visual];
            return (
              <Reveal key={feat.title} delay={i * 120}>
                <div
                  className={`flex flex-col border-b border-zinc-800 h-full ${
                    i % 2 === 0 ? 'md:border-r' : ''
                  }`}
                >
                  {/* Text */}
                  <div className="p-8 md:p-10 grow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                        <feat.icon className="size-4 text-emerald-400" />
                      </div>
                      <h5 className="text-xl font-semibold text-white tracking-tight">{feat.title}</h5>
                    </div>
                    <p className="text-zinc-400 text-[15px] leading-relaxed">{feat.description}</p>
                  </div>

                  {/* Visual Mockup */}
                  <div className="relative h-48 border-t border-zinc-800/60 bg-gradient-to-b from-[#0a0a0a] to-zinc-950 flex items-center justify-center px-8 overflow-hidden">
                    <Visual />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}