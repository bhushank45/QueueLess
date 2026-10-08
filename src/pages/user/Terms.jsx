import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

function Terms() {
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

        <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: October 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Acceptance of Terms
              </h2>
              <p className="mt-2">
                By using QueueLess, you agree to follow these Terms &
                Conditions. If you do not agree with these terms, please do not
                use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                2. Using QueueLess
              </h2>
              <p className="mt-2">
                QueueLess provides a digital queue management service that
                allows users to join queues, receive tokens, and track their
                position.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                3. User Responsibilities
              </h2>
              <p className="mt-2">
                Users are responsible for providing accurate information and
                using the platform in a respectful and appropriate manner.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Queue Information
              </h2>
              <p className="mt-2">
                Queue positions and estimated waiting times may change as
                services are provided. QueueLess does not guarantee a specific
                waiting time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Account Security
              </h2>
              <p className="mt-2">
                You are responsible for keeping your account credentials secure.
                Do not share your login information with others.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                6. Changes to These Terms
              </h2>
              <p className="mt-2">
                QueueLess may update these terms when necessary. Continued use
                of the platform after changes means you accept the updated
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                7. Contact
              </h2>
              <p className="mt-2">
                For questions about these terms, visit our{" "}
                <Link
                  to="/support"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Help & Support
                </Link>{" "}
                page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Terms;
