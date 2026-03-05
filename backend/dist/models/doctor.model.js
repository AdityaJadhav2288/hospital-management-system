"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorModel = void 0;
const prisma_1 = require("../config/prisma");
class DoctorModel {
    static findByUserId(userId) {
        return prisma_1.prisma.doctorProfile.findUnique({ where: { userId } });
    }
    static listPublic(specialty) {
        return prisma_1.prisma.doctorProfile.findMany({
            where: specialty
                ? {
                    specialty: {
                        contains: specialty,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { user: { name: "asc" } },
            include: {
                user: { select: { id: true, name: true, email: true } },
                department: { select: { id: true, name: true } },
            },
        });
    }
}
exports.DoctorModel = DoctorModel;
