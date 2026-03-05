import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { LoginInput, RegisterInput } from "../utils/validation";

export class AuthService {
  private static readonly doctorDefaults = {
    specialty: "General Medicine",
    experienceYears: 0,
  };

  private static readonly patientDefaults = {
    phone: "0000000",
    address: "Not provided",
  };

  public static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  }

  public static async register(payload: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });

    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, "Email already in use");
    }

    const hashed = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashed,
        role: payload.role,
        doctorProfile:
          payload.role === Role.DOCTOR
            ? {
                create: {
                  specialty: payload.specialty ?? AuthService.doctorDefaults.specialty,
                  experienceYears: payload.experienceYears ?? AuthService.doctorDefaults.experienceYears,
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
                  phone: payload.phone ?? AuthService.patientDefaults.phone,
                  address: payload.address ?? AuthService.patientDefaults.address,
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
      },
    });

    const token = signToken({ userId: user.id, role: user.role });

    return { token, user };
  }

  public static async login(payload: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isMatch = await comparePassword(payload.password, user.password);

    if (!isMatch) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const token = signToken({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
