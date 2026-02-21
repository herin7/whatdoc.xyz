import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './app/page';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ImportRepo from './pages/ImportRepo';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/import" element={<ProtectedRoute><ImportRepo /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
