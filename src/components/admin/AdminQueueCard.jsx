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

// ==========================================
// GET USER NAME
// ==========================================

const getUserName = (user, queue = null) => {
  // First check if queue itself has the name
  if (queue?.userName?.trim()) {
    return queue.userName.trim();
  }

  if (queue?.name?.trim()) {
    return queue.name.trim();
  }

  if (!user) {
    return "Unknown user";
  }

  // name
  if (user.name?.trim()) {
    return user.name.trim();
  }

  // fullName
  if (user.fullName?.trim()) {
    return user.fullName.trim();
  }

  // displayName
  if (user.displayName?.trim()) {
    return user.displayName.trim();
  }

  // firstName + lastName
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  // email as final fallback
  if (user.email?.trim()) {
    return user.email.trim();
  }

  return "Unknown user";
};

// ==========================================
// GET EMAIL
// ==========================================

const getUserEmail = (user, queue = null) => {
  if (queue?.userEmail?.trim()) {
    return queue.userEmail.trim();
  }

  if (user?.email?.trim()) {
    return user.email.trim();
  }

  return "";
};

// ==========================================
// GET TOKEN LABEL
// ==========================================

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

// ==========================================
// ADMIN QUEUES
// ==========================================

const AdminQueues = () => {
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState({});

  const [loading, setLoading] = useState(true);
  const [processingServiceId, setProcessingServiceId] =
    useState(null);

  const [error, setError] = useState("");

  // ==========================================
  // SERVICES LISTENER
  // ==========================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const serviceData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setServices(serviceData);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(
          "Services listener error:",
          snapshotError
        );

        setError("Unable to load services.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // QUEUES LISTENER
  // ==========================================

  useEffect(() => {
    const queuesQuery = query(
      collection(db, "queues"),
      where("status", "in", ["waiting", "serving"])
    );

    const unsubscribe = onSnapshot(
      queuesQuery,
      (snapshot) => {
        const queueData = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setQueues(queueData);
      },
      (snapshotError) => {
        console.error(
          "Queues listener error:",
          snapshotError
        );

        setError("Unable to load queues.");
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // USERS LISTENER
  // ==========================================

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
      (snapshotError) => {
        console.error(
          "Users listener error:",
          snapshotError
        );

        setError(
          "Unable to load user names. Check Firestore permissions."
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // USER HELPERS
  // ==========================================

  const getQueueUser = (queue) => {
    if (!queue) {
      return null;
    }

    return users[queue.userId] || null;
  };

  const getQueueUserName = (queue) => {
    const user = getQueueUser(queue);

    return getUserName(user, queue);
  };

  const getQueueUserEmail = (queue) => {
    const user = getQueueUser(queue);

    return getUserEmail(user, queue);
  };

  // ==========================================
  // SERVICE + QUEUE DATA
  // ==========================================

  const serviceQueueData = useMemo(() => {
    return services
      .map((service) => {
        const serviceQueues = queues
          .filter(
            (queue) => queue.serviceId === service.id
          )
          .sort((a, b) => {
            const tokenA =
              Number(a.tokenNumber) || 0;

            const tokenB =
              Number(b.tokenNumber) || 0;

            return tokenA - tokenB;
          });

        const waitingQueues = serviceQueues.filter(
          (queue) => queue.status === "waiting"
        );

        const servingQueues = serviceQueues.filter(
          (queue) => queue.status === "serving"
        );

        const currentQueue =
          servingQueues[0] || null;

        const nextQueue =
          waitingQueues[0] || null;

        const waitingCount =
          waitingQueues.length;

        const averageServiceTime =
          Number(service.averageServiceTime) ||
          Number(service.estimatedWait) ||
          5;

        const estimatedWait =
          waitingCount * averageServiceTime;

        return {
          ...service,

          waitingQueues,
          servingQueues,

          currentQueue,
          nextQueue,

          waitingCount,
          estimatedWait,

          currentToken:
            currentQueue?.token ||
            (service.currentTokenNumber
              ? `${service.currentTokenNumber}`
              : "--"),

          nextToken:
            nextQueue?.token || "--",
        };
      })
      .filter(
        (service) =>
          service.waitingQueues.length > 0 ||
          service.servingQueues.length > 0
      );
  }, [services, queues]);

  // ==========================================
  // SERVE NEXT
  // ==========================================

  const handleServeNext = async (service) => {
    if (processingServiceId) {
      return;
    }

    const currentQueue =
      service.currentQueue;

    const nextQueue =
      service.nextQueue;

    if (!nextQueue) {
      return;
    }

    try {
      setProcessingServiceId(service.id);
      setError("");

      const batch = writeBatch(db);

      // Complete current customer
      if (currentQueue) {
        const currentQueueRef = doc(
          db,
          "queues",
          currentQueue.id
        );

        batch.update(currentQueueRef, {
          status: "completed",
          completedAt: serverTimestamp(),
        });
      }

      // Start next customer
      const nextQueueRef = doc(
        db,
        "queues",
        nextQueue.id
      );

      batch.update(nextQueueRef, {
        status: "serving",
        startedAt: serverTimestamp(),
      });

      // Update service current token
      const serviceRef = doc(
        db,
        "services",
        service.id
      );

      batch.update(serviceRef, {
        currentTokenNumber:
          Number(nextQueue.tokenNumber) || 0,
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch (operationError) {
      console.error(
        "Serve next error:",
        operationError
      );

      setError(
        "Unable to serve the next customer."
      );
    } finally {
      setProcessingServiceId(null);
    }
  };

  // ==========================================
  // SKIP CURRENT
  // ==========================================

  const handleSkip = async (service) => {
    if (processingServiceId) {
      return;
    }

    const currentQueue =
      service.currentQueue;

    const nextQueue =
      service.nextQueue;

    if (!currentQueue) {
      return;
    }

    try {
      setProcessingServiceId(service.id);
      setError("");

      const batch = writeBatch(db);

      // Skip current customer
      const currentQueueRef = doc(
        db,
        "queues",
        currentQueue.id
      );

      batch.update(currentQueueRef, {
        status: "skipped",
        skippedAt: serverTimestamp(),
      });

      // Start next customer
      if (nextQueue) {
        const nextQueueRef = doc(
          db,
          "queues",
          nextQueue.id
        );

        batch.update(nextQueueRef, {
          status: "serving",
          startedAt: serverTimestamp(),
        });

        const serviceRef = doc(
          db,
          "services",
          service.id
        );

        batch.update(serviceRef, {
          currentTokenNumber:
            Number(nextQueue.tokenNumber) || 0,
          updatedAt: serverTimestamp(),
        });
      } else {
        const serviceRef = doc(
          db,
          "services",
          service.id
        );

        batch.update(serviceRef, {
          currentTokenNumber: 0,
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
    } catch (operationError) {
      console.error(
        "Skip queue error:",
        operationError
      );

      setError(
        "Unable to skip the current customer."
      );
    } finally {
      setProcessingServiceId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <AdminPageLayout title="Queue Management">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-sm text-gray-500">
              Loading queue management...
            </p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <AdminPageLayout title="Queue Management">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Queue Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage all active queues in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live Queue Updates
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {serviceQueueData.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ListOrdered className="h-8 w-8 text-gray-400" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No active queues
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              There are currently no customers waiting or being served.
            </p>
          </div>
        ) : (
          <>
            {/* SERVICE CARDS */}
            <div className="grid gap-6 xl:grid-cols-2">

              {serviceQueueData.map((service) => {
                const isProcessing =
                  processingServiceId === service.id;

                const currentUser =
                  getQueueUser(
                    service.currentQueue
                  );

                const nextUser =
                  getQueueUser(
                    service.nextQueue
                  );

                return (
                  <div
                    key={service.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >

                    {/* SERVICE HEADER */}
                    <div className="border-b border-gray-100 px-5 py-5">
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>

                          <div>
                            <h2 className="font-semibold text-gray-900">
                              {service.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                              {service.description ||
                                "Queue management service"}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            service.status === "accepting" ||
                            service.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {service.status === "accepting" ||
                          service.status === "active"
                            ? "Open"
                            : "Closed"}
                        </span>

                      </div>
                    </div>

                    {/* CURRENT + NEXT */}
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 p-5">

                      {/* CURRENT */}
                      <div className="rounded-xl bg-blue-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Currently Serving
                        </div>

                        <p className="mt-2 text-3xl font-bold text-blue-600">
                          {getTokenLabel(
                            service.currentQueue
                          )}
                        </p>

                        {service.currentQueue ? (
                          <div className="mt-3">

                            <p className="text-base font-semibold text-gray-900">
                              {getQueueUserName(
                                service.currentQueue
                              )}
                            </p>

                            {getQueueUserEmail(
                              service.currentQueue
                            ) && (
                              <p className="mt-1 truncate text-xs text-gray-500">
                                {getQueueUserEmail(
                                  service.currentQueue
                                )}
                              </p>
                            )}

                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-gray-500">
                            No one is currently being served
                          </p>
                        )}

                      </div>

                      {/* NEXT */}
                      <div className="rounded-xl bg-gray-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                          <ArrowRight className="h-4 w-4" />
                          Next Token
                        </div>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                          {getTokenLabel(
                            service.nextQueue
                          )}
                        </p>

                        {service.nextQueue ? (
                          <div className="mt-3">

                            <p className="text-base font-semibold text-gray-900">
                              {getQueueUserName(
                                service.nextQueue
                              )}
                            </p>

                            {getQueueUserEmail(
                              service.nextQueue
                            ) && (
                              <p className="mt-1 truncate text-xs text-gray-500">
                                {getQueueUserEmail(
                                  service.nextQueue
                                )}
                              </p>
                            )}

                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-gray-500">
                            No one waiting
                          </p>
                        )}

                      </div>

                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-3 divide-x border-b border-gray-100">

                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">
                            Waiting
                          </span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {service.waitingCount}
                        </p>
                      </div>

                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500">
                          <Clock3 className="h-4 w-4" />
                          <span className="text-xs">
                            Est. Wait
                          </span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {service.estimatedWait} min
                        </p>
                      </div>

                      <div className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500">
                          <ListOrdered className="h-4 w-4" />
                          <span className="text-xs">
                            Total Active
                          </span>
                        </div>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {service.waitingQueues.length +
                            service.servingQueues.length}
                        </p>
                      </div>

                    </div>

                    {/* WAITING CUSTOMERS */}
                    <div className="p-5">

                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Queue Status
                        </h3>

                        <span className="text-xs text-gray-500">
                          {service.waitingCount} waiting
                        </span>
                      </div>

                      {service.waitingQueues.length === 0 ? (
                        <div className="rounded-xl bg-gray-50 px-4 py-5 text-center">
                          <p className="text-sm text-gray-500">
                            No customers waiting.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">

                          {service.waitingQueues
                            .slice(0, 5)
                            .map((queue, index) => (

                              <div
                                key={queue.id}
                                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                              >

                                <div className="flex min-w-0 items-center gap-3">

                                  {/* POSITION */}
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-700 shadow-sm">
                                    {index + 1}
                                  </div>

                                  <div className="min-w-0">

                                    {/* NAME */}
                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {getQueueUserName(
                                        queue
                                      )}
                                    </p>

                                    {/* EMAIL */}
                                    {getQueueUserEmail(
                                      queue
                                    ) && (
                                      <p className="truncate text-xs text-gray-500">
                                        {getQueueUserEmail(
                                          queue
                                        )}
                                      </p>
                                    )}

                                  </div>

                                </div>

                                {/* TOKEN */}
                                <div className="ml-3 shrink-0 text-right">

                                  <p className="text-sm font-bold text-blue-600">
                                    {getTokenLabel(queue)}
                                  </p>

                                  <p className="text-[11px] text-gray-400">
                                    Token
                                  </p>

                                </div>

                              </div>

                            ))}

                          {service.waitingQueues.length > 5 && (
                            <p className="pt-1 text-center text-xs text-gray-500">
                              +{" "}
                              {service.waitingQueues.length - 5}{" "}
                              more customer
                              {service.waitingQueues.length - 5 !==
                              1
                                ? "s"
                                : ""}
                            </p>
                          )}

                        </div>
                      )}

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-5 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          handleServeNext(service)
                        }
                        disabled={
                          !service.nextQueue ||
                          isProcessing
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        <ArrowRight className="h-4 w-4" />

                        {isProcessing
                          ? "Processing..."
                          : service.currentQueue
                            ? "Serve Next"
                            : "Start Serving"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSkip(service)
                        }
                        disabled={
                          !service.currentQueue ||
                          isProcessing
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <SkipForward className="h-4 w-4" />
                        Skip Current
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* ACTIVE SERVICES */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Active Services
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {serviceQueueData.length}
                    </p>
                  </div>

                </div>

              </div>

              {/* WAITING */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
                    <Users className="h-5 w-5 text-yellow-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Total Waiting
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {serviceQueueData.reduce(
                        (total, service) =>
                          total +
                          service.waitingCount,
                        0
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* SERVING */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Currently Serving
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {serviceQueueData.reduce(
                        (total, service) =>
                          total +
                          service.servingQueues.length,
                        0
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* AVG WAIT */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    <Clock3 className="h-5 w-5 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Avg. Wait
                    </p>

                    <p className="text-2xl font-bold text-gray-900">
                      {serviceQueueData.length > 0
                        ? Math.round(
                            serviceQueueData.reduce(
                              (total, service) =>
                                total +
                                service.estimatedWait,
                              0
                            ) /
                              serviceQueueData.length
                          )
                        : 0}{" "}
                      min
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default AdminQueues;