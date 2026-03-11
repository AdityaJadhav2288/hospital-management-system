import { getRole } from "@/lib/auth";
import { apiClient } from "@/services/api-client";
import type { Prescription } from "@/types/prescription";

interface ApiPrescription {
  id: string;
  medication?: string | null;
  dosage?: string | null;
  instructions?: string | null;
  createdAt?: string | null;
  doctor?: { name?: string | null; user?: { name?: string | null } } | null;
  patient?: { name?: string | null; user?: { name?: string | null } } | null;
}

function routeByRole(): string {
  const role = getRole();
  if (role === "doctor") return "/doctor/prescriptions";
  if (role === "patient") return "/patient/prescriptions";
  return "/doctor/prescriptions";
}

export const prescriptionsService = {
  list: async (): Promise<Prescription[]> => {
    const data = await apiClient.get<Array<ApiPrescription | null>>(routeByRole());

    return (data ?? [])
      .filter((item): item is ApiPrescription => Boolean(item))
      .map((item) => ({
        id: item.id,
        patientName: item.patient?.name || item.patient?.user?.name || "Unknown Patient",
        doctorName: item.doctor?.name || item.doctor?.user?.name || "Unknown Doctor",
        medication: item.medication || "Medication",
        dosage: item.dosage || "N/A",
        instructions: item.instructions || "",
        issuedAt: item.createdAt || new Date().toISOString(),
        doctorSpecialization: item.doctor?.name ? undefined : undefined,
      }));
  },
};
