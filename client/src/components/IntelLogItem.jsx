export default function IntelLogItem({ tag, tone = "neutral", message, meta, timestamp, muted = false }) {
  const toneClass = {
    primary: "text-primary",
    error: "text-error",
    neutral: "text-on-surface-variant",
  }[tone];
 
  return (
    <div className={`flex items-start justify-between gap-3 py-3 border-b border-outline-variant/40 ${muted ? "opacity-40" : ""}`}>
      <div className="space-y-1 min-w-0">
        <div className={`font-label-mono text-[11px] font-medium ${toneClass}`}>
          [{tag}] {message}
        </div>
        {meta && (
          <div className="font-label-mono text-[10px] text-outline truncate">{meta}</div>
        )}
      </div>
      {timestamp && (
        <span className="font-label-mono text-[9px] text-outline shrink-0 pt-0.5">{timestamp}</span>
      )}
    </div>
  );
}
 