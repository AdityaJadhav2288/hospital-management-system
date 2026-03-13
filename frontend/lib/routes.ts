import type { UserRole } from "@/types/role";

export const authRoutes = ["/login", "/register"];

export const defaultDashboardByRole: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  doctor: "/dashboard/doctor",
  patient: "/dashboard/patient",
};

export const sidebarRoutesByRole: Record<UserRole, Array<{ href: string; label: string }>> = {
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/doctors", label: "Doctors" },
    { href: "/dashboard/admin/patients", label: "Patients" },
    { href: "/dashboard/admin/appointments", label: "Appointments" },
    { href: "/dashboard/admin/messages", label: "Messages" },
    { href: "/dashboard/admin/departments", label: "Departments" },
    { href: "/dashboard/admin/blood-stock", label: "Blood Inventory" },
  ],
  doctor: [
    { href: "/dashboard/doctor", label: "Overview" },
    { href: "/dashboard/doctor/appointments", label: "Appointments" },
    { href: "/dashboard/doctor/patients", label: "Patients" },
    { href: "/dashboard/doctor/prescriptions", label: "Prescriptions" },
  ],
  patient: [
    { href: "/dashboard/patient", label: "Overview" },
    { href: "/dashboard/patient/appointments", label: "Appointments" },
    { href: "/dashboard/patient/prescriptions", label: "Prescriptions" },
    { href: "/dashboard/patient/history", label: "Vitals & History" },
    { href: "/dashboard/patient/profile", label: "Profile" },
  ],
};
