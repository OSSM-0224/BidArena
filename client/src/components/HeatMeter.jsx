const HeatMeter = ({ heat = 0 }) => {
  const tone = heat > 70 ? "text-tertiary" : heat > 35 ? "text-secondary" : "text-outline";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-label-mono text-[9px] uppercase tracking-widest text-outline">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
          Auction Heat
        </span>
        <span className={tone}>{heat}</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-low border border-outline-variant overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-secondary to-tertiary transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, heat))}%` }}
        />
      </div>
    </div>
  );
};

export default HeatMeter;