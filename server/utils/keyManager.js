const raw = process.env.GEMINI_API_KEYS
    ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(Boolean)
    : [];

// Validate each key — Google Gemini keys are 39 chars and start with "AIzaSy"
const keys = [];
for (const k of raw) {
    if (k.length >= 39 && k.startsWith('AIzaSy')) {
        keys.push(k);
    } else {
        console.warn(`⚠️  Skipping invalid API key: "${k.slice(0, 10)}…" (bad format)`);
    }
}

if (keys.length === 0) {
    console.error('🚨 No valid API keys found in GEMINI_API_KEYS! Check your .env file.');
} else {
    console.log(`🔑 Key rotator loaded: ${keys.length} valid key(s) out of ${raw.length} provided`);
}

let currentIndex = 0;

function getNextApiKey() {
    const key = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;
    return key;
}

module.exports = { getNextApiKey, totalKeys: keys.length };
