"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
const role_1 = require("../constants/role");
const jwt_1 = require("../utils/jwt");
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        const entity = decoded.role === role_1.Role.ADMIN
            ? await prisma_1.prisma.admin.findUnique({ where: { id: decoded.userId } })
            : decoded.role === role_1.Role.DOCTOR
                ? await prisma_1.prisma.doctor.findUnique({ where: { id: decoded.userId } })
                : await prisma_1.prisma.patient.findUnique({ where: { id: decoded.userId } });
        if (!entity) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid token user" });
            return;
        }
        req.user = {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            role: decoded.role,
        };
        next();
    }
    catch {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.protect = protect;
