"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModel = void 0;
const prisma_1 = require("../config/prisma");
class PatientModel {
    static findByUserId(userId) {
        return prisma_1.prisma.patientProfile.findUnique({ where: { userId } });
    }
    static getVitals(patientId) {
        return prisma_1.prisma.vitals.findMany({ where: { patientId }, orderBy: { recordedAt: "desc" } });
    }
}
exports.PatientModel = PatientModel;
