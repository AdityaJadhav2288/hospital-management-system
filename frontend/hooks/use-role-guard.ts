"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultDashboardByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated, token, user } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    const adminPath = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/dashboard/admin");
    const doctorPath = pathname.startsWith("/doctor/dashboard") || pathname.startsWith("/dashboard/doctor");
    const patientPath = pathname.startsWith("/patient/dashboard") || pathname.startsWith("/dashboard/patient");

    if (!token || !user) {
      const loginPath = adminPath ? "/login/admin" : doctorPath ? "/login/doctor" : patientPath ? "/login/patient" : "/login";
      router.replace(`${loginPath}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (adminPath && user.role !== "admin") {
      router.replace(defaultDashboardByRole[user.role]);
    }
    if (doctorPath && user.role !== "doctor") {
      router.replace(defaultDashboardByRole[user.role]);
    }
    if (patientPath && user.role !== "patient") {
      router.replace(defaultDashboardByRole[user.role]);
    }
  }, [hydrated, pathname, router, token, user]);

  return { hydrated, token, user };
}
