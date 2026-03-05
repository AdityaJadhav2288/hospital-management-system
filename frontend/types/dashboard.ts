export interface AdminMetrics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalDepartments?: number;
  bloodUnits?: number;
  revenue: number;
  revenueSeries: Array<{ month: string; value: number }>;
  appointmentSeries: Array<{ name: string; value: number }>;
}

export interface DoctorMetrics {
  todaysAppointments: number;
  totalPatients: number;
  pendingPrescriptions: number;
}

export interface PatientMetrics {
  upcomingAppointments: number;
  activePrescriptions: number;
  totalVisits: number;
}
