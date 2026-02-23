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
    const { UserModel } = require('./models/User');
    await UserModel.syncIndexes();
}).catch(err => console.error('MongoDB connection error:', err));

// --- DOMAIN ROUTING ---
const customDomainRouter = require('./middlewares/customDomainRouter');
app.use(customDomainRouter);
// ----------------------

// 2. CORS CONFIGURATION (Must come BEFORE routes)
const APP_DOMAIN = process.env.APP_DOMAIN || 'localhost';
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

if (process.env.CLIENT_URL && !ALLOWED_ORIGINS.includes(process.env.CLIENT_URL)) {
    ALLOWED_ORIGINS.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: (origin, callback) => {
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
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow these
    allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly allow these
}));

// Add this immediately after CORS to handle the OPTIONS preflight
app.options('*', cors());
// 3. OTHER MIDDLEWARE

// --- Security Middleware Initialization ---
// Helmet helps secure Express apps by setting various HTTP headers (including removing X-Powered-By)
app.use(helmet());

// Global Rate Limiter: 100 requests per 15 minutes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

// Specific Limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: { error: 'Too many generation requests, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// ------------------------------------------

app.use(express.json({ limit: '10mb' }));

// Mongo Sanitize MUST come *after* body-parser/express.json to scrub malicious keys
app.use((req, res, next) => {
    // Express 5 makes req.query a getter-only property. 
    // We manually sanitize vectors and surgically redefine req.query to avoid the TypeError
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

// 4. ROUTES (All routes must be below CORS)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/usercount', async (req, res) => {
    try {
        const count = await UserModel.countDocuments({});
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
});

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");

// Apply specific limiters to their respective route boundaries
app.use("/auth", authLimiter, authRoutes);
app.use("/projects", apiLimiter, projectRoutes);
// Example for invites: app.use("/api/invites/request", authLimiter, inviteRequestRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});