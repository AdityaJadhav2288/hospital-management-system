import { prisma } from "../config/prisma";

export class DoctorModel {
  public static findByUserId(userId: string) {
    return prisma.doctor.findUnique({ where: { id: userId } });
  }

  public static listPublic(specialty?: string) {
    return prisma.doctor.findMany({
      where: specialty
        ? {
            specialization: {
              contains: specialty,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        experience: true,
        phone: true,
        department: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
