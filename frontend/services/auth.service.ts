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
  };
}

function loginPathByRole(role: UserRole): string {
  if (role === "admin") return "/admin/login";
  if (role === "doctor") return "/doctor/login";
  return "/patient/login";
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const loginPath = loginPathByRole(payload.role);
    console.info("[authService.login] request", { role: payload.role, path: loginPath });

    let response: ApiAuthPayload;

    try {
      response = await apiClient.post<ApiAuthPayload>(
        loginPath,
        {
          email: payload.email,
          password: payload.password,
        },
        { auth: false },
      );
    } catch (error) {
      console.error("[authService.login] failed", { role: payload.role, path: loginPath, error });
      throw error;
    }

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
