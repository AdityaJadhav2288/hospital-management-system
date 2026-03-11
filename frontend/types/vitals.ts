export interface VitalsRecord {
  id: string;
  heightCm?: number | null;
  weightKg?: number | null;
  bloodPressure?: string | null;
  pulseRate?: number | null;
  temperatureC?: number | null;
  notes?: string | null;
  recordedAt: string;
}
