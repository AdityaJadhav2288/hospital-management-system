import { prisma } from "../config/prisma";

export class DoctorModel {
  public static findByUserId(userId: string) {
    return prisma.doctorProfile.findUnique({ where: { userId } });
  }

  public static listPublic(specialty?: string) {
    return prisma.doctorProfile.findMany({
      where: specialty
        ? {
            specialty: {
              contains: specialty,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { user: { name: "asc" } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
      },
    });
  }
}
