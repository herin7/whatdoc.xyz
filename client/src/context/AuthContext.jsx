import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi, warmUpBackend } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverReady, setServerReady] = useState(false);
    const [warmUpStatus, setWarmUpStatus] = useState('');

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const data = await authApi.me();
            setUser(data.current_user);
        } catch {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const result = await warmUpBackend((status) => {
                if (!cancelled) setWarmUpStatus(status);
            });

            if (cancelled) return;

            setServerReady(result.ok);

            if (result.ok) {
                setWarmUpStatus('Connected!');
                await fetchUser();
            } else {
                setWarmUpStatus('Could not reach the server');
                setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [fetchUser]);

    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, updateUser, serverReady, warmUpStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
