const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
};

export const project = {    
    create: (body) => {
        const customKey = localStorage.getItem('wtd_gemini_key') || '';
        const customModel = localStorage.getItem('wtd_gemini_model') || 'gemini-2.5-flash-lite';
        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'x-custom-gemini-key': customKey,
                'x-target-model': customModel,
            },
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
};
