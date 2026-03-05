import { AppShell } from "@/components/layout/app-shell";
import { ProtectedView } from "@/components/layout/protected-view";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedView>
      <AppShell>{children}</AppShell>
    </ProtectedView>
  );
}
