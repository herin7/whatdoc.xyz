const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs/promises');
const simpleGit = require('simple-git');
const { Project: TsMorphProject, SyntaxKind } = require('ts-morph');
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

// ── Token budgeting ─────────────────────────────────────────────────
// Hard character cap → safely approximates ~25 000 tokens for Gemini.
const MAX_CHARS = 100_000;

/**
 * Build a token-budgeted payload from raw AST data.
 * Priority order: Models → Routes → Exports.
 * Returns a plain object ready to be JSON.stringified for the LLM prompt.
 */
function buildTokenBudgetedPayload(astData) {
    const payload = { models: [], routes: [], exports: [], fileCount: astData.fileCount };
    let currentChars = 0;

    const totals = {
        models: astData.models.length,
        routes: astData.routes.length,
        exports: astData.exports.length,
    };

    // ── Priority 1 — Models (most important for schema inference) ────
    for (const model of astData.models) {
        const str = JSON.stringify(model);
        if (currentChars + str.length >= MAX_CHARS) break;
        payload.models.push(model);
        currentChars += str.length;
    }

    // ── Priority 2 — Routes (shortest paths first = core routes) ────
    const sortedRoutes = [...astData.routes].sort(
        (a, b) => (a.path?.length || 0) - (b.path?.length || 0)
    );

    for (const route of sortedRoutes) {
        const str = JSON.stringify(route);
        if (currentChars + str.length >= MAX_CHARS) break;
        payload.routes.push(route);
        currentChars += str.length;
    }

    // ── Priority 3 — Exports (only if budget remains) ───────────────
    for (const exp of astData.exports) {
        const str = JSON.stringify(exp);
        if (currentChars + str.length >= MAX_CHARS) break;
        payload.exports.push(exp);
        currentChars += str.length;
    }

    // ── Truncation report ───────────────────────────────────────────
    const dropped = {
        models: totals.models - payload.models.length,
        routes: totals.routes - payload.routes.length,
        exports: totals.exports - payload.exports.length,
    };

    if (dropped.models > 0) console.log(`[budget] Dropped ${dropped.models} models to stay under token budget`);
    if (dropped.routes > 0) console.log(`[budget] Dropped ${dropped.routes} routes to stay under token budget`);
    if (dropped.exports > 0) console.log(`[budget] Dropped ${dropped.exports} exports to stay under token budget`);

    console.log(`[budget] Final payload: ${currentChars} chars — ${payload.models.length} models, ${payload.routes.length} routes, ${payload.exports.length} exports`);

    return payload;
}

// ── AST extraction ──────────────────────────────────────────────────

const HTTP_METHODS = new Set(['get', 'post', 'put', 'delete', 'patch', 'use']);
const NEXT_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);

/**
 * Initialise a ts-morph project over the cloned repo and return
 * a "Context Map" with routes, models, and exported signatures.
 */
function extractArchitecture(repoPath) {
    const tsProject = new TsMorphProject({
        skipAddingFilesFromTsConfig: true,
        compilerOptions: {
            allowJs: true,
            jsx: 2, // React
            esModuleInterop: true,
            noEmit: true,
        },
    });

    // Add every JS/TS source file (node_modules & .git excluded below)
    tsProject.addSourceFilesAtPaths(
        path.join(repoPath, '**/*.{js,jsx,ts,tsx}').replace(/\\/g, '/')
    );

    const sourceFiles = tsProject.getSourceFiles().filter((sf) => {
        const fp = sf.getFilePath();
        return !fp.includes('node_modules') && !fp.includes('.git');
    });

    const routes = [];
    const models = [];
    const exports_ = [];

    for (const sf of sourceFiles) {
        const relPath = path.relative(repoPath, sf.getFilePath()).replace(/\\/g, '/');
        extractExpressRoutes(sf, relPath, routes);
        extractNextRoutes(sf, relPath, routes);
        extractMongooseModels(sf, relPath, models);
        extractExportedSignatures(sf, relPath, exports_);
    }

    return { routes, models, exports: exports_, fileCount: sourceFiles.length };
}

// ── Express routes: router.get('/path', ...) / app.post(...) ────────
function extractExpressRoutes(sourceFile, relPath, routes) {
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    for (const call of calls) {
        const expr = call.getExpression();
        if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) continue;
        const methodName = expr.getName?.();
        if (!methodName || !HTTP_METHODS.has(methodName)) continue;
        const args = call.getArguments();
        if (args.length === 0) continue;
        const firstArg = args[0];
        if (firstArg.getKind() !== SyntaxKind.StringLiteral) continue;
        routes.push({
            file: relPath,
            method: methodName.toUpperCase(),
            path: firstArg.getLiteralText(),
            type: 'express',
        });
    }
}

