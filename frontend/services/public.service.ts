import { apiClient } from "@/services/api-client";
import type { BloodStock } from "@/types/blood-stock";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import type { HealthPackage } from "@/types/health-package";

interface ApiPublicDoctor {
  id: string;
  specialty: string;
  experienceYears: number;
  bio?: string | null;
  imageUrl?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  department?: {
    id: string;
    name: string;
  } | null;
}

interface HospitalStats {
  beds: number;
  doctors: number;
  patientsServed: number;
}

function mapDoctor(item: ApiPublicDoctor): Doctor {
  return {
    id: item.id,
    userId: item.user.id,
    name: item.user.name,
    email: item.user.email,
    specialization: item.specialty,
    experienceYears: item.experienceYears,
  };
}

export const publicService = {
  getDoctors: async (specialty?: string): Promise<Doctor[]> => {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : "";
    const data = await apiClient.get<ApiPublicDoctor[]>(`/public/doctors${query}`, { auth: false });
    return data.map(mapDoctor);
  },

  getDepartments: (): Promise<Department[]> => apiClient.get<Department[]>("/public/departments", { auth: false }),

  getPackages: (category?: string): Promise<HealthPackage[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiClient.get<HealthPackage[]>(`/public/packages${query}`, { auth: false });
  },

  getBloodStock: (): Promise<BloodStock[]> => apiClient.get<BloodStock[]>("/public/blood-stock", { auth: false }),

  getStats: (): Promise<HospitalStats> => apiClient.get<HospitalStats>("/public/stats", { auth: false }),
};
