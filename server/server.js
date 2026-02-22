require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { UserModel } = require('./models/User');

const app = express();

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected');
    const { UserModel } = require('./models/User');
    await UserModel.syncIndexes();
}).catch(err => console.error('MongoDB connection error:', err));

// 2. CORS CONFIGURATION (Must come BEFORE routes)
const ALLOWED_ORIGINS = [
    'https://whatdoc.xyz',
    'https://www.whatdoc.xyz',
    'https://whatdoc-xyz.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        const isWhitelisted = ALLOWED_ORIGINS.includes(origin);
        const isSubdomain = 
            /^https?:\/\/[a-z0-9-]+\.whatdoc\.xyz$/.test(origin) || 
            /^http:\/\/localhost:(5173|4173)$/.test(origin) ||
            /^http:\/\/[a-z0-9-]+\.localhost:(5173|4173)$/.test(origin);

        if (isWhitelisted || isSubdomain) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 3. OTHER MIDDLEWARE
app.use(express.json({ limit: '10mb' }));

// 4. ROUTES (All routes must be below CORS)
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

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});