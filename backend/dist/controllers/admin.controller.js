"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const admin_service_1 = require("../services/admin.service");
class AdminController {
    static async getUsers(req, res) {
        const role = req.query.role;
        const users = await admin_service_1.AdminService.getUsers(role);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Users fetched", data: users });
    }
    static async getUserById(req, res) {
        const user = await admin_service_1.AdminService.getUserById(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "User fetched", data: user });
    }
    static async createUser(req, res) {
        const user = await admin_service_1.AdminService.createUser(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: "User created", data: user });
    }
    static async updateUser(req, res) {
        const user = await admin_service_1.AdminService.updateUser(req.params.id, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "User updated", data: user });
    }
    static async deleteUser(req, res) {
        await admin_service_1.AdminService.deleteUser(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "User deleted" });
    }
    static async getAppointments(req, res) {
        const status = req.query.status;
        const appointments = await admin_service_1.AdminService.listAppointments(status);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Appointments fetched", data: appointments });
    }
    static async getDashboard(_req, res) {
        const metrics = await admin_service_1.AdminService.getDashboardMetrics();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Dashboard fetched", data: metrics });
    }
    static async getDepartments(_req, res) {
        const departments = await admin_service_1.AdminService.listDepartments();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Departments fetched", data: departments });
    }
    static async createDepartment(req, res) {
        const department = await admin_service_1.AdminService.createDepartment(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: "Department created", data: department });
    }
    static async updateDepartment(req, res) {
        const department = await admin_service_1.AdminService.updateDepartment(req.params.id, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Department updated", data: department });
    }
    static async deleteDepartment(req, res) {
        await admin_service_1.AdminService.deleteDepartment(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Department deleted" });
    }
    static async getHealthPackages(_req, res) {
        const packages = await admin_service_1.AdminService.listHealthPackages();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Health packages fetched", data: packages });
    }
    static async createHealthPackage(req, res) {
        const item = await admin_service_1.AdminService.createHealthPackage(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, message: "Health package created", data: item });
    }
    static async updateHealthPackage(req, res) {
        const item = await admin_service_1.AdminService.updateHealthPackage(req.params.id, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Health package updated", data: item });
    }
    static async deleteHealthPackage(req, res) {
        await admin_service_1.AdminService.deleteHealthPackage(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Health package deleted" });
    }
    static async getBloodStocks(_req, res) {
        const stocks = await admin_service_1.AdminService.listBloodStocks();
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Blood stock fetched", data: stocks });
    }
    static async upsertBloodStock(req, res) {
        const stock = await admin_service_1.AdminService.upsertBloodStock(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Blood stock updated", data: stock });
    }
    static async deleteBloodStock(req, res) {
        await admin_service_1.AdminService.deleteBloodStock(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ success: true, message: "Blood stock deleted" });
    }
}
exports.AdminController = AdminController;
