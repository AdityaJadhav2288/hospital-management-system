"use client";

import { Toaster } from "sonner";
import { AuthCookieSync } from "@/components/layout/auth-cookie-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthCookieSync />
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
