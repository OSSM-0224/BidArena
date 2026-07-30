import React from 'react'

const Select = ({ label, tag, error, id, options = [], className = "", ...rest }) => {
 const inputId = id || rest.name;
 
  return (
    <div className="space-y-2">
      {(label || tag) && (
        <div className="flex justify-between items-end">
          {label && (
            <label
              htmlFor={inputId}
              className="font-label-mono font-medium text-[11px] tracking-widest uppercase text-outline/60"
            >
              {label}
            </label>
          )}
          {tag && <span className="text-[9px] text-primary/40 font-label-mono">{tag}</span>}
        </div>
      )}
 
      <div className="relative tech-border tech-border-tl tech-border-br">
        <select
          id={inputId}
          className={`w-full input-tech rounded-none py-4 pl-4 pr-10 text-on-surface font-label-mono uppercase text-[13px] appearance-none cursor-pointer ${
            error ? "input-error" : ""
          } ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-container-low text-on-surface">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
          expand_more
        </span>
      </div>
 
      {error && (
        <p className="text-[11px] font-label-mono text-error tracking-wide uppercase">{error}</p>
      )}
    </div>
  );
}

export default Select