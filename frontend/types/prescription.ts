export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  medication: string;
  dosage: string;
  instructions: string;
  issuedAt: string;
  doctorSpecialization?: string;
}
