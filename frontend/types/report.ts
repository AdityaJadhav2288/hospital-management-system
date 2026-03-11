export type MedicalReportCategory = "LAB_REPORT" | "X_RAY" | "MRI" | "BLOOD_TEST" | "OTHER";

export interface MedicalReport {
  id: string;
  title: string;
  category: MedicalReportCategory;
  fileName: string;
  mimeType: string;
  notes?: string | null;
  createdAt: string;
}

export interface DownloadableMedicalReport extends MedicalReport {
  fileData: string;
}
