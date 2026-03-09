"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
class UserModel {
    static async findByEmail(email) {
        const [admin, doctor, patient] = await Promise.all([
            prisma_1.prisma.admin.findUnique({ where: { email } }),
            prisma_1.prisma.doctor.findUnique({ where: { email } }),
            prisma_1.prisma.patient.findUnique({ where: { email } }),
        ]);
        if (admin) {
            return { ...admin, role: client_1.Role.ADMIN };
        }
        if (doctor) {
            return { ...doctor, role: client_1.Role.DOCTOR };
        }
        if (patient) {
            return { ...patient, role: client_1.Role.PATIENT };
        }
        return null;
    }
    static async findById(id) {
        const [admin, doctor, patient] = await Promise.all([
            prisma_1.prisma.admin.findUnique({ where: { id } }),
            prisma_1.prisma.doctor.findUnique({ where: { id } }),
            prisma_1.prisma.patient.findUnique({ where: { id } }),
        ]);
        if (admin) {
            return { ...admin, role: client_1.Role.ADMIN };
        }
        if (doctor) {
            return { ...doctor, role: client_1.Role.DOCTOR };
        }
        if (patient) {
            return { ...patient, role: client_1.Role.PATIENT };
        }
        return null;
    }
    static async listByRole(role) {
        if (role === client_1.Role.ADMIN) {
            const admins = await prisma_1.prisma.admin.findMany({ orderBy: { createdAt: "desc" } });
            return admins.map((admin) => ({ ...admin, role: client_1.Role.ADMIN }));
        }
        if (role === client_1.Role.DOCTOR) {
            const doctors = await prisma_1.prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });
            return doctors.map((doctor) => ({ ...doctor, role: client_1.Role.DOCTOR }));
        }
        if (role === client_1.Role.PATIENT) {
            const patients = await prisma_1.prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
            return patients.map((patient) => ({ ...patient, role: client_1.Role.PATIENT }));
        }
        const [admins, doctors, patients] = await Promise.all([
            prisma_1.prisma.admin.findMany({ orderBy: { createdAt: "desc" } }),
            prisma_1.prisma.doctor.findMany({ orderBy: { createdAt: "desc" } }),
            prisma_1.prisma.patient.findMany({ orderBy: { createdAt: "desc" } }),
        ]);
        return [
            ...admins.map((admin) => ({ ...admin, role: client_1.Role.ADMIN })),
            ...doctors.map((doctor) => ({ ...doctor, role: client_1.Role.DOCTOR })),
            ...patients.map((patient) => ({ ...patient, role: client_1.Role.PATIENT })),
        ].sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
    }
}
exports.UserModel = UserModel;
