import {
  LayoutDashboard,
  ListOrdered,
  Settings,
  LogOut,
  Building2,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Queues",
    icon: ListOrdered,
  },
  {
    label: "Services",
    icon: Building2,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div>
            <h1 className="text-xl font-bold text-blue-600">QueueLess</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.label === "Dashboard"
                ? location.pathname === "/admin"
                : item.label === "Queues"
                  ? location.pathname === "/admin/queues"
                  : item.label === "Services"
                    ? location.pathname === "/admin/services"
                    : location.pathname === "/admin/settings";

            const route =
              item.label === "Dashboard"
                ? "/admin"
                : item.label === "Queues"
                  ? "/admin/queues"
                  : item.label === "Services"
                    ? "/admin/services"
                    : "/admin/settings";

            return (
              <Link
                key={item.label}
                to={route}
                onClick={onClose}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