// ── Next.js App Router handlers: export async function GET(req) ────
function extractNextRoutes(sourceFile, relPath, routes) {
    const base = path.basename(relPath);
    if (!['route.ts', 'route.js', 'route.tsx', 'route.jsx'].includes(base)) return;

    // Derive URL from file path: app/api/users/route.ts → /api/users
    const segments = relPath.replace(/\\/g, '/').split('/');
    const appIdx = segments.indexOf('app');
    let urlPath = '/';
    if (appIdx !== -1) {
        urlPath = '/' + segments.slice(appIdx + 1, -1).join('/');
    }

    for (const [name] of sourceFile.getExportedDeclarations()) {
        if (NEXT_METHODS.has(name)) {
            routes.push({ file: relPath, method: name, path: urlPath, type: 'nextjs' });
        }
    }
}

// ── Mongoose models: new Schema({ ... }) ───────────────────────────
function extractMongooseModels(sourceFile, relPath, models) {
    const text = sourceFile.getFullText();
    if (!text.includes('mongoose')) return;

    // Find  new Schema({...})  or  Schema({...})  call expressions
    const newExprs = sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression);
    const callExprs = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

    const candidates = [];

    for (const ne of newExprs) {
        const exprText = ne.getExpression().getText();
        if (exprText === 'Schema' || exprText === 'mongoose.Schema') {
            candidates.push(ne);
        }
    }
    for (const ce of callExprs) {
        const exprText = ce.getExpression().getText();
        if (exprText === 'Schema' || exprText === 'mongoose.Schema') {
            candidates.push(ce);
        }
    }

    for (const node of candidates) {
        const args = node.getArguments();
        if (args.length === 0) continue;
        const schemaArg = args[0];
        if (schemaArg.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;

        const keys = schemaArg.getProperties()
            .map((p) => {
                if (p.getKind() === SyntaxKind.PropertyAssignment) return p.getName();
                if (p.getKind() === SyntaxKind.ShorthandPropertyAssignment) return p.getName();
                return null;
            })
            .filter(Boolean);

        const modelName = guessModelName(sourceFile, relPath);
        models.push({ file: relPath, modelName, schemaKeys: keys });
    }
}

function guessModelName(sourceFile, relPath) {
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    for (const call of calls) {
        const txt = call.getExpression().getText();
        if (txt !== 'mongoose.model' && txt !== 'model') continue;
        const args = call.getArguments();
        if (args.length > 0 && args[0].getKind() === SyntaxKind.StringLiteral) {
            return args[0].getLiteralText();
        }
    }
    return path.basename(relPath, path.extname(relPath));
}

// ── Exported functions & signatures ─────────────────────────────────
function extractExportedSignatures(sourceFile, relPath, exports_) {
    for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
        for (const decl of declarations) {
            const kind = decl.getKindName();
            let params = null;
            let returnType = null;

            if (decl.getParameters) {
                params = decl.getParameters().map((p) => ({
                    name: p.getName(),
                    type: p.getType()?.getText() || undefined,
                }));
            }
            if (decl.getReturnType) {
                try { returnType = decl.getReturnType().getText(); } catch { /* JS files may fail */ }
            }

            exports_.push({
                file: relPath,
                name,
                kind,
                ...(params && { params }),
                ...(returnType && { returnType }),
            });
        }
    }
}

// ── Generation pipeline ─────────────────────────────────────────────
async function runGenerationPipeline(projectId, repoUrl, llmProvider = 'gemini') {
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

        // ── Step 2 — AST Analysis ───────────────────────────────────
        checkCancelled(projectId);
        await setStatus(projectId, 'analyzing', 'Extracting AST metadata…');
        emit(projectId, 'log', { step: 'analyzing', message: 'Extracting AST metadata...' });

        const contextMap = extractArchitecture(tempPath);

        emit(projectId, 'log', {
            step: 'analyzing',
            message: `Analysis complete — ${contextMap.routes.length} routes, ${contextMap.models.length} models, ${contextMap.exports.length} exports across ${contextMap.fileCount} files`,
        });

        // ── Step 3 — LLM Documentation Generation (single batch call) ─
        checkCancelled(projectId);
        await setStatus(projectId, 'generating', 'AI is writing the documentation…');
        emit(projectId, 'log', { step: 'generating', message: 'AI is writing the documentation...' });

        const provider = getLLMProvider(llmProvider);
        emit(projectId, 'log', { step: 'generating', message: `Using ${provider.label}` });

        // Token-budgeted payload: models → routes → exports, hard-capped
        // at MAX_CHARS (~25 k tokens).  Exactly ONE stringify for the LLM.
        const budgeted = buildTokenBudgetedPayload(contextMap);
        const contextMapJSON = JSON.stringify(budgeted, null, 2);

        emit(projectId, 'log', {
            step: 'generating',
            message: `Sending batch prompt — ${contextMapJSON.length} chars (${budgeted.routes.length} routes, ${budgeted.models.length} models, ${budgeted.exports.length} exports)`,
        });

        const markdown = await provider.generate(contextMapJSON);

        // Save generated docs to MongoDB
        await Project.findByIdAndUpdate(projectId, { generatedDocs: markdown });

        emit(projectId, 'log', {
            step: 'generating',
            message: `Documentation generated — ${markdown.length} characters`,
        });

        // Done
        await setStatus(projectId, 'ready', 'Documentation is live!');

        return contextMap;
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

module.exports = { engineEmitter, runGenerationPipeline, extractArchitecture, requestCancel };
