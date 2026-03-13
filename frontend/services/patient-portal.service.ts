import { apiClient } from "@/services/api-client";
import type { DownloadableMedicalReport, MedicalReport, MedicalReportCategory } from "@/types/report";
import type { PatientVitalRecord } from "@/types/vitals";

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string | null;
  gender?: string | null;
}

type ApiVitals = PatientVitalRecord;

interface ApiHistoryAppointment {
  id: string;
  date: string;
  reason?: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  doctor?: {
    id: string;
    name: string;
    specialization?: string | null;
    department?: string | null;
  } | null;
}

interface ApiHistoryPrescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
    specialization?: string | null;
  } | null;
}

interface ApiVisitNote {
  id: string;
  diagnosis: string;
  notes?: string | null;
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
    specialization?: string | null;
  } | null;
  appointment?: {
    id: string;
    date: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  } | null;
}

export interface PatientHistory {
  patient: PatientProfile;
  appointments: ApiHistoryAppointment[];
  prescriptions: ApiHistoryPrescription[];
  vitals: ApiVitals[];
  visitNotes: ApiVisitNote[];
  reports: MedicalReport[];
}

interface ReportPayload {
  title: string;
  category: MedicalReportCategory;
  fileName: string;
  mimeType: string;
  fileData: string;
  notes?: string;
}

export const patientPortalService = {
  getProfile: (): Promise<PatientProfile> => apiClient.get<PatientProfile>("/patient/profile"),

  updateProfile: (payload: Partial<Pick<PatientProfile, "phone" | "address" | "dateOfBirth" | "gender">>): Promise<PatientProfile> =>
    apiClient.patch<PatientProfile>("/patient/profile", payload),

  getVitals: (): Promise<PatientVitalRecord[]> => apiClient.get<PatientVitalRecord[]>("/patient/vitals"),

  getHistory: async (): Promise<PatientHistory> => {
    const data = await apiClient.get<{
      patient: PatientProfile;
      appointments: ApiHistoryAppointment[];
      prescriptions: ApiHistoryPrescription[];
      vitals: ApiVitals[];
      visitNotes: ApiVisitNote[];
      reports: MedicalReport[];
    }>("/patient/history");

    return {
      ...data,
      vitals: data.vitals,
    };
  },

  getReports: (): Promise<MedicalReport[]> => apiClient.get<MedicalReport[]>("/patient/reports"),

  uploadReport: (payload: ReportPayload): Promise<MedicalReport> => apiClient.post<MedicalReport>("/patient/reports", payload),

  downloadReport: (reportId: string): Promise<DownloadableMedicalReport> =>
    apiClient.get<DownloadableMedicalReport>(`/patient/reports/${reportId}/download`),
};
