import { apiClient } from "@/services/api-client";
import type { AdminMetrics, DoctorMetrics, PatientMetrics } from "@/types/dashboard";

export const dashboardService = {
  getAdminMetrics: (): Promise<AdminMetrics> => apiClient.get<AdminMetrics>("/admin/dashboard"),
  getDoctorMetrics: (): Promise<DoctorMetrics> => apiClient.get<DoctorMetrics>("/doctor/dashboard"),
  getPatientMetrics: (): Promise<PatientMetrics> => apiClient.get<PatientMetrics>("/patient/dashboard"),
};
