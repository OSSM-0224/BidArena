import React from "react";

const StatCard = ({ label, value, valueClassName = "", icon, children }) => {
  return (
    <div className="terminal-glass tech-border tech-border-tl tech-border-br p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-label-mono text-[11px] text-outline tracking-widest uppercase">
          {label}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-outline text-[18px]">
            {icon}
          </span>
        )}
      </div>

      <div
        className={`text-[32px] leading-none font-bold text-on-surface ${valueClassName}`}
      >
        {value}
      </div>

      {children}
    </div>
  );
};

export default StatCard;
