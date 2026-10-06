import { Clock3, Users, ArrowUpRight } from "lucide-react";

function LiveTokenCard() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/50 sm:p-8 mt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Your live token
          </p>

          <h3 className="mt-1 text-sm font-semibold text-slate-900">
            Campus Center
          </h3>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-600">Active</span>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-blue-50 px-6 py-7 text-center">
        <p className="text-xs font-medium text-blue-500">TOKEN NUMBER</p>

        <p className="mt-2 text-5xl font-bold tracking-tight text-blue-600">
          A-105
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Position</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">#4</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs font-medium">Est. Wait</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-900">15 min</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            3 people ahead of you
          </span>

          <span className="text-xs font-semibold text-blue-600">Desk 03</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-[70%] rounded-full bg-blue-600" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-400">Updated just now</p>

        <div className="flex items-center gap-1 text-xs font-semibold text-blue-600">
          Live status
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}

export default LiveTokenCard;
