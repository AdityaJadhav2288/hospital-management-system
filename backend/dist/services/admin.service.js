"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const role_1 = require("../constants/role");
const app_error_1 = require("../utils/app-error");
const demo_password_1 = require("../utils/demo-password");
const password_1 = require("../utils/password");
class AdminService {
    static async ensureEmailIsAvailable(email, currentId) {
        const [admin, doctor, patient] = await Promise.all([
            prisma_1.prisma.admin.findUnique({ where: { email } }),
            prisma_1.prisma.doctor.findUnique({ where: { email } }),
            prisma_1.prisma.patient.findUnique({ where: { email } }),
        ]);
        const conflicts = [admin, doctor, patient].filter(Boolean);
        const hasConflict = conflicts.some((item) => item.id !== currentId);
        if (hasConflict) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.CONFLICT, "Email already in use");
        }
    }
    static mapDoctor(doctor) {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: role_1.Role.DOCTOR,
            createdAt: doctor.createdAt,
            updatedAt: doctor.updatedAt,
            demoPassword: (0, demo_password_1.buildDemoPassword)(role_1.Role.DOCTOR, doctor.id),
            doctorProfile: {
                id: doctor.id,
                specialty: doctor.specialization,
                experienceYears: doctor.experience,
                phone: doctor.phone,
                department: doctor.department,
                bio: doctor.bio,
                imageUrl: doctor.profileImage,
            },
            patientProfile: null,
        };
    }
    static mapPatient(patient) {
        return {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            role: role_1.Role.PATIENT,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt,
            demoPassword: (0, demo_password_1.buildDemoPassword)(role_1.Role.PATIENT, patient.id),
            doctorProfile: null,
            patientProfile: {
                id: patient.id,
                phone: patient.phone,
                address: patient.address,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
            },
        };
    }
    static async getUsers(role) {
        if (role === role_1.Role.DOCTOR) {
            const doctors = await prisma_1.prisma.doctor.findMany({
                orderBy: { createdAt: "desc" },
            });
            return doctors.map(AdminService.mapDoctor);
        }
        if (role === role_1.Role.PATIENT) {
            const patients = await prisma_1.prisma.patient.findMany({
                orderBy: { createdAt: "desc" },
            });
            return patients.map(AdminService.mapPatient);
        }
        if (role === role_1.Role.ADMIN) {
            return prisma_1.prisma.admin.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            });
        }
        const [doctors, patients, admins] = await Promise.all([
            prisma_1.prisma.doctor.findMany({ orderBy: { createdAt: "desc" } }),
            prisma_1.prisma.patient.findMany({ orderBy: { createdAt: "desc" } }),
            prisma_1.prisma.admin.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            }),
        ]);
        return [
            ...doctors.map(AdminService.mapDoctor),
            ...patients.map(AdminService.mapPatient),
            ...admins.map((admin) => ({
                ...admin,
                role: role_1.Role.ADMIN,
                doctorProfile: null,
                patientProfile: null,
            })),
        ];
    }
    static async getUserById(userId) {
        const [doctor, patient, admin] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: userId } }),
            prisma_1.prisma.patient.findUnique({ where: { id: userId } }),
            prisma_1.prisma.admin.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                },
            }),
        ]);
        if (doctor)
            return AdminService.mapDoctor(doctor);
        if (patient)
            return AdminService.mapPatient(patient);
        if (admin) {
            return {
                ...admin,
                role: role_1.Role.ADMIN,
                doctorProfile: null,
                patientProfile: null,
            };
        }
        throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    static async createUser(payload) {
        await AdminService.ensureEmailIsAvailable(payload.email);
        const password = await (0, password_1.hashPassword)(payload.password);
        if (payload.role === role_1.Role.DOCTOR) {
            const createdDoctor = await prisma_1.prisma.doctor.create({
                data: {
                    name: payload.name,
                    email: payload.email,
                    password,
                    specialization: payload.specialization,
                    experience: payload.experienceYears,
                    phone: payload.phone,
                    department: payload.department,
                    bio: payload.bio,
                    profileImage: payload.profileImage,
                },
            });
            const demoPassword = (0, demo_password_1.buildDemoPassword)(role_1.Role.DOCTOR, createdDoctor.id);
            const doctor = await prisma_1.prisma.doctor.update({
                where: { id: createdDoctor.id },
                data: { password: await (0, password_1.hashPassword)(demoPassword) },
            });
            return AdminService.mapDoctor(doctor);
        }
        const createdPatient = await prisma_1.prisma.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                password,
                phone: payload.phone,
                address: payload.address,
                dateOfBirth: payload.dateOfBirth,
                gender: payload.gender,
            },
        });
        const demoPassword = (0, demo_password_1.buildDemoPassword)(role_1.Role.PATIENT, createdPatient.id);
        const patient = await prisma_1.prisma.patient.update({
            where: { id: createdPatient.id },
            data: { password: await (0, password_1.hashPassword)(demoPassword) },
        });
        return AdminService.mapPatient(patient);
    }
    static async updateUser(userId, payload) {
        const [doctor, patient, admin] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: userId } }),
            prisma_1.prisma.patient.findUnique({ where: { id: userId } }),
            prisma_1.prisma.admin.findUnique({ where: { id: userId } }),
        ]);
        if (admin) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Admin account cannot be modified here");
        }
        if (!doctor && !patient) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        if (payload.email) {
            await AdminService.ensureEmailIsAvailable(payload.email, userId);
        }
        if (doctor) {
            const updated = await prisma_1.prisma.doctor.update({
                where: { id: userId },
                data: {
                    name: payload.name,
                    email: payload.email,
                    specialization: payload.specialization,
                    experience: payload.experienceYears,
                    phone: payload.phone,
                    department: payload.department,
                    bio: payload.bio,
                    profileImage: payload.profileImage,
                },
            });
            return AdminService.mapDoctor(updated);
        }
        const updated = await prisma_1.prisma.patient.update({
            where: { id: userId },
            data: {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                address: payload.address,
                dateOfBirth: payload.dateOfBirth,
                gender: payload.gender,
            },
        });
        return AdminService.mapPatient(updated);
    }
    static async resetUserPassword(userId, payload) {
        const password = await (0, password_1.hashPassword)(payload.password);
        const [doctor, patient, admin] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: userId }, select: { id: true } }),
            prisma_1.prisma.patient.findUnique({ where: { id: userId }, select: { id: true } }),
            prisma_1.prisma.admin.findUnique({ where: { id: userId }, select: { id: true } }),
        ]);
        if (admin) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "The fixed admin account password cannot be managed here");
        }
        if (doctor) {
            await prisma_1.prisma.doctor.update({
                where: { id: userId },
                data: { password },
            });
            return;
        }
        if (patient) {
            await prisma_1.prisma.patient.update({
                where: { id: userId },
                data: { password },
            });
            return;
        }
        throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    static async deleteUser(userId) {
        const [doctor, patient, admin] = await Promise.all([
            prisma_1.prisma.doctor.findUnique({ where: { id: userId }, select: { id: true } }),
            prisma_1.prisma.patient.findUnique({ where: { id: userId }, select: { id: true } }),
            prisma_1.prisma.admin.findUnique({ where: { id: userId }, select: { id: true } }),
        ]);
        if (admin) {
            throw new app_error_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "The fixed admin account cannot be deleted");
        }
        if (doctor) {
            await prisma_1.prisma.doctor.delete({ where: { id: userId } });
            return;
        }
        if (patient) {
            await prisma_1.prisma.patient.delete({ where: { id: userId } });
            return;
        }
        throw new app_error_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    static async listDoctors() {
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
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: "asc" },
        });
    }
    static async listPatients() {
        return prisma_1.prisma.patient.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                dateOfBirth: true,
                gender: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { name: "asc" },
        });
    }
    static async listAppointments(status) {
        return prisma_1.prisma.appointment.findMany({
            where: status ? { status } : undefined,
            orderBy: { date: "asc" },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true,
                        department: true,
                        experience: true,
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
    static async listContactMessages() {
        return prisma_1.prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    static async getDashboardMetrics() {
        const [totalDoctors, totalPatients, totalAppointments, totalDepartments, bloodRows, appointmentStatusCounts] = await Promise.all([
            prisma_1.prisma.doctor.count(),
            prisma_1.prisma.patient.count(),
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
                { month: "Jan", value: Math.round(totalAppointments * 0.2) * 120 },
                { month: "Feb", value: Math.round(totalAppointments * 0.3) * 120 },
                { month: "Mar", value: Math.round(totalAppointments * 0.5) * 120 },
            ],
            appointmentSeries: [
                { name: "PENDING", value: statusMap.PENDING },
                { name: "CONFIRMED", value: statusMap.CONFIRMED },
                { name: "CANCELLED", value: statusMap.CANCELLED },
            ],
        };
    }
    static async listDepartments() {
        const [departments, doctors] = await Promise.all([
            prisma_1.prisma.department.findMany({
                orderBy: { name: "asc" },
            }),
            prisma_1.prisma.doctor.findMany({
                select: { department: true },
            }),
        ]);
        return departments.map((department) => ({
            ...department,
            _count: {
                doctors: doctors.filter((doctor) => doctor.department === department.name).length,
            },
        }));
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
