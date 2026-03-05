"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const http_status_codes_1 = require("http-status-codes");
const public_service_1 = require("../services/public.service");
class PublicController {
    static async getDoctors(req, res) {
        const specialty = req.query.specialty;
        const doctors = await public_service_1.PublicService.listDoctors(specialty);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Public doctors fetched", data: doctors });
    }
    static async getDepartments(_req, res) {
        const departments = await public_service_1.PublicService.listDepartments();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Departments fetched", data: departments });
    }
    static async getPackages(req, res) {
        const category = req.query.category;
        const packages = await public_service_1.PublicService.listHealthPackages(category);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Health packages fetched", data: packages });
    }
    static async getBloodStock(_req, res) {
        const stock = await public_service_1.PublicService.listBloodStock();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Blood stock fetched", data: stock });
    }
    static async getStats(_req, res) {
        const stats = await public_service_1.PublicService.getHospitalStats();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Hospital stats fetched", data: stats });
    }
}
exports.PublicController = PublicController;
