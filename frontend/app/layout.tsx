import type { Metadata } from "next";

import "./globals.css";

import { APP_NAME } from "@/config/app";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Modern Hospital Management System for patient care and appointments.",
  keywords: [
    "hospital management",
    "medical system",
    "doctor appointment",
    "healthcare platform",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
