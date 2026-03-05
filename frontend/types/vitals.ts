export interface VitalsRecord {
  id: string;
  heightCm?: number | null;
  weightKg?: number | null;
  bloodPressure?: string | null;
  pulseRate?: number | null;
  recordedAt: string;
}
