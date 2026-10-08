import { Building2, Check, Radio, Ticket } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Building2,
    title: "Choose a service",
    description:
      "Select from healthcare clinics, campus administrative desks, banking windows, or technical mentors.",
    feature: "Multiple departments supported",
    featureIcon: Building2,
  },
  {
    number: "2",
    icon: Ticket,
    title: "Join the queue",
    description:
      "Enter your name and mobile number. Instantly receive a digital token code with an accurate wait estimate.",
    feature: "Instant ticket generation",
    featureIcon: Check,
  },
  {
    number: "3",
    icon: Radio,
    title: "Track your token",
    description:
      "Watch live wait times on your phone or on public displays. Get summoned directly to your assigned station.",
    feature: "Live audio & screen alerts",
    featureIcon: Radio,
  },
];

function HowItWorks() {
  return (
    <section className="bg-[#f8f7ff] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-600">
            SIMPLE 3-STEP PROCESS
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            How It Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            No clipboards, no physical lines, no wasted afternoons. Designed for
            transparent, stress-free assistance.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const FeatureIcon = step.featureIcon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  {/* Number */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg font-semibold text-blue-600">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <StepIcon size={21} strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 min-h-21 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Feature */}
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f5f7ff] px-4 py-3">
                  <FeatureIcon
                    size={17}
                    strokeWidth={2}
                    className="shrink-0 text-blue-600"
                  />

                  <div className="h-5 w-px bg-slate-200" />

                  <span className="text-sm font-medium text-slate-700">
                    {step.feature}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
