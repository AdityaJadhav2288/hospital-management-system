import { apiClient } from "@/services/api-client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";
import type { UserRole } from "@/types/role";

interface ApiAuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
}

interface ApiAuthPayload {
  token: string;
  user: ApiAuthUser;
  demoPassword?: string;
}

const roleMap: Record<ApiAuthUser["role"], UserRole> = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

function toAuthResponse(payload: ApiAuthPayload): AuthResponse {
  return {
    token: payload.token,
    user: {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      role: roleMap[payload.user.role],
    },
    demoPassword: payload.demoPassword,
  };
}

function loginPathByRole(role: UserRole): string {
  if (role === "admin") return "/admin/login";
  if (role === "doctor") return "/doctor/login";
  return "/patient/login";
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiAuthPayload>(
      loginPathByRole(payload.role),
      {
        email: payload.email,
        password: payload.password,
      },
      { auth: false },
    );

    return toAuthResponse(response);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiAuthPayload>(
      "/patient/register",
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
        address: payload.address,
      },
      { auth: false },
    );

    return toAuthResponse(response);
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const response = await apiClient.get<ApiAuthUser>("/auth/me");
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      role: roleMap[response.role],
    };
  },
};
