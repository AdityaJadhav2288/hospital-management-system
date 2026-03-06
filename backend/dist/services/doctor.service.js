"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
class DoctorService {
    static async getDashboardMetrics(doctorId) {
        const doctor = await prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const [todaysAppointments, uniquePatients, pendingAppointments] = await Promise.all([
            prisma_1.prisma.appointment.count({
                where: {
                    doctorId: doctor.id,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
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
    static async getOwnAppointments(doctorId) {
        const doctor = await prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        return prisma_1.prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            orderBy: { date: "asc" },
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
    static async updateAppointmentStatus(doctorId, appointmentId, status) {
        const doctor = await prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } });
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
    static async getPatientList(doctorId) {
        const doctor = await prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        const rows = await prisma_1.prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            select: { patientId: true },
            distinct: ["patientId"],
        });
        return prisma_1.prisma.patient.findMany({
            where: {
                id: {
                    in: rows.map((row) => row.patientId),
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
            },
            orderBy: { name: "asc" },
        });
    }
    static async getPatientHistory(doctorId, patientId) {
        const [doctor, patient] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } }),
            prisma_1.prisma.patient.findUnique({
                where: { id: patientId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                },
            }),
        ]);
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
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
            patient,
            appointments,
            prescriptions,
            vitals,
        };
    }
    static async createPrescription(doctorId, payload) {
        const [doctor, patient] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } }),
            prisma_1.prisma.patient.findUnique({ where: { id: payload.patientId } }),
        ]);
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
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
    static async listPrescriptions(doctorId) {
        const doctor = await prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
        return prisma_1.prisma.prescription.findMany({
            where: { doctorId: doctor.id },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                appointment: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    static async createVitals(doctorId, payload) {
        const [doctor, patient] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: doctorId } }),
            prisma_1.prisma.patient.findUnique({ where: { id: payload.patientId } }),
        ]);
        if (!doctor) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Doctor profile not found");
        }
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
