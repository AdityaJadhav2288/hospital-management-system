import { Admin, Doctor, Patient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { Role } from "../constants/role";
import { AppError } from "../utils/app-error";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { LoginInput, PatientRegisterInput, ScopedLoginInput } from "../utils/validation";

type SanitizedAuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: Date;
};

const FIXED_ADMIN_EMAIL = "adityajadhav121248@gmail.com";

export class AuthService {
  private static async ensureEmailIsAvailable(email: string) {
    const [admin, doctor, patient] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.doctor.findUnique({ where: { email } }),
      prisma.patient.findUnique({ where: { email } }),
    ]);

    if (admin || doctor || patient) {
      throw new AppError(StatusCodes.CONFLICT, "Email already in use");
    }
  }

  private static toAuthUser(record: Admin | Doctor | Patient, role: Role): SanitizedAuthUser {
    return {
      id: record.id,
      name: record.name,
      email: record.email,
      role,
      createdAt: record.createdAt,
    };
  }

  private static async loginByRole(role: Role, payload: ScopedLoginInput) {
    const entity =
      role === Role.ADMIN
        ? await prisma.admin.findUnique({ where: { email: payload.email } })
        : role === Role.DOCTOR
          ? await prisma.doctor.findUnique({ where: { email: payload.email } })
          : await prisma.patient.findUnique({ where: { email: payload.email } });

    if (!entity) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await comparePassword(payload.password, entity.password);

    if (!isMatch) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const user = AuthService.toAuthUser(entity, role);

    return {
      token: signToken({ userId: user.id, role }),
      user,
    };
  }

  public static async me(userId: string, role: Role) {
    const entity =
      role === Role.ADMIN
        ? await prisma.admin.findUnique({ where: { id: userId } })
        : role === Role.DOCTOR
          ? await prisma.doctor.findUnique({ where: { id: userId } })
          : await prisma.patient.findUnique({ where: { id: userId } });

    if (!entity) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    return AuthService.toAuthUser(entity, role);
  }

  public static async registerPatient(payload: PatientRegisterInput) {
    await AuthService.ensureEmailIsAvailable(payload.email);

    const patient = await prisma.patient.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: await hashPassword(payload.password),
        plainPassword: payload.password,
        phone: payload.phone,
        address: payload.address ?? "Not provided",
        dateOfBirth: payload.dateOfBirth,
        gender: payload.gender,
      },
    });

    const user = AuthService.toAuthUser(patient, Role.PATIENT);

    return {
      token: signToken({ userId: user.id, role: Role.PATIENT }),
      user,
    };
  }

  public static async login(payload: LoginInput) {
    return AuthService.loginByRole(payload.role, payload);
  }

  public static async loginAdmin(payload: ScopedLoginInput) {
    if (payload.email !== FIXED_ADMIN_EMAIL) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    return AuthService.loginByRole(Role.ADMIN, payload);
  }

  public static async loginDoctor(payload: ScopedLoginInput) {
    return AuthService.loginByRole(Role.DOCTOR, payload);
  }

  public static async loginPatient(payload: ScopedLoginInput) {
    return AuthService.loginByRole(Role.PATIENT, payload);
  }
}
