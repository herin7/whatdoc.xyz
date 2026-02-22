import { API_URL } from './config';

/* ── Warm-up helper for Render cold starts ──────────────────────────── */

/**
 * Pings the backend until it responds (or we give up).
 * Returns { ok: boolean, attempts: number }.
 */
export async function warmUpBackend(onStatus) {
    const MAX_ATTEMPTS = 8;
    const TIMEOUT_MS = 8_000;

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        try {
            if (onStatus) onStatus(i <= 2 ? 'Connecting to server…' : i <= 5 ? 'Server is waking up…' : 'Almost there…');

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

            // Use a lightweight GET — any 2xx/4xx means server is alive
            const res = await fetch(`${API_URL}/auth/me`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' },
            });
            clearTimeout(timer);

            // Any response (even 401) means the server is up
            if (res.status > 0) return { ok: true, attempts: i };
        } catch {
            // Network error or timeout — server still cold
            const backoff = Math.min(2000, 500 * i);
            await new Promise((r) => setTimeout(r, backoff));
        }
    }
    return { ok: false, attempts: MAX_ATTEMPTS };
}

/* ── Core API request ───────────────────────────────────────────────── */

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const { headers: optHeaders, ...restOptions } = options;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...optHeaders,
        },
        ...restOptions,
    };

    const res = await fetch(`${API_URL}${endpoint}`, config);
    const data = await res.json();

    if (!res.ok) {
        throw { status: res.status, ...data };
    }

    return data;
}

export const auth = {
    signup: (body) =>
        apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

    signin: (body) =>
        apiRequest('/auth/signin', { method: 'POST', body: JSON.stringify(body) }),

    me: () => apiRequest('/auth/me'),

    deleteAccount: (password) =>
        apiRequest('/auth/account', { method: 'DELETE', body: JSON.stringify({ password }) }),
};

export const project = {
    create: (body) => {
        const rawKey = (localStorage.getItem('wtd_gemini_key') || '').trim();
        const customModel = localStorage.getItem('wtd_gemini_model') || 'gemini-2.5-flash-lite';

        // Only send the header if it looks like a real Gemini key
        const isKeyValid = rawKey.length > 30 && rawKey !== 'null';

        const extraHeaders = { 'x-target-model': customModel };
        if (isKeyValid) extraHeaders['x-custom-gemini-key'] = rawKey;

        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: extraHeaders,
        });
    },

    getProviders: () => apiRequest('/projects/providers'),

    getBySlug: (slug) => apiRequest(`/projects/slug/${slug}`),

    listMine: () => apiRequest('/projects/mine'),

    cancel: (projectId) =>
        apiRequest(`/projects/${projectId}/cancel`, { method: 'POST' }),

    delete: (projectId) =>
        apiRequest(`/projects/${projectId}`, { method: 'DELETE' }),

    getById: (projectId) =>
        apiRequest(`/projects/${projectId}`),

    update: (projectId, body) =>
        apiRequest(`/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(body) }),
};

export const github = {
    // Get the GitHub OAuth URL — pass includePrivate to control scope
    getAuthUrl: (includePrivate = false) =>
        apiRequest(`/auth/github?includePrivate=${includePrivate}`),
    getRepos: () => apiRequest('/auth/github/repos'),
    unlink: () => apiRequest('/auth/github/unlink', { method: 'PUT' }),
};
