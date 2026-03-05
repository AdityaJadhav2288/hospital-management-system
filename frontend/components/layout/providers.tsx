"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthCookieSync } from "@/components/layout/auth-cookie-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthCookieSync />
      {children}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
