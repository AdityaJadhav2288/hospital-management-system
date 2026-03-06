"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth.service");
const patient_service_1 = require("../services/patient.service");
class PatientController {
    static async register(req, res) {
        const result = await auth_service_1.AuthService.registerPatient(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Patient registered successfully",
            data: result,
        });
    }
    static async login(req, res) {
        const result = await auth_service_1.AuthService.loginPatient(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Patient login successful",
            data: result,
        });
    }
    static async getDashboard(req, res) {
        const metrics = await patient_service_1.PatientService.getDashboardMetrics(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Patient dashboard fetched",
            data: metrics,
        });
    }
    static async getDoctors(_req, res) {
        const doctors = await patient_service_1.PatientService.getDoctors();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Doctors fetched", data: doctors });
    }
    static async bookAppointment(req, res) {
        const appointment = await patient_service_1.PatientService.bookAppointment(req.user.id, req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Appointment booked",
            data: appointment,
        });
    }
    static async getOwnAppointments(req, res) {
        const appointments = await patient_service_1.PatientService.getOwnAppointments(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Appointments fetched",
            data: appointments,
        });
    }
    static async getProfile(req, res) {
        const profile = await patient_service_1.PatientService.getOwnProfile(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Profile fetched", data: profile });
    }
    static async updateProfile(req, res) {
        const profile = await patient_service_1.PatientService.updateOwnProfile(req.user.id, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Profile updated", data: profile });
    }
    static async getPrescriptions(req, res) {
        const prescriptions = await patient_service_1.PatientService.listOwnPrescriptions(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Prescriptions fetched", data: prescriptions });
    }
    static async getVitals(req, res) {
        const vitals = await patient_service_1.PatientService.listOwnVitals(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Vitals fetched", data: vitals });
    }
}
exports.PatientController = PatientController;
