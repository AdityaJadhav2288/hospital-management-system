import type { UserRole } from "@/types/role";

export const authRoutes = ["/login", "/register"];

export const defaultDashboardByRole: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
};

export const sidebarRoutesByRole: Record<UserRole, Array<{ href: string; label: string }>> = {
  admin: [
    { href: "/admin/dashboard", label: "Overview" },
    { href: "/admin/dashboard/doctors", label: "Doctors" },
    { href: "/admin/dashboard/patients", label: "Patients" },
    { href: "/admin/dashboard/appointments", label: "Appointments" },
    { href: "/admin/dashboard/departments", label: "Departments" },
    { href: "/admin/dashboard/blood-stock", label: "Blood Inventory" },
  ],
  doctor: [
    { href: "/doctor/dashboard", label: "Overview" },
    { href: "/doctor/dashboard/appointments", label: "Appointments" },
    { href: "/doctor/dashboard/patients", label: "Patients" },
    { href: "/doctor/dashboard/prescriptions", label: "Prescriptions" },
  ],
  patient: [
    { href: "/patient/dashboard", label: "Overview" },
    { href: "/patient/dashboard/appointments", label: "Appointments" },
    { href: "/patient/dashboard/prescriptions", label: "Prescriptions" },
    { href: "/patient/dashboard/history", label: "Vitals & History" },
    { href: "/patient/dashboard/reports", label: "Reports" },
    { href: "/patient/dashboard/profile", label: "Profile" },
  ],
};
