"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
const app_error_1 = require("../utils/app-error");
class PatientService {
    static async getDashboardMetrics(patientId) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        const [upcomingAppointments, totalVisits, activePrescriptions, nextAppointment, latestVitals, recentPrescriptions, reportCount] = await Promise.all([
            prisma_1.prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    date: { gte: new Date() },
                    status: { not: client_1.AppointmentStatus.CANCELLED },
                },
            }),
            prisma_1.prisma.appointment.count({
                where: {
                    patientId: patient.id,
                    status: client_1.AppointmentStatus.COMPLETED,
                },
            }),
            prisma_1.prisma.prescription.count({ where: { patientId: patient.id } }),
            prisma_1.prisma.appointment.findFirst({
                where: {
                    patientId: patient.id,
                    date: { gte: new Date() },
                    status: { not: client_1.AppointmentStatus.CANCELLED },
                },
                orderBy: { date: "asc" },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                            department: true,
                            phone: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.vitals.findFirst({
                where: { patientId: patient.id },
                orderBy: { recordedAt: "desc" },
            }),
            prisma_1.prisma.prescription.findMany({
                where: { patientId: patient.id },
                orderBy: { createdAt: "desc" },
                take: 3,
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.medicalReport.count({ where: { patientId: patient.id } }),
        ]);
        return {
            upcomingAppointments,
            activePrescriptions,
            totalVisits,
            reportCount,
            nextAppointment,
            latestVitals,
            recentPrescriptions,
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
    static async cancelAppointment(patientId, appointmentId) {
        const appointment = await prisma_1.prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment || appointment.patientId !== patientId) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Appointment not found");
        }
        if (appointment.status === client_1.AppointmentStatus.COMPLETED) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Completed appointments cannot be cancelled");
        }
        return prisma_1.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
    }
    static async rescheduleAppointment(patientId, appointmentId, payload) {
        const appointment = await prisma_1.prisma.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment || appointment.patientId !== patientId) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Appointment not found");
        }
        if (appointment.status === client_1.AppointmentStatus.COMPLETED) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Completed appointments cannot be rescheduled");
        }
        return prisma_1.prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                date: payload.date,
                reason: payload.reason ?? appointment.reason,
                status: client_1.AppointmentStatus.PENDING,
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
    static async getOwnHistory(patientId) {
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
            },
        });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        const [appointments, prescriptions, vitals, visitNotes, reports] = await Promise.all([
            prisma_1.prisma.appointment.findMany({
                where: { patientId },
                orderBy: { date: "desc" },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                            department: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.prescription.findMany({
                where: { patientId },
                orderBy: { createdAt: "desc" },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.vitals.findMany({
                where: { patientId },
                orderBy: { recordedAt: "desc" },
            }),
            prisma_1.prisma.visitNote.findMany({
                where: { patientId },
                orderBy: { createdAt: "desc" },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialization: true,
                        },
                    },
                    appointment: {
                        select: {
                            id: true,
                            date: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma_1.prisma.medicalReport.findMany({
                where: { patientId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    fileName: true,
                    mimeType: true,
                    notes: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            patient,
            appointments,
            prescriptions,
            vitals,
            visitNotes,
            reports,
        };
    }
    static async listOwnReports(patientId) {
        return prisma_1.prisma.medicalReport.findMany({
            where: { patientId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                category: true,
                fileName: true,
                mimeType: true,
                notes: true,
                createdAt: true,
            },
        });
    }
    static async createReport(patientId, payload) {
        const patient = await prisma_1.prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });
        if (!patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient profile not found");
        }
        return prisma_1.prisma.medicalReport.create({
            data: {
                patientId,
                title: payload.title,
                category: payload.category,
                fileName: payload.fileName,
                mimeType: payload.mimeType,
                fileData: payload.fileData,
                notes: payload.notes,
            },
            select: {
                id: true,
                title: true,
                category: true,
                fileName: true,
                mimeType: true,
                notes: true,
                createdAt: true,
            },
        });
    }
    static async getReportDownload(patientId, reportId) {
        const report = await prisma_1.prisma.medicalReport.findFirst({
            where: {
                id: reportId,
                patientId,
            },
            select: {
                id: true,
                title: true,
                category: true,
                fileName: true,
                mimeType: true,
                fileData: true,
                notes: true,
                createdAt: true,
            },
        });
        if (!report) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "Report not found");
        }
        return report;
    }
}
exports.PatientService = PatientService;
