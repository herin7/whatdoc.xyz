const Redis = require('ioredis');
require('dotenv').config();

const connection = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false },
    family: 0
});

async function clearCache() {
    console.log("Connecting to Upstash to clear cache...");
    try {
        await connection.flushdb();
        console.log("Upstash cache cleared completely.");
    } catch (err) {
        console.error("Failed to clear cache:", err);
    }
    process.exit(0);
}

clearCache();
