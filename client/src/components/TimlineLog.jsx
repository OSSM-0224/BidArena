const ICONS = {
  created: "add_circle",
  started: "play_circle",
  bid: "gavel",
  extension: "hourglass_bottom",
  winner: "trophy",
  payment: "payments",
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour12: false });
}

const TimelineLog = ({ entries = [] }) => (
  <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 flex flex-col gap-1 h-full">
    <div className="font-label-mono text-[10px] uppercase tracking-widest text-outline mb-2 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">history</span>
      Auction Timeline
    </div>
    <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[320px]">
      {[...entries].reverse().map((e) => (
        <div key={e.id} className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5">
            {ICONS[e.type] ?? "circle"}
          </span>
          <div className="flex-1">
            <div className="text-on-surface text-[12px] leading-snug">{e.message}</div>
            <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest mt-0.5">
              {formatTime(e.ts)}
            </div>
          </div>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
          No events yet
        </div>
      )}
    </div>
  </div>
);

export default TimelineLog;