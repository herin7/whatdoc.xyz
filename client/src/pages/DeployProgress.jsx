import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';
import GenerationTerminal from '../components/GenerationTerminal';

export default function DeployProgress() {
    const { projectId } = useParams();

    // slug is stored in sessionStorage by ConfigureProject before navigating here
    const slug = sessionStorage.getItem('deploy_slug') || '';

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Top bar */}
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
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Deploying documentation</h1>
                        <p className="text-sm text-zinc-500">
                            Your project is being cloned, analyzed, and documented in real time.
                        </p>
                    </div>

                    {/* Terminal */}
                    <GenerationTerminal projectId={projectId} slug={slug} />
                </div>
            </main>
        </div>
    );
}
