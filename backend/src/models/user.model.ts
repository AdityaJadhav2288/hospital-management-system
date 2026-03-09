import { Role } from "@prisma/client";
import { prisma } from "../config/prisma";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
};

export class UserModel {
  public static async findByEmail(email: string): Promise<UserRecord | null> {
    const [admin, doctor, patient] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.doctor.findUnique({ where: { email } }),
      prisma.patient.findUnique({ where: { email } }),
    ]);

    if (admin) {
      return { ...admin, role: Role.ADMIN };
    }

    if (doctor) {
      return { ...doctor, role: Role.DOCTOR };
    }

    if (patient) {
      return { ...patient, role: Role.PATIENT };
    }

    return null;
  }

  public static async findById(id: string): Promise<UserRecord | null> {
    const [admin, doctor, patient] = await Promise.all([
      prisma.admin.findUnique({ where: { id } }),
      prisma.doctor.findUnique({ where: { id } }),
      prisma.patient.findUnique({ where: { id } }),
    ]);

    if (admin) {
      return { ...admin, role: Role.ADMIN };
    }

    if (doctor) {
      return { ...doctor, role: Role.DOCTOR };
    }

    if (patient) {
      return { ...patient, role: Role.PATIENT };
    }

    return null;
  }

  public static async listByRole(role?: Role): Promise<UserRecord[]> {
    if (role === Role.ADMIN) {
      const admins = await prisma.admin.findMany({ orderBy: { createdAt: "desc" } });
      return admins.map((admin) => ({ ...admin, role: Role.ADMIN }));
    }

    if (role === Role.DOCTOR) {
      const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
      return doctors.map((doctor) => ({ ...doctor, role: Role.DOCTOR }));
    }

    if (role === Role.PATIENT) {
      const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
      return patients.map((patient) => ({ ...patient, role: Role.PATIENT }));
    }

    const [admins, doctors, patients] = await Promise.all([
      prisma.admin.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.doctor.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.patient.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return [
      ...admins.map((admin) => ({ ...admin, role: Role.ADMIN })),
      ...doctors.map((doctor) => ({ ...doctor, role: Role.DOCTOR })),
      ...patients.map((patient) => ({ ...patient, role: Role.PATIENT })),
    ].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
  }
}
