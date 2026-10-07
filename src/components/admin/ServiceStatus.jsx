import { Building2, CheckCircle2, Clock3, Users } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Hospital OPD",
    description: "Outpatient Clinic & Triage",
    waiting: 8,
    wait: 20,
    status: "Open",
  },
  {
    id: 2,
    name: "Bank Customer Service",
    description: "Main Branch Counter 1-4",
    waiting: 4,
    wait: 10,
    status: "Open",
  },
  {
    id: 3,
    name: "College Office",
    description: "Registrar & Fee Inquiries",
    waiting: 6,
    wait: 15,
    status: "Open",
  },
];

function ServiceStatus() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-5">
        <h2 className="text-lg font-bold text-slate-900">Service Status</h2>

        <p className="mt-1 text-sm text-slate-500">
          Current status of available services
        </p>
      </div>

      {/* Services */}
      <div className="space-y-3 p-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {service.status}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-5 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400">Waiting</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {service.waiting}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400">Est. Wait</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {service.wait} min
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceStatus;
