import { apiClient } from "@/services/api-client";
import type { VitalsRecord } from "@/types/vitals";

export interface PatientProfile {
  id: string;
  phone: string;
  address: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ApiVitals {
  id: string;
  heightCm?: number | null;
  weightKg?: number | null;
  bloodPressure?: string | null;
  pulseRate?: number | null;
  recordedAt: string;
}

export const patientPortalService = {
  getProfile: (): Promise<PatientProfile> => apiClient.get<PatientProfile>("/patient/profile"),

  updateProfile: (payload: Partial<Pick<PatientProfile, "phone" | "address" | "dateOfBirth" | "gender">>): Promise<PatientProfile> =>
    apiClient.patch<PatientProfile>("/patient/profile", payload),

  getVitals: async (): Promise<VitalsRecord[]> => {
    const data = await apiClient.get<ApiVitals[]>("/patient/vitals");
    return data.map((item) => ({
      id: item.id,
      heightCm: item.heightCm,
      weightKg: item.weightKg,
      bloodPressure: item.bloodPressure,
      pulseRate: item.pulseRate,
      recordedAt: item.recordedAt,
    }));
  },
};
