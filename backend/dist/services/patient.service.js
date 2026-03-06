"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
class PatientService {
    static async getDashboardMetrics(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
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
        return prisma_1.prisma.doctor.findMany({
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
            },
            orderBy: { name: "asc" },
        });
    }
    static async bookAppointment(patientId, payload) {
        const [patient, doctor] = await Promise.all([
            prisma_1.prisma.patient.findUnique({ where: { id: patientId } }),
            prisma_1.prisma.doctor.findUnique({ where: { id: payload.doctorId } }),
        ]);
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
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
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        specialization: true,
                        experience: true,
                        department: true,
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
    static async getOwnAppointments(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.appointment.findMany({
            where: { patientId: patient.id },
            orderBy: { date: "asc" },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true,
                        experience: true,
                        phone: true,
                        department: true,
                        profileImage: true,
                    },
                },
            },
        });
    }
    static async getOwnProfile(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({
            where: { id: patientId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                dateOfBirth: true,
                gender: true,
                createdAt: true,
            },
        });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return patient;
    }
    static async updateOwnProfile(patientId, payload) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.patient.update({
            where: { id: patientId },
            data: payload,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                dateOfBirth: true,
                gender: true,
                createdAt: true,
            },
        });
    }
    static async listOwnPrescriptions(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.prescription.findMany({
            where: { patientId: patient.id },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        specialization: true,
                        department: true,
                        profileImage: true,
                    },
                },
                appointment: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async listOwnVitals(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.vitals.findMany({
            where: { patientId: patient.id },
            orderBy: { recordedAt: "desc" },
        });
    }
}
exports.PatientService = PatientService;
