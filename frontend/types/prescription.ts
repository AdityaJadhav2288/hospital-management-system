export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientAge?: number | null;
  doctorName: string;
  doctorSpecialization?: string | null;
  doctorDepartment?: string | null;
  diagnosis: string;
  medication: string;
  dosage: string;
  instructions: string;
  issuedAt: string;
  hospitalName: string;
  medicines: PrescriptionMedicine[];
}
