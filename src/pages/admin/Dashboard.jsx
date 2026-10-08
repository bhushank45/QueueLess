import { Activity, ListOrdered, Menu, Users, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import StatsCard from "../../components/admin/StatsCard";
import QueueOverview from "../../components/admin/QueueOverview";
import ServiceStatus from "../../components/admin/ServiceStatus";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
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
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Monitor your QueueLess services
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                A
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section className="px-5 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Welcome */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                SYSTEM ONLINE
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Good morning, Admin
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Here is what's happening across your queues today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                title="Active Queues"
                value="12"
                description="Currently running"
                icon={ListOrdered}
                iconClass="bg-blue-50 text-blue-600"
              />

              <StatsCard
                title="People Waiting"
                value="48"
                description="Across all queues"
                icon={Users}
                iconClass="bg-amber-50 text-amber-600"
              />

              <StatsCard
                title="Currently Serving"
                value="7"
                description="Tokens being served"
                icon={Activity}
                iconClass="bg-purple-50 text-purple-600"
              />

              <StatsCard
                title="Completed Today"
                value="126"
                description="Tokens completed"
                icon={CheckCircle2}
                iconClass="bg-emerald-50 text-emerald-600"
              />
            </div>

            {/* Main Dashboard */}
            <div className="mt-7 grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <QueueOverview />
              </div>

              <div>
                <ServiceStatus />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
