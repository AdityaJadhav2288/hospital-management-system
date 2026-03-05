import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
