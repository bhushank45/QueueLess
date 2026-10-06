import { Ticket } from "lucide-react";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
        <Ticket className="h-5 w-5 text-white" />
      </div>

      <span className="text-xl font-bold tracking-tight text-slate-900">
        Queue<span className="text-blue-600">Less</span>
      </span>
    </div>
  );
}

export default Logo;
