import React from "react";

const Button = ({
  children,
  icon,
  loading = false,
  loadingText = "PROCESSING...",
  success = false,
  successText = "DONE",
  variant = "primary",
  className = "",
  disabled,
  ...rest
}) => {
  const base =
    "w-full py-5 font-label-mono text-[14px] uppercase tracking-[0.3em] font-bold relative group overflow-hidden transition-colors disabled:cursor-not-allowed";

  const variantClass = success
    ? "bg-secondary text-on-secondary"
    : variant === "secondary"
      ? "bg-transparent border border-primary text-primary"
      : "bg-primary text-on-primary";

  return (
    <button
      className={`${base} ${variantClass} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {loadingText}
          </>
        ) : success ? (
          <>
            <span className="material-symbols-outlined text-[20px]">
              verified_user
            </span>
            {successText}
          </>
        ) : (
          <>
            {icon && (
              <span className="material-symbols-outlined text-[20px]">
                {icon}
              </span>
            )}
            {children}
          </>
        )}
      </span>
      {!loading && !success && (
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      )}
    </button>
  );
};

export default Button;
