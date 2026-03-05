import { apiClient } from "@/services/api-client";
import type { Doctor } from "@/types/doctor";

interface ApiDoctorUser {
  id: string;
  name: string;
  email: string;
  role: "DOCTOR";
  doctorProfile: {
    id: string;
    specialty: string;
    experienceYears: number;
    departmentId?: string | null;
    bio?: string | null;
    imageUrl?: string | null;
  } | null;
}

interface DoctorPayload {
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  departmentId?: string;
  bio?: string;
  imageUrl?: string;
  password?: string;
}

function mapDoctor(user: ApiDoctorUser): Doctor {
  return {
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    specialization: user.doctorProfile?.specialty || "",
    experienceYears: user.doctorProfile?.experienceYears || 0,
  };
}

export const doctorsService = {
  list: async (specialization?: string): Promise<Doctor[]> => {
    const users = await apiClient.get<ApiDoctorUser[]>("/admin/users?role=DOCTOR");
    const doctors = users.map(mapDoctor);
    if (!specialization || specialization === "all") return doctors;
    return doctors.filter((doctor) => doctor.specialization === specialization);
  },

  create: async (payload: DoctorPayload): Promise<Doctor> => {
    const created = await apiClient.post<ApiDoctorUser>("/admin/users", {
      name: payload.name,
      email: payload.email,
      password: payload.password || "ChangeMe123!",
      role: "DOCTOR",
      specialty: payload.specialization,
      experienceYears: payload.experienceYears,
      departmentId: payload.departmentId,
      bio: payload.bio,
      imageUrl: payload.imageUrl,
    });

    return mapDoctor(created);
  },

  update: async (id: string, payload: Omit<DoctorPayload, "password">): Promise<Doctor> => {
    const updated = await apiClient.patch<ApiDoctorUser>(`/admin/users/${id}`, {
      name: payload.name,
      email: payload.email,
      specialty: payload.specialization,
      experienceYears: payload.experienceYears,
      departmentId: payload.departmentId,
      bio: payload.bio,
      imageUrl: payload.imageUrl,
    });

    return mapDoctor(updated);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean }>(`/admin/users/${id}`);
  },
};
