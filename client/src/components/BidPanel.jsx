import { useEffect, useState } from "react";
import Button from "@/components/Button";

const REJECTION_COPY = {
  BID_TOO_LOW: "Someone beat you to it — raise your bid.",
  ROOM_NOT_ACTIVE: "This auction isn't live right now.",
  NOT_AUTHENTICATED: "Sign in to place a bid.",
  DUPLICATE_LEADER: "You're already the highest bidder.",
  SPECTATOR_MODE: "Join as a bidder to place a bid.",
  NOT_CONNECTED: "Reconnecting — try again in a moment.",
};

function formatTimeLeft(ms) {
  if (ms == null) return "--:--:--";
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const BidPanel = ({
  status,
  highestBid,
  highestBidder,
  minIncrement,
  timeLeftMs,
  mode,
  onBecomeBidder,
  onSubmitBid,
  rejection,
  onClearRejection,
  currentUserId,
}) => {
  const suggested = highestBid + minIncrement;
  const [amount, setAmount] = useState(suggested);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setAmount(suggested), [suggested]);

  const isLive = status === "active";
  const youAreLeading = highestBidder?.userId === currentUserId;

  const handleSubmit = async () => {
    setSubmitting(true);
    onClearRejection?.();
    await onSubmitBid(Number(amount));
    setSubmitting(false);
  };

  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline">
            {status === "completed" ? "Winning Bid" : "Current Highest Bid"}
          </div>
          <div className="text-[28px] font-bold text-primary leading-tight">
            ${highestBid.toLocaleString()}
          </div>
          {highestBidder && (
            <div className="font-label-mono text-[10px] text-outline uppercase tracking-widest mt-1">
              {youAreLeading ? "You are leading" : `Leader: ${highestBidder.userName}`}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline flex items-center gap-1 justify-end">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {status === "completed" ? "Ended" : "Time Left"}
          </div>
          <div className="text-[20px] font-bold text-secondary tabular-nums">
            {status === "completed" ? "00:00:00" : formatTimeLeft(timeLeftMs)}
          </div>
        </div>
      </div>

      {status === "completed" ? (
        <div className="font-label-mono text-[11px] uppercase tracking-widest text-outline">
          Auction closed
        </div>
      ) : mode !== "bidder" ? (
        <div className="space-y-3">
          <p className="text-on-surface-variant text-[13px]">
            You're viewing in spectator mode. Join as a bidder to place bids.
          </p>
          <Button size="sm" variant="primary" onClick={onBecomeBidder} disabled={!isLive}>
            Join as Bidder
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-label-mono text-[13px] text-outline">$</span>
            <input
              type="number"
              min={suggested}
              step={minIncrement}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isLive || submitting}
              className="flex-1 bg-surface-container-low border border-outline-variant px-3 py-2 text-on-surface font-label-mono text-[14px] outline-none focus:border-primary disabled:opacity-50"
            />
          </div>
          <div className="font-label-mono text-[9px] uppercase tracking-widest text-outline">
            Minimum next bid ${suggested.toLocaleString()}
          </div>
          {rejection && (
            <div className="font-label-mono text-[10px] uppercase tracking-widest text-error">
              {REJECTION_COPY[rejection.reason] ?? "That bid couldn't be placed."}
            </div>
          )}
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={!isLive || submitting || Number(amount) < suggested}
          >
            {submitting ? "Placing Bid..." : "Place Bid"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BidPanel;