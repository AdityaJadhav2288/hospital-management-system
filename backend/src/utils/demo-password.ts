import { Role } from "../constants/role";

export function buildDemoPassword(role: "DOCTOR" | "PATIENT", userId: string) {
  const suffix = userId.slice(-6).toUpperCase();
  return role === Role.DOCTOR ? `Doc@${suffix}` : `Pat@${suffix}`;
}
