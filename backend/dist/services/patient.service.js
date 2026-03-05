"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
class PatientService {
    static async getDashboardMetrics(userId) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        const [upcomingAppointments, totalVisits, activePrescriptions] = await Promise.all([
            prisma_1.prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    date: { gte: new Date() },
                },
            }),
            prisma_1.prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    date: { lt: new Date() },
                },
            }),
            prisma_1.prisma.prescription.count({ where: { patientId: patient.id } }),
        ]);
        return {
            upcomingAppointments,
            activePrescriptions,
            totalVisits,
        };
    }
    static async getDoctors() {
        return prisma_1.prisma.doctorProfile.findMany({
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                department: true,
            },
            orderBy: {
                user: { name: "asc" },
            },
        });
    }
    static async bookAppointment(userId, payload) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { id: payload.doctorId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor not found");
        }
        return prisma_1.prisma.appointment.create({
            data: {
                doctorId: doctor.id,
                patientId: patient.id,
                date: payload.date,
                reason: payload.reason,
            },
        });
    }
    static async getOwnAppointments(userId) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.appointment.findMany({
            where: { patientId: patient.id },
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
            },
        });
    }
    static async getOwnProfile(userId) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return patient;
    }
    static async updateOwnProfile(userId, payload) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.patientProfile.update({
            where: { userId },
            data: payload,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    static async listOwnPrescriptions(userId) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.prescription.findMany({
            where: { patientId: patient.id },
            include: {
                doctor: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        department: true,
                    },
                },
                appointment: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async listOwnVitals(userId) {
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.vitals.findMany({
            where: { patientId: patient.id },
            include: {
                recordedByDoctor: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { recordedAt: "asc" },
        });
    }
}
exports.PatientService = PatientService;
