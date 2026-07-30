import React from "react";
import Badge from "./Badge";
import Button from "./Button";

const OperationCard = ({
  id,
  statusLabel,
  statusTone = "primary",
  icon = "inventory_2",
  title,
  stat1Label,
  stat1Value,
  stat2Label,
  stat2Value,
  stat2Tone = "secondary",
  primaryAction,
  onPrimaryAction,
  secondaryAction,
  onSecondaryAction,
}) => {
  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-5 flex flex-col sm:flex-row gap-5">
      <div className="w-full sm:w-28 h-28 shrink-0 bg-surface-container-low border border-outline-variant flex items-center justify-center">
        <span className="material-symbols-outlined text-outline text-[36px]">
          {icon}
        </span>
      </div>

      <div className="grow flex flex-col justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-label-mono text-[10px] text-outline uppercase tracking-widest">
                {id}
              </span>
              {statusLabel && <Badge tone={statusTone}>{statusLabel}</Badge>}
            </div>
            <h3 className="text-on-surface font-semibold text-[17px] leading-snug">
              {title}
            </h3>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex gap-6">
            {stat1Label && (
              <div>
                <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest">
                  {stat1Label}
                </div>
                <div className="text-on-surface font-semibold text-[15px]">
                  {stat1Value}
                </div>
              </div>
            )}
            {stat2Label && (
              <div>
                <div className="font-label-mono text-[9px] text-outline uppercase tracking-widest">
                  {stat2Label}
                </div>
                <div
                  className={`font-label-mono font-semibold text-[15px] ${
                    stat2Tone === "error" ? "text-error" : "text-secondary"
                  }`}
                >
                  {stat2Value}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-32">
            {primaryAction && (
              <Button onClick={onPrimaryAction} size="sm">
                {primaryAction}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="secondary" onClick={onSecondaryAction} size="sm">
                {secondaryAction}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationCard;
