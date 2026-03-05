import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { BookAppointmentInput, UpdatePatientProfileInput } from "../utils/validation";

export class PatientService {
  public static async getDashboardMetrics(userId: string) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    const [upcomingAppointments, totalVisits, activePrescriptions] = await Promise.all([
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          date: { gte: new Date() },
        },
      }),
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          date: { lt: new Date() },
        },
      }),
      prisma.prescription.count({ where: { patientId: patient.id } }),
    ]);

    return {
      upcomingAppointments,
      activePrescriptions,
      totalVisits,
    };
  }

  public static async getDoctors() {
    return prisma.doctorProfile.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        department: true,
      },
      orderBy: {
        user: { name: "asc" },
      },
    });
  }

  public static async bookAppointment(userId: string, payload: BookAppointmentInput) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    const doctor = await prisma.doctorProfile.findUnique({ where: { id: payload.doctorId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor not found");
    }

    return prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        date: payload.date,
        reason: payload.reason,
      },
    });
  }

  public static async getOwnAppointments(userId: string) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { date: "asc" },
      include: {
        doctor: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            department: true,
          },
        },
      },
    });
  }

  public static async getOwnProfile(userId: string) {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return patient;
  }

  public static async updateOwnProfile(userId: string, payload: UpdatePatientProfileInput) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.patientProfile.update({
      where: { userId },
      data: payload,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }

  public static async listOwnPrescriptions(userId: string) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            department: true,
          },
        },
        appointment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async listOwnVitals(userId: string) {
    const patient = await prisma.patientProfile.findUnique({ where: { userId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.vitals.findMany({
      where: { patientId: patient.id },
      include: {
        recordedByDoctor: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { recordedAt: "asc" },
    });
  }
}
