"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicService = void 0;
const prisma_1 = require("../config/prisma");
class PublicService {
    static async listDoctors(specialty) {
        return prisma_1.prisma.doctorProfile.findMany({
            where: specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                department: true,
            },
            orderBy: { user: { name: "asc" } },
        });
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
        const [bedsCount, doctorsCount, patientsCount] = await Promise.all([
            prisma_1.prisma.bloodStock.aggregate({ _sum: { units: true } }),
            prisma_1.prisma.doctorProfile.count(),
            prisma_1.prisma.patientProfile.count(),
        ]);
        return {
            beds: Math.max(120, bedsCount._sum.units ?? 0),
            doctors: doctorsCount,
            patientsServed: patientsCount,
        };
    }
}
exports.PublicService = PublicService;
