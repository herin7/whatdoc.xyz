require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { UserModel } = require('./models/User');
const Project = require('./models/Project');
const app = express();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected');
    await UserModel.syncIndexes();
}).catch(err => console.error('MongoDB connection error:', err));

const APP_DOMAIN = process.env.APP_DOMAIN || 'whatdoc.xyz';
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

if (process.env.CLIENT_URL && !ALLOWED_ORIGINS.includes(process.env.CLIENT_URL)) {
    ALLOWED_ORIGINS.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: async (origin, callback) => {
        if (!origin) return callback(null, true);

        const isWhitelisted = ALLOWED_ORIGINS.includes(origin);
        const escapedDomain = APP_DOMAIN.replace(/\./g, '\\.');
        const isSubdomain = new RegExp(`^https?://[a-z0-9-]+\\.${escapedDomain}$`).test(origin);

        if (isWhitelisted || isSubdomain) return callback(null, true);

        try {
            console.log(`[CORS] Checking dynamic whitelist for: ${origin}`);
            const strippedOrigin = origin.replace(/^https?:\/\//, '');
            const projectExists = await Project.findOne({ customDomain: strippedOrigin });
            if (projectExists) return callback(null, true);
        } catch (err) {
            console.error("CORS DB Check Error", err);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
// Handle Global Preflight
// app.options('*', cors());
// 3. SECURITY & UTILITY MIDDLEWARE
app.use(helmet());

// Bypass rate limiting and domain routing for health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));



app.use(express.json({ limit: '10mb' }));

// Sanitize inputs to prevent NoSQL Injection
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    if (req.headers) req.headers = mongoSanitize.sanitize(req.headers, { replaceWith: '_' });

    if (req.query) {
        const sanitizedQuery = mongoSanitize.sanitize(req.query, { replaceWith: '_' });
        Object.defineProperty(req, 'query', {
            value: sanitizedQuery,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
    next();
});

// 4. DOMAIN ROUTING (After CORS and Security)
const customDomainRouter = require('./middlewares/customDomainRouter');

app.use(customDomainRouter);

// 5. ROUTES

app.get('/api/usercount', async (req, res) => {
    try {
        const count = await UserModel.countDocuments({});
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});



const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: 'Too many generation requests.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");

app.use("/auth", authRoutes);
app.use("/projects", apiLimiter, projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});