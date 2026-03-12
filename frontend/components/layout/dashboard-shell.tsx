import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedView } from "@/components/layout/protected-view";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
      <ProtectedView>
        <AppShell>{children}</AppShell>
      </ProtectedView>
    </Suspense>
  );
}
