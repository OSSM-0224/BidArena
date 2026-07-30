import React from 'react'

const Textarea = ({ label, tag, error, id, className = "", rows = 4, ...rest }) => {
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
        <textarea
          id={inputId}
          rows={rows}
          className={`w-full input-tech rounded-none py-4 pl-4 pr-4 text-on-surface placeholder:text-outline/30 font-label-mono resize-none ${
            error ? "input-error" : ""
          } ${className}`}
          {...rest}
        />
      </div>
 
      {error && (
        <p className="text-[11px] font-label-mono text-error tracking-wide uppercase">{error}</p>
      )}
    </div>
  );
}

export default Textarea