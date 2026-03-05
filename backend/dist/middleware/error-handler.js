"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../utils/app-error");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof app_error_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Database request failed",
            details: err.message,
        });
        return;
    }
    if (err instanceof Error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
        });
        return;
    }
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
