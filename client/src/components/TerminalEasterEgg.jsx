import { useState, useEffect, useCallback } from 'react';

const BOOT_LINES = [
  '[OK] Booting HerinOS v2.0.26...',
  '[OK] Mounting C++ custom memory allocator...',
  '[OK] Initializing MiniDB Engine...',
  '[OK] Fetching competitive programming stats... LeetCode Knight (1881) secured.',
  '[OK] Pinging GitForMe servers... 20,000+ developers acknowledged.',
  '[WARN] Recruiter presence detected in sector 7G.',
  '> Root access granted. Executing hire_herin.sh...',
  '[OK] Spawning microservices... Node gateway online.',
  '[OK] Flask inference engine warmed up.',
  '[OK] Redis cache primed. Latency minimized.',
  '[OK] Parsing 50,000+ files... done in under 3 seconds.',
  '[OK] Compiling scalable system design instincts...',
  '[OK] Initializing builder mindset over textbook theory.',
  '[OK] Deploy history found: shipped → scaled → optimized.',
  '[OK] Competitive coding mode loaded (logic > noise).',
  '[OK] AI-assisted development enabled — human judgment retained.',
  '[INFO] Trust protocol active: AI as amplifier, not replacement.',
  '[INFO] Production-first thinking detected.',
  '[OK] Community impact module loaded (20k+ devs reached).',
  '[OK] Startup-ready execution environment initialized.',
  '[SYSTEM] Ready to build things people actually use.'
];

export default function TerminalEasterEgg() {
    const [input, setInput] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [visibleLines, setVisibleLines] = useState([]);

    // Keystroke listener
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape' && isActive) {
                setIsActive(false);
                setInput('');
                setVisibleLines([]);
                return;
            }

            if (!isActive && e.key.length === 1) {
                setInput((prev) => (prev + e.key).slice(-6));
            }
        }

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isActive]);

    // Trigger activation
    useEffect(() => {
        if (input.toLowerCase() === 'hireme') {
            setIsActive(true);
            setInput('');
        }
    }, [input]);

    // Boot sequence typewriter
    useEffect(() => {
        if (!isActive) return;

        let cancelled = false;
        let i = 0;

        function showNext() {
            if (cancelled || i >= BOOT_LINES.length) return;
            const line = BOOT_LINES[i];
            i++;
            setVisibleLines((prev) => [...prev, line]);
            const delay = Math.floor(Math.random() * 600) + 200;
            setTimeout(showNext, delay);
        }

        const kickoff = setTimeout(showNext, 400);
        return () => {
            cancelled = true;
            clearTimeout(kickoff);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black text-[#00ff00] font-mono p-6 sm:p-8 overflow-hidden">
            {/* Scanline overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background:
                        'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
                }}
            />

            {/* ESC hint */}
            <span className="absolute top-4 right-6 text-[11px] text-[#00ff00]/40 z-20">
                Press ESC to exit
            </span>

            {/* Terminal content */}
            <div className="relative z-20 max-w-3xl">
                {visibleLines.map((line, idx) => (
                    <p
                        key={idx}
                        className="text-sm sm:text-base leading-relaxed mb-1"
                        style={{ textShadow: '0 0 10px #00ff00' }}
                    >
                        {line}
                    </p>
                ))}

                {/* Blinking cursor */}
                <span
                    className="inline-block mt-1 text-lg animate-pulse"
                    style={{ textShadow: '0 0 10px #00ff00' }}
                >
                    _
                </span>
            </div>
        </div>
    );
}
