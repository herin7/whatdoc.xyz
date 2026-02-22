import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ServerWarmup from './ServerWarmup';

export default function ProtectedRoute({ children }) {
    const { user, loading, serverReady, warmUpStatus } = useAuth();

    if (!serverReady) {
        return <ServerWarmup status={warmUpStatus} />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-zinc-500">Loading your session…</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
