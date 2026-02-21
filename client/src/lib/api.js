const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
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
    create: (body) =>
        apiRequest('/projects', { method: 'POST', body: JSON.stringify(body) }),
};

export const github = {
    // Get the GitHub OAuth URL — pass includePrivate to control scope
    getAuthUrl: (includePrivate = false) =>
        apiRequest(`/auth/github?includePrivate=${includePrivate}`),

    // Fetch all repos for the connected GitHub account
    getRepos: () => apiRequest('/auth/github/repos'),
};
