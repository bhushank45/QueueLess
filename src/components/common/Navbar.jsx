import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-transparent px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto max-w-7xl rounded-3xl border border-white bg-white px-5 py-3 shadow-sm sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative py-2 text-sm font-semibold transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Services
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/queue"
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  My Queue
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                  )}
                </>
              )}
            </NavLink>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 hover:text-blue-700"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 border-t border-slate-100 pt-4 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                Services
              </NavLink>

              <NavLink
                to="/queue"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                My Queue
              </NavLink>

              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
