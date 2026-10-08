import {
  ArrowRight,
  Building2,
  Clock3,
  GraduationCap,
  Hospital,
  Users,
  WalletCards,
} from "lucide-react";

const iconMap = {
  hospital: Hospital,
  bank: WalletCards,
  college: GraduationCap,
};

function ServiceCard({ service, onJoinQueue }) {
  const Icon = iconMap[service.icon] || Building2;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold capitalize text-blue-700">
            {service.status}
          </span>
        </div>
      </div>

      {/* Service details */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>

        <p className="mt-1 text-sm text-slate-500">{service.description}</p>
      </div>

      {/* Queue information */}
      <div className="mt-6 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-blue-50/70 px-3 py-3">
        <div className="px-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />

            <span className="text-xs font-medium text-slate-500">Waiting</span>
          </div>

          <p className="mt-1 text-base font-semibold text-slate-900">
            {service.waitingCount} people
          </p>
        </div>

        <div className="px-3">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-500" />

            <span className="text-xs font-medium text-slate-500">
              Est. Wait
            </span>
          </div>

          <p className="mt-1 text-base font-semibold text-blue-600">
            {service.estimatedWait} min
          </p>
        </div>
      </div>

      {/* Join Queue button */}
      <button
        type="button"
        onClick={() => onJoinQueue(service)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-700"
      >
        Join Queue
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ServiceCard;
