const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getNextApiKey } = require('../utils/keyManager');

// ── Supported providers ─────────────────────────────────────────────
// Add new providers here. Each must expose  generate(contextMapJSON) → string
const PROVIDERS = {
    gemini: createGeminiProvider,
    // openai: createOpenAIProvider,    ← future
};

const PROVIDER_LABELS = {
    gemini: 'Google Gemini (gemini-2.5-flash)',
    // openai: 'OpenAI (gpt-4o-mini)',  ← future
};

// ── Retry config ────────────────────────────────────────────────────
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 15_000; // 15 s — generous for free-tier RPM

// ── Context-map size caps (keeps prompt within token budget) ────────
const MAX_ROUTES = 120;
const MAX_MODELS = 50;
const MAX_EXPORTS = 200;

// ── System prompt ───────────────────────────────────────────────────
// The ENTIRE Context Map is sent in ONE prompt. No per-file or per-route
// looping — exactly 1 call to generateContent per repository.
const SYSTEM_PROMPT = `You are a senior technical writer employed at a world-class developer tools company.

You will receive a SINGLE JSON "Context Map" that represents the ENTIRE codebase.
It was extracted via static analysis (AST) and contains ALL routes, models, and exports
from every file in the repository — already aggregated for you.

The Context Map contains:
  • routes   — HTTP method, URL path, source file, framework type (express / nextjs)
  • models   — Mongoose model name, schema field names, source file
  • exports  — exported function/variable names, parameter names & types, source file
  • fileCount — total number of source files analysed

Your task — produce ALL documentation in this single response:

1. Generate a comprehensive **README.md** covering:
   - Project overview (infer from the routes, models, tech stack)
   - Tech stack list
   - Getting started / installation steps
   - Environment variables (infer from common patterns)
   - Project structure (derive from the file paths in the Context Map)
   - Available API endpoints (table with Method, Path, Description)
   - Database models (table with Model, Fields)

2. Then generate an **API_REFERENCE.md** covering:
   - Each route grouped by resource/file
   - HTTP method, path, description, request body fields (infer from model schemas)
   - Response format (reasonable inference)
   - Authentication notes (if auth middleware is visible)

Rules:
- Output ONLY valid Markdown. No prose outside the Markdown.
- Separate the two documents with a line containing exactly: <!-- SPLIT -->
- Do NOT hallucinate endpoints, fields, or features that are not in the Context Map.
- If data is insufficient to fill a section, simply omit that section entirely.
- Be concise but thorough. Use tables, code blocks, and proper heading hierarchy.
- Do NOT include the raw JSON in the output.
- This is a BATCH request — cover every route, every model, every export in ONE pass.`;

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Sleep helper for exponential backoff.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Trim a context map so the stringified payload stays within a reasonable
 * token budget.  Mutates nothing — returns a new object.
 */
function trimContextMap(contextMap) {
    return {
        routes: contextMap.routes.slice(0, MAX_ROUTES),
        models: contextMap.models.slice(0, MAX_MODELS),
        exports: contextMap.exports.slice(0, MAX_EXPORTS),
        fileCount: contextMap.fileCount,
        ...(contextMap.routes.length > MAX_ROUTES && { _routesTruncated: true }),
        ...(contextMap.exports.length > MAX_EXPORTS && { _exportsTruncated: true }),
    };
}

// ── Gemini provider ─────────────────────────────────────────────────
function createGeminiProvider() {
    return {
        name: 'gemini',
        label: PROVIDER_LABELS.gemini,

        /**
         * Batch-prompt: sends the ENTIRE context map in exactly ONE
         * generateContent call.  Retries with exponential backoff on 429.
         *
         * @param {string} contextMapJSON  Stringified (already trimmed) Context Map
         * @returns {Promise<string>}      Combined Markdown (README + SPLIT + API_REFERENCE)
         */
        async generate(contextMapJSON, { customKey, targetModel } = {}) {
            // BYOK: use custom key if provided, otherwise round-robin
            const apiKeyToUse = customKey || getNextApiKey();
            const modelName = targetModel || 'gemini-2.5-flash';
            const genAI = new GoogleGenerativeAI(apiKeyToUse);
            console.log(`⚡️ Engine starting... Model: ${modelName} | Custom Key Used: ${!!customKey}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const contents = [
                {
                    role: 'user',
                    parts: [
                        { text: SYSTEM_PROMPT },
                        { text: `Here is the full Context Map JSON for the entire repository (one object, all data):\n\n${contextMapJSON}` },
                    ],
                },
            ];

            const generationConfig = {
                temperature: 0.3,
                maxOutputTokens: 65536,
            };

            let lastError;

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    // ── Exactly 1 API call per attempt ──────────────
                    const result = await model.generateContent({ contents, generationConfig });
                    const text = result.response.text();

                    if (!text || text.trim().length === 0) {
                        throw new Error('LLM returned an empty response');
                    }

                    return text;
                } catch (err) {
                    lastError = err;
                    const is429 = err?.status === 429
                        || err?.message?.includes('429')
                        || err?.message?.toLowerCase().includes('rate limit')
                        || err?.message?.toLowerCase().includes('resource exhausted');

                    if (is429 && attempt < MAX_RETRIES) {
                        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
                        console.warn(`[llm] 429 rate-limited — retrying in ${backoff / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})`);
                        await sleep(backoff);
                        continue;
                    }

                    throw err;
                }
            }

            throw lastError;
        },
    };
}

// ── Factory ─────────────────────────────────────────────────────────

/**
 * Get a provider instance by name.
 * @param {'gemini'|'openai'} providerName
 */
function getLLMProvider(providerName = 'gemini') {
    const factory = PROVIDERS[providerName];
    if (!factory) {
        throw new Error(`Unknown LLM provider: "${providerName}". Available: ${Object.keys(PROVIDERS).join(', ')}`);
    }
    return factory();
}

function listProviders() {
    return Object.entries(PROVIDER_LABELS).map(([key, label]) => ({ key, label }));
}

module.exports = { getLLMProvider, listProviders, trimContextMap, SYSTEM_PROMPT };
