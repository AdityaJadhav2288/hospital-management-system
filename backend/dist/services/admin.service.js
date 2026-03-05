"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
const password_1 = require("../utils/password");
class AdminService {
    static async getUsers(role) {
        return prisma_1.prisma.user.findMany({
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
    static async getUserById(userId) {
        const user = await prisma_1.prisma.user.findUnique({
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
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        return user;
    }
    static async createUser(payload) {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
        if (existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use");
        }
        const password = await (0, password_1.hashPassword)(payload.password);
        return prisma_1.prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password,
                role: payload.role,
                doctorProfile: payload.role === client_1.Role.DOCTOR
                    ? {
                        create: {
                            specialty: payload.specialty,
                            experienceYears: payload.experienceYears,
                            departmentId: payload.departmentId,
                            bio: payload.bio,
                            imageUrl: payload.imageUrl,
                        },
                    }
                    : undefined,
                patientProfile: payload.role === client_1.Role.PATIENT
                    ? {
                        create: {
                            phone: payload.phone,
                            address: payload.address,
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
    static async updateUser(userId, payload) {
        const exists = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: { doctorProfile: true, patientProfile: true },
        });
        if (!exists) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        if (payload.email && payload.email !== exists.email) {
            const duplicate = await prisma_1.prisma.user.findUnique({ where: { email: payload.email } });
            if (duplicate) {
                throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use");
            }
        }
        const { specialty, experienceYears, departmentId, bio, imageUrl, phone, address, dateOfBirth, gender, ...userPayload } = payload;
        return prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...userPayload,
                doctorProfile: exists.role === client_1.Role.DOCTOR
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
                patientProfile: exists.role === client_1.Role.PATIENT
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
    static async deleteUser(userId) {
        const exists = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!exists) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        await prisma_1.prisma.user.delete({ where: { id: userId } });
    }
    static async listAppointments(status) {
        return prisma_1.prisma.appointment.findMany({
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
    static async getDashboardMetrics() {
        const [totalDoctors, totalPatients, totalAppointments, totalDepartments, bloodRows, appointmentStatusCounts] = await Promise.all([
            prisma_1.prisma.doctorProfile.count(),
            prisma_1.prisma.patientProfile.count(),
            prisma_1.prisma.appointment.count(),
            prisma_1.prisma.department.count(),
            prisma_1.prisma.bloodStock.findMany(),
            prisma_1.prisma.appointment.groupBy({
                by: ["status"],
                _count: { _all: true },
            }),
        ]);
        const statusMap = {
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
    static async listDepartments() {
        return prisma_1.prisma.department.findMany({
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
    static async createDepartment(payload) {
        const existing = await prisma_1.prisma.department.findUnique({ where: { name: payload.name } });
        if (existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Department name already exists");
        }
        return prisma_1.prisma.department.create({ data: payload });
    }
    static async updateDepartment(id, payload) {
        const existing = await prisma_1.prisma.department.findUnique({ where: { id } });
        if (!existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Department not found");
        }
        if (payload.name && payload.name !== existing.name) {
            const duplicate = await prisma_1.prisma.department.findUnique({ where: { name: payload.name } });
            if (duplicate) {
                throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Department name already exists");
            }
        }
        return prisma_1.prisma.department.update({ where: { id }, data: payload });
    }
    static async deleteDepartment(id) {
        const existing = await prisma_1.prisma.department.findUnique({ where: { id } });
        if (!existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Department not found");
        }
        await prisma_1.prisma.department.delete({ where: { id } });
    }
    static async listHealthPackages() {
        return prisma_1.prisma.healthPackage.findMany({ orderBy: { createdAt: "desc" } });
    }
    static async createHealthPackage(payload) {
        return prisma_1.prisma.healthPackage.create({ data: payload });
    }
    static async updateHealthPackage(id, payload) {
        const existing = await prisma_1.prisma.healthPackage.findUnique({ where: { id } });
        if (!existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Package not found");
        }
        return prisma_1.prisma.healthPackage.update({ where: { id }, data: payload });
    }
    static async deleteHealthPackage(id) {
        const existing = await prisma_1.prisma.healthPackage.findUnique({ where: { id } });
        if (!existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Package not found");
        }
        await prisma_1.prisma.healthPackage.delete({ where: { id } });
    }
    static async listBloodStocks() {
        return prisma_1.prisma.bloodStock.findMany({ orderBy: { bloodGroup: "asc" } });
    }
    static async upsertBloodStock(payload) {
        return prisma_1.prisma.bloodStock.upsert({
            where: { bloodGroup: payload.bloodGroup },
            update: { units: payload.units },
            create: payload,
        });
    }
    static async deleteBloodStock(id) {
        const existing = await prisma_1.prisma.bloodStock.findUnique({ where: { id } });
        if (!existing) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Blood stock row not found");
        }
        await prisma_1.prisma.bloodStock.delete({ where: { id } });
    }
}
exports.AdminService = AdminService;
