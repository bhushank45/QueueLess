import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

function Privacy() {
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
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: October 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                QueueLess may collect information such as your name, email
                address, mobile number, and queue-related information when you
                use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                2. How We Use Your Information
              </h2>
              <p className="mt-2">
                Your information may be used to create and manage your account,
                provide queue services, show your queue status, and communicate
                important service-related updates.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                3. Information Security
              </h2>
              <p className="mt-2">
                We take reasonable steps to protect the information associated
                with your QueueLess account and use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                4. Third-Party Services
              </h2>
              <p className="mt-2">
                QueueLess may use third-party services to provide features such
                as authentication, data storage, and application functionality.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                5. Your Privacy
              </h2>
              <p className="mt-2">
                We aim to use your information only for purposes necessary to
                provide and improve the QueueLess experience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">
                6. Contact Us
              </h2>
              <p className="mt-2">
                If you have questions about this Privacy Policy, please visit
                our{" "}
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

export default Privacy;
