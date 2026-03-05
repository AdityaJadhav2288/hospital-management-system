import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";

export class AppointmentModel {
  public static listByDoctor(doctorId: string) {
    return prisma.appointment.findMany({ where: { doctorId }, orderBy: { date: "asc" } });
  }

  public static listByPatient(patientId: string) {
    return prisma.appointment.findMany({ where: { patientId }, orderBy: { date: "asc" } });
  }

  public static listAll(status?: AppointmentStatus) {
    return prisma.appointment.findMany({ where: status ? { status } : undefined, orderBy: { date: "desc" } });
  }
}
