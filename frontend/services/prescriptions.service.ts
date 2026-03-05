import { getRole } from "@/lib/auth";
import { apiClient } from "@/services/api-client";
import type { Prescription } from "@/types/prescription";

interface ApiPrescription {
  id: string;
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: string;
  doctor?: { user?: { name?: string } };
  patient?: { user?: { name?: string } };
}

function routeByRole(): string {
  const role = getRole();
  if (role === "doctor") return "/doctor/prescriptions";
  if (role === "patient") return "/patient/prescriptions";
  return "/doctor/prescriptions";
}

export const prescriptionsService = {
  list: async (): Promise<Prescription[]> => {
    const data = await apiClient.get<ApiPrescription[]>(routeByRole());
    return data.map((item) => ({
      id: item.id,
      patientName: item.patient?.user?.name || "Unknown Patient",
      doctorName: item.doctor?.user?.name || "Unknown Doctor",
      medication: item.medication,
      dosage: item.dosage,
      instructions: item.instructions,
      issuedAt: item.createdAt,
    }));
  },
};
