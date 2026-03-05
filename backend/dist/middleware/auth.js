"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../config/prisma");
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
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid token user" });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.protect = protect;
