import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^.{8,}$/;

    setSuccess("");

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
      setSuccess("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
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
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 text-center">
          {success}
        </div>
      )}
      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
      >
        Sign In
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
      >
        <span className="text-lg font-bold text-red-600">G</span>
        Continue with Google
      </button>
    </form>
  );
}

export default LoginForm;
