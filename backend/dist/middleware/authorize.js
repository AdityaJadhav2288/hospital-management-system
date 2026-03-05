"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const http_status_codes_1 = require("http-status-codes");
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        return;
    }
    if (!roles.includes(req.user.role)) {
        res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ success: false, message: "Forbidden" });
        return;
    }
    next();
};
exports.authorize = authorize;
