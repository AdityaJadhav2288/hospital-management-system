"use client";

import { useSyncAuthCookie } from "@/hooks/use-sync-auth-cookie";

export function AuthCookieSync() {
  useSyncAuthCookie();
  return null;
}
