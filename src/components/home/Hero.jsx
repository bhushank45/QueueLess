import { ArrowRight, Clock, RefreshCw, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BenefitItem from "./BenefitItem";
import LiveTokenCard from "./LiveTokenCard";

function Hero() {
  const { user, role, loading } = useAuth();
  const secondaryAction = user
    ? {
        label: role === "admin" ? "Admin Dashboard" : "My Queue",
        to: role === "admin" ? "/admin" : "/queue",
      }
    : { label: "Login", to: "/login" };

  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-blue-700 sm:text-sm">
                Queues are moving
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Skip the wait.
              <span className="block text-blue-600">
                Join the queue online.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Get your queue token online, track your position in real-time, and
              know when it&apos;s your turn.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/services"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Join Queue
                <ArrowRight className="h-4 w-4" />
              </Link>

              {!loading && (
                <Link
                  to={secondaryAction.to}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LiveTokenCard />
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-slate-100 pt-8 sm:grid-cols-3 lg:mt-12">
          <BenefitItem
            icon={Ticket}
            title="Instant Token"
            description="Get your queue token in seconds."
          />

          <BenefitItem
            icon={RefreshCw}
            title="Real-time Updates"
            description="Track your position as the queue moves."
          />

          <BenefitItem
            icon={Clock}
            title="Save Time"
            description="Know when it's your turn."
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
