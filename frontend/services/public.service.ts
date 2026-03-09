import { apiClient } from "@/services/api-client";
import type { BloodStock } from "@/types/blood-stock";
import type { Department } from "@/types/department";
import type { Doctor } from "@/types/doctor";
import type { HealthPackage } from "@/types/health-package";

interface HospitalStats {
  beds: number;
  doctors: number;
  patientsServed: number;
}

function isDefinedDoctorRecord(
  item: Parameters<typeof mapDoctor>[0] | null,
): item is Parameters<typeof mapDoctor>[0] {
  return Boolean(item);
}

function mapDoctor(item: {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  phone: string;
  department: string;
  profileImage: string;
  bio?: string | null;
}): Doctor {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    specialization: item.specialization,
    experienceYears: item.experience,
    phone: item.phone,
    department: item.department,
    profileImage: item.profileImage,
    bio: item.bio,
  };
}

export const publicService = {
  getDoctors: async (specialty?: string): Promise<Doctor[]> => {
    const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : "";
    const data = await apiClient.get<Array<Parameters<typeof mapDoctor>[0] | null>>(`/doctors${query}`, { auth: false });
    return (data ?? []).filter(isDefinedDoctorRecord).map((item) => mapDoctor(item));
  },

  getDepartments: (): Promise<Department[]> => apiClient.get<Department[]>("/public/departments", { auth: false }),

  getPackages: (category?: string): Promise<HealthPackage[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiClient.get<HealthPackage[]>(`/public/packages${query}`, { auth: false });
  },

  getBloodStock: (): Promise<BloodStock[]> => apiClient.get<BloodStock[]>("/public/blood-stock", { auth: false }),

  getStats: (): Promise<HospitalStats> => apiClient.get<HospitalStats>("/public/stats", { auth: false }),
};
