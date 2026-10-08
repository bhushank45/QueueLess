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
  building: Building2,
};

function ServiceCard({ service, onJoinQueue, joining = false }) {
  const Icon = iconMap[service.icon] || Building2;

  const isOpen = service.status === "accepting";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${
            isOpen ? "bg-blue-50" : "bg-slate-100"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOpen ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />

          <span
            className={`text-xs font-semibold ${
              isOpen ? "text-blue-700" : "text-slate-500"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold text-slate-900">
          {service.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {service.description}
        </p>
      </div>

      {/* Queue Information */}
      <div className="mt-6 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-blue-50/70 px-3 py-3">
        <div className="px-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />

            <span className="text-xs font-medium text-slate-500">
              Waiting
            </span>
          </div>

          <p className="mt-1 text-base font-semibold text-slate-900">
            {service.waitingCount || 0} people
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
            {service.estimatedWait || 0} min
          </p>
        </div>
      </div>

      {/* Join */}
      <button
        type="button"
        disabled={!isOpen || joining}
        onClick={() => onJoinQueue(service)}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
          isOpen && !joining
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 hover:bg-blue-700"
            : "cursor-not-allowed bg-slate-100 text-slate-400"
        }`}
      >
        {joining
          ? "Joining..."
          : isOpen
            ? "Join Queue"
            : "Service Closed"}

        {isOpen && !joining && (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default ServiceCard;