"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
class DoctorService {
    static async getDashboardMetrics(userId) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const [todaysAppointments, uniquePatients, pendingAppointments] = await Promise.all([
            prisma_1.prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
            prisma_1.prisma.appointment.findMany({
                where: { doctorId: doctor.id },
                select: { patientId: true },
                distinct: ["patientId"],
            }),
            prisma_1.prisma.appointment.count({
                where: { doctorId: doctor.id, status: client_1.AppointmentStatus.PENDING },
            }),
        ]);
        return {
            todaysAppointments,
            totalPatients: uniquePatients.length,
            pendingPrescriptions: pendingAppointments,
        };
    }
    static async getOwnAppointments(userId) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        return prisma_1.prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            orderBy: { date: "asc" },
            include: {
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
    static async updateAppointmentStatus(userId, appointmentId, status) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const appointment = await prisma_1.prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Appointment not found");
        }
        if (appointment.doctorId !== doctor.id) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Cannot modify this appointment");
        }
        return prisma_1.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status },
        });
    }
    static async getPatientList(userId) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const rows = await prisma_1.prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            select: { patientId: true },
            distinct: ["patientId"],
        });
        return prisma_1.prisma.patientProfile.findMany({
            where: {
                id: {
                    in: rows.map((row) => row.patientId),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { user: { name: "asc" } },
        });
    }
    static async getPatientHistory(userId, patientId) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const patient = await prisma_1.prisma.patientProfile.findUnique({
            where: { id: patientId },
            include: {
                user: { select: { name: true, email: true } },
            },
        });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient not found");
        }
        const linkedAppointment = await prisma_1.prisma.appointment.findFirst({
            where: {
                doctorId: doctor.id,
                patientId: patient.id,
            },
            select: { id: true },
        });
        if (!linkedAppointment) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Patient is not linked to this doctor");
        }
        const [appointments, prescriptions, vitals] = await Promise.all([
            prisma_1.prisma.appointment.findMany({
                where: {
                    doctorId: doctor.id,
                    patientId: patient.id,
                },
                orderBy: { date: "desc" },
                select: {
                    id: true,
                    date: true,
                    reason: true,
                    status: true,
                },
            }),
            prisma_1.prisma.prescription.findMany({
                where: {
                    doctorId: doctor.id,
                    patientId: patient.id,
                },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    medication: true,
                    dosage: true,
                    instructions: true,
                    createdAt: true,
                },
            }),
            prisma_1.prisma.vitals.findMany({
                where: {
                    patientId: patient.id,
                },
                orderBy: { recordedAt: "desc" },
                select: {
                    id: true,
                    heightCm: true,
                    weightKg: true,
                    bloodPressure: true,
                    pulseRate: true,
                    recordedAt: true,
                },
            }),
        ]);
        return {
            patient: {
                id: patient.id,
                name: patient.user.name,
                email: patient.user.email,
                phone: patient.phone,
                address: patient.address,
            },
            appointments,
            prescriptions,
            vitals,
        };
    }
    static async createPrescription(userId, payload) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { id: payload.patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient not found");
        }
        if (payload.appointmentId) {
            const appointment = await prisma_1.prisma.appointment.findUnique({ where: { id: payload.appointmentId } });
            if (!appointment || appointment.doctorId !== doctor.id || appointment.patientId !== patient.id) {
                throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid appointment for prescription");
            }
        }
        return prisma_1.prisma.prescription.create({
            data: {
                doctorId: doctor.id,
                patientId: patient.id,
                appointmentId: payload.appointmentId,
                medication: payload.medication,
                dosage: payload.dosage,
                instructions: payload.instructions,
            },
        });
    }
    static async listPrescriptions(userId) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        return prisma_1.prisma.prescription.findMany({
            where: { doctorId: doctor.id },
            orderBy: { createdAt: "desc" },
            include: {
                patient: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        });
    }
    static async createVitals(userId, payload) {
        const doctor = await prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const patient = await prisma_1.prisma.patientProfile.findUnique({ where: { id: payload.patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient not found");
        }
        return prisma_1.prisma.vitals.create({
            data: {
                patientId: patient.id,
                recordedByDoctorId: doctor.id,
                heightCm: payload.heightCm,
                weightKg: payload.weightKg,
                bloodPressure: payload.bloodPressure,
                pulseRate: payload.pulseRate,
                notes: payload.notes,
            },
        });
    }
}
exports.DoctorService = DoctorService;
