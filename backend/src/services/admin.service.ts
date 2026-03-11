import { AppointmentStatus } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { Role } from "../constants/role";
import { AppError } from "../utils/app-error";
import { buildDemoPassword } from "../utils/demo-password";
import { hashPassword } from "../utils/password";
import {
  CreateDepartmentInput,
  CreateHealthPackageInput,
  CreateUserByAdminInput,
  ResetUserPasswordInput,
  UpdateDepartmentInput,
  UpdateHealthPackageInput,
  UpdateUserByAdminInput,
  UpsertBloodStockInput,
} from "../utils/validation";

export class AdminService {
  private static async ensureEmailIsAvailable(email: string, currentId?: string) {
    const [admin, doctor, patient] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.doctor.findUnique({ where: { email } }),
      prisma.patient.findUnique({ where: { email } }),
    ]);

    const conflicts = [admin, doctor, patient].filter(Boolean) as Array<{ id: string }>;
    const hasConflict = conflicts.some((item) => item.id !== currentId);

    if (hasConflict) {
      throw new AppError(StatusCodes.CONFLICT, "Email already in use");
    }
  }

  private static mapDoctor(doctor: {
    id: string;
    name: string;
    email: string;
    specialization: string;
    experience: number;
    phone: string;
    department: string;
    bio: string | null;
    profileImage: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      role: Role.DOCTOR,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
      demoPassword: buildDemoPassword(Role.DOCTOR, doctor.id),
      doctorProfile: {
        id: doctor.id,
        specialty: doctor.specialization,
        experienceYears: doctor.experience,
        phone: doctor.phone,
        department: doctor.department,
        bio: doctor.bio,
        imageUrl: doctor.profileImage,
      },
      patientProfile: null,
    };
  }

  private static mapPatient(patient: {
    id: string;
    name: string;
    email: string;
    plainPassword: string | null;
    phone: string;
    address: string;
    dateOfBirth: Date | null;
    gender: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      role: Role.PATIENT,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      password: patient.plainPassword,
      doctorProfile: null,
      patientProfile: {
        id: patient.id,
        phone: patient.phone,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
      },
    };
  }

  public static async getUsers(role?: Role) {
    if (role === Role.DOCTOR) {
      const doctors = await prisma.doctor.findMany({
        orderBy: { createdAt: "desc" },
      });
      return doctors.map(AdminService.mapDoctor);
    }

    if (role === Role.PATIENT) {
      const patients = await prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
      });
      return patients.map(AdminService.mapPatient);
    }

    if (role === Role.ADMIN) {
      return prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    }

    const [doctors, patients, admins] = await Promise.all([
      prisma.doctor.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.patient.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    return [
      ...doctors.map(AdminService.mapDoctor),
      ...patients.map(AdminService.mapPatient),
      ...admins.map((admin) => ({
        ...admin,
        role: Role.ADMIN,
        doctorProfile: null,
        patientProfile: null,
      })),
    ];
  }

  public static async getUserById(userId: string) {
    const [doctor, patient, admin] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: userId } }),
      prisma.patient.findUnique({ where: { id: userId } }),
      prisma.admin.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    if (doctor) return AdminService.mapDoctor(doctor);
    if (patient) return AdminService.mapPatient(patient);
    if (admin) {
      return {
        ...admin,
        role: Role.ADMIN,
        doctorProfile: null,
        patientProfile: null,
      };
    }

    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  public static async createUser(payload: CreateUserByAdminInput) {
    await AdminService.ensureEmailIsAvailable(payload.email);
    const password = await hashPassword(payload.password);

    if (payload.role === Role.DOCTOR) {
      const createdDoctor = await prisma.doctor.create({
        data: {
          name: payload.name,
          email: payload.email,
          password,
          specialization: payload.specialization!,
          experience: payload.experienceYears!,
          phone: payload.phone,
          department: payload.department!,
          bio: payload.bio,
          profileImage: payload.profileImage!,
        },
      });

      const demoPassword = buildDemoPassword(Role.DOCTOR, createdDoctor.id);
      const doctor = await prisma.doctor.update({
        where: { id: createdDoctor.id },
        data: { password: await hashPassword(demoPassword) },
      });

      return AdminService.mapDoctor(doctor);
    }

    const createdPatient = await prisma.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
        password,
        plainPassword: payload.password,
        phone: payload.phone,
        address: payload.address!,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
      },
    });

    return AdminService.mapPatient(createdPatient);
  }

  public static async updateUser(userId: string, payload: UpdateUserByAdminInput) {
    const [doctor, patient, admin] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: userId } }),
      prisma.patient.findUnique({ where: { id: userId } }),
      prisma.admin.findUnique({ where: { id: userId } }),
    ]);

    if (admin) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Admin account cannot be modified here");
    }

    if (!doctor && !patient) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (payload.email) {
      await AdminService.ensureEmailIsAvailable(payload.email, userId);
    }

    if (doctor) {
      const updated = await prisma.doctor.update({
        where: { id: userId },
        data: {
          name: payload.name,
          email: payload.email,
          specialization: payload.specialization,
          experience: payload.experienceYears,
          phone: payload.phone,
          department: payload.department,
          bio: payload.bio,
          profileImage: payload.profileImage,
        },
      });

      return AdminService.mapDoctor(updated);
    }

    const updated = await prisma.patient.update({
      where: { id: userId },
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
      },
    });

    return AdminService.mapPatient(updated);
  }

  public static async resetUserPassword(userId: string, payload: ResetUserPasswordInput) {
    const password = await hashPassword(payload.password);

    const [doctor, patient, admin] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.patient.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.admin.findUnique({ where: { id: userId }, select: { id: true } }),
    ]);

    if (admin) {
      throw new AppError(StatusCodes.BAD_REQUEST, "The fixed admin account password cannot be managed here");
    }

    if (doctor) {
      await prisma.doctor.update({
        where: { id: userId },
        data: { password },
      });
      return;
    }

    if (patient) {
      await prisma.patient.update({
        where: { id: userId },
        data: {
          password,
          plainPassword: payload.password,
        },
      });
      return;
    }

    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  public static async deleteUser(userId: string) {
    const [doctor, patient, admin] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.patient.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.admin.findUnique({ where: { id: userId }, select: { id: true } }),
    ]);

    if (admin) {
      throw new AppError(StatusCodes.BAD_REQUEST, "The fixed admin account cannot be deleted");
    }

    if (doctor) {
      await prisma.doctor.delete({ where: { id: userId } });
      return;
    }

    if (patient) {
      await prisma.patient.delete({ where: { id: userId } });
      return;
    }

    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  public static async listDoctors() {
    return prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        specialization: true,
        email: true,
        experience: true,
        phone: true,
        department: true,
        profileImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    });
  }

  public static async listPatients() {
    const patients = await prisma.patient.findMany({
      orderBy: { name: "asc" },
    });

    return patients.map(AdminService.mapPatient);
  }

  public static async listAppointments(status?: AppointmentStatus) {
    return prisma.appointment.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: "asc" },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            department: true,
            experience: true,
            profileImage: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  public static async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
      throw new AppError(StatusCodes.NOT_FOUND, "Appointment not found");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            department: true,
            experience: true,
            profileImage: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  public static async listContactMessages() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  public static async getDashboardMetrics() {
    const [totalDoctors, totalPatients, totalAppointments, totalDepartments, bloodRows, appointmentStatusCounts] =
      await Promise.all([
        prisma.doctor.count(),
        prisma.patient.count(),
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
      COMPLETED: 0,
      CANCELLED: 0,
    };

    appointmentStatusCounts.forEach((item) => {
      statusMap[item.status] = item._count._all;
    });

    return {
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedVisits: statusMap.COMPLETED,
      totalDepartments,
      bloodUnits: bloodRows.reduce((sum, row) => sum + row.units, 0),
      revenue: totalAppointments * 120,
      revenueSeries: [
        { month: "Jan", value: Math.round(totalAppointments * 0.2) * 120 },
        { month: "Feb", value: Math.round(totalAppointments * 0.3) * 120 },
        { month: "Mar", value: Math.round(totalAppointments * 0.5) * 120 },
      ],
      appointmentSeries: [
        { name: "PENDING", value: statusMap.PENDING },
        { name: "CONFIRMED", value: statusMap.CONFIRMED },
        { name: "COMPLETED", value: statusMap.COMPLETED },
        { name: "CANCELLED", value: statusMap.CANCELLED },
      ],
    };
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
