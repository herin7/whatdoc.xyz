require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect(process.env.MONGO_URI);
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const app = express();

const ALLOWED_ORIGINS = [
    // Production
    'https://whatdoc.xyz',
    'https://www.whatdoc.xyz',
    'https://whatdoc-xyz.vercel.app',
    // Localhost
    'http://localhost:5173',
    'http://localhost:4173',
    // From env (optional override)
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Check exact match
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

        // Allow any *.whatdoc.xyz subdomain (for hosted docs)
        if (/^https?:\/\/[a-z0-9-]+\.whatdoc\.xyz$/.test(origin)) return callback(null, true);

        // Allow *.localhost:5173 subdomains (for local dev)
        if (/^http:\/\/[a-z0-9-]+\.localhost:(5173|4173)$/.test(origin)) return callback(null, true);

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
