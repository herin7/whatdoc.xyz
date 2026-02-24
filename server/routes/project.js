const { Router } = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const authmware = require('../middlewares/authmware');
const { createProject, getJobStatus } = require('../controllers/projectController');
const { engineEmitter, requestCancel } = require('../services/engine');
const { listProviders } = require('../services/llm');
const Project = require('../models/Project');
const { UserModel } = require('../models/User');
const { provisionCustomDomainSSL } = require('../utils/cloudflare');

const router = Router();
const addDomainToVercel = async (domain) => {
    try {
        const response = await axios.post(
            `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
            { name: domain },
            {
                headers: {
                    Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`[VERCEL] Successfully added domain: ${domain}`);
        return response.data;
    } catch (error) {
        const vError = error.response?.data?.error;
        const isAlreadyThere =
            vError?.code === 'domain_already_in_use' ||
            vError?.code === 'duplicate-team-registration';

        if (error.response?.status === 400 && isAlreadyThere) {
            console.log("Domain already exists on Vercel. Proceeding.");
            return { alreadyActive: true };
        }
        throw new Error(vError?.message || 'Failed to link domain to Vercel.');
    }
};
// 1. PUBLIC ROUTES (No Auth)
router.get('/providers', (_req, res) => res.json({ providers: listProviders() }));

// CRITICAL: This must be ABOVE /:projectId to avoid ID collision
router.get('/custom-domain/:domain', async (req, res) => {
    try {
        const domain = req.params.domain.toLowerCase().trim();
        const project = await Project.findOne({ customDomain: domain });

        if (!project) return res.status(404).json({ error: 'Project not found.' });

        let creatorName = null;
        if (project.userId) {
            const user = await UserModel.findById(project.userId, 'firstName lastName githubUsername');
            if (user) {
                creatorName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.githubUsername;
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
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/subdomain/:subdomain', async (req, res) => {
    try {
        const project = await Project.findOne({ subdomain: req.params.subdomain.toLowerCase() });
        if (!project) return res.status(404).json({ error: 'Project not found.' });
        res.json(project);
    } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

router.get('/slug/:slug', async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug.toLowerCase() });
        if (!project) return res.status(404).json({ error: 'Project not found.' });
        res.json({ project });
    } catch (err) { res.status(500).json({ error: 'Server error.' }); }
});

// 2. PROTECTED ROUTES (Auth Required)
router.post('/', authmware, createProject);
router.get('/jobs/:id', authmware, getJobStatus);

router.get('/mine', authmware, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json({ projects });
    } catch (err) { res.status(500).json({ error: 'Failed to fetch projects.' }); }
});

router.post('/:projectId/cancel', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });
        requestCancel(req.params.projectId);
        res.json({ message: 'Cancellation requested.' });
    } catch (err) { res.status(500).json({ error: 'Failed to cancel.' }); }
});

router.get('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });
        res.json({ project });
    } catch (err) { res.status(500).json({ error: 'Fetch failed.' }); }
});

router.put('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });

        const { customDomain, template, customization, slug, subdomain, generatedDocs } = req.body;
        if (customDomain !== undefined && customDomain !== project.customDomain) {
            if (!customDomain) {
                project.customDomain = undefined;
            } else {
                const sanitized = customDomain.toLowerCase().trim();
                const taken = await Project.findOne({ customDomain: sanitized, _id: { $ne: project._id } });
                if (taken) return res.status(409).json({ error: 'Domain already mapped.' });

                try {
                    // Skip Cloudflare for Vercel internal testing aliases
                    if (!sanitized.includes('vercel.app')) {
                        await provisionCustomDomainSSL(sanitized);
                    }
                    await addDomainToVercel(sanitized);
                    project.customDomain = sanitized;
                } catch (err) {
                    return res.status(500).json({ error: err.message });
                }
            }
        }
        if (slug) project.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (subdomain) project.subdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (generatedDocs) project.generatedDocs = generatedDocs;
        if (template) project.template = template;
        if (customization) project.customization = { ...project.customization, ...customization };

        await project.save();
        res.json({ message: 'Project updated.', project });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

router.delete('/:projectId', authmware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project || String(project.userId) !== req.userId) return res.status(403).json({ error: 'Forbidden.' });
        await Project.findByIdAndDelete(req.params.projectId);
        res.json({ message: 'Project deleted.' });
    } catch (err) { res.status(500).json({ error: 'Delete failed.' }); }
});
router.get('/:projectId/stream', authmware, (req, res) => {
    const { projectId } = req.params;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });
    const onStatus = (data) => res.write(`event: status\ndata: ${JSON.stringify(data)}\n\n`);
    const onLog = (data) => res.write(`event: log\ndata: ${JSON.stringify(data)}\n\n`);
    engineEmitter.on(`status:${projectId}`, onStatus);
    engineEmitter.on(`log:${projectId}`, onLog);
    req.on('close', () => {
        engineEmitter.off(`status:${projectId}`, onStatus);
        engineEmitter.off(`log:${projectId}`, onLog);
    });
});

module.exports = router;