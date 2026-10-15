import {
  Bell,
  BellRing,
  Clock3,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function QueueCard({
  queue,
  onLeaveQueue,
  leaving = false,
}) {
  const isServing = queue.status === "serving";
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [enablingAlerts, setEnablingAlerts] = useState(false);
  const notificationRegistration = useRef(null);
  const previousQueueState = useRef({
    queueId: queue.id,
    position: queue.position,
  });
  const alertedQueueId = useRef(null);

  const sendOneAheadAlert = useCallback(async () => {
    if (
      alertedQueueId.current === queue.id ||
      !notificationRegistration.current ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    alertedQueueId.current = queue.id;

    try {
      await notificationRegistration.current.showNotification(
        "You’re nearly next in QueueLess",
        {
          body:
            queue.position === 1
              ? `Token ${queue.token}: you’re next in line.`
              : queue.status === "serving"
                ? `Token ${queue.token}: it’s your turn now.`
                : `Token ${queue.token}: one person is ahead of you.`,
          icon: "/favicon.svg",
          tag: `queueless-one-ahead-${queue.id}`,
          vibrate: [200, 100, 200],
          data: { url: "/queue" },
        }
      );
      setAlertMessage("Buzz alert sent for this queue.");
    } catch (notificationError) {
      alertedQueueId.current = null;
      console.error("Unable to show queue alert:", notificationError);
      setAlertMessage("Could not show the notification on this device.");
    }
  }, [queue.id, queue.token]);

  useEffect(() => {
    const previous = previousQueueState.current;

    if (previous.queueId !== queue.id) {
      previousQueueState.current = {
        queueId: queue.id,
        position: queue.position,
      };
      alertedQueueId.current = null;
      return;
    }

    if (
      alertsEnabled &&
      previous.position > 2 &&
      queue.position <= 2
    ) {
      void sendOneAheadAlert();
    }

    previousQueueState.current = {
      queueId: queue.id,
      position: queue.position,
    };
  }, [alertsEnabled, queue.id, queue.position, queue.status, sendOneAheadAlert]);

  const handleEnableAlerts = async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      setAlertMessage("This browser does not support queue notifications.");
      return;
    }

    if (!window.isSecureContext) {
      setAlertMessage("Notifications need HTTPS. Open the secure app URL on your phone.");
      return;
    }

    try {
      setEnablingAlerts(true);
      setAlertMessage("");

      const permission =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      if (permission !== "granted") {
        setAlertMessage(
          permission === "denied"
            ? "Notifications are blocked. Allow them in this site’s browser settings."
            : "Allow notifications to enable the queue buzz alert."
        );
        return;
      }

      const registration = await navigator.serviceWorker.register(
        "/queueless-notifications-sw.js"
      );
      notificationRegistration.current = registration;
      await navigator.serviceWorker.ready;
      setAlertsEnabled(true);
      setAlertMessage("Buzz alert enabled. Keep My Queue open for this demo.");

      if (queue.status === "waiting" && queue.position === 2) {
        await sendOneAheadAlert();
      }
    } catch (notificationError) {
      console.error("Unable to enable queue notifications:", notificationError);
      setAlertMessage("Could not enable notifications on this device.");
    } finally {
      setEnablingAlerts(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white px-6 py-8 shadow-sm sm:px-9 sm:py-10">

      {/* Status */}
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${
            isServing
              ? "bg-blue-50"
              : "bg-emerald-50"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isServing
                  ? "bg-blue-400"
                  : "bg-emerald-400"
              }`}
            />

            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isServing
                  ? "bg-blue-500"
                  : "bg-emerald-500"
              }`}
            />
          </span>

          <span
            className={`text-xs font-medium ${
              isServing
                ? "text-blue-700"
                : "text-emerald-700"
            }`}
          >
            {isServing
              ? "You are being served"
              : "You're in the queue"}
          </span>
        </div>
      </div>

      {/* Service */}
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-blue-700">
        <ShieldCheck className="h-4 w-4" />

        <span>{queue.service}</span>

        <span className="text-slate-400">•</span>

        <span>{queue.department}</span>
      </div>

      {/* Token */}
      <div className="mt-7 rounded-xl bg-[#f0f1ff] px-6 py-8 text-center sm:py-9">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-blue-700">
          YOUR TOKEN
        </p>

        <p className="mt-1 text-5xl font-bold tracking-tight text-blue-700 sm:text-6xl">
          {queue.token}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />

          {queue.doctor}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">

        {/* Current */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Last Called
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {queue.currentToken}
          </p>

          <div className="mt-0.5 flex items-center justify-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold text-emerald-600">
              Live
            </span>
          </div>
        </div>

        {/* Position */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Your Position
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">
            {queue.position === 0
              ? "NOW"
              : `#${queue.position}`}
          </p>

          <p className="text-[10px] font-medium text-slate-600">
            {queue.position === 0
              ? "being served"
              : "in line"}
          </p>

          {!isServing && (
            <p className="mt-1 text-[10px] text-slate-500">
              {queue.peopleAhead} ahead
            </p>
          )}
        </div>

        {/* Wait */}
        <div className="rounded-xl bg-[#f0f1ff] px-2 py-5 text-center sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Estimated Wait
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {queue.estimatedWait}
            <span className="ml-1 text-xs font-semibold">
              mins
            </span>
          </p>

          <p className="mt-1 text-[10px] text-slate-500">
            ~{queue.waitPerPatient} min / person
          </p>
        </div>
      </div>

      {/* Announcement */}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f0f1ff] px-4 py-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Bell className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">
            {isServing
              ? "Please proceed to the service desk."
              : queue.peopleAhead === 0
                ? "You are next."
                : `${queue.peopleAhead} ${
                    queue.peopleAhead === 1
                      ? "person"
                      : "people"
                  } ahead of you.`}
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
            {alertMessage ||
              "Live queue updates. Buzz alerts work while this page stays open."}
          </p>
        </div>

        {!isServing && (
          <button
            type="button"
            onClick={handleEnableAlerts}
            disabled={enablingAlerts || alertsEnabled}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-default disabled:opacity-70"
          >
            <BellRing className="h-3.5 w-3.5" />
            {enablingAlerts
              ? "Enabling..."
              : alertsEnabled
                ? "Buzz on"
                : "Enable buzz"}
          </button>
        )}
      </div>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <Clock3 className="h-3.5 w-3.5" />

          <span>Joined at {queue.joinedAt}</span>
        </div>

        {!isServing && (
          <button
            type="button"
            disabled={leaving}
            onClick={onLeaveQueue}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" />

            {leaving
              ? "Leaving..."
              : "Leave Queue"}
          </button>
        )}
      </div>
    </div>
  );
}

export default QueueCard;
