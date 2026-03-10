const { GoogleGenerativeAI } = require('@google/generative-ai');


// Add new providers here. Each must expose  generate(rawCode, opts) → string
const PROVIDERS = {
    gemini: createGeminiProvider,
    // openai: createOpenAIProvider,    ← future
};

const PROVIDER_LABELS = {
    gemini: 'Google Gemini (gemini-2.5-flash)',
    // openai: 'OpenAI (gpt-4o-mini)',  ← future
};

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 15_000; // 15 s — generous for free-tier RPM


// Free-tier cap: ~800k chars (~200k tokens). Pro users get full 900k.
const FREE_TIER_CHAR_LIMIT = 800_000;

const SYSTEM_PROMPT = `You are an elite Technical Writer and Principal OSS Maintainer. I am providing you with the raw source code of a repository. Your objective is to write production-grade, highly accurate, and human-readable documentation.

CRITICAL TONE & STYLE GUIDELINES (HUMAN-LIKE):
- Write developer-to-developer. Use a direct, objective, and concise tone.
- AVOID AI buzzwords and robotic phrasing (e.g., "delve", "comprehensive", "robust", "tailored", "multifaceted", "seamless").
- AVOID marketing fluff. Do not sell the project; objectively explain how it works.
- NO conversational preambles (e.g., "Here is the documentation for the codebase"). Start immediately with the Markdown headers.

MARKDOWN & FORMATTING RULES (ZERO ERRORS):
- Syntax Highlighting: EVERY fenced code block MUST have a valid, lowercase language identifier (e.g., \`\`\`javascript, \`\`\`python, \`\`\`bash, \`\`\`json, \`\`\`typescript). Never leave a code block untagged.
- Markdown Tables: Ensure all tables have proper headers and aligned separator rows (e.g., |---|---|). Do not use tables for deeply nested JSON objects; use code blocks instead.
- Hierarchy: Use standard heading levels (# for H1, ## for H2, ### for H3). Do not skip levels.
- Code blocks must be properly closed with three backticks.
- Callouts / Alerts: Use GitHub-flavored blockquote alerts to highlight important information. The supported types are NOTE, TIP, and WARNING. Format them EXACTLY like this (the type tag MUST be on its own line immediately after the >):
  > [!NOTE]
  > This is a note callout for general information.
  
  > [!TIP]
  > This is a tip callout for helpful advice.
  
  > [!WARNING]
  > This is a warning callout for critical caveats.
  
  Use callouts strategically — at least 2-4 per document where relevant. Good use cases: prerequisite warnings, environment variable reminders, common pitfalls, version compatibility notes, performance tips.
- Numbered Steps: When documenting setup instructions, deployment steps, or any sequential process, use ordered lists (1. 2. 3.) instead of bullet points. This enables a visual step-by-step UI in the documentation viewer.

ADAPTABILITY (HANDLE ANY REPO TYPE):
First, analyze the codebase to determine its primary paradigm (e.g., REST API, Frontend Web App, CLI Tool, SDK/Library). Adapt your documentation to fit this paradigm:
- If it's a Backend/API: Focus on endpoints, database models, and auth flows.
- If it's a Frontend: Focus on component architecture, state management, routing, and UI structure.
- If it's a Library/SDK: Focus on exported functions, class methods, and usage patterns.

Your output MUST contain exactly TWO documents separated by a single delimiter line.

=== DOCUMENT 1: README.md ===
Write a world-class OSS README covering:

1. **Overview**: 2-3 clear sentences explaining exactly what the codebase does and what problem it solves.
2. **Architecture & Tech Stack**: 
   - List the primary languages, frameworks, and tools used.
   - Explain the high-level system architecture.
   - Generate a clear ASCII/Text diagram showing the core data flow or component tree.
3. **Core Concepts**: Explain the main domain logic. How do the pieces fit together under the hood?
4. **Real-World Usage Examples**: Provide *actual* code examples showing how to use the system. Do NOT use generic "foo/bar" placeholders. Extract real variable names, route names, and component names from the source code to create highly accurate, copy-pasteable snippets.
5. **Local Setup & Installation**: Step-by-step commands (using \`\`\`bash) to install dependencies, set environment variables (list the specific keys required), and run the project locally.

=== DELIMITER ===
After the README content, output EXACTLY this line ONCE and only ONCE:
Do NOT output this delimiter anywhere else in the entire response.

=== DOCUMENT 2: TECHNICAL_REFERENCE.md ===
Generate an exhaustive technical reference based on the detected repo type.

FOR APIs / BACKENDS:
- Document every major endpoint.
- Include: HTTP Method, Path, and Authentication requirements.
- Request Body/Parameters: Explain the required schemas and data types.
- Example Request: Write a plausible \`cURL\` or \`fetch\` command using \`\`\`bash or \`\`\`javascript.
- Example Response: Write a realistic JSON response payload using \`\`\`json based on the database models or controller return statements.
- Internal Flow: Briefly explain what services or database tables this endpoint touches.

FOR API/BACKEND REPOS ONLY — INTERACTIVE PLAYGROUND BLOCKS:
After each endpoint's documentation, append a fenced code block with the language tag "json-api-playground" containing a JSON object with the endpoint's method, path, default headers, and a sample request body. This enables an interactive playground in the documentation viewer. Example:

\`\`\`json-api-playground
{
  "method": "POST",
  "endpoint": "/auth/signup",
  "headers": { "Content-Type": "application/json" },
  "body": { "email": "user@example.com", "password": "securepass123", "username": "newuser" }
}
\`\`\`

Rules for playground blocks:
- ONLY generate these for backend/API repos. If the repo is a frontend or library, skip playground blocks entirely.
- The JSON must be valid and parseable. No trailing commas, no comments inside.
- Use realistic sample values inferred from the code (model schemas, validation rules), not generic placeholders.
- For GET/DELETE endpoints with no body, omit the "body" field or set it to {}.
- Include auth headers (e.g., "Authorization": "Bearer YOUR_TOKEN") if the endpoint requires authentication.

FOR FRONTENDS / LIBRARIES:
- Document key Components, Hooks, Contexts, or Exported Functions.
- Include Props/Arguments, Return values, and Side effects.
- Provide a concrete implementation/import example for each.

STRICT ENFORCEMENT:
- Base EVERYTHING on the provided source code. 
- If a section cannot be filled because the code does not exist, OMIT the section entirely rather than hallucinating fake data.
- Maximize technical depth. If a file contains complex logic, explain that logic step-by-step.`;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Token Guillotine — truncates raw code for free-tier users to prevent
 * abuse of the context window. Returns the (possibly truncated) code
 * and a boolean indicating whether it was cut.
 */
