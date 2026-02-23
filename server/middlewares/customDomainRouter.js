const Project = require('../models/Project');

/**
 * Middleware to intercept custom domains pointing to the server
 * and rewrite the request URL so Express routes it correctly.
 */
const customDomainRouter = async (req, res, next) => {
    try {
        const host = req.headers.host;

        // Skip if there's no host header
        if (!host) return next();

        // Base domain ignores (e.g., whatdoc.xyz, localhost, internal apps)
        const appDomain = process.env.APP_DOMAIN || 'whatdoc.xyz';
        const isBaseDomain = host.includes(appDomain) || host.includes('localhost') || host.includes('127.0.0.1') || host.includes('onrender.com');

        if (isBaseDomain) {
            return next();
        }

        console.log(`[DOMAIN ROUTER] Incoming custom domain request host: ${host}`);

        // It's an external custom domain! Check the DB.
        // host might include a port (docs.example.com:3000), so strip it if necessary for safety
        const strippedHost = host.split(':')[0].toLowerCase();

        console.log(`[DOMAIN ROUTER] Searching DB for: ${strippedHost}`);
        const project = await Project.findOne({ customDomain: strippedHost });

        if (project) {
            // Rewrite the URL internally to the standard viewer route
            // The user requested: req.url = '/project/' + project._id + '/view'
            // NOTE: adjust this matching your actual front-facing viewer route string if different
            req.url = `/projects/${project._id}/view`;
            console.log(`[DOMAIN ROUTER] MATCH FOUND: Project ID ${project._id}. Internal URL rewritten to: ${req.url}`);
            // Or you can proxy it to your frontend app serving logic
            return next();
        }

        console.warn(`[DOMAIN ROUTER] 404 - No project registered for host: ${strippedHost}`);
        // If the domain is pointing here but isn't registered in our DB
        return res.status(404).send(`
            <html>
                <body style="font-family: monospace; padding: 2rem; background: #050505; color: #fff; text-align: center;">
                    <h2>Domain Not Configured</h2>
                    <p>The custom domain <b>${strippedHost}</b> is pointing to WHATDOC.XYZ, but it is not registered to any active project.</p>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Custom domain router error:', err);
        next();
    }
};

module.exports = customDomainRouter;
