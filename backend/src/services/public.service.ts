import { prisma } from "../config/prisma";

export class PublicService {
  public static async listDoctors(specialty?: string) {
    return prisma.doctorProfile.findMany({
      where: specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: true,
      },
      orderBy: { user: { name: "asc" } },
    });
  }

  public static async listDepartments() {
    return prisma.department.findMany({
      include: {
        _count: {
          select: {
            doctors: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  public static async listHealthPackages(category?: string) {
    return prisma.healthPackage.findMany({
      where: category ? { category: { equals: category, mode: "insensitive" } } : undefined,
      orderBy: [{ category: "asc" }, { price: "asc" }],
    });
  }

  public static async listBloodStock() {
    return prisma.bloodStock.findMany({
      orderBy: { bloodGroup: "asc" },
    });
  }

  public static async getHospitalStats() {
    const [bedsCount, doctorsCount, patientsCount] = await Promise.all([
      prisma.bloodStock.aggregate({ _sum: { units: true } }),
      prisma.doctorProfile.count(),
      prisma.patientProfile.count(),
    ]);

    return {
      beds: Math.max(120, bedsCount._sum.units ?? 0),
      doctors: doctorsCount,
      patientsServed: patientsCount,
    };
  }
}
