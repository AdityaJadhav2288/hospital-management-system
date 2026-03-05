import { AppointmentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreatePrescriptionInput, CreateVitalsInput } from "../utils/validation";

export class DoctorService {
  public static async getDashboardMetrics(userId: string) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const [todaysAppointments, uniquePatients, pendingAppointments] = await Promise.all([
      prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        select: { patientId: true },
        distinct: ["patientId"],
      }),
      prisma.appointment.count({
        where: { doctorId: doctor.id, status: AppointmentStatus.PENDING },
      }),
    ]);

    return {
      todaysAppointments,
      totalPatients: uniquePatients.length,
      pendingPrescriptions: pendingAppointments,
    };
  }

  public static async getOwnAppointments(userId: string) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    return prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      orderBy: { date: "asc" },
      include: {
        patient: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  }

  public static async updateAppointmentStatus(userId: string, appointmentId: string, status: AppointmentStatus) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });

    if (!appointment) {
      throw new AppError(StatusCodes.NOT_FOUND, "Appointment not found");
    }

    if (appointment.doctorId !== doctor.id) {
      throw new AppError(StatusCodes.FORBIDDEN, "Cannot modify this appointment");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  public static async getPatientList(userId: string) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const rows = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: { patientId: true },
      distinct: ["patientId"],
    });

    return prisma.patientProfile.findMany({
      where: {
        id: {
          in: rows.map((row) => row.patientId),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { user: { name: "asc" } },
    });
  }

  public static async getPatientHistory(userId: string, patientId: string) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
    }

    const linkedAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        patientId: patient.id,
      },
      select: { id: true },
    });

    if (!linkedAppointment) {
      throw new AppError(StatusCodes.FORBIDDEN, "Patient is not linked to this doctor");
    }

    const [appointments, prescriptions, vitals] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          patientId: patient.id,
        },
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          reason: true,
          status: true,
        },
      }),
      prisma.prescription.findMany({
        where: {
          doctorId: doctor.id,
          patientId: patient.id,
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          medication: true,
          dosage: true,
          instructions: true,
          createdAt: true,
        },
      }),
      prisma.vitals.findMany({
        where: {
          patientId: patient.id,
        },
        orderBy: { recordedAt: "desc" },
        select: {
          id: true,
          heightCm: true,
          weightKg: true,
          bloodPressure: true,
          pulseRate: true,
          recordedAt: true,
        },
      }),
    ]);

    return {
      patient: {
        id: patient.id,
        name: patient.user.name,
        email: patient.user.email,
        phone: patient.phone,
        address: patient.address,
      },
      appointments,
      prescriptions,
      vitals,
    };
  }

  public static async createPrescription(userId: string, payload: CreatePrescriptionInput) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const patient = await prisma.patientProfile.findUnique({ where: { id: payload.patientId } });
    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
    }

    if (payload.appointmentId) {
      const appointment = await prisma.appointment.findUnique({ where: { id: payload.appointmentId } });
      if (!appointment || appointment.doctorId !== doctor.id || appointment.patientId !== patient.id) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid appointment for prescription");
      }
    }

    return prisma.prescription.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        appointmentId: payload.appointmentId,
        medication: payload.medication,
        dosage: payload.dosage,
        instructions: payload.instructions,
      },
    });
  }

  public static async listPrescriptions(userId: string) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    return prisma.prescription.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  public static async createVitals(userId: string, payload: CreateVitalsInput) {
    const doctor = await prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    const patient = await prisma.patientProfile.findUnique({ where: { id: payload.patientId } });
    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
    }

    return prisma.vitals.create({
      data: {
        patientId: patient.id,
        recordedByDoctorId: doctor.id,
        heightCm: payload.heightCm,
        weightKg: payload.weightKg,
        bloodPressure: payload.bloodPressure,
        pulseRate: payload.pulseRate,
        notes: payload.notes,
      },
    });
  }
}
