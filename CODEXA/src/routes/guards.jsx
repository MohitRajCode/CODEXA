import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// ─── Protected Route: requires auth ──────────────────────────────────────────
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ─── Admin Route: requires admin role ────────────────────────────────────────
export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

// ─── Guest Route: redirect authenticated users away from auth pages ────────────
export function GuestRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6D5DFB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}
