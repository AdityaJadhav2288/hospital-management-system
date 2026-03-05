"use client";

import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      
      {/* NAVBAR */}
      <PublicNavbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4">
          {children}
        </div>
      </main>

      {/* FOOTER */}
      <PublicFooter />

    </div>
  );
}