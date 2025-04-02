"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - fixed width on desktop, hideable on mobile */}
      <aside
        className={cn(
          "h-full w-64 shrink-0 overflow-y-auto border-r bg-card transition-all duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main content area - flexible width */}
      <main className="flex h-screen w-full flex-col">
        {/* Header with fixed height */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Main content - takes remaining height */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar - only visible when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default MainLayout; 