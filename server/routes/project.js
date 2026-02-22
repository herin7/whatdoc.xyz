const { Router } = require('express');
const authmware = require('../middlewares/authmware');
const { createProject } = require('../controllers/projectController');
const { engineEmitter, requestCancel } = require('../services/engine');
const { listProviders } = require('../services/llm');
const Project = require('../models/Project');
const { UserModel } = require('../models/User');

const router = Router();

router.post('/', authmware, createProject);

// ── List current user's projects: GET /projects/mine ────────────────
router.get('/mine', authmware, async (req, res) => {
    try {
        const projects = await Project.find(
            { userId: req.userId },
            'repoName slug techstack status updatedAt'
        ).sort({ updatedAt: -1 });

        res.json({ projects });
    } catch (err) {
        console.error('List projects error:', err);
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
});

// ── Public doc viewer: GET /projects/subdomain/:subdomain ───────────
// No auth — serves generated documentation for public projects.
router.get('/subdomain/:subdomain', async (req, res) => {
    try {
        const project = await Project.findOne(
            { subdomain: req.params.subdomain.toLowerCase() },
            'repoName techstack generatedDocs updatedAt isPublic userId template subdomain customization'
        );

        if (!project || project.isPublic === false) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Fetch creator name
        let creatorName = null;
        if (project.userId) {
            const user = await UserModel.findById(project.userId, 'firstName lastName githubUsername');
            if (user) {
                creatorName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.githubUsername || null;
            }
        }

        res.json({
            repoName: project.repoName,
            techstack: project.techstack,
            generatedDocs: project.generatedDocs,
            updatedAt: project.updatedAt,
            creatorName,
            template: project.template || 'modern',
            subdomain: project.subdomain,
            customization: project.customization || {},
        });
    } catch (err) {
        console.error('Subdomain lookup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ── Public doc viewer (legacy slug): GET /projects/slug/:slug ───────
// Kept for backward compatibility.
router.get('/slug/:slug', async (req, res) => {
    try {
        const project = await Project.findOne(
            { slug: req.params.slug },
            'repoName techstack generatedDocs updatedAt isPublic userId template subdomain customization'
        );

        if (!project || project.isPublic === false) {
            return res.status(404).json({ error: 'Project not found.' });
        }

        // Fetch creator name
        let creatorName = null;
        if (project.userId) {
            const user = await UserModel.findById(project.userId, 'firstName lastName githubUsername');
            if (user) {
                creatorName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.githubUsername || null;
            }
        }

        res.json({
            repoName: project.repoName,
            techstack: project.techstack,
            generatedDocs: project.generatedDocs,
            updatedAt: project.updatedAt,
            creatorName,
            template: project.template || 'modern',
            subdomain: project.subdomain,
            customization: project.customization || {},
        });
    } catch (err) {
        console.error('Slug lookup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ── List available LLM providers: GET /projects/providers ───────────
router.get('/providers', (_req, res) => {
    res.json({ providers: listProviders() });
});

// ── Cancel a running pipeline: POST /projects/:projectId/cancel ─────
router.post('/:projectId/cancel', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ error: 'Project not found.' });
        if (String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });

        const running = ['scanning', 'analyzing', 'generating'];
        if (!running.includes(project.status)) {
            return res.status(400).json({ error: 'Pipeline is not running.' });
        }

        requestCancel(req.params.projectId);
        res.json({ message: 'Cancellation requested.' });
    } catch (err) {
        console.error('Cancel error:', err);
        res.status(500).json({ error: 'Failed to cancel.' });
    }
});

// ── Get a single project by ID: GET /projects/:projectId ────────────
router.get('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ error: 'Project not found.' });
        if (String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });

        res.json({ project });
    } catch (err) {
        console.error('Get project error:', err);
        res.status(500).json({ error: 'Failed to fetch project.' });
    }
});

// ── Update a project: PUT /projects/:projectId ─────────────────────
router.put('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ error: 'Project not found.' });
        if (String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });

        const { generatedDocs, subdomain, slug, template, customization } = req.body;

        // Validate slug uniqueness when changing
        if (slug !== undefined && slug !== project.slug) {
            const sanitized = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
            if (!sanitized || sanitized.length < 2) return res.status(400).json({ error: 'Slug must be at least 2 characters.' });

            const taken = await Project.findOne({ slug: sanitized, _id: { $ne: project._id } });
            if (taken) return res.status(409).json({ error: 'Slug is already taken.' });

            project.slug = sanitized;
        }

        // Validate subdomain uniqueness when changing
        if (subdomain !== undefined && subdomain !== project.subdomain) {
            const sanitized = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
            if (!sanitized) return res.status(400).json({ error: 'Invalid subdomain.' });

            const taken = await Project.findOne({ subdomain: sanitized, _id: { $ne: project._id } });
            if (taken) return res.status(409).json({ error: 'Subdomain is already taken.' });

            project.subdomain = sanitized;
        }

        if (generatedDocs !== undefined) project.generatedDocs = generatedDocs;

        if (template !== undefined) {
            const allowed = ['modern', 'minimal', 'twilio', 'django', 'mdn', 'aerolatex'];
            if (allowed.includes(template)) project.template = template;
        }

        if (customization && typeof customization === 'object') {
            const c = project.customization || {};
            if (customization.logoUrl !== undefined) c.logoUrl = customization.logoUrl;
            if (customization.ownerName !== undefined) c.ownerName = customization.ownerName;
            if (customization.currentVersion !== undefined) c.currentVersion = customization.currentVersion;
            if (customization.upcomingVersion !== undefined) c.upcomingVersion = customization.upcomingVersion;
            project.customization = c;
        }

        await project.save();
        res.json({ message: 'Project updated.', project });
    } catch (err) {
        console.error('Update project error:', err);
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

// ── Delete a project: DELETE /projects/:projectId ───────────────────
router.delete('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) return res.status(404).json({ error: 'Project not found.' });
        if (String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });

        const running = ['scanning', 'analyzing', 'generating'];
        if (running.includes(project.status)) {
            requestCancel(req.params.projectId);
        }

        await Project.findByIdAndDelete(req.params.projectId);
        res.json({ message: 'Project deleted.' });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

// ── SSE stream: GET /projects/:projectId/stream ─────────────────────
// Streams real-time status + log events for a running generation pipeline.
router.get('/:projectId/stream', authmware, (req, res) => {
    const { projectId } = req.params;

    // SSE headers — keep connection alive, disable buffering
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // nginx
    });

    // Flush headers immediately
    res.flushHeaders();

    // Send an initial comment so the client knows the connection is open
    res.write(': connected\n\n');

    // ── Event listeners scoped to this project ──
    const onStatus = (data) => {
        res.write(`event: status\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const onLog = (data) => {
        res.write(`event: log\ndata: ${JSON.stringify(data)}\n\n`);
    };

    engineEmitter.on(`status:${projectId}`, onStatus);
    engineEmitter.on(`log:${projectId}`, onLog);

    // ── Keep-alive ping every 15 s (prevents proxy/browser timeouts) ──
    const keepAlive = setInterval(() => {
        res.write(': ping\n\n');
    }, 15_000);

    // ── Clean up on client disconnect ──
    req.on('close', () => {
        clearInterval(keepAlive);
        engineEmitter.off(`status:${projectId}`, onStatus);
        engineEmitter.off(`log:${projectId}`, onLog);
        res.end();
    });
});

module.exports = router;
