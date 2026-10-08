import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Radio, Volume2 } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import QueueCard from "../../components/queue/QueueCard";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function Queue() {
  const { user } = useAuth();

  const [queue, setQueue] = useState(null);
  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // Listen to user's active queue
  // ==========================================

  useEffect(() => {
    if (!user) {
      setQueue(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const queuesQuery = query(
      collection(db, "queues"),
      where("userId", "==", user.uid),
      where("status", "in", ["waiting", "serving"])
    );

    const unsubscribe = onSnapshot(
      queuesQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setQueue(null);
          setLoading(false);
          return;
        }

        const queueDoc = snapshot.docs[0];

        setQueue({
          id: queueDoc.id,
          ...queueDoc.data(),
        });

        setLoading(false);
      },
      (error) => {
        console.error("Queue listener error:", error);
        setError("Unable to load your queue.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ==========================================
  // Listen to service
  // ==========================================

  useEffect(() => {
    if (!queue?.serviceId) {
      setService(null);
      return;
    }

    const serviceRef = doc(
      db,
      "services",
      queue.serviceId
    );

    const unsubscribe = onSnapshot(
      serviceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setService({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      },
      (error) => {
        console.error("Service listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [queue?.serviceId]);

  // ==========================================
  // Leave queue
  // ==========================================

  const handleLeaveQueue = async () => {
    if (!queue?.id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to leave this queue?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLeaving(true);
      setError("");

      await deleteDoc(
        doc(db, "queues", queue.id)
      );

      setQueue(null);
    } catch (error) {
      console.error("Leave queue error:", error);

      setError(
        "Unable to leave the queue. Please try again."
      );
    } finally {
      setLeaving(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7ff]">
        <Navbar />

        <section className="px-5 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your queue...
            </p>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // ==========================================
  // No active queue
  // ==========================================

  if (!queue) {
    return (
      <main className="min-h-screen bg-[#f8f7ff]">
        <Navbar />

        <section className="px-5 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Radio className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              No Active Queue
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You are not currently waiting in any queue.
            </p>

            <a
              href="/services"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Services
            </a>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  // ==========================================
  // Real queue values
  // ==========================================

  const currentTokenNumber =
    Number(service?.currentTokenNumber) || 0;

  const userTokenNumber =
    Number(queue.tokenNumber) || 0;

  const isServing = queue.status === "serving";

  const peopleAhead = isServing
    ? 0
    : Math.max(
        0,
        userTokenNumber - currentTokenNumber - 1
      );

  const position = isServing
    ? 0
    : peopleAhead + 1;

  const waitPerPatient =
    Number(service?.averageServiceTime) ||
    Number(service?.estimatedWait) ||
    5;

  const estimatedWait =
    isServing
      ? 0
      : peopleAhead * waitPerPatient;

  const currentToken =
    currentTokenNumber > 0
      ? `${service?.name?.trim()?.charAt(0)?.toUpperCase() || "Q"}-${String(
          currentTokenNumber
        ).padStart(3, "0")}`
      : "Not started";

  const joinedAt = queue.joinedAt?.toDate
    ? queue.joinedAt.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  const displayQueue = {
    service:
      queue.serviceName ||
      service?.name ||
      "QueueLess Service",

    department:
      queue.serviceDescription ||
      service?.description ||
      "Service Queue",

    token: queue.token,

    doctor:
      isServing
        ? "Currently being served"
        : "QueueLess Service Desk",

    currentToken,

    position,

    peopleAhead,

    estimatedWait,

    waitPerPatient,

    joinedAt,

    status: queue.status,

    serviceStatus: service?.status,
  };

  return (
    <main className="min-h-screen bg-[#f8f7ff]">
      <Navbar />

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {error && (
            <div className="mx-auto mb-4 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <QueueCard
            queue={displayQueue}
            onLeaveQueue={handleLeaveQueue}
            leaving={leaving}
          />

          {/* Information */}
          <div className="mx-auto mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Volume2 className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Queue Status
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Your queue information is synced directly
                    with Firebase.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Radio className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    Live Sync Active
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Changes made by the administrator appear
                    automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Queue;