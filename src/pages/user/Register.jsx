import { Link } from "react-router-dom";
import { Ticket, Zap, RefreshCw, Clock } from "lucide-react";
import RegisterForm from "../../components/auth/RegisterForm";

function Register() {
  return (
    <main className="min-h-screen bg-slate-50 p-0 sm:p-4 lg:p-8">
      <div className="mx-auto min-h-screen max-w-6xl overflow-hidden bg-white shadow-xl sm:min-h-0 sm:rounded-3xl">
        <div className="grid min-h-180 md:grid-cols-2">
          
          <section className="relative hidden overflow-hidden bg-linear-to-br from-blue-100 via-blue-50 to-white md:block">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-300/30" />

            <div className="relative flex h-full flex-col p-10 lg:p-14">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                  <Ticket className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    QueueLess
                  </h1>

                  <p className="text-sm text-slate-500">Digital Queue System</p>
                </div>
              </div>

              <div className="mt-20 max-w-lg">
                <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 lg:text-6xl">
                  Join the queue,
                  <span className="block text-blue-600">without the wait.</span>
                </h2>

                <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
                  Create your QueueLess account and manage your queue experience
                  easily from anywhere.
                </p>
              </div>

              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Zap className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Quick Registration
                    </h3>

                    <p className="text-sm text-slate-500">
                      Create your account in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <RefreshCw className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Real-time Updates
                    </h3>

                    <p className="text-sm text-slate-500">
                      Track your position live
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                    <Clock className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">Save Time</h3>

                    <p className="text-sm text-slate-500">
                      No unnecessary waiting
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 hidden rotate-3 rounded-2xl border border-white/80 bg-white/70 p-5 shadow-xl backdrop-blur-sm lg:block">
                <p className="text-xs font-medium text-slate-500">Your Queue</p>

                <p className="mt-1 text-3xl font-bold text-blue-600">A-022</p>

                <div className="mt-3 h-2 w-24 rounded-full bg-blue-100" />
                <div className="mt-2 h-2 w-16 rounded-full bg-blue-100" />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-10 text-center md:hidden">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                  <Ticket className="h-7 w-7 text-white" />
                </div>

                <h1 className="mt-3 text-2xl font-bold text-slate-900">
                  QueueLess
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Digital Queue System
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Join QueueLess and start managing your queue easily
                </p>
              </div>

              <RegisterForm />

              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Register;
