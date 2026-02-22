// In dev mode, use empty string so requests go through the Vite proxy (avoids cross-origin blocks on subdomains).
// In production, use the full API URL.
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'http://localhost:3000');
export const APP_DOMAIN = import.meta.env.VITE_APP_DOMAIN || 'localhost:5173';
