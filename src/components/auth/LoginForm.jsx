import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase/firebase";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // =========================
    // Validation
    // =========================

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const passwordRegex = /^.{8,}$/;

    setErrors({});

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    // Stop if validation fails
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // =========================
    // Firebase Login
    // =========================

    try {
      setLoading(true);

      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const loggedInUser = credential.user;

      console.log(
        "Firebase login successful:",
        loggedInUser.uid
      );

      // =========================
      // Get User Profile
      // =========================

      const userRef = doc(
        db,
        "users",
        loggedInUser.uid
      );

      const userSnap = await getDoc(userRef);

      // =========================
      // Check User Role
      // =========================

      if (userSnap.exists()) {
        const userData = userSnap.data();

        console.log("User profile:", userData);
        console.log("User role:", userData.role);

        // Admin
        if (userData.role === "admin") {
          navigate("/admin");
        }

        // Normal user
        else {
          navigate("/");
        }
      }

      // If Firestore profile does not exist
      else {
        console.warn(
          "User profile not found in Firestore"
        );

        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      // =========================
      // Firebase Errors
      // =========================

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setErrors({
          general: "Invalid email or password.",
        });
      } else if (
        error.code === "auth/too-many-requests"
      ) {
        setErrors({
          general:
            "Too many failed attempts. Please try again later.",
        });
      } else if (
        error.code === "auth/network-request-failed"
      ) {
        setErrors({
          general:
            "Network error. Please check your internet connection.",
        });
      } else {
        setErrors({
          general:
            "Login failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* =========================
          General Error
      ========================= */}

      {errors.general && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
          {errors.general}
        </div>
      )}

      {/* =========================
          Email
      ========================= */}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Email address
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
            autoComplete="email"
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      {/* =========================
          Password
      ========================= */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-800"
          >
            Password
          </label>

          <button
            type="button"
            disabled={loading}
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            disabled={loading}
            autoComplete="current-password"
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-500">
            {errors.password}
          </p>
        )}
      </div>

      {/* =========================
          Sign In Button
      ========================= */}

      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            Sign In
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      {/* =========================
          OR Divider
      ========================= */}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-medium text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* =========================
          Google Button
      ========================= */}

      <button
        type="button"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="text-lg font-bold text-red-600">
          G
        </span>

        Continue with Google
      </button>
    </form>
  );
}

export default LoginForm;