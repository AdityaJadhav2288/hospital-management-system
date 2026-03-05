import { AppointmentStatus, Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { hashPassword } from "../utils/password";
import {
  CreateDepartmentInput,
  CreateHealthPackageInput,
  CreateUserByAdminInput,
  UpdateDepartmentInput,
  UpdateHealthPackageInput,
  UpdateUserByAdminInput,
  UpsertBloodStockInput,
} from "../utils/validation";

export class AdminService {
  public static async getUsers(role?: Role) {
    return prisma.user.findMany({
      where: role ? { role } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        doctorProfile: {
          include: {
            department: true,
          },
        },
        patientProfile: true,
      },
    });
  }

  public static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        doctorProfile: {
          include: {
            department: true,
          },
        },
        patientProfile: true,
      },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  }

  public static async createUser(payload: CreateUserByAdminInput) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });

    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, "Email already in use");
    }

    const password = await hashPassword(payload.password);

    return prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password,
        role: payload.role,
        doctorProfile:
          payload.role === Role.DOCTOR
            ? {
                create: {
                  specialty: payload.specialty!,
                  experienceYears: payload.experienceYears!,
                  departmentId: payload.departmentId,
                  bio: payload.bio,
                  imageUrl: payload.imageUrl,
                },
              }
            : undefined,
        patientProfile:
          payload.role === Role.PATIENT
            ? {
                create: {
                  phone: payload.phone!,
                  address: payload.address!,
                  dateOfBirth: payload.dateOfBirth,
                  gender: payload.gender,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        doctorProfile: true,
        patientProfile: true,
      },
    });
  }

  public static async updateUser(userId: string, payload: UpdateUserByAdminInput) {
    const exists = await prisma.user.findUnique({
      where: { id: userId },
      include: { doctorProfile: true, patientProfile: true },
    });

    if (!exists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (payload.email && payload.email !== exists.email) {
      const duplicate = await prisma.user.findUnique({ where: { email: payload.email } });
      if (duplicate) {
        throw new AppError(StatusCodes.CONFLICT, "Email already in use");
      }
    }

    const {
      specialty,
      experienceYears,
      departmentId,
      bio,
      imageUrl,
      phone,
      address,
      dateOfBirth,
      gender,
      ...userPayload
    } = payload;

    return prisma.user.update({
      where: { id: userId },
      data: {
        ...userPayload,
        doctorProfile:
          exists.role === Role.DOCTOR
            ? {
                update: {
                  specialty: specialty ?? exists.doctorProfile?.specialty,
                  experienceYears: experienceYears ?? exists.doctorProfile?.experienceYears,
                  departmentId: departmentId ?? exists.doctorProfile?.departmentId,
                  bio: bio ?? exists.doctorProfile?.bio,
                  imageUrl: imageUrl ?? exists.doctorProfile?.imageUrl,
                },
              }
            : undefined,
        patientProfile:
          exists.role === Role.PATIENT
            ? {
                update: {
                  phone: phone ?? exists.patientProfile?.phone,
                  address: address ?? exists.patientProfile?.address,
                  dateOfBirth: dateOfBirth ?? exists.patientProfile?.dateOfBirth,
                  gender: gender ?? exists.patientProfile?.gender,
                },
              }
            : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        doctorProfile: true,
        patientProfile: true,
      },
    });
  }

  public static async deleteUser(userId: string) {
    const exists = await prisma.user.findUnique({ where: { id: userId } });

    if (!exists) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    await prisma.user.delete({ where: { id: userId } });
  }

  public static async listAppointments(status?: AppointmentStatus) {
    return prisma.appointment.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: "asc" },
      include: {
        doctor: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            department: true,
          },
        },
        patient: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  }

  public static async getDashboardMetrics() {
    const [totalDoctors, totalPatients, totalAppointments, totalDepartments, bloodRows, appointmentStatusCounts] = await Promise.all([
      prisma.doctorProfile.count(),
      prisma.patientProfile.count(),
      prisma.appointment.count(),
      prisma.department.count(),
      prisma.bloodStock.findMany(),
      prisma.appointment.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const statusMap: Record<AppointmentStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      CANCELLED: 0,
    };

    appointmentStatusCounts.forEach((item) => {
      statusMap[item.status] = item._count._all;
    });

    return {
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalDepartments,
      bloodUnits: bloodRows.reduce((sum, row) => sum + row.units, 0),
      revenue: totalAppointments * 120,
      revenueSeries: [
        { month: "Jan", value: 0 },
        { month: "Feb", value: 0 },
        { month: "Mar", value: totalAppointments * 120 },
      ],
      appointmentSeries: [
        { name: "PENDING", value: statusMap.PENDING },
        { name: "CONFIRMED", value: statusMap.CONFIRMED },
        { name: "CANCELLED", value: statusMap.CANCELLED },
      ],
    };
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

  public static async createDepartment(payload: CreateDepartmentInput) {
    const existing = await prisma.department.findUnique({ where: { name: payload.name } });
    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, "Department name already exists");
    }

    return prisma.department.create({ data: payload });
  }

  public static async updateDepartment(id: string, payload: UpdateDepartmentInput) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "Department not found");
    }

    if (payload.name && payload.name !== existing.name) {
      const duplicate = await prisma.department.findUnique({ where: { name: payload.name } });
      if (duplicate) {
        throw new AppError(StatusCodes.CONFLICT, "Department name already exists");
      }
    }

    return prisma.department.update({ where: { id }, data: payload });
  }

  public static async deleteDepartment(id: string) {
    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "Department not found");
    }

    await prisma.department.delete({ where: { id } });
  }

  public static async listHealthPackages() {
    return prisma.healthPackage.findMany({ orderBy: { createdAt: "desc" } });
  }

  public static async createHealthPackage(payload: CreateHealthPackageInput) {
    return prisma.healthPackage.create({ data: payload });
  }

  public static async updateHealthPackage(id: string, payload: UpdateHealthPackageInput) {
    const existing = await prisma.healthPackage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "Package not found");
    }

    return prisma.healthPackage.update({ where: { id }, data: payload });
  }

  public static async deleteHealthPackage(id: string) {
    const existing = await prisma.healthPackage.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "Package not found");
    }

    await prisma.healthPackage.delete({ where: { id } });
  }

  public static async listBloodStocks() {
    return prisma.bloodStock.findMany({ orderBy: { bloodGroup: "asc" } });
  }

  public static async upsertBloodStock(payload: UpsertBloodStockInput) {
    return prisma.bloodStock.upsert({
      where: { bloodGroup: payload.bloodGroup },
      update: { units: payload.units },
      create: payload,
    });
  }

  public static async deleteBloodStock(id: string) {
    const existing = await prisma.bloodStock.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "Blood stock row not found");
    }

    await prisma.bloodStock.delete({ where: { id } });
  }
}
