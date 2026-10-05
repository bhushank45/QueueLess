import { Mail, Lock, ArrowRight } from "lucide-react";
function LoginForm() {
  return (
    <form className="space-y-5">
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
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
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
            type="password"
            placeholder="Enter your password"
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

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
