export type VitalsRange = "today" | "week" | "month";

export interface PatientVitalRecord {
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
