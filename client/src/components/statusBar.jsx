const Stat = ({ icon, label, value }) => (
  <div className="flex-1 flex items-center gap-2">
    <span className="material-symbols-outlined text-outline text-[18px]">{icon}</span>
    <div>
      <div className="text-[15px] font-bold text-on-surface leading-none">{value}</div>
      <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline mt-1">{label}</div>
    </div>
  </div>
);

const StatsBar = ({ bidders = 0, spectators = 0, bidCount = 0 }) => (
  <div className="terminal-glass tech-border tech-border-tl tech-border-br p-4 flex items-center gap-4">
    <Stat icon="group" label="Bidders" value={bidders} />
    <Stat icon="visibility" label="Spectators" value={spectators} />
    <Stat icon="gavel" label="Bids Placed" value={bidCount} />
  </div>
);

export default StatsBar;