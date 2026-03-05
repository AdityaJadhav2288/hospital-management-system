"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function useSyncAuthCookie() {
  const { token, user } = useAuthStore();

  useEffect(() => {
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
    const attrs = `; path=/; SameSite=Lax${secure}`;

    if (token) {
      document.cookie = `hms_access_token=${token}${attrs}`;
    } else {
      document.cookie = `hms_access_token=; Max-Age=0${attrs}`;
    }

    if (user?.role) {
      document.cookie = `hms_user_role=${user.role}${attrs}`;
    } else {
      document.cookie = `hms_user_role=; Max-Age=0${attrs}`;
    }
  }, [token, user?.role]);
}
