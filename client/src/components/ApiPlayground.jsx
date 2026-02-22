import { useState, useCallback } from 'react';
import { Play, Copy, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const METHOD_COLORS = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    PATCH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function ApiPlayground({ config }) {
    const { method = 'GET', endpoint = '/', headers = {}, body = {} } = config || {};

    const [baseUrl, setBaseUrl] = useState('http://localhost:3000');
    const [headersText, setHeadersText] = useState(JSON.stringify(headers, null, 2));
    const [bodyText, setBodyText] = useState(
        Object.keys(body).length ? JSON.stringify(body, null, 2) : ''
    );
    const [response, setResponse] = useState(null);
    const [statusCode, setStatusCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const methodUpper = method.toUpperCase();
    const hasBody = !['GET', 'HEAD', 'DELETE'].includes(methodUpper);
    const colorClass = METHOD_COLORS[methodUpper] || METHOD_COLORS.GET;

    const runRequest = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        setStatusCode(null);

        try {
            let parsedHeaders = {};
            try {
                parsedHeaders = JSON.parse(headersText);
            } catch {
                throw new Error('Invalid JSON in headers');
            }

            const fetchOpts = {
                method: methodUpper,
                headers: { 'Content-Type': 'application/json', ...parsedHeaders },
            };

            if (hasBody && bodyText.trim()) {
                try {
                    JSON.parse(bodyText); // validate
                } catch {
                    throw new Error('Invalid JSON in request body');
                }
                fetchOpts.body = bodyText;
            }

            const url = `${baseUrl.replace(/\/+$/, '')}${endpoint}`;
            const res = await fetch(url, fetchOpts);
            setStatusCode(res.status);

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const json = await res.json();
                setResponse(JSON.stringify(json, null, 2));
            } else {
                const text = await res.text();
                setResponse(text.slice(0, 5000));
            }
        } catch (err) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    }, [baseUrl, headersText, bodyText, methodUpper, hasBody, endpoint]);

    const copyResponse = useCallback(() => {
        if (!response) return;
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [response]);

    return (
        <div className="my-6 rounded-xl border border-zinc-700/60 bg-zinc-900/80 overflow-hidden shadow-lg">
            {/* Header bar */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800/60 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono border ${colorClass}`}>
                        {methodUpper}
                    </span>
                    <span className="text-sm font-mono text-zinc-300">{endpoint}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <span>Try it</span>
                    {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
            </button>

            {/* Expandable body */}
            {expanded && (
                <div className="px-4 py-4 space-y-4 border-t border-zinc-700/40">
                    {/* Base URL */}
                    <div>
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-1">
                            Base URL
                        </label>
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                            placeholder="http://localhost:3000"
                        />
                    </div>

                    {/* Headers */}
                    <div>
                        <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-1">
                            Headers (JSON)
                        </label>
                        <textarea
                            value={headersText}
                            onChange={(e) => setHeadersText(e.target.value)}
                            rows={3}
                            spellCheck={false}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors resize-y"
                        />
                    </div>

                    {/* Body (only for methods that accept a body) */}
                    {hasBody && (
                        <div>
                            <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wide mb-1">
                                Request Body (JSON)
                            </label>
                            <textarea
                                value={bodyText}
                                onChange={(e) => setBodyText(e.target.value)}
                                rows={6}
                                spellCheck={false}
                                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors resize-y"
                            />
                        </div>
                    )}

                    {/* Run button */}
                    <button
                        onClick={runRequest}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                    >
                        {loading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Play className="size-4" />
                        )}
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>

                    {/* Error */}
                    {error && (
                        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
                            {error}
                        </div>
                    )}

                    {/* Response */}
                    {response !== null && (
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                                        Response
                                    </span>
                                    {statusCode && (
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                                            statusCode < 300
                                                ? 'bg-emerald-500/15 text-emerald-400'
                                                : statusCode < 500
                                                    ? 'bg-amber-500/15 text-amber-400'
                                                    : 'bg-red-500/15 text-red-400'
                                        }`}>
                                            {statusCode}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={copyResponse}
                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre className="px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono text-zinc-300 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap">
                                {response}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
