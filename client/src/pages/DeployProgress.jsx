import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import GenerationTerminal from '../components/GenerationTerminal';

export default function DeployProgress() {
    const { projectId } = useParams();

    // slug is stored in sessionStorage by ConfigureProject before navigating here
    const slug = sessionStorage.getItem('deploy_slug') || '';
    const jobId = sessionStorage.getItem('deploy_jobId') || '';

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md px-6">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between">
                    <Logo className="text-lg" />
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-4 pt-14">
                <div className="w-full max-w-2xl py-16">
                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Deploying documentation</h1>
                        <p className="text-sm text-zinc-400">
                            Your project is being cloned, analyzed, and documented in real time.
                        </p>
                        <div className="mt-3 inline-flex mx-auto items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/90 text-xs px-3 py-1.5 rounded-full font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Note: Advanced reasoning templates (like Pro models) may take 1-2 minutes.
                        </div>
                    </div>

                    {/* Terminal */}
                    <GenerationTerminal projectId={projectId} slug={slug} jobId={jobId} />
                </div>
            </main>
        </div>
    );
}
