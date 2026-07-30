import React from "react";

const Badge = ({ children, tone = "neutral", className = "" }) => {
  const toneClass = {
    primary: "bg-primary/10 text-primary border-primary/30",
    secondary: "bg-secondary/10 text-secondary border-secondary/30",
    error: "bg-error/10 text-error border-error/30",
    neutral:
      "bg-surface-container-low text-on-surface-variant border-outline-variant",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 border font-label-mono text-[10px] uppercase tracking-widest ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
