import React from "react";

const Loading = ({label = "establishing connection"}) => {
  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* background layers, consistent with AuthLayout */}
      <div className="absolute inset-0 pointer-events-none grid-bg" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-outline-variant" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[22px]">
              security
            </span>
          </div>
        </div>

        {/* label */}
        <div className="flex items-center gap-2 font-label-mono text-[11px] text-outline tracking-widest uppercase">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse uppercase" />
          {label}
          <span className="animate-pulse">...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
