"use client";

import { Toaster } from "sonner";
import { ChatbotWidget } from "@/components/ai/chatbot-widget";
import { AuthCookieSync } from "@/components/layout/auth-cookie-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthCookieSync />
      {children}
      <ChatbotWidget />
      <Toaster richColors position="top-right" />
    </>
  );
}
