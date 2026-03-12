"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultDashboardByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function DashboardIndexPageClient() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.replace(defaultDashboardByRole[user.role]);
    }
  }, [router, user]);

  return <div className="text-sm text-muted-foreground">Redirecting...</div>;
}