function applyTokenGuillotine(rawCode, isPro = false) {
    if (isPro) return { code: rawCode, wasTruncated: false };

    if (rawCode.length <= FREE_TIER_CHAR_LIMIT) {
        return { code: rawCode, wasTruncated: false };
    }

    // Cut at the limit, but try to end at a file boundary to avoid mid-file garbage
    let cutPoint = FREE_TIER_CHAR_LIMIT;
    const lastFileBoundary = rawCode.lastIndexOf('\n\n--- FILE:', cutPoint);
    if (lastFileBoundary > FREE_TIER_CHAR_LIMIT * 0.7) {
        cutPoint = lastFileBoundary;
    }

    const truncated = rawCode.slice(0, cutPoint);
    const note = `\n\n--- TRUNCATED ---\n⚠️ Free-tier limit reached (${FREE_TIER_CHAR_LIMIT} chars). Upgrade to Pro for full repository analysis.\n`;

    return { code: truncated + note, wasTruncated: true };
}

function createGeminiProvider() {
    return {
        name: 'gemini',
        label: PROVIDER_LABELS.gemini,

        /**
         * Sends the raw concatenated source code to Gemini in ONE call.
         * Retries with exponential backoff on 429.
         *
         * @param {string} rawCode         Concatenated source code with --- FILE: --- headers
         * @param {object} opts            BYOK options
         * @param {string} opts.customKey  User-provided Gemini API key
         * @param {string} opts.targetModel Target model name
         * @param {boolean} opts.isPro     Whether the user has Pro access
         * @returns {Promise<string>}      Combined Markdown (README + SPLIT + API_REFERENCE)
         */
        async generate(rawCode, { customKey, targetModel, isPro } = {}) {
            // BYOK-only: user MUST provide their own API key
            const isCustomKeyValid = customKey && customKey !== 'null' && customKey.trim().length > 20;
            if (!isCustomKeyValid) {
                throw new Error('API key is required. Please provide your own API key (BYOK) to generate documentation.');
            }
            const apiKeyToUse = customKey.trim();
            const modelName = targetModel || 'gemini-2.5-flash';
            const genAI = new GoogleGenerativeAI(apiKeyToUse);
            console.log(`⚡️ Engine starting... Model: ${modelName} | BYOK Active: true`);

            // BYOK users get full context window (no truncation)
            const code = rawCode;

            const model = genAI.getGenerativeModel({ model: modelName });

            const contents = [
                {
                    role: 'user',
                    parts: [
                        { text: SYSTEM_PROMPT },
                        { text: `Here is the raw source code for the entire repository:\n\n${code}` },
                    ],
                },
            ];

            const generationConfig = {
                temperature: 0.3,
                maxOutputTokens: 65536,
            };

            let lastError;
            const startTime = Date.now();

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                try {
                    console.log(`[llm] Sending payload to ${modelName} (Attempt ${attempt + 1}/${MAX_RETRIES + 1}). Wait for Reasoning...`);
                    const result = await model.generateContent({ contents, generationConfig });
                    const text = result.response.text();
                    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

                    if (!text || text.trim().length === 0) {
                        throw new Error('LLM returned an empty response');
                    }

                    // Optional: Get token usage if supported by the library version
                    const usage = result.response.usageMetadata;
                    if (usage) {
                        console.log(`[llm] ✅ Generation Successful in ${duration}s | In: ${usage.promptTokenCount} | Out: ${usage.candidatesTokenCount}`);
                    } else {
                        console.log(`[llm] ✅ Generation Successful in ${duration}s (Token usage unavailable in response)`);
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

module.exports = { getLLMProvider, listProviders, SYSTEM_PROMPT };
