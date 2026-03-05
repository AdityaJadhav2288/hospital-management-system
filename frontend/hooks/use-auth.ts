"use client";

import { useRouter } from "next/navigation";
import { clearRole, clearToken, setRole, setToken } from "@/lib/auth";
import { defaultDashboardByRole } from "@/lib/routes";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import type { LoginPayload, RegisterPayload } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const { user, token, setSession, clearSession } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    if (payload.role !== response.user.role) {
      throw new Error(`This account is registered as ${response.user.role}. Please select that role.`);
    }

    setToken(response.token);
    setRole(response.user.role);
    setSession(response.token, response.user);
    router.push(defaultDashboardByRole[response.user.role]);
  };

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload);

    clearToken();
    clearRole();
    clearSession();

    const rolePath = payload.role.toLowerCase();
    router.push(`/login/${rolePath}`);
  };

  const logout = () => {
    clearToken();
    clearRole();
    clearSession();
    router.push("/login");
  };

  return { user, token, login, register, logout };
}
