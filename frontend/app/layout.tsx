import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/config/app";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Hospital Management System frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
