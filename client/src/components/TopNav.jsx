import React from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";

const TopNav = () => {
  const navItems = [
    { label: "Dashboard", to: "/dashboard" ,end:true },
    { label: "Active Bids", to: "/dashboard/active-bids" },
    { label: "Inventory", to: "/dashboard/inventory" },
  ];

  let navigate = useNavigate();
  return (
    <header className="w-full border-b border-outline-variant/40 bg-surface-container-low/60 backdrop-blur">
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-primary text-[24px]">
            security
          </span>
          <span className="font-extrabold text-primary uppercase tracking-[0.15em] text-[15px]">
            BidArena
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 grow">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-4 py-2 font-label-mono text-[12px] uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-on-surface-variant hover:text-on-surface"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Status + actions */}
        <div className="flex items-center gap-5 shrink-0">
          <div className="hidden lg:flex items-center gap-2 font-label-mono text-[10px] text-outline uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            ABC-99 · 27 STORES
          </div>

           <Button icon="bolt" size="sm" fullWidth={false} onClick={() => navigate("/dashboard/create-bid")}>
            Create Bid
          </Button>

          <div className="w-9 h-9 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0">
            <span onClick={() => navigate('/dashboard/profile')} className="material-symbols-outlined text-on-surface-variant text-[20px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
