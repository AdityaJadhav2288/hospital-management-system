import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
