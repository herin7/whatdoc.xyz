require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { UserModel } = require('./models/User');

const app = express();

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected');
    await UserModel.syncIndexes();
}).catch(err => console.error('MongoDB connection error:', err));

// 2. CORS CONFIGURATION (MUST BE FIRST)
const APP_DOMAIN = process.env.APP_DOMAIN || 'whatdoc.xyz';
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

if (process.env.CLIENT_URL && !ALLOWED_ORIGINS.includes(process.env.CLIENT_URL)) {
    ALLOWED_ORIGINS.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server or non-browser tools (Postman/Curl)
        if (!origin) return callback(null, true);

        const isWhitelisted = ALLOWED_ORIGINS.includes(origin);
        const escapedDomain = APP_DOMAIN.replace(/\./g, '\\.');
        const isSubdomain = new RegExp(`^https?://[a-z0-9-]+\\.${escapedDomain}$`).test(origin);

        const isDev = process.env.NODE_ENV !== 'production';
        const isLocalhost = isDev && (
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/[a-z0-9-]+\.localhost:\d+$/.test(origin)
        );

        if (isWhitelisted || isSubdomain || isLocalhost) {
            callback(null, true);
        } else {
            console.warn(`[CORS BLOCKED] Origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle Global Preflight
app.options('*', cors());

// 3. SECURITY & UTILITY MIDDLEWARE
app.use(helmet());

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

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

// Bypass health check for internal monitoring
app.use((req, res, next) => {
    if (req.path === '/health') return next();
    customDomainRouter(req, res, next);
});

// 5. ROUTES
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/usercount', async (req, res) => {
    try {
        const count = await UserModel.countDocuments({});
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Slightly higher for production stability
    message: { error: 'Too many authentication attempts.' },
    standardHeaders: true,
    legacyHeaders: false,
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

app.use("/auth", authLimiter, authRoutes);
app.use("/projects", apiLimiter, projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});