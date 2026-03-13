import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateVitalsInput } from "../utils/validation";

type VitalsRow = {
  id: string;
  patientId: string;
  bloodSugar: number | null;
  heartRate: number | null;
  cholesterol: number | null;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  temperatureC: number | null;
  spo2: number | null;
  weightKg: number | null;
  heightCm: number | null;
  notes: string | null;
  recordedAt: Date;
};

export class VitalsService {
  private static formatVitalsRow(row: VitalsRow) {
    const bmi =
      typeof row.weightKg === "number" && typeof row.heightCm === "number" && row.heightCm > 0
        ? Number((row.weightKg / Math.pow(row.heightCm / 100, 2)).toFixed(1))
        : null;

    return {
      id: row.id,
      patientId: row.patientId,
      bloodSugar: row.bloodSugar,
      heartRate: row.heartRate,
      cholesterol: row.cholesterol,
      bpSystolic: row.bpSystolic,
      bpDiastolic: row.bpDiastolic,
      bloodPressure:
        typeof row.bpSystolic === "number" && typeof row.bpDiastolic === "number"
          ? `${row.bpSystolic}/${row.bpDiastolic}`
          : null,
      temperatureC: row.temperatureC,
      spo2: row.spo2,
      weightKg: row.weightKg,
      heightCm: row.heightCm,
      bmi,
      notes: row.notes,
      recordedAt: row.recordedAt,
    };
  }

  private static async assertPatientExists(patientId: string) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
    }
  }

  private static async assertDoctorAccess(doctorId: string, patientId: string) {
    const linkedAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        patientId,
      },
      select: { id: true },
    });

    if (!linkedAppointment) {
      throw new AppError(StatusCodes.FORBIDDEN, "Patient is not linked to this doctor");
    }
  }

  public static async listPatientVitals(patientId: string) {
    await this.assertPatientExists(patientId);

    const rows = await prisma.vitals.findMany({
      where: { patientId },
      orderBy: { recordedAt: "desc" },
      select: {
        id: true,
        patientId: true,
        bloodSugar: true,
        heartRate: true,
        cholesterol: true,
        bpSystolic: true,
        bpDiastolic: true,
        temperatureC: true,
        spo2: true,
        weightKg: true,
        heightCm: true,
        notes: true,
        recordedAt: true,
      },
    });

    return rows.map((row) => this.formatVitalsRow(row));
  }

  public static async getLatestPatientVitals(patientId: string) {
    await this.assertPatientExists(patientId);

    const row = await prisma.vitals.findFirst({
      where: { patientId },
      orderBy: { recordedAt: "desc" },
      select: {
        id: true,
        patientId: true,
        bloodSugar: true,
        heartRate: true,
        cholesterol: true,
        bpSystolic: true,
        bpDiastolic: true,
        temperatureC: true,
        spo2: true,
        weightKg: true,
        heightCm: true,
        notes: true,
        recordedAt: true,
      },
    });

    return row ? this.formatVitalsRow(row) : null;
  }

  public static async recordVitals(doctorId: string, payload: CreateVitalsInput) {
    const [doctor] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true } }),
      this.assertPatientExists(payload.patientId),
    ]);

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, "Doctor profile not found");
    }

    await this.assertDoctorAccess(doctor.id, payload.patientId);

    const created = await prisma.vitals.create({
      data: {
        patientId: payload.patientId,
        recordedByDoctorId: doctor.id,
        bloodSugar: payload.bloodSugar,
        heartRate: payload.heartRate,
        cholesterol: payload.cholesterol,
        bpSystolic: payload.bpSystolic,
        bpDiastolic: payload.bpDiastolic,
        temperatureC: payload.temperatureC,
        spo2: payload.spo2,
        weightKg: payload.weightKg,
        heightCm: payload.heightCm,
        notes: payload.notes,
        recordedAt: payload.recordedAt,
      },
      select: {
        id: true,
        patientId: true,
        bloodSugar: true,
        heartRate: true,
        cholesterol: true,
        bpSystolic: true,
        bpDiastolic: true,
        temperatureC: true,
        spo2: true,
        weightKg: true,
        heightCm: true,
        notes: true,
        recordedAt: true,
      },
    });

    return this.formatVitalsRow(created);
  }

  public static async getVitalsForViewer(viewerId: string, viewerRole: Role, patientId: string) {
    await this.assertPatientExists(patientId);

    if (viewerRole === Role.PATIENT && viewerId !== patientId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You can only access your own vitals");
    }

    if (viewerRole === Role.DOCTOR) {
      await this.assertDoctorAccess(viewerId, patientId);
    }

    return {
      vitals: await this.listPatientVitals(patientId),
    };
  }
}
