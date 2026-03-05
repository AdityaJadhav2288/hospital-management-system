import type { UserRole } from "@/types/role";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export type RegisterRole = "ADMIN" | "DOCTOR" | "PATIENT";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: RegisterRole;
}
