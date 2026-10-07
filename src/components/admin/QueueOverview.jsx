import { Clock3, ListOrdered, Users } from "lucide-react";

const queues = [
  {
    id: 1,
    service: "Hospital OPD",
    department: "Outpatient Consultation",
    currentToken: "A-101",
    waiting: 8,
    estimatedWait: 20,
    status: "Active",
  },
  {
    id: 2,
    service: "Bank Customer Service",
    department: "Main Branch Counter",
    currentToken: "B-045",
    waiting: 4,
    estimatedWait: 10,
    status: "Active",
  },
  {
    id: 3,
    service: "College Office",
    department: "Registrar & Fee Inquiries",
    currentToken: "C-018",
    waiting: 6,
    estimatedWait: 15,
    status: "Active",
  },
];

function QueueOverview() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Active Queues</h2>
          <p className="mt-1 text-sm text-slate-500">
            Overview of currently running queues
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      {/* Queue List */}
      <div className="divide-y divide-slate-100">
        {queues.map((queue) => (
          <div
            key={queue.id}
            className="px-5 py-5 transition hover:bg-slate-50/70"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Service */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ListOrdered className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {queue.service}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {queue.department}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 sm:w-fit">
                <div>
                  <p className="text-[11px] font-medium text-slate-400">
                    Current
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {queue.currentToken}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-[11px] font-medium text-slate-400">
                      Waiting
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {queue.waiting}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-[11px] font-medium text-slate-400">
                      Wait
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-bold text-blue-600">
                    {queue.estimatedWait} min
                  </p>
                </div>
              </div>

              {/* Status */}
              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {queue.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueueOverview;
