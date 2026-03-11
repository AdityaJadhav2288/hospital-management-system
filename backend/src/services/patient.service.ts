import { StatusCodes } from "http-status-codes";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import {
  BookAppointmentInput,
  CreateMedicalReportInput,
  RescheduleAppointmentInput,
  UpdatePatientProfileInput,
} from "../utils/validation";

export class PatientService {
  public static async getDashboardMetrics(patientId: string) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    const [upcomingAppointments, totalVisits, activePrescriptions, nextAppointment, latestVitals, recentPrescriptions, reportCount] =
      await Promise.all([
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          date: { gte: new Date() },
          status: { not: AppointmentStatus.CANCELLED },
        },
      }),
      prisma.appointment.count({
        where: {
          patientId: patient.id,
          status: AppointmentStatus.COMPLETED,
        },
      }),
      prisma.prescription.count({ where: { patientId: patient.id } }),
      prisma.appointment.findFirst({
        where: {
          patientId: patient.id,
          date: { gte: new Date() },
          status: { not: AppointmentStatus.CANCELLED },
        },
        orderBy: { date: "asc" },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              department: true,
              phone: true,
            },
          },
        },
      }),
      prisma.vitals.findFirst({
        where: { patientId: patient.id },
        orderBy: { recordedAt: "desc" },
      }),
      prisma.prescription.findMany({
        where: { patientId: patient.id },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
        },
      }),
      prisma.medicalReport.count({ where: { patientId: patient.id } }),
    ]);

    return {
      upcomingAppointments,
      activePrescriptions,
      totalVisits,
      reportCount,
      nextAppointment,
      latestVitals,
      recentPrescriptions,
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

  public static async cancelAppointment(patientId: string, appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });

    if (!appointment || appointment.patientId !== patientId) {
      throw new AppError(StatusCodes.NOT_FOUND, "Appointment not found");
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Completed appointments cannot be cancelled");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  public static async rescheduleAppointment(
    patientId: string,
    appointmentId: string,
    payload: RescheduleAppointmentInput,
  ) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });

    if (!appointment || appointment.patientId !== patientId) {
      throw new AppError(StatusCodes.NOT_FOUND, "Appointment not found");
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Completed appointments cannot be rescheduled");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: payload.date,
        reason: payload.reason ?? appointment.reason,
        status: AppointmentStatus.PENDING,
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

  public static async getOwnHistory(patientId: string) {
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
      },
    });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    const [appointments, prescriptions, vitals, visitNotes, reports] = await Promise.all([
      prisma.appointment.findMany({
        where: { patientId },
        orderBy: { date: "desc" },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              department: true,
            },
          },
        },
      }),
      prisma.prescription.findMany({
        where: { patientId },
        orderBy: { createdAt: "desc" },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
        },
      }),
      prisma.vitals.findMany({
        where: { patientId },
        orderBy: { recordedAt: "desc" },
      }),
      prisma.visitNote.findMany({
        where: { patientId },
        orderBy: { createdAt: "desc" },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
            },
          },
          appointment: {
            select: {
              id: true,
              date: true,
              status: true,
            },
          },
        },
      }),
      prisma.medicalReport.findMany({
        where: { patientId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          category: true,
          fileName: true,
          mimeType: true,
          notes: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      patient,
      appointments,
      prescriptions,
      vitals,
      visitNotes,
      reports,
    };
  }

  public static async listOwnReports(patientId: string) {
    return prisma.medicalReport.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        fileName: true,
        mimeType: true,
        notes: true,
        createdAt: true,
      },
    });
  }

  public static async createReport(patientId: string, payload: CreateMedicalReportInput) {
    const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient profile not found");
    }

    return prisma.medicalReport.create({
      data: {
        patientId,
        title: payload.title,
        category: payload.category,
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        fileData: payload.fileData,
        notes: payload.notes,
      },
      select: {
        id: true,
        title: true,
        category: true,
        fileName: true,
        mimeType: true,
        notes: true,
        createdAt: true,
      },
    });
  }

  public static async getReportDownload(patientId: string, reportId: string) {
    const report = await prisma.medicalReport.findFirst({
      where: {
        id: reportId,
        patientId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        fileName: true,
        mimeType: true,
        fileData: true,
        notes: true,
        createdAt: true,
      },
    });

    if (!report) {
      throw new AppError(StatusCodes.NOT_FOUND, "Report not found");
    }

    return report;
  }
}
