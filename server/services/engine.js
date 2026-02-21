const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs/promises');
const simpleGit = require('simple-git');
const { Project: TsMorphProject, SyntaxKind } = require('ts-morph');
const Project = require('../models/Project');

// ── Global emitter ──────────────────────────────────────────────────
// Events are namespaced per project:  `status:<projectId>`  and  `log:<projectId>`
const engineEmitter = new EventEmitter();
engineEmitter.setMaxListeners(100); // allow many concurrent SSE clients

// ── Paths ───────────────────────────────────────────────────────────
const TMP_ROOT = path.join(__dirname, '..', 'tmp');

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
async function runGenerationPipeline(projectId, repoUrl) {
    const tempPath = path.join(TMP_ROOT, projectId);

    try {
        // ── Step 1 — Clone ──────────────────────────────────────────
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
        await setStatus(projectId, 'analyzing', 'Extracting AST metadata…');
        emit(projectId, 'log', { step: 'analyzing', message: 'Extracting AST metadata...' });

        const contextMap = extractArchitecture(tempPath);

        emit(projectId, 'log', {
            step: 'analyzing',
            message: `Analysis complete — ${contextMap.routes.length} routes, ${contextMap.models.length} models, ${contextMap.exports.length} exports across ${contextMap.fileCount} files`,
        });

        // ── Step 3 — Generating (placeholder) ───────────────────────
        await setStatus(projectId, 'generating', 'Generating documentation pages…');
        emit(projectId, 'log', { step: 'generating', message: 'Sending context to LLM…' });
        await sleep(3000);
        emit(projectId, 'log', { step: 'generating', message: 'Documentation compiled' });

        // Done
        await setStatus(projectId, 'ready', 'Documentation is live!');

        return contextMap;
    } catch (err) {
        console.error('Pipeline error:', err);
        await setStatus(projectId, 'failed', err.message || 'Pipeline crashed');
    } finally {
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

module.exports = { engineEmitter, runGenerationPipeline, extractArchitecture };
