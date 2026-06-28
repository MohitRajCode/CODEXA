import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProtectedRoute, GuestRoute, AdminRoute } from './routes/guards';

// Layouts
import Layout from './components/layout/Layout';

// Landing pages
import Home     from './pages/landing/Home';
import Pricing  from './pages/landing/Pricing';
import NotFound from './pages/NotFound';

// Auth pages
import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import ForgotPassword  from './pages/auth/ForgotPassword';
import ResetPassword   from './pages/auth/ResetPassword';
import AuthCallback    from './pages/auth/AuthCallback';

// Dashboard pages
import Dashboard     from './pages/Dashboard';
import Sessions      from './pages/dashboard/Sessions';
import Projects      from './pages/dashboard/Projects';
import Analytics     from './pages/dashboard/Analytics';
import Goals         from './pages/dashboard/Goals';
import Leaderboard   from './pages/dashboard/Leaderboard';
import Profile       from './pages/dashboard/Profile';
import Settings      from './pages/dashboard/Settings';
import Premium       from './pages/dashboard/Premium';
import Calendar      from './pages/dashboard/Calendar';
import Github        from './pages/dashboard/Github';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* ── Public / Landing ──────────────────────────── */}
              <Route path="/"         element={<Home />} />
              <Route path="/pricing"  element={<Pricing />} />

              {/* ── Auth ─────────────────────────────────────── */}
              <Route path="/login"          element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register"       element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback"  element={<AuthCallback />} />

              {/* ── Protected Dashboard ──────────────────────── */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index            element={<Dashboard />} />
                <Route path="sessions"     element={<Sessions />} />
                <Route path="projects"     element={<Projects />} />
                <Route path="analytics"    element={<Analytics />} />
                <Route path="goals"        element={<Goals />} />
                <Route path="leaderboard"  element={<Leaderboard />} />
                <Route path="profile"      element={<Profile />} />
                <Route path="settings"     element={<Settings />} />
                <Route path="premium"      element={<Premium />} />
                <Route path="calendar"     element={<Calendar />} />
                <Route path="github"       element={<Github />} />
              </Route>

              {/* ── 404 ──────────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}