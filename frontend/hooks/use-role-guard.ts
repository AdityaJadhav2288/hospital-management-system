"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultDashboardByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/dashboard/admin")) {
        router.replace("/login/admin");
        return;
      }
      if (pathname.startsWith("/doctor/dashboard") || pathname.startsWith("/dashboard/doctor")) {
        router.replace("/login/doctor");
        return;
      }
      if (pathname.startsWith("/patient/dashboard") || pathname.startsWith("/dashboard/patient")) {
        router.replace("/login/patient");
        return;
      }

      router.replace("/login");
      return;
    }

    const adminPath = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/dashboard/admin");
    const doctorPath = pathname.startsWith("/doctor/dashboard") || pathname.startsWith("/dashboard/doctor");
    const patientPath = pathname.startsWith("/patient/dashboard") || pathname.startsWith("/dashboard/patient");

    if (adminPath && user.role !== "admin") {
      router.replace(defaultDashboardByRole[user.role]);
    }
    if (doctorPath && user.role !== "doctor") {
      router.replace(defaultDashboardByRole[user.role]);
    }
    if (patientPath && user.role !== "patient") {
      router.replace(defaultDashboardByRole[user.role]);
    }
  }, [pathname, router, token, user]);

  return { token, user };
}
