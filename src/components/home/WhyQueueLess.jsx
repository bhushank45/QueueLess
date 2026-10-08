import { Bell, Clock3, MapPin, Ticket } from "lucide-react";

const benefits = [
  {
    icon: Clock3,
    title: "Save Time",
    description: "Spend less time in lines and more time on what matters.",
  },
  {
    icon: MapPin,
    title: "Skip the Line",
    description: "Join a queue from anywhere, no need to wait physically.",
  },
  {
    icon: Ticket,
    title: "Digital Token",
    description: "Get your token instantly with accurate wait time estimates.",
  },
  {
    icon: Bell,
    title: "Live Updates",
    description: "Know your position with real-time alerts and notifications.",
  },
];

function WhyQueueLess() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-600">
            WHY CHOOSE QUEUELESS
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Why QueueLess?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            A simpler, smarter way to manage waiting. Built for students,
            patients, and everyone in between.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={23} strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyQueueLess;
