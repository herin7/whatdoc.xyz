import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './app/page';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ImportRepo from './pages/ImportRepo';
import ConfigureProject from './pages/ConfigureProject';
import DeployProgress from './pages/DeployProgress';
import DocViewer from './pages/DocViewer';
import ProjectEditor from './pages/ProjectEditor';
import ProjectSettings from './pages/ProjectSettings';
import Profile from './pages/Profile';
import Engine from './pages/Engine';
import Creator from './pages/Creator';
import SubdomainApp from './pages/SubdomainApp';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Templates from './pages/Templates';
import PublicProjectView from './pages/PublicProjectView';

/** Extract subdomain from current hostname, ignoring "www". */
function getSubdomain() {
  const host = window.location.hostname; // e.g. "acme.whatdoc.xyz" or "acme.localhost"
  const parts = host.split('.');

  // Vercel preview: whatdoc-xyz.vercel.app — no subdomain support there
  if (host.endsWith('.vercel.app')) return null;

  // localhost / whatdoc.xyz  → no subdomain
  // acme.localhost / acme.whatdoc.xyz → "acme"
  if (parts.length <= 1) return null;

  // "foo.localhost" → 2 parts, "foo.whatdoc.xyz" → 3 parts
  const isLocalhost = parts[parts.length - 1] === 'localhost';
  const minParts = isLocalhost ? 2 : 3; // 2 for *.localhost, 3 for *.whatdoc.xyz

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

function App() {
  // If accessed via a subdomain (e.g. acme.whatdoc.xyz), render standalone doc site
  const subdomain = getSubdomain();
  if (subdomain) return <SubdomainApp subdomain={subdomain} />;

  return (
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
      <Route path="/project/:id/settings" element={<ProtectedRoute><ProjectSettings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/engine" element={<Engine />} />
      <Route path="/creator" element={<Creator />} />

      <Route path="/templates" element={<Templates />} />
    </Routes>
  );
}

export default App;
