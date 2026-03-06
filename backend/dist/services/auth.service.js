"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const role_1 = require("../constants/role");
const app_error_1 = require("../utils/app-error");
const demo_password_1 = require("../utils/demo-password");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const FIXED_ADMIN_EMAIL = "adityajadhav121248@gmail.com";
class AuthService {
    static async ensureEmailIsAvailable(email) {
        const [admin, doctor, patient] = await Promise.all([
            prisma_1.prisma.admin.findUnique({ where: { email } }),
            prisma_1.prisma.doctor.findUnique({ where: { email } }),
            prisma_1.prisma.patient.findUnique({ where: { email } }),
        ]);
        if (admin || doctor || patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use");
        }
    }
    static toAuthUser(record, role) {
        return {
            id: record.id,
            name: record.name,
            email: record.email,
            role,
            createdAt: record.createdAt,
        };
    }
    static async loginByRole(role, payload) {
        const entity = role === role_1.Role.ADMIN
            ? await prisma_1.prisma.admin.findUnique({ where: { email: payload.email } })
            : role === role_1.Role.DOCTOR
                ? await prisma_1.prisma.doctor.findUnique({ where: { email: payload.email } })
                : await prisma_1.prisma.patient.findUnique({ where: { email: payload.email } });
        if (!entity) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        const isMatch = await (0, password_1.comparePassword)(payload.password, entity.password);
        if (!isMatch) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        const user = AuthService.toAuthUser(entity, role);
        return {
            token: (0, jwt_1.signToken)({ userId: user.id, role }),
            user,
        };
    }
    static async me(userId, role) {
        const entity = role === role_1.Role.ADMIN
            ? await prisma_1.prisma.admin.findUnique({ where: { id: userId } })
            : role === role_1.Role.DOCTOR
                ? await prisma_1.prisma.doctor.findUnique({ where: { id: userId } })
                : await prisma_1.prisma.patient.findUnique({ where: { id: userId } });
        if (!entity) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        return AuthService.toAuthUser(entity, role);
    }
    static async registerPatient(payload) {
        await AuthService.ensureEmailIsAvailable(payload.email);
        const createdPatient = await prisma_1.prisma.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: await (0, password_1.hashPassword)(payload.password),
                phone: payload.phone,
                address: payload.address ?? "Not provided",
                dateOfBirth: payload.dateOfBirth,
                gender: payload.gender,
            },
        });
        const demoPassword = (0, demo_password_1.buildDemoPassword)(role_1.Role.PATIENT, createdPatient.id);
        const patient = await prisma_1.prisma.patient.update({
            where: { id: createdPatient.id },
            data: {
                password: await (0, password_1.hashPassword)(demoPassword),
            },
        });
        const user = AuthService.toAuthUser(patient, role_1.Role.PATIENT);
        return {
            token: (0, jwt_1.signToken)({ userId: user.id, role: role_1.Role.PATIENT }),
            user,
            demoPassword,
        };
    }
    static async login(payload) {
        return AuthService.loginByRole(payload.role, payload);
    }
    static async loginAdmin(payload) {
        if (payload.email !== FIXED_ADMIN_EMAIL) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid credentials");
        }
        return AuthService.loginByRole(role_1.Role.ADMIN, payload);
    }
    static async loginDoctor(payload) {
        return AuthService.loginByRole(role_1.Role.DOCTOR, payload);
    }
    static async loginPatient(payload) {
        return AuthService.loginByRole(role_1.Role.PATIENT, payload);
    }
}
exports.AuthService = AuthService;
