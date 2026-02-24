import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ExternalLink, AlertCircle, Terminal, Square } from 'lucide-react';
import { project as projectApi } from '../lib/api';
import { API_URL } from '../lib/config';

const STATUS_COLORS = {
    queued: 'text-blue-400',
    scanning: 'text-yellow-400',
    analyzing: 'text-cyan-400',
    generating: 'text-purple-400',
    ready: 'text-emerald-400',
    failed: 'text-red-400',
};

const STATUS_LABELS = {
    queued: 'Queued',
    scanning: 'Scanning',
    analyzing: 'Analyzing',
    generating: 'Generating Data...',
    ready: 'Complete',
    failed: 'Failed',
};

/**
 * Real-time terminal that streams SSE logs from the generation pipeline.
 *
 * @param {{ projectId: string, slug?: string }} props
 */
export default function GenerationTerminal({ projectId, slug, jobId }) {
    const [logs, setLogs] = useState([]);
    const [status, setStatus] = useState('connecting');
    const [connected, setConnected] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const pollInterval = useRef(null);


    useEffect(() => {
        if (!jobId) return; // Fallback to direct SSE if no jobId

        const checkQueue = async () => {
            try {
                const res = await projectApi.getJobStatus(jobId);
                if (res.state === 'waiting' || res.state === 'delayed') {
                    setStatus('queued');
                    setLogs((prev) => {
                        // Prevent spamming the exact same log every second
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg && lastMsg.message.includes('Position in queue')) return prev;
                        return [...prev, { type: 'system', message: 'Job added to queue. Waiting for an available worker...', ts: Date.now() }];
                    });
                } else if (res.state === 'active') {
                    // Job started! Stop polling and let SSE take over.
                    if (pollInterval.current) clearInterval(pollInterval.current);
                    connectSSE();
                } else if (res.state === 'completed' || res.state === 'failed') {
                    // Missed the active window (job finished extremely fast or failed instantly)
                    if (pollInterval.current) clearInterval(pollInterval.current);
                    setStatus(res.state === 'completed' ? 'ready' : 'failed');
                    connectSSE(); // Connect briefly just in case there are lingering events or to trigger final UI
                }
            } catch (err) {
                console.error('Job polling failed:', err);
                if (pollInterval.current) clearInterval(pollInterval.current);
                connectSSE(); // Fallback to raw SSE
            }
        };

        checkQueue(); // Fire immediately
        pollInterval.current = setInterval(checkQueue, 2000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [jobId]);


    const connectSSE = () => {
        if (!projectId) return;

        const token = localStorage.getItem('token');
        const url = `${API_URL}/projects/${projectId}/stream${token ? `?token=${token}` : ''}`;

        const es = new EventSource(url);

        es.onopen = () => {
            setConnected(true);
            setLogs((prev) => [
                ...prev,
                { type: 'system', message: 'Connected to pipeline stream', ts: Date.now() },
            ]);
        };

        es.addEventListener('status', (e) => {
            try {
                const data = JSON.parse(e.data);
                setStatus(data.status);
                setLogs((prev) => [
                    ...prev,
                    { type: 'status', status: data.status, message: data.message, ts: data.ts || Date.now() },
                ]);

                // Terminal states — close connection
                if (data.status === 'ready' || data.status === 'failed') {
                    es.close();
                }
            } catch { /* malformed — ignore */ }
        });

        es.addEventListener('log', (e) => {
            try {
                const data = JSON.parse(e.data);
                setLogs((prev) => [
                    ...prev,
                    { type: 'log', step: data.step, message: data.message, ts: Date.now() },
                ]);
            } catch { /* malformed — ignore */ }
        });

        es.onerror = () => {
            // EventSource auto-reconnects; only log if we haven't reached a terminal state
            setLogs((prev) => {
                const last = prev[prev.length - 1];
                if (last?.status === 'ready' || last?.status === 'failed') return prev;
                return [
                    ...prev,
                    { type: 'error', message: 'Connection interrupted — retrying…', ts: Date.now() },
                ];
            });
        };

        return () => {
            es.close();
        };
    };

    // If no jobId was passed, connect SSE immediately for backwards compatibility
    useEffect(() => {
        let cleanup;
        if (!jobId) cleanup = connectSSE();
        return () => { if (cleanup) cleanup(); };
    }, [projectId, jobId]);

    useEffect(() => {
        let timer1, timer2;
        if (status === 'generating') {
            timer1 = setTimeout(() => {
                setLogs((prev) => [
                    ...prev,
                    { type: 'system', message: 'Analyzing deep context... Pro & advanced models can take up to 60-90 seconds.', ts: Date.now() },
                ]);
            }, 12000); // Wait 12 seconds before warning

            timer2 = setTimeout(() => {
                setLogs((prev) => [
                    ...prev,
                    { type: 'system', message: 'Still reasoning... Building comprehensive documentation structure. Please do not close the page.', ts: Date.now() },
                ]);
            }, 35000); // 35 seconds warning
        }
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [status]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const fmtTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const lineColor = (entry) => {
        if (entry.type === 'error') return 'text-red-400';
        if (entry.type === 'system') return 'text-zinc-500';
        if (entry.type === 'status') return STATUS_COLORS[entry.status] || 'text-green-400';
        // log entries — colour by step
        if (entry.step === 'cloning') return 'text-yellow-400';
        if (entry.step === 'analyzing') return 'text-cyan-400';
        if (entry.step === 'generating') return 'text-purple-400';
        if (entry.step === 'cleanup') return 'text-zinc-500';
        return 'text-green-400';
    };

    const stepTag = (entry) => {
        if (entry.type === 'system') return 'SYS';
        if (entry.type === 'error') return 'ERR';
        if (entry.type === 'status') return 'STATUS';
        return (entry.step || 'log').toUpperCase();
    };

    const isTerminal = status === 'ready' || status === 'failed';

    const handleCancel = async () => {
        if (cancelling || isTerminal) return;
        setCancelling(true);
        try {
            await projectApi.cancel(projectId);
            setLogs((prev) => [
                ...prev,
                { type: 'system', message: 'Cancellation requested — waiting for pipeline to stop…', ts: Date.now() },
            ]);
        } catch {
            setCancelling(false);
        }
    };

    return (
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
            {/* ── Title bar  */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60">
                <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-400 font-mono">generation-pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Cancel button — only while running */}
                    {!isTerminal && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Square className="size-3" />
                            {cancelling ? 'Stopping…' : 'Stop'}
                        </button>
                    )}
                    {/* Traffic-light dots */}
                    <div className={`h-2.5 w-2.5 rounded-full ${status === 'ready'
                        ? 'bg-emerald-400'
                        : status === 'failed'
                            ? 'bg-red-400'
                            : 'bg-yellow-400 animate-pulse'
                        }`} />
                    <span className={`text-xs font-mono font-semibold ${STATUS_COLORS[status] || 'text-zinc-500'} ${status === 'generating' ? 'animate-pulse' : ''}`}>
                        {STATUS_LABELS[status] || status}
                    </span>
                </div>
            </div>

            {/* ── Terminal body ── */}
            <div
                ref={containerRef}
                className="bg-black text-green-400 font-mono text-[13px] leading-relaxed p-4 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
                {/* Initial prompt */}
                <div className="text-zinc-600 mb-1">
                    <span className="text-zinc-500">$</span> whatdoc generate --project {projectId.slice(0, 8)}…
                </div>

                {logs.map((entry, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-zinc-600 shrink-0 select-none">{fmtTime(entry.ts)}</span>
                        <span className={`shrink-0 w-20 text-right select-none ${lineColor(entry)}`}>
                            [{stepTag(entry)}]
                        </span>
                        <span className={lineColor(entry)}>{entry.message}</span>
                    </div>
                ))}

                {/* Blinking cursor while still running */}
                {!isTerminal && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-zinc-600">$</span>
                        <span className="inline-block w-2 h-4 bg-green-400 animate-pulse rounded-sm" />
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
            </div>

            {/* ── Footer — CTA buttons  */}
            {isTerminal && (
                <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
                    {status === 'ready' ? (
                        <>
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <CheckCircle2 className="size-4" />
                                <span className="font-medium">Documentation generated successfully</span>
                            </div>
                            <Link
                                to={slug ? `/p/${slug}` : '/dashboard'}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-500 transition-colors"
                            >
                                View Documentation
                                <ExternalLink className="size-3.5" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle className="size-4" />
                                <span className="font-medium">Pipeline failed</span>
                            </div>
                            <Link
                                to="/import"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                Try Again
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
