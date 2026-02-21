const { Router } = require('express');
const authmware = require('../middlewares/authmware');
const { createProject } = require('../controllers/projectController');
const { engineEmitter } = require('../services/engine');

const router = Router();

router.post('/', authmware, createProject);

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
