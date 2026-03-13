export interface AdminMetrics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedVisits: number;
  totalDepartments?: number;
  bloodUnits?: number;
  revenue: number;
  revenueSeries: Array<{ month: string; value: number }>;
  appointmentSeries: Array<{ name: string; value: number }>;
}

export interface DoctorScheduleItem {
  id: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  reason?: string | null;
  patient?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  } | null;
}

export interface DoctorMetrics {
  todaysAppointments: number;
  totalPatients: number;
  pendingQueue: number;
  pendingPrescriptions: number;
  todaysSchedule: DoctorScheduleItem[];
}

export interface PatientDashboardPrescription {
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

export interface PatientDashboardVitals {
  id: string;
  patientId: string;
  bloodSugar?: number | null;
  heartRate?: number | null;
  cholesterol?: number | null;
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  bloodPressure?: string | null;
  temperatureC?: number | null;
  spo2?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  bmi?: number | null;
  notes?: string | null;
  recordedAt: string;
}

export interface PatientDashboardAppointment {
  id: string;
  date: string;
  reason?: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  doctor?: {
    id: string;
    name: string;
    specialization?: string | null;
    department?: string | null;
    phone?: string | null;
  } | null;
}

export interface PatientMetrics {
  upcomingAppointments: number;
  activePrescriptions: number;
  totalVisits: number;
  reportCount: number;
  nextAppointment?: PatientDashboardAppointment | null;
  latestVitals?: PatientDashboardVitals | null;
  recentPrescriptions: PatientDashboardPrescription[];
}
