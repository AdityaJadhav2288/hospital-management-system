import { getRole } from "@/lib/auth";
import { apiClient } from "@/services/api-client";
import type { Prescription } from "@/types/prescription";

interface ApiPrescription {
  id: string;
  medication?: string | null;
  dosage?: string | null;
  instructions?: string | null;
  createdAt?: string | null;
  doctor?: {
    name?: string | null;
    specialization?: string | null;
    department?: string | null;
    user?: { name?: string | null };
  } | null;
  patient?: {
    name?: string | null;
    dateOfBirth?: string | null;
    user?: { name?: string | null };
  } | null;
  appointment?: {
    id?: string | null;
    date?: string | null;
    reason?: string | null;
    visitNotes?: Array<{ diagnosis?: string | null } | null> | null;
  } | null;
}

function calculateAge(dateOfBirth?: string | null): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function parseInstructionMeta(instructions: string) {
  const normalized = instructions.trim();
  if (!normalized) {
    return {
      frequency: "As directed",
      duration: "Until review",
    };
  }

  const durationMatch = normalized.match(/(\d+\s*(?:day|days|week|weeks|month|months))/i);
  const frequencyMatch = normalized.match(
    /(once daily|twice daily|thrice daily|morning\/night|morning and night|before meals|after meals|every \d+ hours?)/i,
  );

  return {
    frequency: frequencyMatch?.[0] || "As directed",
    duration: durationMatch?.[0] || "Until review",
  };
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
      .map((item) => {
        const instructions = item.instructions || "";
        const instructionMeta = parseInstructionMeta(instructions);

        return {
          id: item.id,
          patientName: item.patient?.name || item.patient?.user?.name || "Unknown Patient",
          patientAge: calculateAge(item.patient?.dateOfBirth),
          doctorName: item.doctor?.name || item.doctor?.user?.name || "Unknown Doctor",
          doctorSpecialization: item.doctor?.specialization || null,
          doctorDepartment: item.doctor?.department || null,
          diagnosis:
            item.appointment?.visitNotes?.find((note) => note?.diagnosis)?.diagnosis ||
            item.appointment?.reason ||
            "General medical consultation",
          medication: item.medication || "Medication",
          dosage: item.dosage || "N/A",
          instructions,
          issuedAt: item.createdAt || new Date().toISOString(),
          hospitalName: "MediCore Hospital",
          medicines: [
            {
              name: item.medication || "Medication",
              dosage: item.dosage || "N/A",
              frequency: instructionMeta.frequency,
              duration: instructionMeta.duration,
            },
          ],
        };
      });
  },
};
