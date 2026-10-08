import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ListOrdered,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import Logo from "./Logo";
import { auth, db } from "../../firebase/firebase";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Listen for Firebase authentication changes
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Get user's profile from Firestore
          const userDoc = await getDoc(
            doc(db, "users", currentUser.uid)
          );

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setUserName(
              userData.name ||
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "User"
            );
          } else {
            setUserName(
              currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "User"
            );
          }
        } catch (error) {
          console.error("Error loading user profile:", error);

          setUserName(
            currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "User"
          );
        }
      } else {
        setUserName("");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ==========================================
  // Logout
  // ==========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==========================================
  // Get first letter for profile avatar
  // ==========================================

  const getInitial = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <header className="bg-transparent px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto max-w-7xl rounded-3xl border border-white bg-white px-5 py-3 shadow-sm sm:px-8 lg:px-10">

        {/* ==========================================
            DESKTOP / MAIN NAVBAR
        ========================================== */}

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              setIsMenuOpen(false);
              setIsProfileOpen(false);
            }}
          >
            <Logo />
          </Link>

          {/* Navigation Links */}
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

          {/* ==========================================
              RIGHT SIDE
          ========================================== */}

          <div className="hidden items-center gap-4 md:flex">

            {/* Loading */}
            {loading ? (
              <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (

              /* ==========================================
                 LOGGED-IN USER
              ========================================== */

              <div className="relative">

                {/* Profile Button */}
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(!isProfileOpen)
                  }
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
                >

                  {/* Avatar */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {getInitial()}
                  </div>

                  {/* Name */}
                  <div className="max-w-32 text-left">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isProfileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">

                    {/* User Info */}
                    <div className="border-b border-slate-100 px-4 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {getInitial()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {userName || "User"}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* Dropdown Links */}
                    <div className="p-2">

                      <Link
                        to="/queue"
                        onClick={() =>
                          setIsProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <ListOrdered className="h-4 w-4" />
                        My Queue
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>

                    </div>
                  </div>
                )}

              </div>

            ) : (

              /* ==========================================
                 LOGGED-OUT USER
              ========================================== */

              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
            className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
            aria-label={
              isMenuOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* ==========================================
            MOBILE MENU
        ========================================== */}

        {isMenuOpen && (
          <div className="mt-4 border-t border-slate-100 pt-4 md:hidden">

            {/* Mobile User Info */}
            {user && (
              <div className="mb-3 rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                    {getInitial()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {userName || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">

              {/* Home */}
              <NavLink
                to="/"
                end
                onClick={() =>
                  setIsMenuOpen(false)
                }
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

              {/* Services */}
              <NavLink
                to="/services"
                onClick={() =>
                  setIsMenuOpen(false)
                }
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

              {/* My Queue */}
              <NavLink
                to="/queue"
                onClick={() =>
                  setIsMenuOpen(false)
                }
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

              {/* Logged Out */}
              {!user && !loading && (
                <>
                  <Link
                    to="/login"
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                    className="mt-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/login"
                    onClick={() =>
                      setIsMenuOpen(false)
                    }
                    className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign In
                  </Link>
                </>
              )}

              {/* Logged In */}
              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}

            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;