import { apiClient } from "@/services/api-client";
import type { Patient } from "@/types/patient";

interface ApiPatientUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT";
  patientProfile: {
    id: string;
    phone: string;
    address: string;
    dateOfBirth?: string | null;
    gender?: string | null;
  } | null;
}

interface PatientPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
  password?: string;
}

function mapPatient(user: ApiPatientUser): Patient {
  return {
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.patientProfile?.phone || "",
    address: user.patientProfile?.address || "",
  };
}

export const patientsService = {
  list: async (): Promise<Patient[]> => {
    const users = await apiClient.get<ApiPatientUser[]>("/admin/users?role=PATIENT");
    return users.map(mapPatient);
  },

  create: async (payload: PatientPayload): Promise<Patient> => {
    const created = await apiClient.post<ApiPatientUser>("/admin/users", {
      name: payload.name,
      email: payload.email,
      password: payload.password || "ChangeMe123!",
      role: "PATIENT",
      phone: payload.phone,
      address: payload.address,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
    });

    return mapPatient(created);
  },

  update: async (id: string, payload: Omit<PatientPayload, "password">): Promise<Patient> => {
    const updated = await apiClient.patch<ApiPatientUser>(`/admin/users/${id}`, {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
    });

    return mapPatient(updated);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean }>(`/admin/users/${id}`);
  },
};
