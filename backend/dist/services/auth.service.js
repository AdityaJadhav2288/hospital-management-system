"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
class AuthService {
    static doctorDefaults = {
        specialty: "General Medicine",
        experienceYears: 0,
    };
    static patientDefaults = {
        phone: "0000000",
        address: "Not provided",
    };
    static async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
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
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        return user;
    }
    static async register(payload) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use");
        }
        const hashed = await (0, password_1.hashPassword)(payload.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: hashed,
                role: payload.role,
                doctorProfile: payload.role === client_1.Role.DOCTOR
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
                patientProfile: payload.role === client_1.Role.PATIENT
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
        const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
        return { token, user };
    }
    static async login(payload) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: payload.email },
        });
        if (!user) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        const isMatch = await (0, password_1.comparePassword)(payload.password, user.password);
        if (!isMatch) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
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
exports.AuthService = AuthService;
