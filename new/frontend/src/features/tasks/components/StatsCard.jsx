function StatsCard({ title, value, description, icon, accent = "ocean" }) {
  const accentColors = {
    ocean: "text-ocean-500",
    azure: "text-azure-500",
    coral: "text-coral-500",
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-mist-200">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-medium text-deep-700/60 uppercase tracking-wide">
          {title}
        </p>
        <span className={`${accentColors[accent]} [&>svg]:w-4 [&>svg]:h-4`}>
          {icon}
        </span>
      </div>
      <p className="text-[26px] font-medium text-deep-800 leading-none">
        {value}
      </p>
      <p className="text-xs text-deep-700/40 mt-1.5">
        {description}
      </p>
    </div>
  );
}

export default StatsCard;