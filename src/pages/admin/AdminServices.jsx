import {
  Building2,
  Edit3,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import AdminPageLayout from "../../components/admin/AdminPageLayout";
import { db } from "../../firebase/firebase";

function AdminServices() {
  const [services, setServices] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("building");
  const [status, setStatus] = useState("accepting");

  // New field
  const [averageServiceTime, setAverageServiceTime] =
    useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD SERVICES
  // =====================================================

  useEffect(() => {
    const servicesRef = collection(db, "services");

    const unsubscribe = onSnapshot(
      servicesRef,
      (snapshot) => {
        const serviceList = snapshot.docs.map(
          (serviceDoc) => ({
            id: serviceDoc.id,
            ...serviceDoc.data(),
          })
        );

        setServices(serviceList);
      },
      (snapshotError) => {
        console.error(
          "Error loading services:",
          snapshotError
        );

        setError("Unable to load services.");
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setName("");
    setDescription("");
    setIcon("building");
    setStatus("accepting");
    setAverageServiceTime(5);
    setEditingService(null);
    setError("");
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddClick = () => {
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditClick = (service) => {
    setEditingService(service);

    setName(service.name || "");
    setDescription(service.description || "");
    setIcon(service.icon || "building");
    setStatus(service.status || "accepting");

    setAverageServiceTime(
      Number(service.averageServiceTime) || 5
    );

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // SAVE SERVICE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!description.trim()) {
      setError("Service description is required.");
      return;
    }

    const serviceTime =
      Number(averageServiceTime);

    if (
      !serviceTime ||
      serviceTime < 1 ||
      serviceTime > 120
    ) {
      setError(
        "Average service time must be between 1 and 120 minutes."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =================================================
      // UPDATE EXISTING SERVICE
      // =================================================

      if (editingService) {
        const serviceRef = doc(
          db,
          "services",
          editingService.id
        );

        await updateDoc(serviceRef, {
          name: name.trim(),
          description: description.trim(),
          icon,
          status,

          averageServiceTime:
            serviceTime,

          updatedAt:
            serverTimestamp(),
        });
      }

      // =================================================
      // CREATE NEW SERVICE
      // =================================================

      else {
        await addDoc(
          collection(db, "services"),
          {
            name: name.trim(),
            description: description.trim(),
            icon,
            status,

            // ===========================================
            // QUEUE SETTINGS
            // ===========================================

            waitingCount: 0,

            estimatedWait: 0,

            averageServiceTime:
              serviceTime,

            // ===========================================
            // TOKEN SYSTEM
            // ===========================================

            lastTokenNumber: 0,

            currentTokenNumber: 0,

            // ===========================================
            // TIMESTAMPS
            // ===========================================

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );
      }

      // =================================================
      // CLOSE MODAL
      // =================================================

      setShowModal(false);
      resetForm();
    } catch (saveError) {
      console.error(
        "Save service error:",
        saveError
      );

      setError(
        "Unable to save service. Please check your Firebase permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE SERVICE
  // =====================================================

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteDoc(
        doc(db, "services", service.id)
      );
    } catch (deleteError) {
      console.error(
        "Delete service error:",
        deleteError
      );

      setError(
        "Unable to delete service. Please check your Firebase permissions."
      );
    }
  };

  // =====================================================
  // TOGGLE SERVICE STATUS
  // =====================================================

  const handleToggleStatus = async (service) => {
    try {
      setError("");

      const newStatus =
        service.status === "accepting"
          ? "closed"
          : "accepting";

      await updateDoc(
        doc(db, "services", service.id),
        {
          status: newStatus,
          updatedAt:
            serverTimestamp(),
        }
      );
    } catch (statusError) {
      console.error(
        "Status update error:",
        statusError
      );

      setError(
        "Unable to update service status."
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <AdminPageLayout
      title="Service Management"
      description="Add, update and manage QueueLess services"
    >
      <section className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                <Building2 className="h-3.5 w-3.5" />
                SERVICES
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Manage Services
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage services and queue settings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </button>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {services.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No services yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add your first service to make it
                available to users.
              </p>

              <button
                type="button"
                onClick={handleAddClick}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add First Service
              </button>

            </div>
          ) : (

            /* =================================================
               SERVICE GRID
            ================================================= */

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {services.map((service) => (

                <div
                  key={service.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >

                  {/* SERVICE HEADER */}

                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">

                    <div className="flex min-w-0 items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Building2 className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {service.name}
                        </h3>

                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {service.description}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                        service.status ===
                        "accepting"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {service.status ===
                      "accepting"
                        ? "Open"
                        : "Closed"}
                    </span>

                  </div>

                  {/* QUEUE INFO */}

                  <div className="grid grid-cols-3 border-b border-slate-100">

                    <div className="px-3 py-3 text-center">

                      <p className="text-[10px] text-slate-500">
                        Waiting
                      </p>

                      <p className="mt-0.5 text-lg font-bold text-slate-900">
                        {service.waitingCount ||
                          0}
                      </p>

                    </div>

                    <div className="border-x border-slate-100 px-3 py-3 text-center">

                      <p className="text-[10px] text-slate-500">
                        Avg. Time
                      </p>

                      <p className="mt-0.5 text-lg font-bold text-blue-600">
                        {service.averageServiceTime ||
                          5}
                        <span className="ml-0.5 text-[10px] font-medium">
                          min
                        </span>
                      </p>

                    </div>

                    <div className="px-3 py-3 text-center">

                      <p className="text-[10px] text-slate-500">
                        Current
                      </p>

                      <p className="mt-0.5 text-lg font-bold text-slate-900">
                        {service.currentTokenNumber ||
                          "--"}
                      </p>

                    </div>

                  </div>

                  {/* TOKEN INFO */}

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">

                    <div>
                      <p className="text-[10px] text-slate-400">
                        Last Token
                      </p>

                      <p className="text-xs font-semibold text-slate-700">
                        {service.lastTokenNumber ||
                          0}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">
                        Estimated Wait
                      </p>

                      <p className="text-xs font-semibold text-blue-600">
                        {service.estimatedWait ||
                          0}{" "}
                        min
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="p-3">

                    <div className="grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditClick(
                            service
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            service
                          )
                        }
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          service
                        )
                      }
                      className={`mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        service.status ===
                        "accepting"
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {service.status ===
                      "accepting" ? (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          Close Service
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Open Service
                        </>
                      )}
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
      </section>

      {/* ===================================================
          ADD / EDIT MODAL
      =================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* CLOSE */}

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* TITLE */}

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingService
                  ? "Update Service"
                  : "Add Service"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingService
                  ? "Update service information."
                  : "Create a new QueueLess service."}
              </p>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4"
            >

              {/* NAME */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Service Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. Passport Office"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Passport application and verification"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* SERVICE TYPE */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Service Type
                </label>

                <select
                  value={icon}
                  onChange={(e) =>
                    setIcon(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="building">
                    General Office
                  </option>

                  <option value="hospital">
                    Hospital
                  </option>

                  <option value="bank">
                    Bank
                  </option>

                  <option value="college">
                    College
                  </option>
                </select>
              </div>

              {/* AVERAGE SERVICE TIME */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Average Service Time
                </label>

                <div className="relative">

                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={
                      averageServiceTime
                    }
                    onChange={(e) =>
                      setAverageServiceTime(
                        e.target.value
                      )
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-14 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    minutes
                  </span>

                </div>

                <p className="mt-1 text-[10px] text-slate-400">
                  Used to calculate estimated queue waiting time.
                </p>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="accepting">
                    Open / Accepting Queue
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>
              </div>

              {/* ERROR */}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              )}

              {/* BUTTONS */}

              <div className="flex gap-2 pt-1">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingService
                      ? "Update Service"
                      : "Add Service"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}

export default AdminServices;