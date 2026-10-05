function BenefitItem({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center lg:justify-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

export default BenefitItem;
