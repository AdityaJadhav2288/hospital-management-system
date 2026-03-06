import { prisma } from "../config/prisma";
import { CreateContactMessageInput } from "../utils/validation";

export class PublicService {
  public static async listDoctors(specialty?: string) {
    return prisma.doctor.findMany({
      where: specialty
        ? { specialization: { contains: specialty, mode: "insensitive" } }
        : undefined,
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
      },
      orderBy: { name: "asc" },
    });
  }

  public static async listDepartments() {
    const [departments, doctors] = await Promise.all([
      prisma.department.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.doctor.findMany({
        select: { department: true },
      }),
    ]);

    return departments.map((department) => ({
      ...department,
      _count: {
        doctors: doctors.filter((doctor) => doctor.department === department.name).length,
      },
    }));
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
    const [bloodUnits, doctorsCount, patientsCount] = await Promise.all([
      prisma.bloodStock.aggregate({ _sum: { units: true } }),
      prisma.doctor.count(),
      prisma.patient.count(),
    ]);

    return {
      beds: Math.max(120, bloodUnits._sum.units ?? 0),
      doctors: doctorsCount,
      patientsServed: patientsCount,
    };
  }

  public static async createContactMessage(payload: CreateContactMessageInput) {
    return prisma.contactMessage.create({
      data: payload,
    });
  }
}
