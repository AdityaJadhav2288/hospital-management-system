"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const error_handler_1 = require("./middleware/error-handler");
const not_found_1 = require("./middleware/not-found");
const rate_limit_1 = require("./middleware/rate-limit");
const routes_1 = __importDefault(require("./routes"));
exports.app = (0, express_1.default)();
/* Security headers */
exports.app.use((0, helmet_1.default)());
/* CORS configuration (important for Vercel frontend) */
exports.app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
/* Body parser */
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
/* Logger */
exports.app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
/* Rate limiter */
exports.app.use(rate_limit_1.apiRateLimiter);
/* Health check route */
exports.app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Hospital API is running",
    });
});
/* API routes */
exports.app.use("/api/v1", routes_1.default);
/* 404 handler */
exports.app.use(not_found_1.notFound);
/* Global error handler */
exports.app.use(error_handler_1.errorHandler);
