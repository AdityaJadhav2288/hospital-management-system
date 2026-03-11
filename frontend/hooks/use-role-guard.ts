"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultDashboardByRole } from "@/lib/routes";
import { useAuthStore } from "@/store/auth-store";

export function useRoleGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hydrated, token, user } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;

    const adminPath = pathname.startsWith("/admin") || pathname.startsWith("/dashboard/admin");
    const doctorPath = pathname.startsWith("/doctor") || pathname.startsWith("/dashboard/doctor");
    const patientPath = pathname.startsWith("/patient") || pathname.startsWith("/dashboard/patient");
    const queryString = searchParams.toString();
    const redirectTarget = queryString ? `${pathname}?${queryString}` : pathname;

    if (!token || !user) {
      const loginPath = adminPath ? "/login/admin" : doctorPath ? "/login/doctor" : patientPath ? "/login/patient" : "/login";
      router.replace(`${loginPath}?redirect=${encodeURIComponent(redirectTarget)}`);
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
  }, [hydrated, pathname, router, searchParams, token, user]);

  return { hydrated, token, user };
}
