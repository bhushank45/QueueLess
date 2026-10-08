import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// =====================================================
// USER PAGES
// =====================================================

import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Privacy from "./pages/user/Privacy";
import Terms from "./pages/user/Terms";
import Support from "./pages/user/Support";
import Services from "./pages/user/Services";
import Queue from "./pages/user/Queue";

// =====================================================
// ADMIN PAGES
// =====================================================

import Dashboard from "./pages/admin/Dashboard";
import AdminQueues from "./pages/admin/AdminQueues";
import AdminServices from "./pages/admin/AdminServices";
import AdminSettings from "./pages/admin/AdminSettings";

// =====================================================
// LOADING SCREEN
// =====================================================

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <p className="text-sm text-slate-600">
          Loading QueueLess...
        </p>
      </div>
    </div>
  );
}

// =====================================================
// LOGIN REDIRECT
// =====================================================

function LoginRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Already authenticated
  if (user) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/services" replace />;
  }

  return <Login />;
}

// =====================================================
// REGISTER REDIRECT
// =====================================================

function RegisterRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Already authenticated
  if (user) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/services" replace />;
  }

  return <Register />;
}

// =====================================================
// FALLBACK REDIRECT
// =====================================================

function AuthRedirect() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin
  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Normal user
  return <Navigate to="/services" replace />;
}

// =====================================================
// APPLICATION ROUTES
// =====================================================

function AppRoutes() {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<LoginRedirect />}
      />

      <Route
        path="/register"
        element={<RegisterRedirect />}
      />

      <Route
        path="/privacy"
        element={<Privacy />}
      />

      <Route
        path="/terms"
        element={<Terms />}
      />

      <Route
        path="/support"
        element={<Support />}
      />

      {/* =================================================
          USER PROTECTED ROUTES
      ================================================= */}

      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />

      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <Queue />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          ADMIN PROTECTED ROUTES
      ================================================= */}

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Queue Management */}
      <Route
        path="/admin/queues"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminQueues />
          </ProtectedRoute>
        }
      />

      {/* Admin Service Management */}
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminServices />
          </ProtectedRoute>
        }
      />

      {/* Admin Settings */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* =================================================
          UNKNOWN ROUTES
      ================================================= */}

      <Route
        path="*"
        element={<AuthRedirect />}
      />
    </Routes>
  );
}

// =====================================================
// MAIN APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;