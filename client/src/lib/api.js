import { API_URL } from './config';

export async function warmUpBackend(onStatus) {
    const MAX_ATTEMPTS = 12;
    const TIMEOUT_MS = 8_000;

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
        try {
            if (onStatus) {
                if (i === 1) onStatus('Connecting to server…');
                else if (i <= 3) onStatus('Server is waking up (usually takes ~30s)…');
                else onStatus('Still waking up, almost there…');
            }

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const res = await fetch(`${API_URL}/health`, {
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' },
            });
            clearTimeout(timer);

            // If we get a 200 OK, the server is fully awake.
            // If we hit a 429, the server IS awake, it's just telling us to slow down!
            if (res.ok || res.status === 429) {
                return { ok: true, attempts: i };
            }
        } catch (err) {
            // Network error or timeout (server is still asleep/booting)
            // Exponential backoff: 2s, 4s, 6s, 8s... capping at 10 seconds.
            const backoff = Math.min(10_000, 2000 * i);
            await new Promise((r) => setTimeout(r, backoff));
        }
    }
    return { ok: false, attempts: MAX_ATTEMPTS };
}

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
    getByCustomDomain: (domain) => apiRequest(`/projects/custom-domain/${domain}`),
    update: (projectId, body) =>
        apiRequest(`/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        }),
    getJobStatus: (id) => apiRequest(`/projects/jobs/${id}`),

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
    getAuthUrl: (includePrivate = false) =>
        apiRequest(`/auth/github?includePrivate=${includePrivate}`),
    getRepos: () => apiRequest('/auth/github/repos'),
    unlink: () => apiRequest('/auth/github/unlink', { method: 'PUT' }),
};
