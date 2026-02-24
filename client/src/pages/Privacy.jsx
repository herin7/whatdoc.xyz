import { ArrowLeft, Eye, Server, Key, ShieldAlert, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
    const lastUpdated = "February 24, 2026";

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans relative selection:bg-emerald-500/30 pb-20">


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
                        Privacy Policy
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
                                <Eye className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">1. Data We Collect</h2>
                        </div>
                        <p className="text-zinc-400">
                            We collect the bare minimum required to make WhatDoc work. This includes:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 text-zinc-400">
                            <li><strong>Account Info:</strong> Your email, name, and GitHub username (if linked).</li>
                            <li><strong>Repository Data:</strong> We temporarily fetch the code from the public and authorized private repositories you provide to generate documentation. This codebase data is processed securely in memory and NEVER permanently stored on our servers.</li>
                            <li><strong>Analytics:</strong> Basic, anonymized usage data (like page views) to help us see if our servers are going to crash.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Key className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">2. Your API Keys (Bring Your Own Key)</h2>
                        </div>
                        <p className="text-zinc-400">
                            If you input your own LLM API key (Bring Your Own Key) to bypass our generation limits or access max-reasoning models, this key is <strong>stored securely in your local browser storage (localStorage)</strong>. It is securely relayed contextually to the AI providers during generation and is NEVER persisted in our databases. We strongly recommend setting spending limits on your API provider accounts.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Server className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">3. Third-Party Infrastructure</h2>
                        </div>
                        <p className="text-zinc-400">
                            We rely on third-party giants to run this service. Your data passes through Vercel (hosting), Render (backend), MongoDB (database), Cloudflare (SSL/DNS), and Google Gemini (AI generation). By using WhatDoc, you acknowledge that your data is subject to the privacy policies and security practices of these third-party providers. We are not responsible for breaches or outages on their end.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <ShieldAlert className="w-4 h-4 text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">4. No Sensitive Data & Limitation of Liability</h2>
                        </div>
                        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5">
                            <p className="text-zinc-300 text-sm">
                                <strong>DO NOT UPLOAD SECRETS.</strong> WhatDoc is a tool designed for public documentation. Do not connect repositories containing passwords, private API keys, personally identifiable information (PII), or confidential company IP.
                                <br /><br />
                                The Service is provided on an "as-is" basis. <strong>The developer(s) of WhatDoc assume ZERO liability</strong> for any data leaks, data loss, security breaches, or damages resulting from the use of this service. You use this tool entirely at your own risk.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Trash2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">5. Deletion & Data Rights</h2>
                        </div>
                        <p className="text-zinc-400">
                            You can delete your projects and disconnect your GitHub at any time through the dashboard. We reserve the right to delete inactive accounts, wipe generated documentation, or shut down the service entirely without prior notice.
                        </p>
                    </section>

                    {/* Footer Contact */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <p className="text-sm text-zinc-500">
                            Questions? Reach out to us on Twitter/X:{' '}
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