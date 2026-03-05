"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async me(req, res) {
        const user = await auth_service_1.AuthService.me(req.user.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Current user fetched",
            data: user,
        });
    }
    static async register(req, res) {
        const result = await auth_service_1.AuthService.register(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    static async login(req, res) {
        const result = await auth_service_1.AuthService.login(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
}
exports.AuthController = AuthController;
