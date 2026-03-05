import { apiClient } from "@/services/api-client";

export interface DoctorPatient {
  id: string;
  phone: string;
  address: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
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
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
  }>;
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
  notes?: string;
}

export const doctorPortalService = {
  getPatients: (): Promise<DoctorPatient[]> => apiClient.get<DoctorPatient[]>("/doctor/patients"),

  getPatientHistory: (patientId: string): Promise<DoctorPatientHistory> =>
    apiClient.get<DoctorPatientHistory>(`/doctor/patients/${patientId}/history`),

  createPrescription: (payload: CreatePrescriptionPayload) => apiClient.post("/doctor/prescriptions", payload),

  createVitals: (payload: CreateVitalsPayload) => apiClient.post("/doctor/vitals", payload),
};
