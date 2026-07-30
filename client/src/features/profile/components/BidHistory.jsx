import Badge from "@/components/Badge";

const STATUS_CONFIG = {
  leading: { label: "Leading", tone: "primary" },
  won: { label: "Won", tone: "primary" },
  outbid: { label: "Outbid", tone: "secondary" },
  lost: { label: "Lost", tone: "error" },
};

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

const BidHistoryList = ({ bids = [] }) => (
  <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5">
    <div className="font-label-mono text-[10px] uppercase tracking-widest text-outline mb-4 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">receipt_long</span>
      Bid History
    </div>
    <div className="space-y-3">
      {bids.map((bid) => {
        const config = STATUS_CONFIG[bid.status] ?? STATUS_CONFIG.outbid;
        return (
          <div
            key={bid.id}
            className="flex items-center justify-between gap-4 pb-3 border-b border-outline-variant/30 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="text-on-surface text-[13px] font-medium truncate">{bid.title}</div>
              <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest mt-0.5">
                {bid.auctionId} · {formatDate(bid.date)}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-label-mono text-[13px] text-on-surface">
                ${bid.amount.toLocaleString()}
              </span>
              <Badge tone={config.tone}>{config.label}</Badge>
            </div>
          </div>
        );
      })}
      {bids.length === 0 && (
        <div className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
          No bids placed yet
        </div>
      )}
    </div>
  </div>
);

export default BidHistoryList;