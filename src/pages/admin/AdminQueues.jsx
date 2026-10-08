import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  ListOrdered,
  SkipForward,
  Users,
} from "lucide-react";

import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
import AdminPageLayout from "../../components/admin/AdminPageLayout";

// =====================================================
// USER NAME
// =====================================================

const getUserName = (queue, users) => {
  // New queue documents
  if (queue?.userName?.trim()) {
    return queue.userName.trim();
  }

  // Old queue documents -> get name from users collection
  const user = users[queue?.userId];

  if (!user) {
    return "Unknown User";
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  if (user.fullName?.trim()) {
    return user.fullName.trim();
  }

  if (user.displayName?.trim()) {
    return user.displayName.trim();
  }

  const fullName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (user.email?.trim()) {
    return user.email.trim();
  }

  return "Unknown User";
};

// =====================================================
// USER EMAIL
// =====================================================

const getUserEmail = (queue, users) => {
  if (queue?.userEmail?.trim()) {
    return queue.userEmail.trim();
  }

  return users[queue?.userId]?.email || "";
};

// =====================================================
// TOKEN
// =====================================================

const getTokenLabel = (queue) => {
  if (!queue) {
    return "--";
  }

  if (queue.token) {
    return queue.token;
  }

  if (
    queue.tokenNumber !== undefined &&
    queue.tokenNumber !== null
  ) {
    return `#${queue.tokenNumber}`;
  }

  return "--";
};

// =====================================================
// ADMIN QUEUES
// =====================================================

function AdminQueues() {
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState({});

  const [loading, setLoading] = useState(true);
  const [processingServiceId, setProcessingServiceId] =
    useState(null);

  const [error, setError] = useState("");

  // ===================================================
  // SERVICES
  // ===================================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        setServices(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );

        setLoading(false);
      },
      (error) => {
        console.error("Services error:", error);
        setError("Unable to load services.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ===================================================
  // ACTIVE QUEUES
  // ===================================================

  useEffect(() => {
    const queuesQuery = query(
      collection(db, "queues"),
      where("status", "in", ["waiting", "serving"])
    );

    const unsubscribe = onSnapshot(
      queuesQuery,
      (snapshot) => {
        setQueues(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      },
      (error) => {
        console.error("Queues error:", error);
        setError("Unable to load queues.");
      }
    );

    return () => unsubscribe();
  }, []);

  // ===================================================
  // USERS
  //
  // This is important for OLD queue documents.
  // ===================================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userMap = {};

        snapshot.docs.forEach((item) => {
          userMap[item.id] = {
            id: item.id,
            ...item.data(),
          };
        });

        setUsers(userMap);
      },
      (error) => {
        console.error("Users error:", error);
        setError(
          "Unable to load customer information."
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ===================================================
  // SERVICE DATA
  // ===================================================

  const serviceQueueData = useMemo(() => {
    return services
      .map((service) => {
        const serviceQueues = queues
          .filter(
            (queue) =>
              queue.serviceId === service.id
          )
          .sort(
            (a, b) =>
              (Number(a.tokenNumber) || 0) -
              (Number(b.tokenNumber) || 0)
          );

        const waitingQueues =
          serviceQueues.filter(
            (queue) => queue.status === "waiting"
          );

        const servingQueues =
          serviceQueues.filter(
            (queue) => queue.status === "serving"
          );

        const currentQueue =
          servingQueues[0] || null;

        const nextQueue =
          waitingQueues[0] || null;

        const averageServiceTime =
          Number(service.averageServiceTime) ||
          Number(service.estimatedWait) ||
          5;

        return {
          ...service,
          waitingQueues,
          servingQueues,
          currentQueue,
          nextQueue,
          waitingCount: waitingQueues.length,
          estimatedWait:
            waitingQueues.length *
            averageServiceTime,
        };
      })
      .filter(
        (service) =>
          service.waitingQueues.length > 0 ||
          service.servingQueues.length > 0
      );
  }, [services, queues]);

  // ===================================================
  // SERVE NEXT
  // ===================================================

  const handleServeNext = async (service) => {
    if (processingServiceId) return;

    const currentQueue =
      service.currentQueue;

    const nextQueue =
      service.nextQueue;

    if (!nextQueue) return;

    try {
      setProcessingServiceId(service.id);
      setError("");

      const batch = writeBatch(db);

      if (currentQueue) {
        batch.update(
          doc(
            db,
            "queues",
            currentQueue.id
          ),
          {
            status: "completed",
            completedAt:
              serverTimestamp(),
          }
        );
      }

      batch.update(
        doc(
          db,
          "queues",
          nextQueue.id
        ),
        {
          status: "serving",
          startedAt:
            serverTimestamp(),
        }
      );

      batch.update(
        doc(
          db,
          "services",
          service.id
        ),
        {
          currentTokenNumber:
            Number(nextQueue.tokenNumber) || 0,
          updatedAt:
            serverTimestamp(),
        }
      );

      await batch.commit();
    } catch (error) {
      console.error(error);
      setError(
        "Unable to serve the next customer."
      );
    } finally {
      setProcessingServiceId(null);
    }
  };

  // ===================================================
  // SKIP
  // ===================================================

  const handleSkip = async (service) => {
    if (processingServiceId) return;

    const currentQueue =
      service.currentQueue;

    const nextQueue =
      service.nextQueue;

    if (!currentQueue) return;

    try {
      setProcessingServiceId(service.id);
      setError("");

      const batch = writeBatch(db);

      batch.update(
        doc(
          db,
          "queues",
          currentQueue.id
        ),
        {
          status: "skipped",
          skippedAt:
            serverTimestamp(),
        }
      );

      if (nextQueue) {
        batch.update(
          doc(
            db,
            "queues",
            nextQueue.id
          ),
          {
            status: "serving",
            startedAt:
              serverTimestamp(),
          }
        );

        batch.update(
          doc(
            db,
            "services",
            service.id
          ),
          {
            currentTokenNumber:
              Number(nextQueue.tokenNumber) || 0,
            updatedAt:
              serverTimestamp(),
          }
        );
      } else {
        batch.update(
          doc(
            db,
            "services",
            service.id
          ),
          {
            currentTokenNumber: 0,
            updatedAt:
              serverTimestamp(),
          }
        );
      }

      await batch.commit();
    } catch (error) {
      console.error(error);
      setError(
        "Unable to skip the current customer."
      );
    } finally {
      setProcessingServiceId(null);
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <AdminPageLayout title="Queue Management">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading queues...
            </p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <AdminPageLayout title="Queue Management">
      <div className="mx-auto max-w-6xl space-y-5">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Queue Management
            </h1>

            <p className="mt-0.5 text-sm text-gray-500">
              Monitor and manage active queues.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* NO QUEUES */}

        {serviceQueueData.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <ListOrdered className="mx-auto h-8 w-8 text-gray-400" />

            <h2 className="mt-3 font-semibold text-gray-900">
              No active queues
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              No customers are currently waiting.
            </p>
          </div>
        ) : (
          <>
            {/* SERVICE GRID */}

            <div className="grid gap-4 lg:grid-cols-2">

              {serviceQueueData.map(
                (service) => {
                  const isProcessing =
                    processingServiceId ===
                    service.id;

                  return (
                    <div
                      key={service.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >

                      {/* SERVICE HEADER */}

                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-bold text-gray-900">
                              {service.name}
                            </h2>

                            <p className="truncate text-xs text-gray-500">
                              {service.description ||
                                "Queue service"}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            service.status ===
                              "active" ||
                            service.status ===
                              "accepting"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {service.status ===
                            "active" ||
                          service.status ===
                            "accepting"
                            ? "Open"
                            : "Closed"}
                        </span>

                      </div>

                      {/* CURRENT + NEXT */}

                      <div className="grid grid-cols-2 gap-3 p-4">

                        {/* CURRENT */}

                        <div className="rounded-lg bg-blue-50 px-3 py-3">

                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Now Serving
                          </div>

                          <p className="mt-1 text-2xl font-bold text-blue-600">
                            {getTokenLabel(
                              service.currentQueue
                            )}
                          </p>

                          {service.currentQueue ? (
                            <div className="mt-1.5 min-w-0">
                              <p className="truncate text-xs font-semibold text-gray-900">
                                {getUserName(
                                  service.currentQueue,
                                  users
                                )}
                              </p>

                              {getUserEmail(
                                service.currentQueue,
                                users
                              ) && (
                                <p className="truncate text-[10px] text-gray-500">
                                  {getUserEmail(
                                    service.currentQueue,
                                    users
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="mt-1 text-[11px] text-gray-500">
                              Nobody serving
                            </p>
                          )}

                        </div>

                        {/* NEXT */}

                        <div className="rounded-lg bg-gray-50 px-3 py-3">

                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                            <ArrowRight className="h-3.5 w-3.5" />
                            Next
                          </div>

                          <p className="mt-1 text-2xl font-bold text-gray-900">
                            {getTokenLabel(
                              service.nextQueue
                            )}
                          </p>

                          {service.nextQueue ? (
                            <div className="mt-1.5">
                              <p className="truncate text-xs font-semibold text-gray-900">
                                {getUserName(
                                  service.nextQueue,
                                  users
                                )}
                              </p>

                              {getUserEmail(
                                service.nextQueue,
                                users
                              ) && (
                                <p className="truncate text-[10px] text-gray-500">
                                  {getUserEmail(
                                    service.nextQueue,
                                    users
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="mt-1 text-[11px] text-gray-500">
                              No one waiting
                            </p>
                          )}

                        </div>

                      </div>

                      {/* STATS */}

                      <div className="grid grid-cols-3 border-y border-gray-100">

                        <div className="px-3 py-2.5 text-center">
                          <Users className="mx-auto h-4 w-4 text-gray-400" />

                          <p className="mt-0.5 text-lg font-bold text-gray-900">
                            {service.waitingCount}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            Waiting
                          </p>
                        </div>

                        <div className="border-x border-gray-100 px-3 py-2.5 text-center">
                          <Clock3 className="mx-auto h-4 w-4 text-gray-400" />

                          <p className="mt-0.5 text-lg font-bold text-gray-900">
                            {service.estimatedWait}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            Min Wait
                          </p>
                        </div>

                        <div className="px-3 py-2.5 text-center">
                          <ListOrdered className="mx-auto h-4 w-4 text-gray-400" />

                          <p className="mt-0.5 text-lg font-bold text-gray-900">
                            {service.waitingQueues.length +
                              service.servingQueues.length}
                          </p>

                          <p className="text-[10px] text-gray-500">
                            Active
                          </p>
                        </div>

                      </div>

                      {/* WAITING LIST */}

                      <div className="px-4 py-3">

                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-gray-900">
                            Waiting Customers
                          </h3>

                          <span className="text-[10px] text-gray-400">
                            {service.waitingCount}
                          </span>
                        </div>

                        {service.waitingQueues.length ===
                        0 ? (
                          <p className="rounded-lg bg-gray-50 px-3 py-3 text-center text-xs text-gray-500">
                            No customers waiting
                          </p>
                        ) : (
                          <div className="space-y-1.5">

                            {service.waitingQueues
                              .slice(0, 4)
                              .map(
                                (
                                  queue,
                                  index
                                ) => (
                                  <div
                                    key={
                                      queue.id
                                    }
                                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                                  >

                                    <div className="flex min-w-0 items-center gap-2">

                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-bold text-gray-600">
                                        {index +
                                          1}
                                      </span>

                                      <div className="min-w-0">
                                        <p className="truncate text-xs font-semibold text-gray-800">
                                          {getUserName(
                                            queue,
                                            users
                                          )}
                                        </p>

                                        <p className="truncate text-[10px] text-gray-400">
                                          {getUserEmail(
                                            queue,
                                            users
                                          )}
                                        </p>
                                      </div>

                                    </div>

                                    <span className="ml-2 shrink-0 text-xs font-bold text-blue-600">
                                      {getTokenLabel(
                                        queue
                                      )}
                                    </span>

                                  </div>
                                )
                              )}

                            {service.waitingQueues
                              .length >
                              4 && (
                              <p className="pt-1 text-center text-[10px] text-gray-400">
                                +
                                {service.waitingQueues.length -
                                  4}{" "}
                                more
                              </p>
                            )}

                          </div>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-2 border-t border-gray-100 bg-gray-50 p-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleServeNext(
                              service
                            )
                          }
                          disabled={
                            !service.nextQueue ||
                            isProcessing
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />

                          {isProcessing
                            ? "Processing..."
                            : service.currentQueue
                              ? "Serve Next"
                              : "Start Serving"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSkip(
                              service
                            )
                          }
                          disabled={
                            !service.currentQueue ||
                            isProcessing
                          }
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                          Skip
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* SUMMARY */}

            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-500">
                  Active Services
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {serviceQueueData.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-500">
                  Total Waiting
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {serviceQueueData.reduce(
                    (total, service) =>
                      total +
                      service.waitingCount,
                    0
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] text-gray-500">
                  Currently Serving
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {serviceQueueData.reduce(
                    (total, service) =>
                      total +
                      service.servingQueues
                        .length,
                    0
                  )}
                </p>
              </div>

            </div>
          </>
        )}
      </div>
    </AdminPageLayout>
  );
}

export default AdminQueues;