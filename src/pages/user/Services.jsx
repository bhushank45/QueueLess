import { ArrowRight, CheckCircle2, Clock3, RefreshCw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import services from "../../data/services";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ServiceCard from "../../components/service/ServiceCard";

function Services() {
  const [joinedService, setJoinedService] = useState(null);

  const handleJoinQueue = (service) => {
    setJoinedService(service);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* Welcome section */}
        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-semibold text-emerald-700">
                  LIVE FACILITIES ONLINE
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Hello, User
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Select a facility or desk to join a digital queue and track your
                position live.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Avg. Network Wait
                </p>

                <p className="text-lg font-bold leading-tight text-slate-900">
                  ~15 mins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services heading */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Available Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a desk below to request your instant digital token
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
            <RefreshCw className="h-3.5 w-3.5" />
            Refreshed just now
          </div>
        </div>

        {/* Service cards */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onJoinQueue={handleJoinQueue}
            />
          ))}
        </div>
      </section>

      <Footer />

      {/* Success Modal */}
      {joinedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setJoinedService(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
              Joined Queue Successfully!
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              You have joined the queue for{" "}
              <span className="font-semibold text-slate-900">
                {joinedService.name}
              </span>
              .
            </p>

            <p className="mt-2 text-sm text-slate-500">
              You can track your token and queue position from My Queue.
            </p>

            <Link
              to="/queue"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Go to My Queue
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setJoinedService(null)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Stay on Services
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Services;
