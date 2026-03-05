import { PAGE_SIZE } from "@/config/app";
import { getRole } from "@/lib/auth";
import { apiClient } from "@/services/api-client";
import type { PaginatedResponse } from "@/types/api";
import type { Appointment, AppointmentFormPayload, AppointmentStatus } from "@/types/appointment";

interface AppointmentQuery {
  search?: string;
  status?: AppointmentStatus | "all";
  page?: number;
  pageSize?: number;
}

interface ApiAppointment {
  id: string;
  date: string;
  reason?: string | null;
  status: AppointmentStatus;
  doctor?: {
    user?: { name?: string };
  };
  patient?: {
    user?: { name?: string };
  };
}

interface ApiDoctorOption {
  id: string;
  specialty: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function mapAppointment(item: ApiAppointment): Appointment {
  return {
    id: item.id,
    patientName: item.patient?.user?.name || "Unknown Patient",
    doctorName: item.doctor?.user?.name || "Unknown Doctor",
    dateTime: item.date,
    status: item.status,
    reason: item.reason || "Consultation",
  };
}

function routeByRole(): string {
  const role = getRole();
  if (role === "admin") return "/admin/appointments";
  if (role === "doctor") return "/doctor/appointments";
  return "/patient/appointments";
}

export const appointmentsService = {
  list: async (query: AppointmentQuery): Promise<PaginatedResponse<Appointment>> => {
    const source = await apiClient.get<ApiAppointment[]>(routeByRole());

    let rows = source.map(mapAppointment);

    if (query.search) {
      const term = query.search.toLowerCase();
      rows = rows.filter(
        (item) =>
          item.patientName.toLowerCase().includes(term) ||
          item.doctorName.toLowerCase().includes(term) ||
          item.reason.toLowerCase().includes(term),
      );
    }

    if (query.status && query.status !== "all") {
      rows = rows.filter((item) => item.status === query.status);
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? PAGE_SIZE;
    const start = (page - 1) * pageSize;

    return {
      items: rows.slice(start, start + pageSize),
      total: rows.length,
      page,
      pageSize,
    };
  },

  book: async (payload: AppointmentFormPayload): Promise<Appointment> => {
    const created = await apiClient.post<ApiAppointment>("/patient/appointments", {
      doctorId: payload.doctorId,
      date: payload.dateTime,
      reason: payload.reason,
    });

    return mapAppointment(created);
  },

  updateStatus: async (appointmentId: string, status: Exclude<AppointmentStatus, "PENDING">): Promise<void> => {
    await apiClient.patch(`/doctor/appointments/${appointmentId}/status`, { status });
  },

  listDoctorOptions: async (): Promise<Array<{ id: string; label: string }>> => {
    const doctors = await apiClient.get<ApiDoctorOption[]>("/patient/doctors");
    return doctors.map((doctor) => ({
      id: doctor.id,
      label: `${doctor.user.name} (${doctor.specialty})`,
    }));
  },
};
