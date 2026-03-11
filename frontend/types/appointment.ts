import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  doctorName: string;
  dateTime: string;
  status: AppointmentStatus;
  reason: string;
  doctorSpecialization?: string;
  doctorDepartment?: string;
  doctorPhone?: string;
  patientPhone?: string;
  patientEmail?: string;
  hasVisitNotes?: boolean;
  doctor?: Doctor;
  patient?: Patient;
}

export interface AppointmentFormPayload {
  doctorId: string;
  dateTime: string;
  reason: string;
  patientId?: string;
  time?: string;
}

export interface DoctorWithPatients extends Doctor {
  todayPatients: Patient[];
}
