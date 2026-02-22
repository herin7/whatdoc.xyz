const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs/promises');
const simpleGit = require('simple-git');
const ignore = require('ignore');
const Project = require('../models/Project');
const { getLLMProvider } = require('./llm');

// ── Global emitter ──────────────────────────────────────────────────
// Events are namespaced per project:  `status:<projectId>`  and  `log:<projectId>`
const engineEmitter = new EventEmitter();
engineEmitter.setMaxListeners(100); // allow many concurrent SSE clients

// ── Paths ───────────────────────────────────────────────────────────
const TMP_ROOT = path.join(__dirname, '..', 'tmp');

// ── Cancellation ────────────────────────────────────────────────────
const cancelledSet = new Set();

function requestCancel(projectId) {
    cancelledSet.add(projectId);
}

function isCancelled(projectId) {
    return cancelledSet.has(projectId);
}

function clearCancel(projectId) {
    cancelledSet.delete(projectId);
}

/** Throw if the pipeline was cancelled between steps. */
function checkCancelled(projectId) {
    if (isCancelled(projectId)) {
        throw new Error('Pipeline cancelled by user');
    }
}

// ── Helpers ─────────────────────────────────────────────────────────
function emit(projectId, type, payload) {
    engineEmitter.emit(`${type}:${projectId}`, payload);
}

