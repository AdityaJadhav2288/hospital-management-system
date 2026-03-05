"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorController = void 0;
const http_status_codes_1 = require("http-status-codes");
const doctor_service_1 = require("../services/doctor.service");
class DoctorController {
    static async getDashboard(req, res) {
        const metrics = await doctor_service_1.DoctorService.getDashboardMetrics(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Doctor dashboard fetched",
            data: metrics,
        });
    }
    static async getOwnAppointments(req, res) {
        const appointments = await doctor_service_1.DoctorService.getOwnAppointments(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Appointments fetched",
            data: appointments,
        });
    }
    static async updateAppointmentStatus(req, res) {
        const appointment = await doctor_service_1.DoctorService.updateAppointmentStatus(req.user.id, req.params.id, req.body.status);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Appointment status updated",
            data: appointment,
        });
    }
    static async getPatients(req, res) {
        const patients = await doctor_service_1.DoctorService.getPatientList(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Patient list fetched",
            data: patients,
        });
    }
    static async getPatientHistory(req, res) {
        const history = await doctor_service_1.DoctorService.getPatientHistory(req.user.id, req.params.patientId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Patient history fetched",
            data: history,
        });
    }
    static async createPrescription(req, res) {
        const prescription = await doctor_service_1.DoctorService.createPrescription(req.user.id, req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Prescription created",
            data: prescription,
        });
    }
    static async getPrescriptions(req, res) {
        const prescriptions = await doctor_service_1.DoctorService.listPrescriptions(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Prescriptions fetched",
            data: prescriptions,
        });
    }
    static async createVitals(req, res) {
        const vitals = await doctor_service_1.DoctorService.createVitals(req.user.id, req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Vitals recorded",
            data: vitals,
        });
    }
}
exports.DoctorController = DoctorController;
