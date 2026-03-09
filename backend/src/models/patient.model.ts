import { prisma } from "../config/prisma";

export class PatientModel {
  public static findByUserId(userId: string) {
    return prisma.patient.findUnique({ where: { id: userId } });
  }

  public static getVitals(patientId: string) {
    return prisma.vitals.findMany({ where: { patientId }, orderBy: { recordedAt: "desc" } });
  }
}
