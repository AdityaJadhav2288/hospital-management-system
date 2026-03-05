import { API_BASE_URL } from "@/config/app";
import { getToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

type ErrorPayload = {
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await response.json()) as ApiResponse<T> | ErrorPayload) : null;

  if (!response.ok) {
    const errorPayload = payload as ErrorPayload | null;
    let message = errorPayload?.message || `Request failed with status ${response.status}`;

    const fieldErrors = errorPayload?.errors;
    if (fieldErrors) {
      const firstErrorEntry = Object.values(fieldErrors).find(
        (value): value is string[] => Array.isArray(value) && value.length > 0,
      );
      if (firstErrorEntry) {
        message = `${message}: ${firstErrorEntry[0]}`;
      }
    }

    throw new Error(message);
  }

  return (payload as ApiResponse<T>).data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};

export function resolveApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred.";
}
