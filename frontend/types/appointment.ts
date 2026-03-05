import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  dateTime: string;
  status: AppointmentStatus;
  reason: string;
}

export interface AppointmentFormPayload {
  doctorId: string;
  dateTime: string;
  reason: string;
}

export interface DoctorWithPatients extends Doctor {
  todayPatients: Patient[];
}
