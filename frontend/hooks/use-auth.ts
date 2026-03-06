"use client";

import { useRouter } from "next/navigation";
import {
  clearAuthCookies,
  clearRole,
  clearToken,
  sanitizeInternalRedirect,
  setAuthCookies,
  setRole,
  setToken,
} from "@/lib/auth";
import { defaultDashboardByRole } from "@/lib/routes";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const { hydrated, user, token, setSession, clearSession } = useAuthStore();

  const login = async (payload: LoginPayload, redirect?: string | null) => {
    const response = await authService.login(payload);
    const destination = sanitizeInternalRedirect(redirect) || defaultDashboardByRole[response.user.role];

    setToken(response.token);
    setRole(response.user.role);
    setAuthCookies(response.token, response.user.role);
    setSession(response.token, response.user);

    if (typeof window !== "undefined") {
      window.location.assign(destination);
      return response;
    }

    router.replace(destination);

    return response;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await authService.register(payload);

    clearToken();
    clearRole();
    clearAuthCookies();
    clearSession();
    router.replace("/login/patient");
    return response;
  };

  const logout = () => {
    clearToken();
    clearRole();
    clearAuthCookies();
    clearSession();
    router.replace("/login");
  };

  return { hydrated, user, token, login, register, logout };
}
