import { Bell, Clock3, LogOut, ShieldCheck } from "lucide-react";

function QueueCard({ queue }) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10">
      {/* Queue Status */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-xs font-medium text-emerald-700">
            You&apos;re in the queue
          </span>
        </div>
      </div>

      {/* Service */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-blue-700">
        <ShieldCheck className="h-4 w-4" />

        <span>{queue.service}</span>

        <span className="text-slate-400">•</span>

        <span>{queue.department}</span>
      </div>

      {/* Token */}
      <div className="mt-7 rounded-xl bg-[#f0f1ff] px-6 py-8 text-center sm:py-9">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-700">
          YOUR TOKEN
        </p>

        <p className="mt-1 text-5xl font-bold tracking-tight text-blue-700 sm:text-6xl">
          {queue.token}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

          {queue.doctor}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {/* Current Token */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Current Token
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {queue.currentToken}
          </p>

          <div className="mt-0.5 flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold text-emerald-600">
              Active
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-500">Serving now</p>
        </div>

        {/* Position */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Your Position
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">
            #{queue.position}
          </p>

          <p className="text-[10px] font-medium text-slate-600">in line</p>

          <p className="mt-1 text-[10px] text-slate-500">
            {queue.peopleAhead} patients ahead
          </p>
        </div>

        {/* Estimated Wait */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Estimated Wait
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {queue.estimatedWait}
            <span className="ml-1 text-xs font-semibold">mins</span>
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            ~{queue.waitPerPatient} min / patient
          </p>
        </div>
      </div>

      {/* Queue Announcement */}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f0f1ff] px-4 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Bell className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">
            Stay nearby OPD Waiting Area B
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
            We&apos;ll buzz your device when 1 person is ahead of you.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          SMS Live
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock3 className="h-3.5 w-3.5" />

          <span>Joined at {queue.joinedAt}</span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          Leave Queue
        </button>
      </div>
    </div>
  );
}

export default QueueCard;
