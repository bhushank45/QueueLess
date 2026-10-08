import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // ---------------------------------------
  // Firebase authentication is loading
  // ---------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading QueueLess...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // User is NOT logged in
  // Redirect to Login
  // ---------------------------------------
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ---------------------------------------
  // User is logged in but has wrong role
  // ---------------------------------------
  if (allowedRole && role !== allowedRole) {
    // Admin trying to access user pages
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // Normal user trying to access admin pages
    return <Navigate to="/services" replace />;
  }

  // ---------------------------------------
  // User is authenticated and has
  // the correct role
  // ---------------------------------------
  return children;
}

export default ProtectedRoute;