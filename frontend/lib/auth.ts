import { ROLE_KEY, TOKEN_KEY } from "@/config/app";
import type { UserRole } from "@/types/role";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem(ROLE_KEY);
  if (role === "admin" || role === "doctor" || role === "patient") return role;
  return null;
}

export function setRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

export function clearRole(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_KEY);
}
