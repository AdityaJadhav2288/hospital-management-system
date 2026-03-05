"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModel = void 0;
const prisma_1 = require("../config/prisma");
class AppointmentModel {
    static listByDoctor(doctorId) {
        return prisma_1.prisma.appointment.findMany({ where: { doctorId }, orderBy: { date: "asc" } });
    }
    static listByPatient(patientId) {
        return prisma_1.prisma.appointment.findMany({ where: { patientId }, orderBy: { date: "asc" } });
    }
    static listAll(status) {
        return prisma_1.prisma.appointment.findMany({ where: status ? { status } : undefined, orderBy: { date: "desc" } });
    }
}
exports.AppointmentModel = AppointmentModel;
