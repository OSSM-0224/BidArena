import React from "react";

const BgLayout = ({ children, eyebrow = "CMD://CREATE_IDENTITY" }) => {
return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>
 
      {/* Header */}
      <header className="w-full px-margin-desktop py-8 relative z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined text-primary text-[32px]">security</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-ping" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-primary uppercase tracking-[0.2em] leading-none">
              BidArena
            </span>
            <span className="text-[10px] font-label-mono text-outline uppercase tracking-widest mt-1">
              Terminal Ver 4.0.2-Beta
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 font-label-mono text-[11px] text-outline">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            NETWORK: SECURE
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            LATENCY: 14MS
          </div>
        </div>
      </header>
 
      <main className="grow flex items-stretch relative z-10">
        {/* Left technical display */}
        <div className="hidden lg:flex w-[40%] flex-col justify-center px-margin-desktop space-y-12 border-r border-outline-variant/30">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary/60 font-label-mono text-[12px]">
              <span className="px-2 py-0.5 border border-primary/40 rounded">SYSTEM_ONBOARDING</span>
              <span>{eyebrow}</span>
            </div>
            <h1 className="text-[48px] leading-14 tracking-[-0.02em] font-extrabold text-on-surface max-w-md">
              Initialize High-Clearance Protocol.
            </h1>
            <p className="text-lg text-on-surface-variant max-w-sm">
              Join the elite high-stakes trading floor. Your authorization process begins now.
            </p>
          </div>
 
          <div className="terminal-glass p-6 rounded-lg tech-border tech-border-tl tech-border-br font-label-mono text-[12px] text-primary/70 space-y-2 overflow-hidden max-h-75">
            <div className="flex justify-between items-center border-b border-primary/20 pb-2 mb-4">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">terminal</span> LIVE_FEED
              </span>
              <span className="text-[10px] opacity-50">NODE_NYC_04</span>
            </div>
            <div className="space-y-1 animate-pulse">
              <p>&gt; Synchronizing biometric encryption hash...</p>
              <p>&gt; Routing through decentralized liquidity pools...</p>
              <p>
                &gt; Status: <span className="text-secondary">AWAITING_USER_INPUT</span>
              </p>
              <p>&gt; 0x4F...E2A connected to internal bus</p>
              <p className="opacity-40">&gt; [LOG] Packet integrity verified</p>
              <p className="opacity-40">&gt; [LOG] Handshake protocol initiated</p>
              <p>&gt; Initializing wallet virtualization module...</p>
              <p className="text-green-400">&gt; FIREWALL: BYPASS_AUTHORIZED</p>
            </div>
          </div>
        </div>
 
        {/* Right content — the form goes here */}
        <div className="grow flex items-center justify-center p-margin-mobile">
          <div className="w-full max-w-135 relative">
            <div className="absolute -top-4 -left-4 font-label-mono text-[10px] text-outline/40">
              COORD: 40.7128° N
            </div>
            <div className="absolute -bottom-4 -right-4 font-label-mono text-[10px] text-outline/40">
              COORD: 74.0060° W
            </div>
            <div className="terminal-glass p-8 md:p-12 rounded-none relative overflow-hidden">
              <div className="scanline" />
              {children}
            </div>
          </div>
        </div>
      </main>
 
      <footer className="w-full py-6 px-margin-desktop relative z-10 border-t border-outline-variant/10">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8 font-label-mono text-[10px] text-outline/50 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>SHA-512 SECURED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">account_balance</span>
              <span>INSTITUTIONAL GRADE</span>
            </div>
          </div>
          <div className="font-label-mono font-medium text-[10px] text-outline/40 uppercase tracking-widest">
            SYS_COPYRIGHT © 2024 BIDARENA_NETWORKS
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BgLayout;
