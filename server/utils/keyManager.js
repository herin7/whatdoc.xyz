const keys = process.env.GEMINI_API_KEYS
    ? process.env.GEMINI_API_KEYS.split(',').map(k => k.trim())
    : [];

if (keys.length === 0) {
    console.error('🚨 No API keys found in GEMINI_API_KEYS environment variable!');
}

let currentIndex = 0;

function getNextApiKey() {
    const key = keys[currentIndex];
    currentIndex = (currentIndex + 1) % keys.length;
    return key;
}

module.exports = { getNextApiKey, totalKeys: keys.length };
