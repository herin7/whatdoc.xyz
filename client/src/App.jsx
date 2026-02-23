import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import ServerWarmup from './components/ServerWarmup';
import { useAuth } from './context/AuthContext';
import { project } from './lib/api';
// Lazy load pages for code splitting
const Home = lazy(() => import('./app/page'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ImportRepo = lazy(() => import('./pages/ImportRepo'));
const ConfigureProject = lazy(() => import('./pages/ConfigureProject'));
const DeployProgress = lazy(() => import('./pages/DeployProgress'));
const DocViewer = lazy(() => import('./pages/DocViewer'));
const ProjectEditor = lazy(() => import('./pages/ProjectEditor'));
const BetaProjectEditor = lazy(() => import('./pages/BetaProjectEditor'));
const ProjectSettings = lazy(() => import('./pages/ProjectSettings'));
const Profile = lazy(() => import('./pages/Profile'));
const Engine = lazy(() => import('./pages/Engine'));
const Creator = lazy(() => import('./pages/Creator'));
const SubdomainApp = lazy(() => import('./pages/SubdomainApp'));
const Templates = lazy(() => import('./pages/Templates'));
const PublicProjectView = lazy(() => import('./pages/PublicProjectView'));

function getSubdomain() {
  const host = window.location.hostname;
  const parts = host.split('.');

  if (host.endsWith('.vercel.app')) return null;
  if (parts.length <= 1) return null;

  const isLocalhost = parts[parts.length - 1] === 'localhost';
  const minParts = isLocalhost ? 2 : 3;

  if (parts.length < minParts) return null;

  const sub = parts[0].toLowerCase();
  if (sub === 'www') return null;
  return sub;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Global Suspense Loader
const PageLoader = () => (
  <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
    <Loader2 className="size-6 animate-spin text-emerald-500" />
  </div>
);

function App() {
  const [customDocData, setCustomDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { serverReady, warmUpStatus } = useAuth();
  const hostname = window.location.hostname;
  const isCustomDomain = !hostname.includes('whatdoc.xyz') && !hostname.includes('localhost');
  const subdomain = getSubdomain();
  useEffect(() => {
    if (isCustomDomain) {
      // 2. Fetch the project data from your Render backend using the hostname
      project.getByCustomDomain(hostname)
        .then((data) => {
          setCustomDocData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Domain lookup failed", err);
          setLoading(false);
        });
    }
  }, [isCustomDomain, hostname]);
  if (isCustomDomain) {
    if (loading) return <div className="loader">Loading Documentation...</div>;
    if (!customDocData) return <div className="error">404: Documentation Not Found</div>;

    // Render the dedicated viewer component with the fetched docs
    return <RepoDetailView project={customDocData} isPublicView={true} />;
  }
  if (subdomain) {
    return (
      <Suspense fallback={<PageLoader />}>
        <SubdomainApp subdomain={subdomain} />
      </Suspense>
    );
  }

  if (!serverReady) {
    return <ServerWarmup status={warmUpStatus} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:slug" element={<PublicProjectView />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/import" element={<ProtectedRoute><ImportRepo /></ProtectedRoute>} />
        <Route path="/configure" element={<ProtectedRoute><ConfigureProject /></ProtectedRoute>} />
        <Route path="/deploy/:projectId" element={<ProtectedRoute><DeployProgress /></ProtectedRoute>} />
        <Route path="/editor/:projectId" element={<ProtectedRoute><ProjectEditor /></ProtectedRoute>} />
        <Route path="/project/:projectId/beta-edit" element={<ProtectedRoute><BetaProjectEditor /></ProtectedRoute>} />
        <Route path="/project/:id/settings" element={<ProtectedRoute><ProjectSettings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/engine" element={<Engine />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/templates" element={<Templates />} />
      </Routes>
    </Suspense>
  );
}

export default App;
