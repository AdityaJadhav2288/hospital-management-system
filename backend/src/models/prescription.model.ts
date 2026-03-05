import { prisma } from "../config/prisma";

export class PrescriptionModel {
  public static listByPatient(patientId: string) {
    return prisma.prescription.findMany({ where: { patientId }, orderBy: { createdAt: "desc" } });
  }

  public static listByDoctor(doctorId: string) {
    return prisma.prescription.findMany({ where: { doctorId }, orderBy: { createdAt: "desc" } });
  }
}
