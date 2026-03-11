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

/* SAFE DOCTOR MAPPER */

function mapDoctor(item: any): Doctor {
  return {
    id: item?.id || `doctor-${item?.email || item?.name || "unknown"}`,
    name: item?.name || "Doctor",
    email: item?.email || "",
    specialization: item?.specialization || "General Specialist",
    experienceYears: item?.experience ?? item?.experienceYears ?? 0,
    phone: item?.phone || "",
    department: item?.department || "",
    profileImage: item?.profileImage || "",
    bio: item?.bio || "",
  };
}

export const publicService = {

  /* SAFE DOCTOR FETCH */

  getDoctors: async (specialty?: string): Promise<Doctor[]> => {

    const query = specialty
      ? `?specialty=${encodeURIComponent(specialty)}`
      : "";

    const response = await apiClient.get<any>(`/doctors${query}`, {
      auth: false,
    });

    let doctors: any = response;

    /* HANDLE DIFFERENT API FORMATS */

    if (response?.data) doctors = response.data;
    if (response?.doctors) doctors = response.doctors;

    if (!Array.isArray(doctors)) return [];

    return doctors
      .filter((d) => d && typeof d === "object")
      .map(mapDoctor);
  },

  /* DEPARTMENTS */

  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<any>("/public/departments", {
      auth: false,
    });

    if (!Array.isArray(response)) return [];

    return response.filter(Boolean);
  },

  /* HEALTH PACKAGES */

  getPackages: async (category?: string): Promise<HealthPackage[]> => {
    const query = category
      ? `?category=${encodeURIComponent(category)}`
      : "";

    const response = await apiClient.get<any>(`/public/packages${query}`, {
      auth: false,
    });

    if (!Array.isArray(response)) return [];

    return response.filter(Boolean);
  },

  /* BLOOD STOCK */

  getBloodStock: async (): Promise<BloodStock[]> => {
    const response = await apiClient.get<any>("/public/blood-stock", {
      auth: false,
    });

    if (!Array.isArray(response)) return [];

    return response.filter(Boolean);
  },

  /* HOSPITAL STATS */

  getStats: async (): Promise<HospitalStats> => {
    const response = await apiClient.get<any>("/public/stats", {
      auth: false,
    });

    return {
      beds: response?.beds ?? 0,
      doctors: response?.doctors ?? 0,
      patientsServed: response?.patientsServed ?? 0,
    };
  },
};
