import { apiClient } from "@/services/api-client";
import type { MedicalReport } from "@/types/report";

interface ApiDoctorPatient {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface DoctorPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface DoctorPatientHistory {
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  vitals: Array<{
    id: string;
    heightCm?: number | null;
    weightKg?: number | null;
    bloodPressure?: string | null;
    pulseRate?: number | null;
    temperatureC?: number | null;
    notes?: string | null;
    recordedAt: string;
  }>;
  prescriptions: Array<{
    id: string;
    medication: string;
    dosage: string;
    instructions: string;
    createdAt: string;
  }>;
  appointments: Array<{
    id: string;
    date: string;
    reason?: string | null;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  }>;
  visitNotes: Array<{
    id: string;
    diagnosis: string;
    notes?: string | null;
    createdAt: string;
    appointmentId?: string | null;
  }>;
  reports: MedicalReport[];
}

export interface CreatePrescriptionPayload {
  patientId: string;
  appointmentId?: string;
  medication: string;
  dosage: string;
  instructions: string;
}

export interface CreateVitalsPayload {
  patientId: string;
  heightCm?: number;
  weightKg?: number;
  bloodPressure?: string;
  pulseRate?: number;
  temperatureC?: number;
  notes?: string;
}

export interface CreateVisitNotePayload {
  patientId: string;
  appointmentId?: string;
  diagnosis: string;
  notes?: string;
}

export interface DoctorAppointmentQueueItem {
  id: string;
  date: string;
  reason?: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  visitNotes: Array<{ id: string }>;
  patient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  } | null;
}

export const doctorPortalService = {
  getPatients: async (): Promise<DoctorPatient[]> => {
    const data = await apiClient.get<Array<ApiDoctorPatient | null>>("/doctor/patients");

    return (data ?? [])
      .filter((item): item is ApiDoctorPatient => Boolean(item))
      .map((item) => ({
        id: item.id,
        name: item.name || "Patient",
        email: item.email || "",
        phone: item.phone || "",
        address: item.address || "",
      }));
  },

  getPatientHistory: (patientId: string): Promise<DoctorPatientHistory> =>
    apiClient.get<DoctorPatientHistory>(`/doctor/patients/${patientId}/history`),

  getTodayAppointments: (): Promise<DoctorAppointmentQueueItem[]> =>
    apiClient.get<DoctorAppointmentQueueItem[]>("/doctor/appointments/today"),

  createPrescription: (payload: CreatePrescriptionPayload) => apiClient.post("/doctor/prescriptions", payload),

  createVitals: (payload: CreateVitalsPayload) => apiClient.post("/doctor/vitals", payload),

  createVisitNote: (payload: CreateVisitNotePayload) => apiClient.post("/doctor/visit-notes", payload),
};
