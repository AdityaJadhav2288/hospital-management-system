"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionModel = void 0;
const prisma_1 = require("../config/prisma");
class PrescriptionModel {
    static listByPatient(patientId) {
        return prisma_1.prisma.prescription.findMany({ where: { patientId }, orderBy: { createdAt: "desc" } });
    }
    static listByDoctor(doctorId) {
        return prisma_1.prisma.prescription.findMany({ where: { doctorId }, orderBy: { createdAt: "desc" } });
    }
}
exports.PrescriptionModel = PrescriptionModel;
