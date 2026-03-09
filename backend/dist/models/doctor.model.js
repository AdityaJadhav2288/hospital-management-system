"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorModel = void 0;
const prisma_1 = require("../config/prisma");
class DoctorModel {
    static findByUserId(userId) {
        return prisma_1.prisma.doctor.findUnique({ where: { id: userId } });
    }
    static listPublic(specialty) {
        return prisma_1.prisma.doctor.findMany({
            where: specialty
                ? {
                    specialization: {
                        contains: specialty,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { name: "asc" },
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
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
exports.DoctorModel = DoctorModel;
