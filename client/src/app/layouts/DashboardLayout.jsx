import TopNav from "@/components/TopNav";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopNav />
      <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
