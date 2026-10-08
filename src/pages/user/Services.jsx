import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  X,
  Building2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ServiceCard from "../../components/service/ServiceCard";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function Services() {
  const navigate = useNavigate();

  const { user, profile } = useAuth();

  const [services, setServices] = useState([]);
  const [joinedQueue, setJoinedQueue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [joiningServiceId, setJoiningServiceId] = useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD SERVICES
  // =====================================================

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
      (snapshotError) => {
        console.error(
          "Error loading services:",
          snapshotError
        );

        setError(
          "Unable to load services. Please refresh the page."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =====================================================
  // GET USER NAME
  // =====================================================

  const getUserName = (userData = {}) => {
    // Context profile
    if (profile?.name?.trim()) {
      return profile.name.trim();
    }

    if (profile?.fullName?.trim()) {
      return profile.fullName.trim();
    }

    if (profile?.displayName?.trim()) {
      return profile.displayName.trim();
    }

    const profileFullName = [
      profile?.firstName,
      profile?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (profileFullName) {
      return profileFullName;
    }

    // Firestore user document
    if (userData?.name?.trim()) {
      return userData.name.trim();
    }

    if (userData?.fullName?.trim()) {
      return userData.fullName.trim();
    }

    if (userData?.displayName?.trim()) {
      return userData.displayName.trim();
    }

    const firestoreFullName = [
      userData?.firstName,
      userData?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (firestoreFullName) {
      return firestoreFullName;
    }

    // Firebase Authentication
    if (user?.displayName?.trim()) {
      return user.displayName.trim();
    }

    if (userData?.email) {
      return userData.email;
    }

    if (user?.email) {
      return user.email;
    }

    return "Unknown User";
  };

  // =====================================================
  // JOIN QUEUE
  // =====================================================

  const handleJoinQueue = async (service) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (service.status !== "accepting") {
      setError(
        "This service is currently closed."
      );
      return;
    }

    try {
      setJoiningServiceId(service.id);
      setError("");

      // =================================================
      // CHECK EXISTING ACTIVE QUEUE
      // =================================================

      const existingQueueQuery = query(
        collection(db, "queues"),
        where("userId", "==", user.uid),
        where(
          "status",
          "in",
          ["waiting", "serving"]
        )
      );

      const existingQueueSnapshot =
        await getDocs(existingQueueQuery);

      if (!existingQueueSnapshot.empty) {
        setError(
          "You already have an active queue. Please finish or leave your current queue first."
        );

        return;
      }

      // =================================================
      // LOAD USER PROFILE
      // =================================================

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnapshot =
        await getDoc(userRef);

      const userData = userSnapshot.exists()
        ? userSnapshot.data()
        : {};

      const userName =
        getUserName(userData);

      const userEmail =
        userData?.email ||
        user?.email ||
        "";

      // =================================================
      // SERVICE REFERENCE
      // =================================================

      const serviceRef = doc(
        db,
        "services",
        service.id
      );

      // =================================================
      // ATOMIC TRANSACTION
      // =================================================

      const queueResult =
        await runTransaction(
          db,
          async (transaction) => {

            // -------------------------------------------
            // READ LATEST SERVICE
            // -------------------------------------------

            const serviceSnapshot =
              await transaction.get(
                serviceRef
              );

            if (!serviceSnapshot.exists()) {
              throw new Error(
                "Service no longer exists."
              );
            }

            const latestService =
              serviceSnapshot.data();

            // -------------------------------------------
            // CHECK SERVICE STATUS
            // -------------------------------------------

            if (
              latestService.status !==
              "accepting"
            ) {
              throw new Error(
                "This service is currently closed."
              );
            }

            // -------------------------------------------
            // GET LAST TOKEN
            // -------------------------------------------

            const rawLastToken =
              latestService.lastTokenNumber;

            const lastTokenNumber =
              Number(rawLastToken);

            // Existing service must have a valid counter
            if (
              rawLastToken === undefined ||
              rawLastToken === null ||
              !Number.isInteger(
                lastTokenNumber
              ) ||
              lastTokenNumber < 0
            ) {
              throw new Error(
                "This service is not initialized for token generation. Please open Admin → Services and recreate or initialize this service."
              );
            }

            // -------------------------------------------
            // GENERATE NEXT TOKEN
            // -------------------------------------------

            const nextTokenNumber =
              lastTokenNumber + 1;

            // -------------------------------------------
            // TOKEN PREFIX
            // -------------------------------------------

            let prefix =
              latestService.tokenPrefix;

            if (
              !prefix ||
              typeof prefix !== "string"
            ) {
              prefix =
                latestService.name
                  ?.trim()
                  ?.charAt(0)
                  ?.toUpperCase() ||
                "Q";
            }

            prefix = prefix
              .trim()
              .toUpperCase()
              .replace(
                /[^A-Z0-9]/g,
                ""
              );

            if (!prefix) {
              prefix = "Q";
            }

            // -------------------------------------------
            // FINAL TOKEN
            // -------------------------------------------

            const token =
              `${prefix}-${String(
                nextTokenNumber
              ).padStart(3, "0")}`;

            // -------------------------------------------
            // CREATE QUEUE DOCUMENT
            // -------------------------------------------

            const queueRef = doc(
              collection(db, "queues")
            );

            // -------------------------------------------
            // UPDATE SERVICE COUNTER
            // -------------------------------------------

            transaction.update(
              serviceRef,
              {
                lastTokenNumber:
                  nextTokenNumber,

                updatedAt:
                  serverTimestamp(),
              }
            );

            // -------------------------------------------
            // CREATE QUEUE
            // -------------------------------------------

            transaction.set(
              queueRef,
              {
                // User
                userId: user.uid,
                userName,
                userEmail,

                // Service
                serviceId:
                  service.id,

                serviceName:
                  latestService.name ||
                  service.name ||
                  "",

                serviceDescription:
                  latestService.description ||
                  service.description ||
                  "",

                // Token
                token,
                tokenNumber:
                  nextTokenNumber,

                // Queue state
                status: "waiting",

                // Timestamps
                joinedAt:
                  serverTimestamp(),

                startedAt: null,

                completedAt: null,

                skippedAt: null,
              }
            );

            return {
              id: queueRef.id,

              token,

              tokenNumber:
                nextTokenNumber,

              serviceName:
                latestService.name ||
                service.name ||
                "",

              userName,
            };
          }
        );

      // =================================================
      // SUCCESS
      // =================================================

      console.log(
        "Queue created successfully:",
        queueResult
      );

      setJoinedQueue(queueResult);

    } catch (joinError) {
      console.error(
        "Join queue error:",
        joinError
      );

      // -----------------------------------------------
      // FIRESTORE PERMISSION ERROR
      // -----------------------------------------------

      if (
        joinError?.code ===
        "permission-denied"
      ) {
        setError(
          "Permission denied. Check that the service has lastTokenNumber initialized and that your Firestore rules are published."
        );
      }

      // -----------------------------------------------
      // SERVICE COUNTER ERROR
      // -----------------------------------------------

      else if (
        joinError?.message?.includes(
          "not initialized"
        )
      ) {
        setError(
          "This service is missing lastTokenNumber. Go to Admin → Services and create a new service, or initialize lastTokenNumber to 0 in Firestore."
        );
      }

      // -----------------------------------------------
      // ALREADY CLOSED
      // -----------------------------------------------

      else if (
        joinError?.message?.includes(
          "currently closed"
        )
      ) {
        setError(
          "This service is currently closed."
        );
      }

      // -----------------------------------------------
      // OTHER ERROR
      // -----------------------------------------------

      else {
        setError(
          joinError?.message ||
            "Unable to join queue. Please try again."
        );
      }
    } finally {
      setJoiningServiceId(null);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">

      <Navbar />

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-7 shadow-sm sm:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">

                <span className="relative flex h-2 w-2">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                </span>

                <span className="text-xs font-semibold text-emerald-700">
                  LIVE SERVICES
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Available Services
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Select a service to join a digital queue
                and track your position live.
              </p>

            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Available Services
                </p>

                <p className="text-lg font-bold leading-tight text-slate-900">
                  {services.filter(
                    (service) =>
                      service.status ===
                      "accepting"
                  ).length}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Choose a Service
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Services are managed by QueueLess administrators.
            </p>

          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">

            <RefreshCw className="h-3.5 w-3.5" />

            Live

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading services...
            </p>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          services.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                <Building2 className="h-7 w-7" />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No services available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Please check back later when a service is
                added by the administrator.
              </p>

            </div>
          )}

        {/* =================================================
            SERVICES
        ================================================= */}

        {!loading &&
          services.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {services.map((service) => (

                <ServiceCard
                  key={service.id}
                  service={service}
                  onJoinQueue={
                    handleJoinQueue
                  }
                  joining={
                    joiningServiceId ===
                    service.id
                  }
                />

              ))}

            </div>
          )}

      </section>

      <Footer />

      {/* ===================================================
          SUCCESS MODAL
      =================================================== */}

      {joinedQueue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5 backdrop-blur-sm">

          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">

            <button
              type="button"
              onClick={() =>
                setJoinedQueue(null)
              }
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">

              <CheckCircle2 className="h-9 w-9" />

            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Queue Joined Successfully
            </h2>

            <p className="mt-3 text-sm text-slate-600">

              You joined{" "}

              <span className="font-semibold text-slate-900">
                {joinedQueue.serviceName}
              </span>

              .

            </p>

            <div className="mt-6 rounded-2xl bg-blue-50 px-5 py-6">

              <p className="text-xs font-semibold tracking-wider text-blue-500">
                YOUR TOKEN
              </p>

              <p className="mt-2 text-5xl font-bold text-blue-600">
                {joinedQueue.token}
              </p>

            </div>

            <Link
              to="/queue"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to My Queue

              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() =>
                setJoinedQueue(null)
              }
              className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Stay on Services
            </button>

          </div>

        </div>
      )}

    </main>
  );
}

export default Services;