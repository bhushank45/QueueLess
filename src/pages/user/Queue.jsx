import { Radio, Volume2 } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import QueueCard from "../../components/queue/QueueCard";

function Queue() {
  const queue = {
    service: "Hospital OPD",
    department: "Outpatient Consultation",
    token: "A-105",
    doctor: "Doctor Desk #04 • Dr. Aris Vance",
    currentToken: "A-101",
    position: 4,
    peopleAhead: 3,
    estimatedWait: 15,
    waitPerPatient: 4,
    joinedAt: "10:42 AM",
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff]">
      <Navbar />

      <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <QueueCard queue={queue} />

          {/* Information Cards */}
          <div className="mx-auto mt-4 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Volume2 className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Audio Announcements
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Tokens are also called out over speaker
                    <br />
                    at Lobby 2.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Radio className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Live Sync Active
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Auto-updating every 10 seconds without
                    <br />
                    refresh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Queue;
