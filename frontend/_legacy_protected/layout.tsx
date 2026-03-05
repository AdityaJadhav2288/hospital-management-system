import { AppShell } from "@/components/layout/app-shell";
import { ProtectedView } from "@/components/layout/protected-view";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedView>
      <AppShell>{children}</AppShell>
    </ProtectedView>
  );
}
