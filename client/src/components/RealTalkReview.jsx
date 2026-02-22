import { useState } from 'react';
import { Sparkles, Hammer, Ghost, Send, X, Loader2 } from 'lucide-react';

export default function RealTalkReview({ onClose }) {
    const [selection, setSelection] = useState(null); // 'magic', 'promising', 'jank'
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        // Simulate network request for that premium feel
        setTimeout(() => {
            setIsSending(false);
            setSubmitted(true);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* The Backdrop that blurs everything else */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.4s_ease-out]"
                onClick={() => !submitted && onClose()}
            />

            {/* The Glass Card */}
            <div className="relative w-full max-w-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-[slideUpFade_0.5s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                
                {/* Subtle top ambient glow based on selection */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[100px] opacity-20 transition-colors duration-700 pointer-events-none ${
                    selection === 'magic' ? 'bg-emerald-500' : 
                    selection === 'promising' ? 'bg-amber-500' : 
                    selection === 'jank' ? 'bg-rose-500' : 'bg-white/20'
                }`} />

                {/* Close Button */}
                {!submitted && (
                    <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white hover:rotate-90 transition-all duration-300 z-10">
                        <X className="size-5" />
                    </button>
                )}

                {submitted ? (
                    <div className="text-center py-10 animate-[fadeIn_0.5s_ease-out]">
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            <Sparkles className="size-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Message Sent.</h3>
                        <p className="text-zinc-400">Thanks for keeping it real. I'm checking the logs right now.</p>
                        <button 
                            onClick={onClose}
                            className="mt-8 px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Real talk.</h2>
                        <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
                            WHATDOC is a V1 prototype. It's not flawless AGI. Did the engine actually understand your repo's logic, or did it completely hallucinate?
                        </p>

                        {!selection ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Option 1: Magic */}
                                <button 
                                    onClick={() => setSelection('magic')}
                                    className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#111] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                >
                                    <Sparkles className="size-6 text-emerald-400 mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300" />
                                    <span className="text-sm font-bold text-white mb-1">F*cking Magic</span>
                                    <span className="text-xs text-zinc-500">It nailed the architecture perfectly.</span>
                                </button>

                                {/* Option 2: Promising */}
                                <button 
                                    onClick={() => setSelection('promising')}
                                    className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#111] border border-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                                >
                                    <Hammer className="size-6 text-amber-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                                    <span className="text-sm font-bold text-white mb-1">Promising</span>
                                    <span className="text-xs text-zinc-500">Good bones, but it missed a few things.</span>
                                </button>

                                {/* Option 3: Jank */}
                                <button 
                                    onClick={() => setSelection('jank')}
                                    className="group flex flex-col items-center text-center p-6 rounded-2xl bg-[#111] border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]"
                                >
                                    <Ghost className="size-6 text-rose-400 mb-4 group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300" />
                                    <span className="text-sm font-bold text-white mb-1">It's Jank</span>
                                    <span className="text-xs text-zinc-500">Completely hallucinated my codebase.</span>
                                </button>
                            </div>
                        ) : (
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                                        selection === 'magic' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                                        selection === 'promising' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 
                                        'text-rose-400 border-rose-500/30 bg-rose-500/10'
                                    }`}>
                                        {selection === 'magic' ? 'Status: Magic' : selection === 'promising' ? 'Status: Promising' : 'Status: Jank'}
                                    </span>
                                    <button 
                                        onClick={() => setSelection(null)}
                                        className="text-xs font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        ← Change
                                    </button>
                                </div>
                                
                                <textarea
                                    autoFocus
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={
                                        selection === 'magic' ? "That's huge. Drop a quote I can put on the landing page..." :
                                        selection === 'promising' ? "What did the LLM get confused about? I'll patch the prompt..." :
                                        "Damn. Roast the output. What went completely wrong?"
                                    }
                                    className={`w-full h-32 bg-[#111] border rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 outline-none resize-none transition-all ${
                                        selection === 'magic' ? 'focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 border-white/10' : 
                                        selection === 'promising' ? 'focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 border-white/10' : 
                                        'focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 border-white/10'
                                    }`}
                                />
                                
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={handleSend}
                                        disabled={!feedback.trim() || isSending}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isSending ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Transmitting
                                            </>
                                        ) : (
                                            <>
                                                Send to Herin
                                                <Send className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUpFade {
                    from { transform: translateY(30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}