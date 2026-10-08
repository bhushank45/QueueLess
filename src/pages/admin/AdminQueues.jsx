import { ListOrdered } from "lucide-react";

import AdminQueueCard from "../../components/admin/AdminQueueCard";

const queues = [
  {
    id: 1,
    service: "Hospital OPD",
    department: "Outpatient Consultation",
    currentToken: "A-101",
    nextToken: "A-102",
    waiting: 8,
    estimatedWait: 20,
    status: "Active",
  },
  {
    id: 2,
    service: "Bank Customer Service",
    department: "Main Branch Counter 1-4",
    currentToken: "B-045",
    nextToken: "B-046",
    waiting: 4,
    estimatedWait: 10,
    status: "Active",
  },
  {
    id: 3,
    service: "College Office",
    department: "Registrar & Fee Inquiries",
    currentToken: "C-018",
    nextToken: "C-019",
    waiting: 6,
    estimatedWait: 15,
    status: "Active",
  },
];

function AdminQueues() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              LIVE QUEUES
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Queue Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor and manage active queues.
            </p>
          </div>

          {/* Active Queue Count */}
          <div className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
            <ListOrdered className="h-5 w-5 text-blue-600" />

            <div>
              <p className="text-xs text-slate-500">Active Queues</p>
              <p className="text-lg font-bold text-slate-900">
                {queues.length}
              </p>
            </div>
          </div>
        </div>

        {/* Queue Cards */}
        <div className="mt-7 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {queues.map((queue) => (
            <AdminQueueCard key={queue.id} queue={queue} />
          ))}
        </div>

        
      </div>
    </main>
  );
}

export default AdminQueues;
