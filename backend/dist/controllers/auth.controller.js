"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async me(req, res) {
        const user = await auth_service_1.AuthService.me(req.user.id, req.user.role);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Current user fetched",
            data: user,
        });
    }
    static async registerPatient(req, res) {
        const result = await auth_service_1.AuthService.registerPatient(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "Patient registered successfully",
            data: result,
        });
    }
    static async login(req, res) {
        const result = await auth_service_1.AuthService.login(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Login successful",
            user: result.user,
            token: result.token,
            data: result,
        });
    }
    static async loginAdmin(req, res) {
        const result = await auth_service_1.AuthService.loginAdmin(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Admin login successful",
            user: result.user,
            token: result.token,
            data: result,
        });
    }
    static async loginDoctor(req, res) {
        const result = await auth_service_1.AuthService.loginDoctor(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Doctor login successful",
            user: result.user,
            token: result.token,
            data: result,
        });
    }
    static async loginPatient(req, res) {
        const result = await auth_service_1.AuthService.loginPatient(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Patient login successful",
            user: result.user,
            token: result.token,
            data: result,
        });
    }
}
exports.AuthController = AuthController;
