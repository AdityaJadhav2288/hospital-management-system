"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicService = void 0;
const prisma_1 = require("../config/prisma");
class PublicService {
    static async listDoctors(specialty) {
        return prisma_1.prisma.doctor.findMany({
            where: specialty
                ? { specialization: { contains: specialty, mode: "insensitive" } }
                : undefined,
            select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                experience: true,
                phone: true,
                department: true,
                profileImage: true,
                bio: true,
            },
            orderBy: { name: "asc" },
        });
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
    static async listHealthPackages(category) {
        return prisma_1.prisma.healthPackage.findMany({
            where: category ? { category: { equals: category, mode: "insensitive" } } : undefined,
            orderBy: [{ category: "asc" }, { price: "asc" }],
        });
    }
    static async listBloodStock() {
        return prisma_1.prisma.bloodStock.findMany({
            orderBy: { bloodGroup: "asc" },
        });
    }
    static async getHospitalStats() {
        const [bloodUnits, doctorsCount, patientsCount] = await Promise.all([
            prisma_1.prisma.bloodStock.aggregate({ _sum: { units: true } }),
            prisma_1.prisma.doctor.count(),
            prisma_1.prisma.patient.count(),
        ]);
        return {
            beds: Math.max(120, bloodUnits._sum.units ?? 0),
            doctors: doctorsCount,
            patientsServed: patientsCount,
        };
    }
    static async createContactMessage(payload) {
        return prisma_1.prisma.contactMessage.create({
            data: payload,
        });
    }
}
exports.PublicService = PublicService;
