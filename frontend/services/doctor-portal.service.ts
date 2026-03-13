import { apiClient } from "@/services/api-client";
import type { MedicalReport } from "@/types/report";
import type { PatientVitalRecord } from "@/types/vitals";

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
  vitals: PatientVitalRecord[];
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
  recordedAt?: string;
  bloodSugar?: number;
  heartRate?: number;
  cholesterol?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  temperatureC?: number;
  spo2?: number;
  weightKg?: number;
  heightCm?: number;
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

  getPatientVitals: async (patientId: string): Promise<PatientVitalRecord[]> => {
    const response = await apiClient.get<{ vitals: PatientVitalRecord[] }>(`/vitals/${patientId}`);
    return response.vitals;
  },

  getTodayAppointments: (): Promise<DoctorAppointmentQueueItem[]> =>
    apiClient.get<DoctorAppointmentQueueItem[]>("/doctor/appointments/today"),

  createPrescription: (payload: CreatePrescriptionPayload) => apiClient.post("/doctor/prescriptions", payload),

  createVitals: (payload: CreateVitalsPayload) => apiClient.post("/vitals/add", payload),

  createVisitNote: (payload: CreateVisitNotePayload) => apiClient.post("/doctor/visit-notes", payload),
};
