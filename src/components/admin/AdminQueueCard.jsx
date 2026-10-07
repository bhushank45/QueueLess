import {
  ArrowRight,
  Clock3,
  ListOrdered,
  SkipForward,
  Users,
} from "lucide-react";

function AdminQueueCard({ queue }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {queue.service}
          </h2>

          <p className="mt-1 text-xs text-slate-500">{queue.department}</p>
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {queue.status}
        </span>
      </div>

      {/* Current Token */}
      <div className="mt-5 rounded-xl bg-blue-50 p-4 text-center">
        <p className="text-xs font-medium text-slate-500">Currently Serving</p>

        <p className="mt-1 text-3xl font-bold text-blue-600">
          {queue.currentToken}
        </p>

        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ArrowRight className="h-3.5 w-3.5" />
          Next:
          <span className="font-semibold text-slate-700">
            {queue.nextToken}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />

            <span className="text-xs text-slate-500">Waiting</span>
          </div>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {queue.waiting}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-400" />

            <span className="text-xs text-slate-500">Est. Wait</span>
          </div>

          <p className="mt-1 text-lg font-bold text-blue-600">
            {queue.estimatedWait} min
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowRight className="h-4 w-4" />
          Serve Next
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
      </div>
    </div>
  );
}

export default AdminQueueCard;
