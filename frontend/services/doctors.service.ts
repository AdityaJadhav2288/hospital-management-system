import { apiClient } from "@/services/api-client";
import type { Doctor } from "@/types/doctor";

interface ApiDoctorUser {
  id: string;
  name: string;
  email: string;
  role?: "DOCTOR";
  createdAt?: string;
  updatedAt?: string;
  demoPassword?: string;
  doctorProfile?: {
    id: string;
    specialty: string;
    experienceYears: number;
    phone: string;
    department: string;
    bio?: string | null;
    imageUrl: string;
  } | null;
}

interface DoctorPayload {
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
  phone?: string;
  department?: string;
  bio?: string;
  profileImage?: string;
  password?: string;
}

function mapDoctor(user: ApiDoctorUser): Doctor {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    specialization: user.doctorProfile?.specialty || "",
    experienceYears: user.doctorProfile?.experienceYears || 0,
    phone: user.doctorProfile?.phone || "",
    department: user.doctorProfile?.department || "",
    profileImage: user.doctorProfile?.imageUrl || "",
    bio: user.doctorProfile?.bio,
    demoPassword: user.demoPassword,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
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
      password: payload.password || "doctor123",
      role: "DOCTOR",
      specialization: payload.specialization,
      experienceYears: payload.experienceYears,
      phone: payload.phone || "0000000000",
      department: payload.department || payload.specialization,
      bio: payload.bio,
      profileImage:
        payload.profileImage ||
        `https://ui-avatars.com/api/?background=0f766e&color=ffffff&name=${encodeURIComponent(payload.name)}`,
    });

    return mapDoctor(created);
  },

  update: async (id: string, payload: Omit<DoctorPayload, "password">): Promise<Doctor> => {
    const updated = await apiClient.patch<ApiDoctorUser>(`/admin/users/${id}`, {
      name: payload.name,
      email: payload.email,
      specialization: payload.specialization,
      experienceYears: payload.experienceYears,
      phone: payload.phone,
      department: payload.department,
      bio: payload.bio,
      profileImage: payload.profileImage,
    });

    return mapDoctor(updated);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean }>(`/admin/users/${id}`);
  },

  resetPassword: async (id: string, password: string): Promise<void> => {
    await apiClient.patch<{ success: boolean }>(`/admin/users/${id}/password`, { password });
  },
};
