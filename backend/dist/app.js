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
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://hospital-management-system.vercel.app"
    ],
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
exports.app.use(rate_limit_1.apiRateLimiter);
exports.app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Hospital API is running",
    });
});
exports.app.use("/api/v1", routes_1.default);
exports.app.use(not_found_1.notFound);
exports.app.use(error_handler_1.errorHandler);
