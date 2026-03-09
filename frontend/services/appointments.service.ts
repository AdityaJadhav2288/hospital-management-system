import { PAGE_SIZE } from "@/config/app";
import { getRole } from "@/lib/auth";
import { apiClient } from "@/services/api-client";
import type { PaginatedResponse } from "@/types/api";
import type { Appointment, AppointmentFormPayload, AppointmentStatus } from "@/types/appointment";
import type { Doctor } from "@/types/doctor";

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
    id: string;
    name?: string;
    email?: string;
    specialization?: string;
    experience?: number;
    department?: string;
    profileImage?: string;
    user?: { name?: string };
  };
  patient?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    user?: { name?: string };
  };
}

interface ApiDoctorRecord {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  phone: string;
  department: string;
  profileImage: string;
  bio?: string | null;
}

function isDefinedDoctorRecord(item: ApiDoctorRecord | null): item is ApiDoctorRecord {
  return Boolean(item);
}

function mapAppointment(item: ApiAppointment): Appointment {
  return {
    id: item.id,
    patientName: item.patient?.name || item.patient?.user?.name || "Unknown Patient",
    doctorName: item.doctor?.name || item.doctor?.user?.name || "Assigned Doctor",
    dateTime: item.date,
    status: item.status,
    reason: item.reason || "Consultation",
  };
}

function mapDoctor(item: ApiDoctorRecord): Doctor {
  return {
    id: item.id,
    name: item.name,
    email: item.email,
    specialization: item.specialization,
    experienceYears: item.experience,
    phone: item.phone,
    department: item.department,
    profileImage: item.profileImage,
    bio: item.bio,
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

  listDoctors: async (): Promise<Doctor[]> => {
    const doctors = await apiClient.get<Array<ApiDoctorRecord | null>>("/doctors", { auth: false });
    return (doctors ?? []).filter(isDefinedDoctorRecord).map((doctor) => mapDoctor(doctor));
  },
};
