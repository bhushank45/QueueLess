import { Settings } from "lucide-react";

function AdminSettings() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Settings className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Admin Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Admin settings will be added here.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminSettings;
