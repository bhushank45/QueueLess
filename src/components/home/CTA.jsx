import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-50 px-6 py-16 md:px-12">
        {/* Decorative circles */}
        <div className="absolute -left-16 -bottom-20 h-48 w-48 rounded-full bg-blue-100/70" />
        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-100/70" />

        {/* Content */}
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-600">
            GET STARTED TODAY
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Ready to <span className="text-blue-600">skip the wait?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Join a queue from anywhere and experience a faster, smarter, and
            more convenient way to get things done.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Join Queue
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
