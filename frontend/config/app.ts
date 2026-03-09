export const APP_NAME = "MediCore HMS";
export const TOKEN_KEY = "hms_access_token";
export const ROLE_KEY = "hms_user_role";

function normalizeApiBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function resolveApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeApiBaseUrl(configuredBaseUrl);
  }

  if (typeof window === "undefined") {
    return "http://localhost:5000/api/v1";
  }

  const { hostname, origin } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api/v1";
  }

  return `${origin}/api/v1`;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const PAGE_SIZE = 8;
