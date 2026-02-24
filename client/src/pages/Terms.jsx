import { ArrowLeft, ShieldCheck, Scale, Database, TerminalSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
    const lastUpdated = "February 24, 2026";

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans relative selection:bg-emerald-500/30 pb-20">

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none flex justify-center z-0">
                <div className="absolute top-[-20%] w-[800px] h-[400px] rounded-[100%] bg-emerald-500/5 blur-[120px]" />
            </div>

            <div className="max-w-3xl mx-auto px-6 pt-24 relative z-10">

                {/* Back Button */}
                <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-zinc-400 text-sm font-mono border-l-2 border-emerald-500/50 pl-3">
                        Last updated: {lastUpdated}
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 leading-relaxed">

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <TerminalSquare className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">1. Welcome to the Engine</h2>
                        </div>
                        <p className="text-zinc-400">
                            By accessing and using WhatDoc.xyz ("the Service"), you agree to be bound by these terms.
                            We built this tool to help developers generate beautiful documentation from their GitHub repositories.
                            We ask that you use it responsibly, don't spam our APIs, and don't use it to generate or host
                            malicious content.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Database className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">2. Your Code & Data</h2>
                        </div>
                        <p className="text-zinc-400 mb-4">
                            <strong>You own your code.</strong> WhatDoc reads your repository to generate documentation,
                            but we do not claim any ownership over your source code, IP, or the generated documentation.
                        </p>
                        <ul className="space-y-2 text-zinc-400 list-disc pl-5">
                            <li>Public Repositories: We read them to generate public docs.</li>
                            <li>API Keys: If you provide your own LLM API keys (e.g., Gemini), they are stored securely and used exclusively for your requests.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">3. Acceptable Use & API Limits</h2>
                        </div>
                        <p className="text-zinc-400">
                            We provide a limited number of free AI generations per user to keep our servers alive.
                            Attempting to bypass these limits via automated scripts, multiple account creation, or
                            other exploits will result in a permanent ban.
                            Do not use our custom domain routing to host phishing sites, malware, or illegal content.
                            We will aggressively take down abusive domains.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Scale className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">4. "As Is" Service</h2>
                        </div>
                        <p className="text-zinc-400">
                            This is a developer tool built in public. The Service is provided "as is" and "as available"
                            without warranties of any kind. We do our best to ensure uptime, fast generation, and secure
                            SSL routing, but we are not liable for any lost data, downtime, or impact on your business
                            due to service interruptions.
                        </p>
                    </section>

                    {/* Footer Contact */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <p className="text-sm text-zinc-500">
                            Questions about these terms? Found a bug? <br />
                            Reach out to us on Twitter/X:{' '}
                            <a href="https://x.com/whatdoc_xyz" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                                @whatdoc_xyz
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}