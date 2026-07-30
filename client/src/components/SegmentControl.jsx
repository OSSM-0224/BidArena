import React from "react";

const SegmentControl = ({ options, value, onChange, columns }) => {
  const cols = columns || options.length;

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`py-3 px-2 font-label-mono text-[11px] uppercase tracking-widest border transition-colors ${
              selected
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-outline"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentControl;
