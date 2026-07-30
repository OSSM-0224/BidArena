import useCountdown from "@/utils/utils";
import React from "react";
import Badge from "./Badge";
import Button from "./Button";

const statusConfig = {
  active: { label: "Live", tone: "primary" },
  upcoming: { label: "Upcoming", tone: "secondary" },
  completed: { label: "Completed", tone: "neutral" },
};

const AuctionCard = ({
  icon = "inventory_2",
  title,
  status = "active",
  priceLabel,
  price,
  targetTime,
  bidders = 0,
  spectators = 0,
  actionLabel,
  onAction,
}) => {
  const config = statusConfig[status] ?? statusConfig.active;
  const { label: countdown, isExpired } = useCountdown(
    status === "completed" ? null : targetTime,
  );

  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-16 h-16 bg-surface-container-low border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-outline text-[28px]">
            {icon}
          </span>
        </div>
        <Badge tone={config.tone}>{config.label}</Badge>
      </div>

      <div className="space-y-1">
        <h3 className="text-on-surface font-semibold text-[16px] leading-snug">
          {title}
        </h3>
        <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest">
          {priceLabel}
        </div>
        <div className="text-[20px] font-bold text-primary">{price}</div>
      </div>

      <div className="flex items-center gap-4 font-label-mono text-[10px] text-outline uppercase tracking-widest">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">group</span>
          {bidders}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            visibility
          </span>
          {spectators}
        </span>
        {status !== "completed" && (
          <span className="ml-auto flex items-center gap-1 text-secondary">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            {isExpired ? "Ending..." : countdown}
          </span>
        )}
      </div>

      <Button
        size="sm"
        onClick={onAction}
        variant={status === "completed" ? "secondary" : "primary"}
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default AuctionCard;
