"use client";

import { useEffect, useState } from "react";
import { useRoleGuard } from "@/hooks/use-role-guard";

export function ProtectedView({ children }: { children: React.ReactNode }) {
  const { token, user } = useRoleGuard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !token || !user) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return <>{children}</>;
}
