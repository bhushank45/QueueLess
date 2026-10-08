import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  ListOrdered,
  Menu,
  RefreshCw,
  Users,
  UserCheck,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { useEffect, useMemo, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import StatsCard from "../../components/admin/StatsCard";
import { db } from "../../firebase/firebase";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [waitingQueues, setWaitingQueues] = useState([]);
  const [servingQueues, setServingQueues] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD SERVICES
  // =========================================================

  useEffect(() => {
    const servicesRef = collection(db, "services");

    const unsubscribe = onSnapshot(
      servicesRef,
      (snapshot) => {
        const serviceList = snapshot.docs.map((serviceDoc) => ({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        }));

        setServices(serviceList);
        setLoading(false);
      },
      (error) => {
        console.error("Services listener error:", error);
        setError("Unable to load services.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // LOAD WAITING QUEUES
  // =========================================================

  useEffect(() => {
    const waitingQuery = query(
      collection(db, "queues"),
      where("status", "==", "waiting")
    );

    const unsubscribe = onSnapshot(
      waitingQuery,
      (snapshot) => {
        const queueList = snapshot.docs.map((queueDoc) => ({
          id: queueDoc.id,
          ...queueDoc.data(),
        }));

        setWaitingQueues(queueList);
      },
      (error) => {
        console.error("Waiting queue listener error:", error);
        setError("Unable to load waiting queues.");
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // LOAD SERVING QUEUES
  // =========================================================

  useEffect(() => {
    const servingQuery = query(
      collection(db, "queues"),
      where("status", "==", "serving")
    );

    const unsubscribe = onSnapshot(
      servingQuery,
      (snapshot) => {
        const queueList = snapshot.docs.map((queueDoc) => ({
          id: queueDoc.id,
          ...queueDoc.data(),
        }));

        setServingQueues(queueList);
      },
      (error) => {
        console.error("Serving queue listener error:", error);
        setError("Unable to load serving queues.");
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================================================
  // DASHBOARD STATISTICS
  // =========================================================

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.status === "accepting"
  ).length;

  const totalWaiting = waitingQueues.length;

  const currentlyServing = servingQueues.length;

  // Calculate average estimated wait from service data
  const averageWait = useMemo(() => {
    if (totalWaiting === 0) {
      return 0;
    }

    let totalWait = 0;

    waitingQueues.forEach((queue) => {
      const service = services.find(
        (item) => item.id === queue.serviceId
      );

      const serviceTime =
        Number(service?.averageServiceTime) ||
        Number(service?.estimatedWait) ||
        5;

      totalWait += serviceTime;
    });

    return Math.round(totalWait / totalWaiting);
  }, [waitingQueues, services, totalWaiting]);

  // =========================================================
  // SERVICE QUEUE OVERVIEW
  // =========================================================

  const serviceOverview = useMemo(() => {
    return services.map((service) => {
      const serviceWaitingQueues = waitingQueues
        .filter(
          (queue) => queue.serviceId === service.id
        )
        .sort(
          (a, b) =>
            Number(a.tokenNumber || 0) -
            Number(b.tokenNumber || 0)
        );

      const serviceServingQueues = servingQueues.filter(
        (queue) => queue.serviceId === service.id
      );

      const currentQueue =
        serviceServingQueues[0] || null;

      const waitingCount =
        serviceWaitingQueues.length;

      const serviceTime =
        Number(service.averageServiceTime) ||
        Number(service.estimatedWait) ||
        5;

      const estimatedWait =
        waitingCount * serviceTime;

      const currentTokenNumber =
        Number(service.currentTokenNumber) || 0;

      const prefix =
        service.name
          ?.trim()
          ?.charAt(0)
          ?.toUpperCase() || "Q";

      const currentToken =
        currentQueue?.token ||
        (currentTokenNumber > 0
          ? `${prefix}-${String(
              currentTokenNumber
            ).padStart(3, "0")}`
          : "Not started");

      const nextQueue =
        serviceWaitingQueues[0] || null;

      return {
        id: service.id,
        name: service.name || "Unnamed Service",
        description:
          service.description || "Queue service",
        status: service.status || "closed",
        waiting: waitingCount,
        estimatedWait,
        currentToken,
        nextToken:
          nextQueue?.token || "None",
        currentQueueId:
          currentQueue?.id || null,
      };
    });
  }, [
    services,
    waitingQueues,
    servingQueues,
  ]);

  // =========================================================
  // REFRESH / RELOAD INDICATOR
  // =========================================================

  const handleRefresh = () => {
    setLoading(true);

    // Firestore onSnapshot listeners automatically
    // receive the latest data. This just gives visual feedback.
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && services.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-64">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-20 items-center gap-3 px-5 sm:px-8">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Dashboard
                </h1>

                <p className="text-xs text-slate-500 sm:text-sm">
                  Loading live queue data...
                </p>
              </div>
            </div>
          </header>

          <section className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading dashboard...
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">

        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 sm:px-8">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Dashboard
                </h1>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Real-time QueueLess overview
                </p>
              </div>
            </div>

            {/* Live Status + Refresh */}

            <div className="flex items-center gap-2 sm:gap-3">

              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-semibold text-emerald-700">
                  Live updates
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label="Refresh dashboard"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="px-5 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">

            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="mb-7">

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                SYSTEM ONLINE
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                QueueLess Dashboard
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monitor services and queues in real time.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatsCard
                title="Total Services"
                value={totalServices}
                description={`${activeServices} currently accepting queues`}
                icon={Building2}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatsCard
                title="People Waiting"
                value={totalWaiting}
                description="Across all active queues"
                icon={Users}
                iconClass="bg-amber-50 text-amber-600"
              />

              <StatsCard
                title="Currently Serving"
                value={currentlyServing}
                description="Tokens being served now"
                icon={UserCheck}
                iconClass="bg-purple-50 text-purple-600"
              />

              <StatsCard
                title="Avg. Wait"
                value={`${averageWait} min`}
                description="Estimated average waiting time"
                icon={Clock3}
                iconClass="bg-emerald-50 text-emerald-600"
              />

            </div>

            {/* =================================================
                SERVICE OVERVIEW
            ================================================= */}

            <div className="mt-7 rounded-2xl border border-slate-100 bg-white shadow-sm">

              {/* Header */}

              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Service Queue Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Live queue information for every service
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <Activity className="h-3.5 w-3.5" />
                  Real-time
                </div>

              </div>

              {/* No Services */}

              {serviceOverview.length === 0 ? (
                <div className="px-5 py-16 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    No services available
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add a service from the Service Management page.
                  </p>

                </div>
              ) : (

                /* =================================================
                   DESKTOP TABLE
                ================================================= */

                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full">

                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Service
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Current
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Next
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Waiting
                        </th>

                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Est. Wait
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {serviceOverview.map((service) => (

                        <tr
                          key={service.id}
                          className="transition hover:bg-slate-50/70"
                        >

                          {/* Service */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <ListOrdered className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {service.name}
                                </p>

                                <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                                  {service.description}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                service.status === "accepting"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  service.status === "accepting"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />

                              {service.status === "accepting"
                                ? "Open"
                                : "Closed"}

                            </span>

                          </td>

                          {/* Current */}

                          <td className="px-5 py-4 text-center">

                            <span className="text-sm font-bold text-blue-600">
                              {service.currentToken}
                            </span>

                          </td>

                          {/* Next */}

                          <td className="px-5 py-4 text-center">

                            <span className="text-sm font-semibold text-slate-700">
                              {service.nextToken}
                            </span>

                          </td>

                          {/* Waiting */}

                          <td className="px-5 py-4 text-center">

                            <div className="inline-flex items-center gap-1.5">

                              <Users className="h-4 w-4 text-slate-400" />

                              <span className="text-sm font-bold text-slate-900">
                                {service.waiting}
                              </span>

                            </div>

                          </td>

                          {/* Estimated Wait */}

                          <td className="px-5 py-4 text-right">

                            <span className="text-sm font-bold text-blue-600">
                              {service.estimatedWait} min
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

              {/* =================================================
                  MOBILE SERVICE CARDS
              ================================================= */}

              {serviceOverview.length > 0 && (
                <div className="space-y-3 p-4 md:hidden">

                  {serviceOverview.map((service) => (

                    <div
                      key={service.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >

                      {/* Header */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ListOrdered className="h-5 w-5" />
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

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            service.status === "accepting"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {service.status === "accepting"
                            ? "Open"
                            : "Closed"}
                        </span>

                      </div>

                      {/* Stats */}

                      <div className="mt-4 grid grid-cols-4 gap-2">

                        <div className="rounded-lg bg-slate-50 p-2 text-center">
                          <p className="text-[9px] text-slate-400">
                            Current
                          </p>

                          <p className="mt-1 text-xs font-bold text-blue-600">
                            {service.currentToken}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-2 text-center">
                          <p className="text-[9px] text-slate-400">
                            Next
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-700">
                            {service.nextToken}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-2 text-center">
                          <p className="text-[9px] text-slate-400">
                            Waiting
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-900">
                            {service.waiting}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-2 text-center">
                          <p className="text-[9px] text-slate-400">
                            Wait
                          </p>

                          <p className="mt-1 text-xs font-bold text-blue-600">
                            {service.estimatedWait}m
                          </p>
                        </div>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>

            {/* =================================================
                LIVE SUMMARY
            ================================================= */}

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              {/* Services */}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Services
                    </p>

                    <p className="text-lg font-bold text-slate-900">
                      {activeServices}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        / {totalServices} open
                      </span>
                    </p>
                  </div>

                </div>

              </div>

              {/* Waiting */}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Waiting
                    </p>

                    <p className="text-lg font-bold text-slate-900">
                      {totalWaiting}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        people
                      </span>
                    </p>
                  </div>

                </div>

              </div>

              {/* Serving */}

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Currently Serving
                    </p>

                    <p className="text-lg font-bold text-slate-900">
                      {currentlyServing}
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        active
                      </span>
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;