export const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
