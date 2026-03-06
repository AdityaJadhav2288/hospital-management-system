import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { BookAppointmentInput, UpdatePatientProfileInput } from "../utils/validation";

export class PatientService {
  public static async getDashboardMetrics(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

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
    return prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        email: true,
        experience: true,
        phone: true,
        department: true,
        profileImage: true,
        bio: true,
      },
      orderBy: { name: "asc" },
    });
  }

  public static async bookAppointment(patientId: string, payload: BookAppointmentInput) {
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: payload.doctorId } }),
    ]);

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

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
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            experience: true,
            department: true,
            profileImage: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  public static async getOwnAppointments(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { date: "asc" },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            experience: true,
            phone: true,
            department: true,
            profileImage: true,
          },
        },
      },
    });
  }

  public static async getOwnProfile(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
      },
    });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return patient;
  }

  public static async updateOwnProfile(patientId: string, payload: UpdatePatientProfileInput) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.patient.update({
      where: { id: patientId },
      data: payload,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dateOfBirth: true,
        gender: true,
        createdAt: true,
      },
    });
  }

  public static async listOwnPrescriptions(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.prescription.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            department: true,
            profileImage: true,
          },
        },
        appointment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async listOwnVitals(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.vitals.findMany({
      where: { patientId: patient.id },
      orderBy: { recordedAt: "desc" },
    });
  }
}
