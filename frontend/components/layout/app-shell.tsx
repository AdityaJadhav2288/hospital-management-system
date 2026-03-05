"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}