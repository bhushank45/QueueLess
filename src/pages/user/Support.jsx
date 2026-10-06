import { Link } from "react-router-dom";
import { ArrowLeft, CircleHelp, Mail, MessageCircle } from "lucide-react";

function Support() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50/70 via-white to-white">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 lg:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <CircleHelp className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Help & Support
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Need help with QueueLess? Find answers or get in touch with our
            support team.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Common Questions
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-800">
                  How do I join a queue?
                </h3>
                <p className="mt-1">
                  Select a service, provide the required information, and join
                  the available queue.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  How can I track my queue?
                </h3>
                <p className="mt-1">
                  Your queue position and estimated waiting time can be viewed
                  through your QueueLess account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  What if I have a problem?
                </h3>
                <p className="mt-1">
                  Contact the QueueLess support team for assistance.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Contact Support
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              If you need additional help, you can contact the QueueLess support
              team.
            </p>

            <a
              href="mailto:support@queueless.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Mail className="h-4 w-4" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Support;
