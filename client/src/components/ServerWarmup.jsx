import { useEffect, useState, useMemo } from 'react';

const STATUS_MESSAGES = [
    { threshold: 0, text: 'Connecting to server…', sub: 'Free-tier servers sleep after inactivity' },
    { threshold: 15, text: 'Server is waking up…', sub: 'This usually takes 20–40 seconds' },
    { threshold: 35, text: 'Almost there…', sub: 'Just a few more seconds' },
    { threshold: 55, text: 'Taking longer than usual…', sub: 'Hang tight, connecting now' },
];

function Particle({ delay, duration, x, size, blur }) {
    return (
        <div
            className="absolute rounded-full"
            style={{
                width: size,
                height: size,
                left: `${x}%`,
                bottom: '-10%',
                background: `radial-gradient(circle, rgba(52,211,153,${0.3 + Math.random() * 0.4}) 0%, transparent 70%)`,
                filter: `blur(${blur}px)`,
                animation: `floatUp ${duration}s ${delay}s ease-out infinite`,
            }}
        />
    );
}

export default function ServerWarmup({ status }) {
    const [elapsed, setElapsed] = useState(0);
    const [visible, setVisible] = useState(false);
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 200);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(iv);
    }, []);

    const msg =
        [...STATUS_MESSAGES].reverse().find((m) => elapsed >= m.threshold) ||
        STATUS_MESSAGES[0];

    const displayText = status || msg.text;

    useEffect(() => {
        setTypedText('');
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setTypedText(displayText.slice(0, i));
            if (i >= displayText.length) clearInterval(iv);
        }, 30);
        return () => clearInterval(iv);
    }, [displayText]);

    const progress = Math.min(92, (elapsed / 60) * 100);

    const particles = useMemo(
        () =>
            Array.from({ length: 18 }, (_, i) => ({
                id: i,
                delay: Math.random() * 8,
                duration: 6 + Math.random() * 10,
                x: Math.random() * 100,
                size: 4 + Math.random() * 16,
                blur: 1 + Math.random() * 4,
            })),
        [],
    );

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] overflow-hidden select-none"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" style={{ animation: 'spinSlow 20s linear infinite' }}>
                <div className="absolute inset-0 rounded-full border border-emerald-500/10" />
                <div className="absolute inset-[40px] rounded-full border border-emerald-400/[0.07]" style={{ animation: 'spinSlow 15s linear infinite reverse' }} />
                <div className="absolute inset-[80px] rounded-full border border-emerald-300/[0.05]" style={{ animation: 'spinSlow 25s linear infinite' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_4px_rgba(52,211,153,0.6)]" />
            </div>

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 40%, transparent 70%)',
                    animation: 'auraPulse 4s ease-in-out infinite',
                }}
            />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {particles.map((p) => (
                    <Particle key={p.id} {...p} />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                <div className="relative mb-10">
                    <div
                        className="absolute -inset-6 rounded-3xl border border-emerald-500/20"
                        style={{ animation: 'breathe 3s ease-in-out infinite' }}
                    />
                    <div
                        className="absolute -inset-3 rounded-2xl border border-emerald-400/10"
                        style={{ animation: 'breathe 3s ease-in-out infinite 0.5s' }}
                    />
                    <div
                        className="relative w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)',
                            boxShadow: '0 0 60px rgba(52,211,153,0.35), 0 0 120px rgba(52,211,153,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                            animation: 'logoFloat 6s ease-in-out infinite',
                        }}
                    >
                        <span className="text-[42px] font-black text-white leading-none drop-shadow-lg"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                            W
                        </span>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2 h-7 flex items-center">
                    <span>{typedText}</span>
                    <span
                        className="inline-block w-[2px] h-5 bg-emerald-400 ml-0.5"
                        style={{ animation: 'cursorBlink 0.8s steps(1) infinite' }}
                    />
                </h2>
                <p className="text-sm text-zinc-500 mb-10 max-w-xs transition-all duration-500">
                    {msg.sub}
                </p>

                <div className="w-56 h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-5 backdrop-blur-sm border border-white/[0.03]">
                    <div
                        className="h-full rounded-full relative overflow-hidden"
                        style={{
                            width: `${progress}%`,
                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'linear-gradient(90deg, #059669, #34d399, #6ee7b7)',
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                                animation: 'shimmer 2s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'dotPulse 2s ease-in-out infinite' }} />
                    <span className="text-xs text-zinc-500 tabular-nums tracking-wider">
                        {elapsed}s
                    </span>
                </div>
            </div>

            <style>{`
        @keyframes spinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes auraPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.6; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.15; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52,211,153,0.4); }
          50% { opacity: 0.5; box-shadow: 0 0 0 4px rgba(52,211,153,0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