async function setStatus(projectId, status, message) {
    await Project.findByIdAndUpdate(projectId, { status });
    emit(projectId, 'status', { status, message, ts: Date.now() });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Allowed file extensions / names for universal ingestion ──────────
const ALLOWED_EXTENSIONS = new Set([
    '.js', '.jsx', '.ts', '.tsx',
    '.py', '.java', '.kt', '.scala',
    '.cpp', '.c', '.h', '.hpp',
    '.go', '.rs', '.rb', '.php', '.cs', '.swift',
    '.md', '.json', '.yml', '.yaml',
]);
const ALLOWED_EXACT_NAMES = new Set(['Dockerfile', 'Makefile']);

// ── Fat-Trimmer Blacklist ───────────────────────────────────────────
// Files & directories that waste tokens but provide zero documentation value.
const BLOCKED_FILENAMES = new Set([
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'Cargo.lock', 'Gemfile.lock', 'composer.lock', 'poetry.lock',
    '.DS_Store', 'Thumbs.db',
    // Block existing docs — we generate our own from source code, not from READMEs
    'README.md', 'README.rst', 'README.txt', 'README',
    'CHANGELOG.md', 'CHANGELOG.txt', 'CHANGES.md',
    'CONTRIBUTING.md', 'CONTRIBUTORS.md',
    'LICENSE', 'LICENSE.md', 'LICENSE.txt',
    'CODE_OF_CONDUCT.md',
]);

const BLOCKED_DIRS = new Set([
    'dist', 'build', 'out', '.next', '.nuxt', '.output',
    '__pycache__', '.pytest_cache', 'coverage',
    '__tests__', '__test__', '__mocks__',
    'vendor', '.gradle', '.idea', '.vscode',
]);

/** Returns true if the filename matches a minified / bundle / test pattern */
function isBlockedPattern(filename) {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.min.js') || lower.endsWith('.min.css')) return true;
    if (lower.endsWith('.bundle.js') || lower.endsWith('.chunk.js')) return true;
    if (lower.endsWith('.map'))  return true;   // source maps
    // Test files — strip before checking (e.g. auth.test.js → test)
    if (/\.(test|spec)\.(js|jsx|ts|tsx|py|java)$/i.test(filename)) return true;
    return false;
}

// ── Regex Guillotine — lightweight per-file content compressor ──────
/**
 * Fast, regex-based minification that strips noise the LLM doesn't need.
 *   1. Block comments (/* … * /) — copyright headers, JSDoc novels
 *   2. Consecutive single-line comment blocks (3+ lines of //)
 *   3. Base64 / data-URI blobs (data:image/…;base64,…)
 *   4. Hardcoded long arrays / objects (>500 chars on one line)
 *   5. Collapse 3+ blank lines → 1
 */
function minifyFileContent(raw) {
    let s = raw;

    // 1. Strip block comments  /* ... */  (non-greedy)
    s = s.replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Collapse runs of 3+ consecutive single-line comments into one note
    s = s.replace(/(?:^[ \t]*\/\/.*\n){3,}/gm, '// [comments collapsed]\n');

    // 3. Truncate base64 / data-URI blobs
    s = s.replace(/data:[\w+/.-]+;base64,[A-Za-z0-9+/=]{100,}/g, '[BASE64 DATA TRUNCATED]');

    // 4. Truncate long string literals (>500 chars) — catches hardcoded SVGs, mock data
    s = s.replace(/(["`'])(?:[^\\]|\\.){500,}?\1/g, '$1[LONG STRING TRUNCATED]$1');

    // 5. Truncate long single-line arrays/objects (>600 chars on one line)
    s = s.replace(/^(.{0,20})(\[.{600,}\]|\{.{600,}\})(.*)$/gm, '$1[DATA TRUNCATED]$3');

    // 6. Collapse 3+ consecutive blank lines → 1
    s = s.replace(/(\n\s*){3,}/g, '\n\n');

    return s;
}

// ── Hard character cap for the raw code payload ─────────────────────
const MAX_CHARS = 900_000; // ~225k tokens — fits comfortably in Gemini's 1M context

/**
 * Walk the cloned repo recursively, respecting .gitignore + Fat-Trimmer
 * blacklist, minify each file with the Regex Guillotine, and concatenate
 * all source files into a single string.
 *
 * Returns { rawCode, fileCount }.
 */
async function extractArchitectureUniversal(repoPath) {
    let combinedCode = '';
    let fileCount = 0;

    // ── Set up .gitignore filtering + blocked dirs ──────────────────
    const ig = ignore();
    ig.add('.git');
    ig.add('node_modules');
    // Inject Fat-Trimmer blocked directories into the ignore filter
    for (const dir of BLOCKED_DIRS) ig.add(dir);

    try {
        const gitignorePath = path.join(repoPath, '.gitignore');
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
        ig.add(gitignoreContent);
    } catch {
        // No .gitignore — that's fine
    }

    // ── Recursive directory walker ──────────────────────────────────
    async function walkDir(currentPath, relativePath = '') {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryRelativePath = relativePath
                ? `${relativePath}/${entry.name}`
                : entry.name;

            if (ig.ignores(entryRelativePath)) continue;

            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                await walkDir(fullPath, entryRelativePath);
            } else if (entry.isFile()) {
                // ── Fat-Trimmer: skip blacklisted filenames & patterns ──
                if (BLOCKED_FILENAMES.has(entry.name)) continue;
                if (isBlockedPattern(entry.name)) continue;

                const ext = path.extname(entry.name).toLowerCase();
                const isAllowed = ALLOWED_EXTENSIONS.has(ext) || ALLOWED_EXACT_NAMES.has(entry.name);

                if (isAllowed && combinedCode.length < MAX_CHARS) {
                    try {
                        const raw = await fs.readFile(fullPath, 'utf8');
                        // ── Regex Guillotine: compress content before appending ──
                        const content = minifyFileContent(raw);
                        combinedCode += `\n\n--- FILE: ${entryRelativePath} ---\n\n${content}`;
                        fileCount++;
                    } catch {
                        // Skip unreadable files (binary masquerading as text, etc.)
                    }
                }
            }
        }
    }

    await walkDir(repoPath);

    // Trim to hard cap if somehow exceeded
    if (combinedCode.length > MAX_CHARS) {
        combinedCode = combinedCode.slice(0, MAX_CHARS);
        console.log(`[ingest] Trimmed raw code to ${MAX_CHARS} chars`);
    }

    return { rawCode: combinedCode, fileCount };
}

// ── Generation pipeline ─────────────────────────────────────────────
async function runGenerationPipeline(projectId, repoUrl, llmProvider = 'gemini', byokOptions = {}) {
    const tempPath = path.join(TMP_ROOT, projectId);

    try {
        // ── Step 1 — Clone ──────────────────────────────────────────
        checkCancelled(projectId);
        await setStatus(projectId, 'scanning', 'Cloning repository…');
        emit(projectId, 'log', { step: 'cloning', message: 'Cloning repository...' });

        // Ensure tmp directory exists
        await fs.mkdir(tempPath, { recursive: true });

        // Shallow clone (--depth 1) — fast, minimal disk usage
        const git = simpleGit();
        await git.clone(repoUrl, tempPath, ['--depth', '1']);

        // Quick file count for the log
        const files = await fs.readdir(tempPath, { recursive: true });
        const fileCount = files.length;
        emit(projectId, 'log', { step: 'cloning', message: `Repository cloned — ${fileCount} entries found` });

        // ── Step 2 — Universal Code Ingestion ────────────────────────
        checkCancelled(projectId);
        await setStatus(projectId, 'analyzing', 'Aggregating multi-language codebase…');
        emit(projectId, 'log', { step: 'analyzing', message: 'Scanning directory and concatenating whitelisted files...' });

        const contextMap = await extractArchitectureUniversal(tempPath);

        emit(projectId, 'log', {
            step: 'analyzing',
            message: `Aggregation complete — concatenated ${contextMap.fileCount} files into context window.`,
        });

        // ── Step 3 — LLM Documentation Generation (single batch call) ─
        checkCancelled(projectId);
        await setStatus(projectId, 'generating', 'AI is writing the documentation…');
        emit(projectId, 'log', { step: 'generating', message: 'AI is writing the documentation...' });

        const provider = getLLMProvider(llmProvider);
        emit(projectId, 'log', { step: 'generating', message: `Using ${provider.label}` });

        emit(projectId, 'log', {
            step: 'generating',
            message: `Sending full codebase — ${contextMap.rawCode.length} chars (${contextMap.fileCount} files)`,
        });

        const markdown = await provider.generate(contextMap.rawCode, byokOptions);

        // Save generated docs to MongoDB
        await Project.findByIdAndUpdate(projectId, { generatedDocs: markdown });

        emit(projectId, 'log', {
            step: 'generating',
            message: `Documentation generated — ${markdown.length} characters`,
        });

        // Done
        await setStatus(projectId, 'ready', 'Documentation is live!');

        return { fileCount: contextMap.fileCount };
    } catch (err) {
        const wasCancelled = isCancelled(projectId);
        console.error('Pipeline error:', err);
        await setStatus(
            projectId,
            wasCancelled ? 'failed' : 'failed',
            wasCancelled ? 'Generation cancelled by user' : (err.message || 'Pipeline crashed')
        );
    } finally {
        clearCancel(projectId);
        // ── Cleanup — always delete cloned code ─────────────────────
        try {
            await fs.rm(tempPath, { recursive: true, force: true });
            emit(projectId, 'log', { step: 'cleanup', message: 'Temporary files removed' });
        } catch (cleanupErr) {
            console.error('Cleanup error:', cleanupErr);
            emit(projectId, 'log', { step: 'cleanup', message: 'Warning: cleanup failed' });
        }
    }
}

module.exports = { engineEmitter, runGenerationPipeline, extractArchitectureUniversal, requestCancel };
